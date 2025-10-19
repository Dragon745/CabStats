import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ExpenseStats from './ExpenseStats';
import {
    FaChartLine,
    FaCalendarAlt,
    FaClock,
    FaMoneyBillWave,
    FaRoute,
    FaTachometerAlt,
    FaMapMarkerAlt,
    FaCreditCard,
    FaGift,
    FaStar,
    FaTrendingDown,
    FaTaxi,
    FaMobile,
    FaWallet,
    FaInfoCircle,
    FaLightbulb,
    FaChartBar,
    FaChartPie,
    FaMapPin,
    FaCoins,
    FaPercentage
} from 'react-icons/fa';
import { FaArrowTrendUp } from 'react-icons/fa6';

const Stats = () => {
    const {
        getDateStats,
        getSessionStats,
        getWeeklyStats,
        getMonthlyStats,
        getAllTimeStats,
        sessions,
        formatCurrency,
        formatDate
    } = useApp();

    // Get today's date in YYYY-MM-DD format for the date input
    const today = new Date().toISOString().split('T')[0];
    const [viewMode, setViewMode] = useState('weekly'); // 'date', 'session', 'weekly', 'monthly', 'allTime'
    const [selectedDate, setSelectedDate] = useState(today);
    const [selectedSessionId, setSelectedSessionId] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(today.slice(0, 7)); // YYYY-MM
    const [showExpenseStats, setShowExpenseStats] = useState(false);

    // Get stats based on view mode
    const stats = (() => {
        switch (viewMode) {
            case 'date': return getDateStats(selectedDate);
            case 'session': return getSessionStats(selectedSessionId);
            case 'weekly': return getWeeklyStats(selectedDate);
            case 'monthly': return getMonthlyStats(selectedMonth + '-01');
            case 'allTime': return getAllTimeStats();
            default: return null;
        }
    })();

    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = Math.floor(minutes % 60);
        if (hours > 0) {
            return `${hours}h ${remainingMinutes}m`;
        }
        return `${remainingMinutes}m`;
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Airport Fee': return '✈️';
            case 'Cigarette': return '🚬';
            case 'Cleaning': return '🧽';
            case 'Food': return '🍽️';
            case 'Fuel': return '⛽';
            case 'Goodies': return '🍬';
            case 'Other': return '📦';
            case 'Other Fees': return '💳';
            case 'Parking Fee': return '🅿️';
            case 'Platform Fee': return '📱';
            case 'Rent': return '🏠';
            case 'Tolls': return '🛣️';
            case 'Water': return '💧';
            case 'Withdrawals': return '💸';
            default: return '💰';
        }
    };

    const getPlatformIcon = (platform) => {
        switch (platform) {
            case 'Uber': return <FaTaxi className="w-4 h-4 text-blue-600" />;
            case 'Ola': return <FaTaxi className="w-4 h-4 text-green-600" />;
            case 'Rapido': return <FaMobile className="w-4 h-4 text-purple-600" />;
            case 'Private': return <FaWallet className="w-4 h-4 text-orange-600" />;
            case 'Other': return <FaTaxi className="w-4 h-4 text-gray-600" />;
            default: return <FaTaxi className="w-4 h-4 text-gray-600" />;
        }
    };

    const getPaymentIcon = (method) => {
        switch (method) {
            case 'Cash Account': return <FaCoins className="w-4 h-4 text-green-600" />;
            case 'Main Account': return <FaWallet className="w-4 h-4 text-blue-600" />;
            case 'Platform Account': return <FaMobile className="w-4 h-4 text-purple-600" />;
            default: return <FaWallet className="w-4 h-4 text-gray-600" />;
        }
    };

    const getPerformanceColor = (value, isPositive = true) => {
        if (isPositive) {
            return value >= 0 ? 'text-green-600' : 'text-red-600';
        }
        return value > 0 ? 'text-green-600' : 'text-gray-600';
    };

    const getPerformanceBgColor = (value, isPositive = true) => {
        if (isPositive) {
            return value >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
        }
        return value > 0 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200';
    };

    // If showing expense stats, render only that
    if (showExpenseStats) {
        return <ExpenseStats onBack={() => setShowExpenseStats(false)} />;
    }

    return (
        <div className="p-4 space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-lg p-4">
                <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                    <FaChartLine className="w-6 h-6 text-blue-600 mr-2" />
                    Advanced Analytics Dashboard
                </h2>

                {/* View Mode Toggle */}
                <div className="mb-4">
                    <div className="flex bg-gray-100 rounded-lg p-1 overflow-x-auto">
                        {[
                            { key: 'date', label: 'By Date', icon: FaCalendarAlt },
                            { key: 'session', label: 'By Session', icon: FaClock },
                            { key: 'weekly', label: 'Weekly', icon: FaChartBar },
                            { key: 'monthly', label: 'Monthly', icon: FaChartPie },
                            { key: 'allTime', label: 'All Time', icon: FaArrowTrendUp }
                        ].map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setViewMode(key)}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${viewMode === key
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Date/Session Selectors */}
                {viewMode === 'date' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Date
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="mt-2 text-sm text-gray-600">
                            Showing statistics for {formatDate(selectedDate)}
                        </div>
                    </div>
                )}

                {viewMode === 'session' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Session
                        </label>
                        <select
                            value={selectedSessionId}
                            onChange={(e) => setSelectedSessionId(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select a session</option>
                            {sessions
                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                .map((session) => (
                                    <option key={session.id} value={session.id}>
                                        {session.name} - {formatDate(session.startTime)}
                                        {session.endTime ? ` to ${formatDate(session.endTime)}` : ' (Active)'}
                                        {session.totalKm > 0 && ` (${session.totalKm} km)`}
                                    </option>
                                ))}
                        </select>
                        {selectedSessionId && stats && (
                            <div className="mt-2 text-sm text-gray-600">
                                Showing statistics for {stats.session?.name}
                            </div>
                        )}
                    </div>
                )}

                {viewMode === 'monthly' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Month
                        </label>
                        <input
                            type="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="mt-2 text-sm text-gray-600">
                            Showing statistics for {selectedMonth}
                        </div>
                    </div>
                )}

                {viewMode === 'weekly' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            End Date (7 days ending on)
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="mt-2 text-sm text-gray-600">
                            Showing statistics for 7 days ending on {formatDate(selectedDate)}
                        </div>
                    </div>
                )}

                {viewMode === 'allTime' && (
                    <div className="mt-2 text-sm text-gray-600">
                        Showing statistics for all recorded data
                    </div>
                )}
            </div>

            {/* Empty State */}
            {(!stats || (stats.totalRides === 0 && stats.totalExpenses === 0)) ? (
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="text-gray-400 text-6xl mb-4">📊</div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Data Available</h3>
                    <p className="text-gray-500">
                        {viewMode === 'date'
                            ? `No rides or expenses recorded for ${formatDate(selectedDate)}`
                            : viewMode === 'session'
                                ? selectedSessionId
                                    ? 'No rides or expenses recorded for this session'
                                    : 'Please select a session to view statistics'
                                : viewMode === 'weekly'
                                    ? `No rides or expenses recorded in the 7 days ending on ${formatDate(selectedDate)}`
                                    : viewMode === 'monthly'
                                        ? `No rides or expenses recorded in ${selectedMonth}`
                                        : 'No rides or expenses recorded'
                        }
                    </p>
                </div>
            ) : (
                <>
                    {/* Key Insights Card */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-lg p-6 border border-blue-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <FaLightbulb className="w-5 h-5 text-yellow-600 mr-2" />
                            Key Insights
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Best Platform */}
                            {stats.platformStats && Object.keys(stats.platformStats).length > 0 && (
                                <div className="bg-white rounded-lg p-4 border border-blue-200">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <FaStar className="w-4 h-4 text-yellow-500" />
                                        <span className="text-sm font-medium text-gray-700">Best Platform</span>
                                    </div>
                                    <div className="text-lg font-bold text-blue-600">
                                        {Object.entries(stats.platformStats)
                                            .filter(([, data]) => data.count > 0)
                                            .sort(([, a], [, b]) => b.avgProfit - a.avgProfit)[0]?.[0] || 'N/A'}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        Highest avg profit per ride
                                    </div>
                                </div>
                            )}

                            {/* Best Day */}
                            {stats.dayOfWeekStats && Object.keys(stats.dayOfWeekStats).length > 0 && (
                                <div className="bg-white rounded-lg p-4 border border-green-200">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <FaArrowTrendUp className="w-4 h-4 text-green-500" />
                                        <span className="text-sm font-medium text-gray-700">Best Day</span>
                                    </div>
                                    <div className="text-lg font-bold text-green-600">
                                        {Object.entries(stats.dayOfWeekStats)
                                            .filter(([, data]) => data.count > 0)
                                            .sort(([, a], [, b]) => b.avgProfit - a.avgProfit)[0]?.[0] || 'N/A'}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        Highest avg profit per ride
                                    </div>
                                </div>
                            )}

                            {/* Peak Hour */}
                            {stats.peakHour && (
                                <div className="bg-white rounded-lg p-4 border border-purple-200">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <FaClock className="w-4 h-4 text-purple-500" />
                                        <span className="text-sm font-medium text-gray-700">Peak Hour</span>
                                    </div>
                                    <div className="text-lg font-bold text-purple-600">
                                        {stats.peakHour.hour}:00
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        Highest total profit
                                    </div>
                                </div>
                            )}

                            {/* Tip Rate */}
                            <div className="bg-white rounded-lg p-4 border border-yellow-200">
                                <div className="flex items-center space-x-2 mb-2">
                                    <FaGift className="w-4 h-4 text-yellow-500" />
                                    <span className="text-sm font-medium text-gray-700">Tip Rate</span>
                                </div>
                                <div className="text-lg font-bold text-yellow-600">
                                    {stats.tipPercentage?.toFixed(1) || 0}%
                                </div>
                                <div className="text-xs text-gray-600">
                                    Rides with tips
                                </div>
                            </div>

                            {/* Most Profitable Area */}
                            {stats.topAreas && stats.topAreas.length > 0 && (
                                <div className="bg-white rounded-lg p-4 border border-orange-200">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <FaMapPin className="w-4 h-4 text-orange-500" />
                                        <span className="text-sm font-medium text-gray-700">Top Area</span>
                                    </div>
                                    <div className="text-lg font-bold text-orange-600">
                                        {stats.topAreas[0]?.area || 'N/A'}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        Most profitable pickup
                                    </div>
                                </div>
                            )}

                            {/* Avg Tip */}
                            <div className="bg-white rounded-lg p-4 border border-pink-200">
                                <div className="flex items-center space-x-2 mb-2">
                                    <FaCoins className="w-4 h-4 text-pink-500" />
                                    <span className="text-sm font-medium text-gray-700">Avg Tip</span>
                                </div>
                                <div className="text-lg font-bold text-pink-600">
                                    {formatCurrency(stats.avgTipAmount || 0)}
                                </div>
                                <div className="text-xs text-gray-600">
                                    Per tipped ride
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Overview Section */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <FaChartLine className="w-5 h-5 text-blue-600 mr-2" />
                            Overview
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{stats.totalRides}</div>
                                <div className="text-sm text-gray-600">Total Rides</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalEarnings)}</div>
                                <div className="text-sm text-gray-600">Total Earnings</div>
                            </div>
                            <div className="text-center">
                                <div className={`text-2xl font-bold ${getPerformanceColor(stats.totalProfit)}`}>
                                    {formatCurrency(stats.totalProfit)}
                                </div>
                                <div className="text-sm text-gray-600">Total Profit</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalTips || 0)}</div>
                                <div className="text-sm text-gray-600">Total Tips</div>
                            </div>
                        </div>
                    </div>

                    {/* Platform Comparison Card */}
                    {stats.platformStats && Object.keys(stats.platformStats).some(key => stats.platformStats[key].count > 0) && (
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <FaTaxi className="w-5 h-5 text-blue-600 mr-2" />
                                Platform Performance
                            </h3>
                            <div className="space-y-3">
                                {Object.entries(stats.platformStats)
                                    .filter(([, data]) => data.count > 0)
                                    .sort(([, a], [, b]) => b.totalProfit - a.totalProfit)
                                    .map(([platform, data]) => (
                                        <div key={platform} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                {getPlatformIcon(platform)}
                                                <div>
                                                    <div className="font-medium text-gray-800">{platform}</div>
                                                    <div className="text-sm text-gray-600">{data.count} rides</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`font-bold ${getPerformanceColor(data.totalProfit)}`}>
                                                    {formatCurrency(data.totalProfit)}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {formatCurrency(data.avgProfit)} avg
                                                </div>
                                                <div className="text-xs text-purple-600">
                                                    {formatCurrency(data.avgTip)} avg tip
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Day of Week Analysis */}
                    {stats.dayOfWeekStats && Object.keys(stats.dayOfWeekStats).some(key => stats.dayOfWeekStats[key].count > 0) && (
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <FaCalendarAlt className="w-5 h-5 text-green-600 mr-2" />
                                Day of Week Analysis
                            </h3>
                            <div className="grid grid-cols-7 gap-2">
                                {Object.entries(stats.dayOfWeekStats).map(([day, data]) => (
                                    <div key={day} className={`text-center p-3 rounded-lg border ${getPerformanceBgColor(data.avgProfit)}`}>
                                        <div className="text-xs font-medium text-gray-700 mb-1">{day.slice(0, 3)}</div>
                                        <div className={`text-lg font-bold ${getPerformanceColor(data.avgProfit)}`}>
                                            {formatCurrency(data.avgProfit)}
                                        </div>
                                        <div className="text-xs text-gray-600">{data.count} rides</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Peak Hours Analysis */}
                    {stats.hourlyStats && Object.keys(stats.hourlyStats).some(key => stats.hourlyStats[key].count > 0) && (
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <FaClock className="w-5 h-5 text-purple-600 mr-2" />
                                Peak Hours Analysis
                            </h3>
                            <div className="grid grid-cols-6 md:grid-cols-12 gap-1">
                                {Object.entries(stats.hourlyStats)
                                    .filter(([, data]) => data.count > 0)
                                    .sort(([a], [b]) => parseInt(a) - parseInt(b))
                                    .map(([hour, data]) => (
                                        <div key={hour} className={`text-center p-2 rounded border ${getPerformanceBgColor(data.totalProfit)}`}>
                                            <div className="text-xs font-medium text-gray-700">{hour}:00</div>
                                            <div className={`text-sm font-bold ${getPerformanceColor(data.totalProfit)}`}>
                                                {formatCurrency(data.totalProfit)}
                                            </div>
                                            <div className="text-xs text-gray-600">{data.count}</div>
                                        </div>
                                    ))}
                            </div>
                            {stats.peakHour && (
                                <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <FaArrowTrendUp className="w-4 h-4 text-purple-600" />
                                        <span className="text-sm font-medium text-purple-800">
                                            Peak earning hour: {stats.peakHour.hour}:00 with {formatCurrency(stats.peakHour.totalProfit)} total profit
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tip Analysis */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <FaGift className="w-5 h-5 text-yellow-600 mr-2" />
                            Tip Analysis
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-yellow-600">{stats.tipPercentage?.toFixed(1) || 0}%</div>
                                <div className="text-sm text-gray-600">Tip Rate</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.avgTipAmount || 0)}</div>
                                <div className="text-sm text-gray-600">Avg Tip Amount</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">{formatCurrency(stats.bestTip || 0)}</div>
                                <div className="text-sm text-gray-600">Best Tip</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalTips || 0)}</div>
                                <div className="text-sm text-gray-600">Total Tips</div>
                            </div>
                        </div>
                    </div>

                    {/* Top Routes/Areas */}
                    {stats.topAreas && stats.topAreas.length > 0 && (
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <FaMapMarkerAlt className="w-5 h-5 text-orange-600 mr-2" />
                                Top Pickup Areas
                            </h3>
                            <div className="space-y-3">
                                {stats.topAreas.map((area, index) => (
                                    <div key={area.area} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-bold text-orange-600">{index + 1}</span>
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-800">{area.area}</div>
                                                <div className="text-sm text-gray-600">{area.count} rides</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-green-600">{formatCurrency(area.totalProfit)}</div>
                                            <div className="text-sm text-gray-600">{formatCurrency(area.avgProfit)} avg</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Payment Method Breakdown */}
                    {stats.paymentMethodStats && Object.keys(stats.paymentMethodStats).some(key => stats.paymentMethodStats[key].count > 0) && (
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <FaCreditCard className="w-5 h-5 text-blue-600 mr-2" />
                                Payment Method Breakdown
                            </h3>
                            <div className="space-y-3">
                                {Object.entries(stats.paymentMethodStats)
                                    .filter(([, data]) => data.count > 0)
                                    .sort(([, a], [, b]) => b.totalAmount - a.totalAmount)
                                    .map(([method, data]) => (
                                        <div key={method} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                {getPaymentIcon(method)}
                                                <div>
                                                    <div className="font-medium text-gray-800">{method}</div>
                                                    <div className="text-sm text-gray-600">{data.count} rides</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-blue-600">{formatCurrency(data.totalAmount)}</div>
                                                <div className="text-sm text-gray-600">
                                                    {formatCurrency(data.totalAmount / data.count)} avg
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Distance & Time Card */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <FaTachometerAlt className="w-5 h-5 text-blue-600 mr-2" />
                            Distance & Time
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{stats.totalKm.toFixed(1)}</div>
                                <div className="text-sm text-gray-600">Total KM</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{stats.averageDistance.toFixed(1)}</div>
                                <div className="text-sm text-gray-600">Avg Distance</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">{formatDuration(stats.totalTimeMinutes)}</div>
                                <div className="text-sm text-gray-600">Total Time</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">{formatDuration(stats.averageDuration)}</div>
                                <div className="text-sm text-gray-600">Avg Duration</div>
                            </div>
                        </div>
                    </div>

                    {/* Efficiency Metrics Card */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <FaRoute className="w-5 h-5 text-green-600 mr-2" />
                            Efficiency Metrics
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className={`text-2xl font-bold ${getPerformanceColor(stats.averageProfitPerKm)}`}>
                                    {formatCurrency(stats.averageProfitPerKm)}
                                </div>
                                <div className="text-sm text-gray-600">Profit/KM</div>
                            </div>
                            <div className="text-center">
                                <div className={`text-2xl font-bold ${getPerformanceColor(stats.averageProfitPerMin)}`}>
                                    {formatCurrency(stats.averageProfitPerMin)}
                                </div>
                                <div className="text-sm text-gray-600">Profit/Min</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalFuelAllocation)}</div>
                                <div className="text-sm text-gray-600">Fuel Allocation</div>
                            </div>
                            <div className="text-center">
                                <div className={`text-2xl font-bold ${getPerformanceColor(stats.averageProfit)}`}>
                                    {formatCurrency(stats.averageProfit)}
                                </div>
                                <div className="text-sm text-gray-600">Avg Profit</div>
                            </div>
                        </div>
                    </div>

                    {/* Expense Statistics Card */}
                    {stats.totalExpenses > 0 && (
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <FaMoneyBillWave className="w-5 h-5 text-red-600 mr-2" />
                                Expense Statistics
                            </h3>
                            <div className="text-center mb-4">
                                <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalExpenses)}</div>
                                <div className="text-sm text-gray-600">Total Expenses</div>
                            </div>

                            {Object.keys(stats.expensesByCategory).length > 0 && (
                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-gray-700 mb-2">Expenses by Category:</div>
                                    {Object.entries(stats.expensesByCategory)
                                        .sort(([, a], [, b]) => b - a)
                                        .map(([category, amount]) => (
                                            <div key={category} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center">
                                                    <span className="mr-2">{getCategoryIcon(category)}</span>
                                                    <span className="text-sm font-medium text-gray-700">{category}</span>
                                                </div>
                                                <span className="text-sm font-bold text-red-600">{formatCurrency(amount)}</span>
                                            </div>
                                        ))}
                                </div>
                            )}

                            {stats.mostExpensiveCategory !== 'None' && (
                                <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                                    <div className="text-sm text-gray-600">Most Expensive Category</div>
                                    <div className="text-lg font-bold text-red-600 flex items-center justify-center">
                                        <span className="mr-2">{getCategoryIcon(stats.mostExpensiveCategory)}</span>
                                        {stats.mostExpensiveCategory}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Financial Summary Card */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <FaChartPie className="w-5 h-5 text-green-600 mr-2" />
                            Financial Summary
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 px-3 bg-green-50 rounded-lg">
                                <span className="text-sm font-medium text-gray-700">Gross Earnings</span>
                                <span className="text-lg font-bold text-green-600">{formatCurrency(stats.grossEarnings)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 px-3 bg-red-50 rounded-lg">
                                <span className="text-sm font-medium text-gray-700">Total Expenses</span>
                                <span className="text-lg font-bold text-red-600">{formatCurrency(stats.totalExpenses)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 px-3 bg-blue-50 rounded-lg">
                                <span className="text-sm font-medium text-gray-700">Net Profit</span>
                                <span className={`text-lg font-bold ${getPerformanceColor(stats.netProfit)}`}>
                                    {formatCurrency(stats.netProfit)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 px-3 bg-purple-50 rounded-lg">
                                <span className="text-sm font-medium text-gray-700">Profit Margin</span>
                                <span className={`text-lg font-bold ${getPerformanceColor(stats.profitMargin)}`}>
                                    {stats.profitMargin.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Expense Statistics Button */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <button
                            onClick={() => setShowExpenseStats(true)}
                            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 transition-all duration-200 shadow-lg"
                        >
                            <FaChartBar className="w-5 h-5" />
                            <span>View Detailed Expense Statistics</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Stats;
