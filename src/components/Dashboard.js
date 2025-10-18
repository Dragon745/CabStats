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
        currentSession,
        startSession,
        endSession,
        resetAllData
    } = useApp();

    const [showStartSessionForm, setShowStartSessionForm] = useState(false);
    const [showEndSessionForm, setShowEndSessionForm] = useState(false);
    const [startKm, setStartKm] = useState('');
    const [endKm, setEndKm] = useState('');
    const [showQRModal, setShowQRModal] = useState(false);

    const todaysRides = getTodaysRides();
    const todaysProfit = getTodaysProfit();
    const combinedBalance = getCombinedBalance();

    const handleStartSession = async (e) => {
        e.preventDefault();
        if (!startKm) {
            alert('Please enter starting km');
            return;
        }
        try {
            await startSession(startKm);
            setStartKm('');
            setShowStartSessionForm(false);
        } catch (error) {
            alert('Failed to start session: ' + error.message);
        }
    };

    const handleEndSession = async (e) => {
        e.preventDefault();
        if (!endKm) {
            alert('Please enter ending km');
            return;
        }
        try {
            await endSession(endKm);
            setEndKm('');
            setShowEndSessionForm(false);
        } catch (error) {
            alert('Failed to end session: ' + error.message);
        }
    };

    const handleResetData = async () => {
        const confirmed = window.confirm(
            '⚠️ WARNING: This will permanently delete ALL data including:\n\n' +
            '• All sessions\n' +
            '• All rides\n' +
            '• All expenses\n' +
            '• All fuel transfers\n' +
            '• Reset all account balances to ₹0\n' +
            '• Any active session or ride\n\n' +
            'This action CANNOT be undone!\n\n' +
            'Are you absolutely sure you want to reset all data?'
        );

        if (confirmed) {
            try {
                await resetAllData();
                alert('✅ All data has been reset successfully!');
            } catch (error) {
                alert('Failed to reset data: ' + error.message);
            }
        }
    };

    const handleShowQR = () => {
        setShowQRModal(true);
    };

    const handleCloseQR = () => {
        setShowQRModal(false);
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
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">Total Balance</h2>
                    <button
                        onClick={handleShowQR}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        title="Show Payment QR Code"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                    </button>
                </div>
                <div className={`text-3xl font-bold ${combinedBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(combinedBalance)}
                </div>
            </div>

            {/* Session Status */}
            <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Session</h3>
                {currentSession ? (
                    <div className="space-y-3">
                        <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-green-800 font-semibold">Active Session</div>
                                    <div className="text-green-600 text-sm">
                                        Started: {new Date(currentSession.startTime).toLocaleTimeString()}
                                    </div>
                                    <div className="text-green-600 text-sm">
                                        Starting KM: {currentSession.startKm}
                                    </div>
                                </div>
                                <span className="text-2xl">🚗</span>
                            </div>
                        </div>

                        {showEndSessionForm ? (
                            <form onSubmit={handleEndSession} className="space-y-3">
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
                                        onClick={() => setShowEndSessionForm(false)}
                                        className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-semibold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold"
                                    >
                                        End Session
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <button
                                onClick={() => setShowEndSessionForm(true)}
                                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold"
                            >
                                End Session
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
                            <div className="text-center text-gray-600">
                                No active session
                            </div>
                        </div>

                        {showStartSessionForm ? (
                            <form onSubmit={handleStartSession} className="space-y-3">
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
                                        onClick={() => setShowStartSessionForm(false)}
                                        className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-semibold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold"
                                    >
                                        Start Session
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <button
                                onClick={() => setShowStartSessionForm(true)}
                                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold"
                            >
                                Start Session
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

            {/* Reset Data Button */}
            <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">⚙️ Data Management</h3>
                <button
                    onClick={handleResetData}
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                    🗑️ Reset All Data
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                    This will permanently delete all data and reset account balances
                </p>
            </div>

            {/* QR Code Modal */}
            {showQRModal && (
                <div className="fixed inset-0 bg-black z-50" onClick={handleCloseQR}>
                    <img
                        src="/PaymentQR.jpg"
                        alt="Payment QR Code"
                        className="w-full h-full object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button
                        onClick={handleCloseQR}
                        className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                        title="Close"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
