import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Dashboard = () => {
    const {
        accounts,
        pendingFuelTransfer,
        getCombinedBalance,
        getTodaysRides,
        getTodaysProfit,
        formatCurrency,
        currentBusinessDay,
        startBusinessDay,
        endBusinessDay
    } = useApp();

    const [showStartDayForm, setShowStartDayForm] = useState(false);
    const [showEndDayForm, setShowEndDayForm] = useState(false);
    const [startKm, setStartKm] = useState('');
    const [endKm, setEndKm] = useState('');

    const todaysRides = getTodaysRides();
    const todaysProfit = getTodaysProfit();
    const combinedBalance = getCombinedBalance();

    const handleStartBusinessDay = async (e) => {
        e.preventDefault();
        if (!startKm) {
            alert('Please enter starting km');
            return;
        }
        try {
            await startBusinessDay(startKm);
            setStartKm('');
            setShowStartDayForm(false);
        } catch (error) {
            alert('Failed to start business day: ' + error.message);
        }
    };

    const handleEndBusinessDay = async (e) => {
        e.preventDefault();
        if (!endKm) {
            alert('Please enter ending km');
            return;
        }
        try {
            await endBusinessDay(endKm);
            setEndKm('');
            setShowEndDayForm(false);
        } catch (error) {
            alert('Failed to end business day: ' + error.message);
        }
    };

    const getAccountColor = (accountName) => {
        switch (accountName) {
            case 'Main Account': return 'bg-green-500';
            case 'Fuel Account': return 'bg-blue-500';
            case 'Cash Account': return 'bg-yellow-500';
            case 'Platform Account': return 'bg-purple-500';
            default: return 'bg-gray-500';
        }
    };

    const getAccountIcon = (accountName) => {
        switch (accountName) {
            case 'Main Account': return '💰';
            case 'Fuel Account': return '⛽';
            case 'Cash Account': return '💵';
            case 'Platform Account': return '📱';
            default: return '💳';
        }
    };

    return (
        <div className="p-4 space-y-4">
            {/* Combined Balance */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Total Balance</h2>
                <div className={`text-3xl font-bold ${combinedBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(combinedBalance)}
                </div>
            </div>

            {/* Business Day Status */}
            <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Business Day</h3>
                {currentBusinessDay ? (
                    <div className="space-y-3">
                        <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-green-800 font-semibold">Active Business Day</div>
                                    <div className="text-green-600 text-sm">
                                        Started: {new Date(currentBusinessDay.startTime).toLocaleTimeString()}
                                    </div>
                                    <div className="text-green-600 text-sm">
                                        Starting KM: {currentBusinessDay.startKm}
                                    </div>
                                </div>
                                <span className="text-2xl">🚗</span>
                            </div>
                        </div>

                        {showEndDayForm ? (
                            <form onSubmit={handleEndBusinessDay} className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Ending KM
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={endKm}
                                        onChange={(e) => setEndKm(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter ending km"
                                        required
                                    />
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowEndDayForm(false)}
                                        className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-semibold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold"
                                    >
                                        End Day
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <button
                                onClick={() => setShowEndDayForm(true)}
                                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold"
                            >
                                End Business Day
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
                            <div className="text-center text-gray-600">
                                No active business day
                            </div>
                        </div>

                        {showStartDayForm ? (
                            <form onSubmit={handleStartBusinessDay} className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Starting KM
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={startKm}
                                        onChange={(e) => setStartKm(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter starting km"
                                        required
                                    />
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowStartDayForm(false)}
                                        className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-semibold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold"
                                    >
                                        Start Day
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <button
                                onClick={() => setShowStartDayForm(true)}
                                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold"
                            >
                                Start Business Day
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Account Cards */}
            <div className="grid grid-cols-2 gap-4">
                {accounts.map((account) => (
                    <div key={account.id} className="bg-white rounded-lg shadow-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{getAccountIcon(account.name)}</span>
                            <div className={`w-3 h-3 rounded-full ${getAccountColor(account.name)}`}></div>
                        </div>
                        <h3 className="text-sm font-medium text-gray-600 mb-1">{account.name}</h3>
                        <div className={`text-lg font-bold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(account.balance)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pending Fuel Transfer */}
            {pendingFuelTransfer > 0 && (
                <div className="bg-orange-100 border border-orange-300 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-orange-800">Pending Fuel Transfer</h3>
                            <p className="text-orange-600">{formatCurrency(pendingFuelTransfer)}</p>
                        </div>
                        <span className="text-2xl">⛽</span>
                    </div>
                </div>
            )}

            {/* Today's Stats */}
            <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Today's Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{todaysRides.length}</div>
                        <div className="text-sm text-gray-600">Rides</div>
                    </div>
                    <div className="text-center">
                        <div className={`text-2xl font-bold ${todaysProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(todaysProfit)}
                        </div>
                        <div className="text-sm text-gray-600">Profit</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
