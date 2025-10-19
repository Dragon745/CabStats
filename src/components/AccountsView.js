import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
    FaWallet, FaGasPump, FaMoneyBillWave, FaMobile,
    FaExchangeAlt, FaEdit, FaCheck, FaTimes,
    FaSpinner, FaChartLine, FaArrowRight,
    FaArrowUp, FaArrowDown, FaExclamationTriangle,
    FaInfoCircle, FaCheckCircle, FaClock
} from 'react-icons/fa';
import { MdAccountBalance, MdTrendingUp } from 'react-icons/md';

const AccountsView = () => {
    const {
        accounts,
        fuelTransfers,
        accountTransfers,
        updateAccountBalance,
        formatCurrency,
        formatDate,
        formatTime,
        pendingFuelTransfer,
        transferToFuelAccount,
        transferBetweenAccounts
    } = useApp();

    const [selectedAccount, setSelectedAccount] = useState(null);
    const [adjustmentAmount, setAdjustmentAmount] = useState('');
    const [showAdjustmentForm, setShowAdjustmentForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showFuelTransferForm, setShowFuelTransferForm] = useState(false);
    const [fuelTransferAmount, setFuelTransferAmount] = useState('');
    const [fuelTransferFromAccount, setFuelTransferFromAccount] = useState('Main Account');
    const [showTransferAllForm, setShowTransferAllForm] = useState(false);
    const [showAccountTransferForm, setShowAccountTransferForm] = useState(false);
    const [accountTransferFrom, setAccountTransferFrom] = useState('Main Account');
    const [accountTransferTo, setAccountTransferTo] = useState('Cash Account');
    const [accountTransferAmount, setAccountTransferAmount] = useState('');
    const [animatedBalance, setAnimatedBalance] = useState(0);

    // Animated balance counter effect
    useEffect(() => {
        const combinedBalance = accounts.reduce((sum, account) => sum + parseFloat(account.balance || 0), 0);
        const targetBalance = combinedBalance;
        const duration = 1000;
        const steps = 60;
        const increment = (targetBalance - animatedBalance) / steps;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            setAnimatedBalance(prev => prev + increment);

            if (step >= steps) {
                setAnimatedBalance(targetBalance);
                clearInterval(timer);
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [accounts, animatedBalance]);

    const getAccountIcon = (accountName) => {
        switch (accountName) {
            case 'Main Account': return FaWallet;
            case 'Fuel Account': return FaGasPump;
            case 'Cash Account': return FaMoneyBillWave;
            case 'Platform Account': return FaMobile;
            default: return FaWallet;
        }
    };

    const getAccountColor = (accountName) => {
        switch (accountName) {
            case 'Main Account': return 'from-green-500 to-green-600';
            case 'Fuel Account': return 'from-blue-500 to-blue-600';
            case 'Cash Account': return 'from-yellow-500 to-yellow-600';
            case 'Platform Account': return 'from-purple-500 to-purple-600';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    const handleAdjustment = async (e) => {
        e.preventDefault();

        if (!selectedAccount || !adjustmentAmount) {
            alert('Please fill in all fields');
            return;
        }

        const amount = parseFloat(adjustmentAmount);
        if (isNaN(amount)) {
            alert('Please enter a valid amount');
            return;
        }

        setLoading(true);
        try {
            await updateAccountBalance(selectedAccount.id, amount);
            setAdjustmentAmount('');
            setShowAdjustmentForm(false);
            setSelectedAccount(null);
            alert('Account balance updated successfully!');
        } catch (error) {
            alert('Failed to update balance: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFuelTransferAll = async () => {
        if (pendingFuelTransfer <= 0) return;

        const fromAccount = accounts.find(acc => acc.name === fuelTransferFromAccount);
        if (fromAccount && fromAccount.balance < pendingFuelTransfer) {
            alert(`Insufficient balance in ${fromAccount.name}`);
            return;
        }

        if (window.confirm(`Transfer ${formatCurrency(pendingFuelTransfer)} from ${fuelTransferFromAccount} to Fuel Account?`)) {
            setLoading(true);
            try {
                await transferToFuelAccount(pendingFuelTransfer, fuelTransferFromAccount);
                alert('Transfer completed successfully!');
            } catch (error) {
                alert('Transfer failed: ' + error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleFuelTransferPartial = async (e) => {
        e.preventDefault();
        const amount = parseFloat(fuelTransferAmount);

        if (amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        if (amount > pendingFuelTransfer) {
            alert('Amount cannot exceed pending transfer amount');
            return;
        }

        const fromAccount = accounts.find(acc => acc.name === fuelTransferFromAccount);
        if (fromAccount && fromAccount.balance < amount) {
            alert(`Insufficient balance in ${fromAccount.name}`);
            return;
        }

        if (window.confirm(`Transfer ${formatCurrency(amount)} from ${fuelTransferFromAccount} to Fuel Account?`)) {
            setLoading(true);
            try {
                await transferToFuelAccount(amount, fuelTransferFromAccount);
                setFuelTransferAmount('');
                setShowFuelTransferForm(false);
                alert('Transfer completed successfully!');
            } catch (error) {
                alert('Transfer failed: ' + error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleAccountTransfer = async (e) => {
        e.preventDefault();
        const amount = parseFloat(accountTransferAmount);

        if (amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        if (accountTransferFrom === accountTransferTo) {
            alert('Cannot transfer to the same account');
            return;
        }

        const fromAccount = accounts.find(acc => acc.name === accountTransferFrom);
        if (fromAccount && fromAccount.balance < amount) {
            alert(`Insufficient balance in ${fromAccount.name}`);
            return;
        }

        if (window.confirm(`Transfer ${formatCurrency(amount)} from ${accountTransferFrom} to ${accountTransferTo}?`)) {
            setLoading(true);
            try {
                await transferBetweenAccounts(accountTransferFrom, accountTransferTo, amount);
                setAccountTransferAmount('');
                setShowAccountTransferForm(false);
                alert('Transfer completed successfully!');
            } catch (error) {
                alert('Transfer failed: ' + error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 space-y-6 pb-20">
            {/* Hero Combined Balance Card */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl shadow-2xl p-8 text-white">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                <MdAccountBalance className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Total Balance</h2>
                                <p className="text-sm opacity-80">All Accounts Combined</p>
                            </div>
                        </div>

                        {animatedBalance >= 0 && (
                            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                                <span className="text-xs font-medium">Active</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-end justify-between">
                        <div>
                            <div className={`text-5xl font-bold mb-2 ${animatedBalance >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                                {formatCurrency(animatedBalance)}
                            </div>
                            <div className="flex items-center space-x-2 text-sm opacity-80">
                                <FaChartLine className="w-4 h-4" />
                                <span>Updated in real-time</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                            <FaArrowUp className="w-3 h-3" />
                            <span className="text-xs font-medium">Live</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
                {accounts.map((account, index) => {
                    const IconComponent = getAccountIcon(account.name);
                    const gradientClass = getAccountColor(account.name);

                    return (
                        <div
                            key={account.id}
                            className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-5 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className={`p-3 rounded-xl bg-gradient-to-r ${gradientClass} text-white shadow-lg`}>
                                    <IconComponent className="w-6 h-6" />
                                </div>
                                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${gradientClass} animate-pulse`}></div>
                            </div>

                            <h3 className="text-sm font-medium text-gray-600 mb-2">{account.name}</h3>
                            <div className={`text-xl font-bold mb-3 ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(account.balance)}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                    <FaClock className="w-3 h-3" />
                                    <span>{formatDate(account.updatedAt)}</span>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedAccount(account);
                                        setShowAdjustmentForm(true);
                                    }}
                                    className="p-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center justify-center"
                                    title="Adjust Balance"
                                >
                                    <FaEdit className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Account Transfer Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                        <FaExchangeAlt className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">Transfer Between Accounts</h3>
                        <p className="text-sm text-gray-600">Move money between your accounts</p>
                    </div>
                </div>

                <button
                    onClick={() => setShowAccountTransferForm(!showAccountTransferForm)}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg transform hover:scale-[1.02]"
                >
                    <FaExchangeAlt className="w-5 h-5" />
                    <span>Transfer Money Between Accounts</span>
                </button>

                {/* Account Transfer Form */}
                {showAccountTransferForm && (
                    <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                        <form onSubmit={handleAccountTransfer} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center space-x-2">
                                            <FaArrowDown className="w-4 h-4 text-gray-500" />
                                            <span>From Account</span>
                                        </div>
                                    </label>
                                    <select
                                        value={accountTransferFrom}
                                        onChange={(e) => setAccountTransferFrom(e.target.value)}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    >
                                        {accounts.map(account => (
                                            <option key={account.id} value={account.name}>
                                                {account.name} - {formatCurrency(account.balance)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center space-x-2">
                                            <FaArrowUp className="w-4 h-4 text-gray-500" />
                                            <span>To Account</span>
                                        </div>
                                    </label>
                                    <select
                                        value={accountTransferTo}
                                        onChange={(e) => setAccountTransferTo(e.target.value)}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    >
                                        {accounts.map(account => (
                                            <option key={account.id} value={account.name}>
                                                {account.name} - {formatCurrency(account.balance)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <div className="flex items-center space-x-2">
                                        <FaMoneyBillWave className="w-4 h-4 text-gray-500" />
                                        <span>Transfer Amount (₹)</span>
                                    </div>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={accountTransferAmount}
                                    onChange={(e) => setAccountTransferAmount(e.target.value)}
                                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg font-medium"
                                    placeholder="Enter amount"
                                    required
                                />
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAccountTransferForm(false);
                                        setAccountTransferAmount('');
                                    }}
                                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
                                >
                                    <FaTimes className="w-4 h-4" />
                                    <span>Cancel</span>
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg"
                                >
                                    {loading ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaCheck className="w-4 h-4" />}
                                    <span>Transfer</span>
                                </button>
                            </div>
                        </form>
                    </div>
                )}

            </div>

            {/* Fuel Transfer Section */}
            {pendingFuelTransfer > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl">
                            <FaGasPump className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800">Fuel Transfer</h3>
                            <p className="text-sm text-gray-600">Transfer pending fuel allocation</p>
                        </div>
                    </div>

                    {/* Pending Amount Alert */}
                    <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-xl shadow-lg p-6 text-white mb-6">
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full translate-y-8 -translate-x-8"></div>
                        </div>

                        <div className="relative z-10 text-center">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                                <FaExclamationTriangle className="w-6 h-6" />
                                <span className="text-lg font-semibold">Pending Transfer</span>
                            </div>
                            <div className="text-3xl font-bold mb-2 animate-pulse">
                                {formatCurrency(pendingFuelTransfer)}
                            </div>
                            <div className="text-sm opacity-90">To Fuel Account</div>
                        </div>
                    </div>

                    {/* Account Balances Preview */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                            <div className="flex items-center space-x-2 mb-2">
                                <FaWallet className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-800">Main Account</span>
                            </div>
                            <div className={`text-lg font-bold ${accounts.find(acc => acc.name === 'Main Account')?.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(accounts.find(acc => acc.name === 'Main Account')?.balance || 0)}
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
                            <div className="flex items-center space-x-2 mb-2">
                                <FaMoneyBillWave className="w-4 h-4 text-yellow-600" />
                                <span className="text-sm font-medium text-yellow-800">Cash Account</span>
                            </div>
                            <div className={`text-lg font-bold ${accounts.find(acc => acc.name === 'Cash Account')?.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(accounts.find(acc => acc.name === 'Cash Account')?.balance || 0)}
                            </div>
                        </div>
                    </div>

                    {/* Transfer Options */}
                    <div className="space-y-3">
                        <button
                            onClick={() => setShowTransferAllForm(!showTransferAllForm)}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg transform hover:scale-[1.02] disabled:opacity-50"
                        >
                            <FaCheck className="w-5 h-5" />
                            <span>{loading ? 'Processing...' : 'Transfer All'}</span>
                        </button>

                        <button
                            onClick={() => setShowFuelTransferForm(!showFuelTransferForm)}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg transform hover:scale-[1.02]"
                        >
                            <FaEdit className="w-5 h-5" />
                            <span>Transfer Partial Amount</span>
                        </button>
                    </div>

                    {/* Transfer All Form */}
                    {showTransferAllForm && (
                        <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                            <form onSubmit={(e) => { e.preventDefault(); handleFuelTransferAll(); }} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center space-x-2">
                                            <FaArrowDown className="w-4 h-4 text-gray-500" />
                                            <span>Transfer From Account</span>
                                        </div>
                                    </label>
                                    <select
                                        value={fuelTransferFromAccount}
                                        onChange={(e) => setFuelTransferFromAccount(e.target.value)}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                    >
                                        <option value="Main Account">
                                            Main Account - {formatCurrency(accounts.find(acc => acc.name === 'Main Account')?.balance || 0)}
                                        </option>
                                        <option value="Cash Account">
                                            Cash Account - {formatCurrency(accounts.find(acc => acc.name === 'Cash Account')?.balance || 0)}
                                        </option>
                                    </select>
                                </div>

                                <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 rounded-xl p-4">
                                    <div className="text-center">
                                        <div className="flex items-center justify-center space-x-2 mb-2">
                                            <FaGasPump className="w-5 h-5 text-green-600" />
                                            <span className="text-lg font-bold text-green-800">
                                                {formatCurrency(pendingFuelTransfer)}
                                            </span>
                                        </div>
                                        <div className="text-green-600 text-sm">Will be transferred to Fuel Account</div>
                                    </div>
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowTransferAllForm(false)}
                                        className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
                                    >
                                        <FaTimes className="w-4 h-4" />
                                        <span>Cancel</span>
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg"
                                    >
                                        {loading ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaCheck className="w-4 h-4" />}
                                        <span>Transfer All</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Partial Transfer Form */}
                    {showFuelTransferForm && (
                        <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                            <form onSubmit={handleFuelTransferPartial} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center space-x-2">
                                            <FaArrowDown className="w-4 h-4 text-gray-500" />
                                            <span>Transfer From Account</span>
                                        </div>
                                    </label>
                                    <select
                                        value={fuelTransferFromAccount}
                                        onChange={(e) => setFuelTransferFromAccount(e.target.value)}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    >
                                        <option value="Main Account">
                                            Main Account - {formatCurrency(accounts.find(acc => acc.name === 'Main Account')?.balance || 0)}
                                        </option>
                                        <option value="Cash Account">
                                            Cash Account - {formatCurrency(accounts.find(acc => acc.name === 'Cash Account')?.balance || 0)}
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center space-x-2">
                                            <FaMoneyBillWave className="w-4 h-4 text-gray-500" />
                                            <span>Transfer Amount (₹)</span>
                                        </div>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={fuelTransferAmount}
                                        onChange={(e) => setFuelTransferAmount(e.target.value)}
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg font-medium"
                                        placeholder="Enter amount"
                                        required
                                    />
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowFuelTransferForm(false);
                                            setFuelTransferAmount('');
                                        }}
                                        className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
                                    >
                                        <FaTimes className="w-4 h-4" />
                                        <span>Cancel</span>
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg"
                                    >
                                        {loading ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaCheck className="w-4 h-4" />}
                                        <span>Transfer</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                </div>
            )}

            {/* Balance Adjustment Modal */}
            {showAdjustmentForm && selectedAccount && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                            <FaEdit className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800">Adjust Balance</h3>
                            <p className="text-sm text-gray-600">{selectedAccount.name}</p>
                        </div>
                    </div>

                    <form onSubmit={handleAdjustment} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center space-x-2">
                                    <FaMoneyBillWave className="w-4 h-4 text-gray-500" />
                                    <span>Adjustment Amount (₹)</span>
                                </div>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={adjustmentAmount}
                                onChange={(e) => setAdjustmentAmount(e.target.value)}
                                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg font-medium"
                                placeholder="Enter amount (+ for credit, - for debit)"
                                required
                            />
                            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                                <div className="flex items-start space-x-2">
                                    <FaInfoCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                                    <p className="text-sm text-blue-800">
                                        Use positive numbers to add money, negative to subtract
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAdjustmentForm(false);
                                    setSelectedAccount(null);
                                    setAdjustmentAmount('');
                                }}
                                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
                            >
                                <FaTimes className="w-4 h-4" />
                                <span>Cancel</span>
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg"
                            >
                                {loading ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaCheck className="w-4 h-4" />}
                                <span>Update Balance</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Accounts History Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl">
                        <FaChartLine className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">Transfer History</h3>
                        <p className="text-sm text-gray-600">Account and fuel transfer records</p>
                    </div>
                </div>

                {/* Account Transfers History */}
                {accountTransfers.length > 0 && (
                    <div className="space-y-4 mb-8">
                        <h4 className="text-lg font-semibold text-gray-700 flex items-center space-x-2">
                            <FaExchangeAlt className="w-5 h-5 text-blue-600" />
                            <span>Account Transfers</span>
                        </h4>

                        <div className="space-y-3">
                            {accountTransfers
                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                .slice(0, 5)
                                .map((transfer, index) => (
                                    <div
                                        key={transfer.id}
                                        className="group bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                                                    <FaExchangeAlt className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-800">
                                                        {formatCurrency(transfer.amount)}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {transfer.fromAccount} → {transfer.toAccount}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                                    Completed
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {formatDate(transfer.createdAt)} at {formatTime(transfer.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {/* Fuel Transfers History */}
                {fuelTransfers.filter(transfer => transfer.status === 'completed').length > 0 && (
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-700 flex items-center space-x-2">
                            <FaGasPump className="w-5 h-5 text-orange-600" />
                            <span>Completed Fuel Transfers</span>
                        </h4>

                        <div className="space-y-3">
                            {fuelTransfers
                                .filter(transfer => transfer.status === 'completed')
                                .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
                                .slice(0, 5)
                                .map((transfer, index) => (
                                    <div
                                        key={transfer.id}
                                        className="group bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg">
                                                    <FaGasPump className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-800">
                                                        {formatCurrency(transfer.amount)}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {transfer.fromAccount} → Fuel Account
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                                    Completed
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {formatDate(transfer.completedAt)} at {formatTime(transfer.completedAt)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {/* Empty State - Show when no transfers exist */}
                {accountTransfers.length === 0 && fuelTransfers.filter(transfer => transfer.status === 'completed').length === 0 && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaChartLine className="w-8 h-8 text-gray-400" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-600 mb-2">No Transfer History</h4>
                        <p className="text-sm text-gray-500">Transfer history will appear here once you make transfers between accounts or fuel transfers.</p>
                    </div>
                )}

            </div>

        </div>
    );
};

export default AccountsView;
