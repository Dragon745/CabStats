import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
    FaWallet,
    FaQrcode,
    FaCar,
    FaPlay,
    FaStop,
    FaClock,
    FaTachometerAlt,
    FaPlayCircle,
    FaGasPump,
    FaMoneyBillWave,
    FaMobile,
    FaTaxi,
    FaChartLine,
    FaExclamationTriangle,
    FaCog,
    FaTrashAlt,
    FaTimes,
    FaSpinner
} from 'react-icons/fa';
import {
    FaArrowUp,
    FaArrowDown
} from 'react-icons/fa';
import {
    MdDashboard
} from 'react-icons/md';

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
    const [isLoading, setIsLoading] = useState(false);
    const [showDataManagement, setShowDataManagement] = useState(false);
    const [animatedBalance, setAnimatedBalance] = useState(0);
    const [sessionDuration, setSessionDuration] = useState(0);

    const todaysRides = getTodaysRides();
    const todaysProfit = getTodaysProfit();
    const combinedBalance = getCombinedBalance();

    // Animated balance counter effect
    useEffect(() => {
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
    }, [combinedBalance, animatedBalance]);

    // Session duration timer
    useEffect(() => {
        let interval;
        if (currentSession) {
            interval = setInterval(() => {
                const now = new Date().getTime();
                const start = new Date(currentSession.startTime).getTime();
                setSessionDuration(Math.floor((now - start) / 1000));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [currentSession]);

    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStartSession = async (e) => {
        e.preventDefault();
        if (!startKm) {
            alert('Please enter starting km');
            return;
        }
        setIsLoading(true);
        try {
            await startSession(startKm);
            setStartKm('');
            setShowStartSessionForm(false);
        } catch (error) {
            alert('Failed to start session: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEndSession = async (e) => {
        e.preventDefault();
        if (!endKm) {
            alert('Please enter ending km');
            return;
        }
        setIsLoading(true);
        try {
            await endSession(endKm);
            setEndKm('');
            setShowEndSessionForm(false);
        } catch (error) {
            alert('Failed to end session: ' + error.message);
        } finally {
            setIsLoading(false);
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
            setIsLoading(true);
            try {
                await resetAllData();
                alert('✅ All data has been reset successfully!');
            } catch (error) {
                alert('Failed to reset data: ' + error.message);
            } finally {
                setIsLoading(false);
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
            case 'Main Account': return 'from-green-400 to-green-600';
            case 'Fuel Account': return 'from-blue-400 to-blue-600';
            case 'Cash Account': return 'from-yellow-400 to-yellow-600';
            case 'Platform Account': return 'from-purple-400 to-purple-600';
            default: return 'from-gray-400 to-gray-600';
        }
    };

    const getAccountIcon = (accountName) => {
        switch (accountName) {
            case 'Main Account': return FaWallet;
            case 'Fuel Account': return FaGasPump;
            case 'Cash Account': return FaMoneyBillWave;
            case 'Platform Account': return FaMobile;
            default: return FaWallet;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 space-y-6 pb-20">
            {/* Hero Balance Card */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl shadow-2xl p-8 text-white transform hover:scale-[1.02] transition-all duration-300">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                <FaWallet className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold opacity-90">Total Balance</h2>
                                <p className="text-sm opacity-70">All Accounts Combined</p>
                            </div>
                        </div>

                        <button
                            onClick={handleShowQR}
                            className="group p-4 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
                            title="Show Payment QR Code"
                        >
                            <FaQrcode className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                        </button>
                    </div>

                    <div className="flex items-end justify-between">
                        <div>
                            <div className={`text-5xl font-bold mb-2 ${animatedBalance >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                                {formatCurrency(animatedBalance)}
                            </div>
                            <div className="flex items-center space-x-2 text-sm opacity-80">
                                <FaArrowUp className="w-4 h-4" />
                                <span>Updated in real-time</span>
                            </div>
                        </div>

                        {animatedBalance >= 0 && (
                            <div className="flex items-center space-x-1 bg-green-500/20 backdrop-blur-sm rounded-full px-3 py-1">
                                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                                <span className="text-xs font-medium">Active</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Session Status Card */}
            {currentSession ? (
                <div className="relative overflow-hidden bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 rounded-2xl shadow-xl p-6 text-white">
                    {/* Animated Background */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full animate-pulse delay-1000"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                    <FaCar className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">Active Session</h3>
                                    <p className="text-sm opacity-80">{currentSession.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                                <span className="text-xs font-medium">LIVE</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                                <div className="flex items-center space-x-2 mb-1">
                                    <FaClock className="w-4 h-4 opacity-70" />
                                    <span className="text-xs opacity-70">Duration</span>
                                </div>
                                <div className="text-lg font-bold">{formatDuration(sessionDuration)}</div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                                <div className="flex items-center space-x-2 mb-1">
                                    <FaTachometerAlt className="w-4 h-4 opacity-70" />
                                    <span className="text-xs opacity-70">Start KM</span>
                                </div>
                                <div className="text-lg font-bold">{currentSession.startKm}</div>
                            </div>
                        </div>

                        <div className="text-xs opacity-70 mb-4">
                            Started: {new Date(currentSession.startTime).toLocaleString()}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaPlayCircle className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready to Start</h3>
                        <p className="text-sm text-gray-600 mb-4">No active session. Start a new driving session to begin tracking.</p>
                    </div>
                </div>
            )}

            {/* Session Controls */}
            {currentSession ? (
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    {showEndSessionForm ? (
                        <form onSubmit={handleEndSession} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <div className="flex items-center space-x-2">
                                        <FaTachometerAlt className="w-4 h-4 text-gray-500" />
                                        <span>Ending KM</span>
                                    </div>
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={endKm}
                                    onChange={(e) => setEndKm(e.target.value)}
                                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-lg font-medium"
                                    placeholder="Enter ending km"
                                    required
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEndSessionForm(false)}
                                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
                                >
                                    <FaTimes className="w-4 h-4" />
                                    <span>Cancel</span>
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                                >
                                    {isLoading ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaStop className="w-4 h-4" />}
                                    <span>End Session</span>
                                </button>
                            </div>
                        </form>
                    ) : (
                        <button
                            onClick={() => setShowEndSessionForm(true)}
                            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg"
                        >
                            <FaStop className="w-5 h-5" />
                            <span>End Session</span>
                        </button>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    {showStartSessionForm ? (
                        <form onSubmit={handleStartSession} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <div className="flex items-center space-x-2">
                                        <FaTachometerAlt className="w-4 h-4 text-gray-500" />
                                        <span>Starting KM</span>
                                    </div>
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={startKm}
                                    onChange={(e) => setStartKm(e.target.value)}
                                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-lg font-medium"
                                    placeholder="Enter starting km"
                                    required
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowStartSessionForm(false)}
                                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
                                >
                                    <FaTimes className="w-4 h-4" />
                                    <span>Cancel</span>
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                                >
                                    {isLoading ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaPlay className="w-4 h-4" />}
                                    <span>Start Session</span>
                                </button>
                            </div>
                        </form>
                    ) : (
                        <button
                            onClick={() => setShowStartSessionForm(true)}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg transform hover:scale-[1.02]"
                        >
                            <FaPlay className="w-5 h-5" />
                            <span>Start Session</span>
                        </button>
                    )}
                </div>
            )}

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
                            <div className={`text-xl font-bold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(account.balance)}
                            </div>

                            <div className="mt-3 pt-3 border-t border-gray-100">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500">Balance</span>
                                    <div className="flex items-center space-x-1">
                                        {account.balance >= 0 ? (
                                            <>
                                                <FaArrowUp className="w-3 h-3 text-green-500" />
                                                <span className="text-green-500 font-medium">+</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaArrowDown className="w-3 h-3 text-red-500" />
                                                <span className="text-red-500 font-medium">-</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pending Fuel Transfer Alert */}
            {pendingFuelTransfer > 0 && (
                <div className="relative overflow-hidden bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 rounded-2xl shadow-xl p-6 text-white animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-500/20"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                    <FaExclamationTriangle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">Pending Fuel Transfer</h3>
                                    <p className="text-sm opacity-90">Transfer required to Fuel Account</p>
                                </div>
                            </div>
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                <FaGasPump className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="text-2xl font-bold">{formatCurrency(pendingFuelTransfer)}</div>
                            <div className="text-sm opacity-80 mt-1">Ready to transfer</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Today's Summary */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                        <MdDashboard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Today's Summary</h3>
                        <p className="text-sm text-gray-600">Performance overview</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 text-center">
                        <div className="flex items-center justify-center mb-2">
                            <FaTaxi className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="text-2xl font-bold text-blue-600">{todaysRides.length}</div>
                        <div className="text-sm text-gray-600">Rides</div>
                    </div>

                    <div className={`rounded-xl p-4 text-center ${todaysProfit >= 0 ? 'bg-gradient-to-r from-green-50 to-green-100' : 'bg-gradient-to-r from-red-50 to-red-100'}`}>
                        <div className="flex items-center justify-center mb-2">
                            <FaChartLine className={`w-5 h-5 ${todaysProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                        </div>
                        <div className={`text-2xl font-bold ${todaysProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(todaysProfit)}
                        </div>
                        <div className="text-sm text-gray-600">Profit</div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Last updated</span>
                        <span className="text-gray-700 font-medium">{new Date().toLocaleTimeString()}</span>
                    </div>
                </div>
            </div>

            {/* Data Management Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl">
                        <FaCog className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Data Management</h3>
                        <p className="text-sm text-gray-600">System administration</p>
                    </div>
                </div>

                <button
                    onClick={() => setShowDataManagement(!showDataManagement)}
                    className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2 mb-4"
                >
                    <FaCog className="w-4 h-4" />
                    <span>System Settings</span>
                </button>

                {showDataManagement && (
                    <div className="border border-red-200 rounded-xl p-4 bg-red-50">
                        <div className="flex items-center space-x-2 mb-3">
                            <FaExclamationTriangle className="w-5 h-5 text-red-600" />
                            <h4 className="font-semibold text-red-800">Danger Zone</h4>
                        </div>
                        <p className="text-sm text-red-700 mb-4">
                            This action will permanently delete all data and reset account balances. This cannot be undone.
                        </p>
                        <button
                            onClick={handleResetData}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                            {isLoading ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaTrashAlt className="w-4 h-4" />}
                            <span>Reset All Data</span>
                        </button>
                    </div>
                )}
            </div>

            {/* QR Code Modal - Fullscreen */}
            {showQRModal && (
                <div className="fixed inset-0 bg-black z-50 flex items-center justify-center" onClick={handleCloseQR}>
                    {/* Close button overlay */}
                    <button
                        onClick={handleCloseQR}
                        className="absolute top-4 right-4 z-60 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors duration-200"
                        title="Close"
                    >
                        <FaTimes className="w-6 h-6 text-white" />
                    </button>

                    {/* Fullscreen image */}
                    <img
                        src="/PaymentQR.jpg"
                        alt="Payment QR Code"
                        className="w-full h-full object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};

export default Dashboard;
