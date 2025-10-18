import React, { createContext, useContext, useState, useEffect } from 'react';
import { database, STORES, initializeDefaultAccounts } from '../utils/db';
import {
    calculateProfit,
    calculateProfitPerKm,
    calculateProfitPerMin,
    calculateFuelAllocation,
    calculateDuration,
    formatCurrency,
    formatTime,
    formatDate,
    getRideTypes,
    getPaymentMethods,
    getExpenseCategories
} from '../utils/calculations';

const AppContext = createContext();

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    const [accounts, setAccounts] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [rides, setRides] = useState([]);
    const [fuelTransfers, setFuelTransfers] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [activeRide, setActiveRide] = useState(null);
    const [currentSession, setCurrentSession] = useState(null);
    const [pendingFuelTransfer, setPendingFuelTransfer] = useState(0);
    const [loading, setLoading] = useState(true);

    // Initialize database and load data
    useEffect(() => {
        const initApp = async () => {
            try {
                await database.init();
                await initializeDefaultAccounts(database);
                await loadAllData();
                setLoading(false);
            } catch (error) {
                console.error('Failed to initialize app:', error);
                setLoading(false);
            }
        };

        initApp();
    }, []);

    const loadAllData = async () => {
        try {
            const [accountsData, sessionsData, ridesData, fuelTransfersData, expensesData, activeRideData] = await Promise.all([
                database.getAll(STORES.ACCOUNTS),
                database.getAll(STORES.SESSIONS),
                database.getAll(STORES.RIDES),
                database.getAll(STORES.FUEL_TRANSFERS),
                database.getAll(STORES.EXPENSES),
                database.getActiveRide()
            ]);

            setAccounts(accountsData);
            setSessions(sessionsData);
            setRides(ridesData);
            setFuelTransfers(fuelTransfersData);
            setExpenses(expensesData);

            // Load active ride if it exists
            if (activeRideData) {
                setActiveRide(activeRideData);
            }

            // Find active session
            const activeSession = sessionsData.find(session => session.status === 'active');
            setCurrentSession(activeSession);

            // Calculate pending fuel transfer
            const pendingTransfers = fuelTransfersData.filter(transfer => transfer.status === 'pending');
            const totalPending = pendingTransfers.reduce((sum, transfer) => sum + transfer.amount, 0);
            setPendingFuelTransfer(totalPending);
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    };

    // Account operations
    const updateAccountBalance = async (accountId, amount) => {
        try {
            // Get fresh account data from database to avoid stale state
            const freshAccounts = await database.getAll(STORES.ACCOUNTS);
            const account = freshAccounts.find(acc => acc.id === accountId);
            if (!account) throw new Error('Account not found');

            const updatedAccount = {
                ...account,
                balance: parseFloat(account.balance || 0) + parseFloat(amount || 0),
                updatedAt: new Date().toISOString()
            };

            await database.update(STORES.ACCOUNTS, updatedAccount);
            setAccounts(prev => prev.map(acc => acc.id === accountId ? updatedAccount : acc));
        } catch (error) {
            console.error('Failed to update account balance:', error);
            throw error;
        }
    };

    // Session operations
    const startSession = async (startKm) => {
        try {
            const sessionNumber = sessions.length + 1;
            const session = {
                name: `Session #${sessionNumber}`,
                startTime: new Date().toISOString(),
                endTime: null,
                startKm: parseFloat(startKm),
                endKm: null,
                totalKm: 0,
                status: 'active',
                createdAt: new Date().toISOString()
            };

            const id = await database.add(STORES.SESSIONS, session);
            const newSession = { ...session, id };

            setSessions(prev => [...prev, newSession]);
            setCurrentSession(newSession);
        } catch (error) {
            console.error('Failed to start session:', error);
            throw error;
        }
    };

    const endSession = async (endKm) => {
        if (!currentSession) return;

        try {
            const endTime = new Date().toISOString();
            const totalKm = parseFloat(endKm) - currentSession.startKm;

            const updatedSession = {
                ...currentSession,
                endTime,
                endKm: parseFloat(endKm),
                totalKm,
                status: 'completed'
            };

            await database.update(STORES.SESSIONS, updatedSession);
            setSessions(prev => prev.map(session => session.id === currentSession.id ? updatedSession : session));
            setCurrentSession(null);
        } catch (error) {
            console.error('Failed to end session:', error);
            throw error;
        }
    };


    // Ride operations
    const startRide = async () => {
        const ride = {
            startTime: new Date().toISOString(),
            endTime: null,
            sessionId: currentSession?.id,
            km: 0,
            fare: 0,
            airportFee: 0,
            platformFee: 0,
            tolls: 0,
            otherFees: 0,
            rideType: '',
            paymentMethod: '',
            profit: 0,
            profitPerKm: 0,
            profitPerMin: 0,
            fuelAllocation: 0,
            createdAt: new Date().toISOString()
        };

        try {
            await database.saveActiveRide(ride);
            setActiveRide(ride);
        } catch (error) {
            console.error('Failed to save active ride:', error);
            // Still set the ride in state even if save fails
            setActiveRide(ride);
        }
    };

    const endRide = async (rideData) => {
        if (!activeRide) {
            throw new Error('No active ride to end');
        }

        try {
            const endTime = new Date().toISOString();
            const duration = calculateDuration(activeRide.startTime, endTime);

            // Convert all inputs to numbers for calculations
            const fare = parseFloat(rideData.fare) || 0;
            const airportFee = parseFloat(rideData.airportFee) || 0;
            const platformFee = parseFloat(rideData.platformFee) || 0;
            const tolls = parseFloat(rideData.tolls) || 0;
            const otherFees = parseFloat(rideData.otherFees) || 0;
            const km = parseFloat(rideData.km) || 0;

            // Validate essential data
            if (fare <= 0) {
                throw new Error('Fare must be greater than 0');
            }
            if (km <= 0) {
                throw new Error('Distance must be greater than 0');
            }
            if (!rideData.rideType) {
                throw new Error('Ride type is required');
            }
            if (!rideData.paymentMethod) {
                throw new Error('Payment method is required');
            }

            const profit = calculateProfit(fare, {
                airportFee,
                platformFee,
                tolls,
                otherFees
            });
            const profitPerKm = calculateProfitPerKm(profit, km);
            const profitPerMin = calculateProfitPerMin(profit, duration);
            const fuelAllocation = calculateFuelAllocation(profit);

            const completedRide = {
                ...activeRide,
                endTime,
                km,
                fare,
                airportFee,
                platformFee,
                tolls,
                otherFees,
                rideType: rideData.rideType,
                paymentMethod: rideData.paymentMethod,
                profit,
                profitPerKm,
                profitPerMin,
                fuelAllocation
            };

            // Save ride
            const id = await database.add(STORES.RIDES, completedRide);
            const savedRide = { ...completedRide, id };
            setRides(prev => [...prev, savedRide]);

            // Update account balance
            const accountName = rideData.paymentMethod;
            const account = accounts.find(acc => acc.name === accountName);
            if (!account) {
                throw new Error(`Account '${accountName}' not found`);
            }
            await updateAccountBalance(account.id, fare);

            // Add fuel allocation to pending transfers
            if (fuelAllocation > 0) {
                const fuelTransfer = {
                    amount: fuelAllocation,
                    fromAccount: 'Main Account', // Fuel allocation always comes from Main Account
                    toAccount: 'Fuel Account',
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                    completedAt: null
                };

                const transferId = await database.add(STORES.FUEL_TRANSFERS, fuelTransfer);
                const savedTransfer = { ...fuelTransfer, id: transferId };
                setFuelTransfers(prev => [...prev, savedTransfer]);
                setPendingFuelTransfer(prev => prev + fuelAllocation);
            }

            // Clear active ride from IndexedDB
            await database.clearActiveRide();
            setActiveRide(null);
        } catch (error) {
            console.error('Failed to end ride:', error);
            throw error;
        }
    };

    // Delete ride and reverse all changes
    const deleteRide = async (rideId) => {
        try {
            const ride = rides.find(r => r.id === rideId);
            if (!ride) {
                throw new Error('Ride not found');
            }

            // Reverse account balance (subtract the fare that was added)
            const accountName = ride.paymentMethod;
            const account = accounts.find(acc => acc.name === accountName);
            if (account) {
                await updateAccountBalance(account.id, -ride.fare);
            }

            // Reverse fuel allocation if it was transferred
            if (ride.fuelAllocation > 0) {
                // Find and reverse any completed fuel transfers for this ride
                const relatedTransfers = fuelTransfers.filter(transfer =>
                    transfer.status === 'completed' &&
                    transfer.amount === ride.fuelAllocation &&
                    transfer.fromAccount === 'Main Account' &&
                    transfer.toAccount === 'Fuel Account'
                );

                // Reverse the most recent transfer (assuming it's the one for this ride)
                if (relatedTransfers.length > 0) {
                    const transferToReverse = relatedTransfers[relatedTransfers.length - 1];

                    // Move money back from Fuel Account to Main Account
                    const mainAccount = accounts.find(acc => acc.name === 'Main Account');
                    const fuelAccount = accounts.find(acc => acc.name === 'Fuel Account');

                    if (mainAccount && fuelAccount) {
                        await updateAccountBalance(mainAccount.id, ride.fuelAllocation);
                        await updateAccountBalance(fuelAccount.id, -ride.fuelAllocation);
                    }

                    // Mark the transfer as reversed
                    const updatedTransfer = {
                        ...transferToReverse,
                        status: 'reversed',
                        reversedAt: new Date().toISOString()
                    };
                    await database.update(STORES.FUEL_TRANSFERS, updatedTransfer);
                    setFuelTransfers(prev => prev.map(t => t.id === transferToReverse.id ? updatedTransfer : t));
                }
            }

            // Remove the ride from database
            const transaction = database.db.transaction([STORES.RIDES], 'readwrite');
            const store = transaction.objectStore(STORES.RIDES);
            await new Promise((resolve, reject) => {
                const request = store.delete(rideId);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });

            // Remove from state
            setRides(prev => prev.filter(r => r.id !== rideId));

        } catch (error) {
            console.error('Failed to delete ride:', error);
            throw error;
        }
    };

    // Expense operations
    const deleteExpense = async (expenseId) => {
        try {
            const expense = expenses.find(e => e.id === expenseId);
            if (!expense) {
                throw new Error('Expense not found');
            }

            // Reverse the account balance (add back the amount that was deducted)
            const accountName = expense.account;
            const account = accounts.find(acc => acc.name === accountName);
            if (account) {
                await updateAccountBalance(account.id, expense.amount);
            }

            // Remove the expense from database
            const transaction = database.db.transaction([STORES.EXPENSES], 'readwrite');
            const store = transaction.objectStore(STORES.EXPENSES);
            await new Promise((resolve, reject) => {
                const request = store.delete(expenseId);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });

            // Remove from state
            setExpenses(prev => prev.filter(e => e.id !== expenseId));

        } catch (error) {
            console.error('Failed to delete expense:', error);
            throw error;
        }
    };

    // Account transfer operations
    const transferBetweenAccounts = async (fromAccountName, toAccountName, amount) => {
        try {
            const fromAccount = accounts.find(acc => acc.name === fromAccountName);
            const toAccount = accounts.find(acc => acc.name === toAccountName);

            if (!fromAccount || !toAccount) {
                throw new Error('One or both accounts not found');
            }

            if (fromAccount.id === toAccount.id) {
                throw new Error('Cannot transfer to the same account');
            }

            if (amount <= 0) {
                throw new Error('Transfer amount must be greater than 0');
            }

            // Update account balances
            await updateAccountBalance(fromAccount.id, -amount);
            await updateAccountBalance(toAccount.id, amount);

        } catch (error) {
            console.error('Failed to transfer between accounts:', error);
            throw error;
        }
    };

    // Fuel transfer operations
    const transferToFuelAccount = async (amount, fromAccountName = 'Main Account') => {
        try {
            const fromAccount = accounts.find(acc => acc.name === fromAccountName);
            const fuelAccount = accounts.find(acc => acc.name === 'Fuel Account');

            if (!fromAccount || !fuelAccount) {
                throw new Error('Required accounts not found');
            }

            // Update account balances
            await updateAccountBalance(fromAccount.id, -amount);
            await updateAccountBalance(fuelAccount.id, amount);

            // Update fuel transfer status
            const pendingTransfers = fuelTransfers.filter(transfer => transfer.status === 'pending');
            let remainingAmount = amount;

            for (const transfer of pendingTransfers) {
                if (remainingAmount <= 0) break;

                const transferToProcess = Math.min(remainingAmount, transfer.amount);
                const updatedTransfer = {
                    ...transfer,
                    status: 'completed',
                    completedAt: new Date().toISOString()
                };

                await database.update(STORES.FUEL_TRANSFERS, updatedTransfer);
                setFuelTransfers(prev => prev.map(t => t.id === transfer.id ? updatedTransfer : t));
                remainingAmount -= transferToProcess;
            }

            setPendingFuelTransfer(prev => Math.max(0, prev - amount));
        } catch (error) {
            console.error('Failed to transfer to fuel account:', error);
            throw error;
        }
    };

    // Expense operations
    const addExpense = async (expenseData) => {
        try {
            const expense = {
                sessionId: currentSession?.id,
                category: expenseData.category,
                amount: parseFloat(expenseData.amount),
                account: expenseData.account,
                description: expenseData.description || '',
                createdAt: new Date().toISOString()
            };

            const id = await database.add(STORES.EXPENSES, expense);
            const savedExpense = { ...expense, id };
            setExpenses(prev => [...prev, savedExpense]);

            // Update account balance
            const accountName = expenseData.category === 'Fuel' ? 'Fuel Account' : expenseData.account;
            const account = accounts.find(acc => acc.name === accountName);
            if (account) {
                await updateAccountBalance(account.id, -expenseData.amount);
            }
        } catch (error) {
            console.error('Failed to add expense:', error);
            throw error;
        }
    };

    // Utility functions
    const getCombinedBalance = () => {
        const total = accounts.reduce((sum, account) => {
            return sum + parseFloat(account.balance || 0);
        }, 0);
        return total;
    };

    const getTodaysRides = () => {
        const today = new Date().toDateString();
        return rides.filter(ride => new Date(ride.createdAt).toDateString() === today);
    };

    const getTodaysProfit = () => {
        return getTodaysRides().reduce((sum, ride) => sum + ride.profit, 0);
    };

    // Date-based utility functions for Stats
    const getDateRides = (dateString) => {
        const targetDate = new Date(dateString).toDateString();
        return rides.filter(ride => new Date(ride.createdAt).toDateString() === targetDate);
    };

    const getDateExpenses = (dateString) => {
        const targetDate = new Date(dateString).toDateString();
        return expenses.filter(expense => new Date(expense.createdAt).toDateString() === targetDate);
    };

    const getDateStats = (dateString) => {
        const dateRides = getDateRides(dateString);
        const dateExpenses = getDateExpenses(dateString);

        // Ride statistics
        const totalRides = dateRides.length;
        const totalEarnings = dateRides.reduce((sum, ride) => sum + ride.fare, 0);
        const totalProfit = dateRides.reduce((sum, ride) => sum + ride.profit, 0);
        const averageFare = totalRides > 0 ? totalEarnings / totalRides : 0;
        const averageProfit = totalRides > 0 ? totalProfit / totalRides : 0;
        const bestRide = totalRides > 0 ? Math.max(...dateRides.map(ride => ride.profit)) : 0;
        const worstRide = totalRides > 0 ? Math.min(...dateRides.map(ride => ride.profit)) : 0;

        // Distance & Time
        const totalKm = dateRides.reduce((sum, ride) => sum + ride.km, 0);
        const averageDistance = totalRides > 0 ? totalKm / totalRides : 0;
        const totalTimeMinutes = dateRides.reduce((sum, ride) => {
            const duration = calculateDuration(ride.startTime, ride.endTime);
            return sum + duration;
        }, 0);
        const averageDuration = totalRides > 0 ? totalTimeMinutes / totalRides : 0;

        // Efficiency metrics
        const averageProfitPerKm = totalKm > 0 ? totalProfit / totalKm : 0;
        const averageProfitPerMin = totalTimeMinutes > 0 ? totalProfit / totalTimeMinutes : 0;
        const totalFuelAllocation = dateRides.reduce((sum, ride) => sum + ride.fuelAllocation, 0);

        // Expense statistics
        const totalExpenses = dateExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        const expensesByCategory = {};
        dateExpenses.forEach(expense => {
            expensesByCategory[expense.category] = (expensesByCategory[expense.category] || 0) + expense.amount;
        });
        const mostExpensiveCategory = Object.keys(expensesByCategory).reduce((a, b) =>
            expensesByCategory[a] > expensesByCategory[b] ? a : b, 'None'
        );

        // Financial summary
        const grossEarnings = totalEarnings;
        const netProfit = grossEarnings - totalExpenses;
        const profitMargin = grossEarnings > 0 ? (netProfit / grossEarnings) * 100 : 0;

        return {
            // Ride statistics
            totalRides,
            totalEarnings,
            totalProfit,
            averageFare,
            averageProfit,
            bestRide,
            worstRide,

            // Distance & Time
            totalKm,
            averageDistance,
            totalTimeMinutes,
            averageDuration,

            // Efficiency metrics
            averageProfitPerKm,
            averageProfitPerMin,
            totalFuelAllocation,

            // Expense statistics
            totalExpenses,
            expensesByCategory,
            mostExpensiveCategory,

            // Financial summary
            grossEarnings,
            netProfit,
            profitMargin
        };
    };

    // Session utility functions
    const getSessionRides = (sessionId) => {
        return rides.filter(ride => ride.sessionId === sessionId);
    };

    const getSessionExpenses = (sessionId) => {
        return expenses.filter(expense => expense.sessionId === sessionId);
    };

    // Reset all data
    const resetAllData = async () => {
        try {
            // Clear all stores
            const stores = [STORES.SESSIONS, STORES.RIDES, STORES.FUEL_TRANSFERS, STORES.EXPENSES];

            for (const storeName of stores) {
                const transaction = database.db.transaction([storeName], 'readwrite');
                const store = transaction.objectStore(storeName);
                await new Promise((resolve, reject) => {
                    const request = store.clear();
                    request.onsuccess = () => resolve();
                    request.onerror = () => reject(request.error);
                });
            }

            // Clear active ride
            await database.clearActiveRide();

            // Reset all account balances to 0
            const freshAccounts = await database.getAll(STORES.ACCOUNTS);
            for (const account of freshAccounts) {
                const updatedAccount = {
                    ...account,
                    balance: 0,
                    updatedAt: new Date().toISOString()
                };
                await database.update(STORES.ACCOUNTS, updatedAccount);
            }

            // Reload all data
            await loadAllData();
        } catch (error) {
            console.error('Failed to reset data:', error);
            throw error;
        }
    };

    const getSessionStats = (sessionId) => {
        const sessionRides = getSessionRides(sessionId);
        const sessionExpenses = getSessionExpenses(sessionId);
        const session = sessions.find(s => s.id === sessionId);

        if (!session) {
            return null;
        }

        // Ride statistics
        const totalRides = sessionRides.length;
        const totalEarnings = sessionRides.reduce((sum, ride) => sum + ride.fare, 0);
        const totalProfit = sessionRides.reduce((sum, ride) => sum + ride.profit, 0);
        const averageFare = totalRides > 0 ? totalEarnings / totalRides : 0;
        const averageProfit = totalRides > 0 ? totalProfit / totalRides : 0;
        const bestRide = totalRides > 0 ? Math.max(...sessionRides.map(ride => ride.profit)) : 0;
        const worstRide = totalRides > 0 ? Math.min(...sessionRides.map(ride => ride.profit)) : 0;

        // Distance & Time
        const totalKm = sessionRides.reduce((sum, ride) => sum + ride.km, 0);
        const averageDistance = totalRides > 0 ? totalKm / totalRides : 0;
        const totalTimeMinutes = sessionRides.reduce((sum, ride) => {
            const duration = calculateDuration(ride.startTime, ride.endTime);
            return sum + duration;
        }, 0);
        const averageDuration = totalRides > 0 ? totalTimeMinutes / totalRides : 0;

        // Efficiency metrics
        const averageProfitPerKm = totalKm > 0 ? totalProfit / totalKm : 0;
        const averageProfitPerMin = totalTimeMinutes > 0 ? totalProfit / totalTimeMinutes : 0;
        const totalFuelAllocation = sessionRides.reduce((sum, ride) => sum + ride.fuelAllocation, 0);

        // Expense statistics
        const totalExpenses = sessionExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        const expensesByCategory = {};
        sessionExpenses.forEach(expense => {
            expensesByCategory[expense.category] = (expensesByCategory[expense.category] || 0) + expense.amount;
        });
        const mostExpensiveCategory = Object.keys(expensesByCategory).reduce((a, b) =>
            expensesByCategory[a] > expensesByCategory[b] ? a : b, 'None'
        );

        // Financial summary
        const grossEarnings = totalEarnings;
        const netProfit = grossEarnings - totalExpenses;
        const profitMargin = grossEarnings > 0 ? (netProfit / grossEarnings) * 100 : 0;

        // Session-specific metrics
        const sessionDuration = session.endTime ?
            calculateDuration(session.startTime, session.endTime) :
            calculateDuration(session.startTime, new Date().toISOString());
        const sessionKm = session.totalKm || 0;

        return {
            // Session info
            session,
            sessionDuration,
            sessionKm,

            // Ride statistics
            totalRides,
            totalEarnings,
            totalProfit,
            averageFare,
            averageProfit,
            bestRide,
            worstRide,

            // Distance & Time
            totalKm,
            averageDistance,
            totalTimeMinutes,
            averageDuration,

            // Efficiency metrics
            averageProfitPerKm,
            averageProfitPerMin,
            totalFuelAllocation,

            // Expense statistics
            totalExpenses,
            expensesByCategory,
            mostExpensiveCategory,

            // Financial summary
            grossEarnings,
            netProfit,
            profitMargin
        };
    };

    const value = {
        // State
        accounts,
        sessions,
        rides,
        fuelTransfers,
        expenses,
        activeRide,
        currentSession,
        pendingFuelTransfer,
        loading,

        // Actions
        updateAccountBalance,
        startSession,
        endSession,
        startRide,
        endRide,
        deleteRide,
        addExpense,
        deleteExpense,
        transferBetweenAccounts,
        transferToFuelAccount,
        resetAllData,

        // Utilities
        getCombinedBalance,
        getTodaysRides,
        getTodaysProfit,
        getDateRides,
        getDateExpenses,
        getDateStats,
        getSessionRides,
        getSessionExpenses,
        getSessionStats,
        calculateDuration,
        formatCurrency,
        formatTime,
        formatDate,
        getRideTypes,
        getPaymentMethods,
        getExpenseCategories
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
