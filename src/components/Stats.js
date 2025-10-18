import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Stats = () => {
    const { getDateStats, getSessionStats, sessions, formatCurrency, formatDate } = useApp();

    // Get today's date in YYYY-MM-DD format for the date input
    const today = new Date().toISOString().split('T')[0];
    const [viewMode, setViewMode] = useState('date'); // 'date' or 'session'
    const [selectedDate, setSelectedDate] = useState(today);
    const [selectedSessionId, setSelectedSessionId] = useState('');

    const stats = viewMode === 'date' ? getDateStats(selectedDate) : getSessionStats(selectedSessionId);

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

    return (
        <div className="p-4 space-y-4">
            {/* View Mode Selector */}
            <div className="bg-white rounded-lg shadow-lg p-4">
                <h2 className="text-xl font-bold text-gray-800 mb-3">📊 Statistics</h2>

                {/* View Mode Toggle */}
                <div className="mb-4">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('date')}
                            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${viewMode === 'date'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            By Date
                        </button>
                        <button
                            onClick={() => setViewMode('session')}
                            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${viewMode === 'session'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            By Session
                        </button>
                    </div>
                </div>

                {/* Date Selector */}
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

                {/* Session Selector */}
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
            </div>

            {/* Empty State */}
            {(!stats || (stats.totalRides === 0 && stats.totalExpenses === 0)) ? (
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="text-gray-400 text-6xl mb-4">📊</div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Data Available</h3>
                    <p className="text-gray-500">
                        {viewMode === 'date'
                            ? `No rides or expenses recorded for ${formatDate(selectedDate)}`
                            : selectedSessionId
                                ? 'No rides or expenses recorded for this session'
                                : 'Please select a session to view statistics'
                        }
                    </p>
                </div>
            ) : (
                <>
                    {/* Session Info Card (only in session mode) */}
                    {viewMode === 'session' && stats.session && (
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <span className="mr-2">📋</span>
                                Session Information
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{stats.session.name}</div>
                                    <div className="text-sm text-gray-600">Session Name</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">{stats.sessionKm.toFixed(1)} km</div>
                                    <div className="text-sm text-gray-600">Total Distance</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">{formatDuration(stats.sessionDuration)}</div>
                                    <div className="text-sm text-gray-600">Session Duration</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-600">
                                        {stats.session.startKm} - {stats.session.endKm || 'Active'}
                                    </div>
                                    <div className="text-sm text-gray-600">KM Range</div>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <div className="text-gray-500">Start Time</div>
                                        <div className="font-semibold">{new Date(stats.session.startTime).toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500">End Time</div>
                                        <div className="font-semibold">
                                            {stats.session.endTime ? new Date(stats.session.endTime).toLocaleString() : 'Active'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Ride Statistics Card */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <span className="mr-2">🚗</span>
                            Ride Statistics
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{stats.totalRides}</div>
                                <div className="text-sm text-gray-600">Total Rides</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalEarnings)}</div>
                                <div className="text-sm text-gray-600">Total Earnings</div>
                            </div>
                            <div className="text-center">
                                <div className={`text-2xl font-bold ${stats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(stats.totalProfit)}
                                </div>
                                <div className="text-sm text-gray-600">Total Profit</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{formatCurrency(stats.averageFare)}</div>
                                <div className="text-sm text-gray-600">Avg Fare</div>
                            </div>
                            <div className="text-center">
                                <div className={`text-2xl font-bold ${stats.averageProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(stats.averageProfit)}
                                </div>
                                <div className="text-sm text-gray-600">Avg Profit</div>
                            </div>
                            <div className="text-center">
                                <div className={`text-2xl font-bold ${stats.bestRide >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(stats.bestRide)}
                                </div>
                                <div className="text-sm text-gray-600">Best Ride</div>
                            </div>
                        </div>
                        {stats.totalRides > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="text-center">
                                    <div className={`text-lg font-bold ${stats.worstRide >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatCurrency(stats.worstRide)}
                                    </div>
                                    <div className="text-sm text-gray-600">Worst Ride</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Distance & Time Card */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <span className="mr-2">📏</span>
                            Distance & Time
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
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
                            <span className="mr-2">⚡</span>
                            Efficiency Metrics
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <div className={`text-2xl font-bold ${stats.averageProfitPerKm >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(stats.averageProfitPerKm)}
                                </div>
                                <div className="text-sm text-gray-600">Profit/KM</div>
                            </div>
                            <div className="text-center">
                                <div className={`text-2xl font-bold ${stats.averageProfitPerMin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(stats.averageProfitPerMin)}
                                </div>
                                <div className="text-sm text-gray-600">Profit/Min</div>
                            </div>
                            <div className="text-center col-span-2">
                                <div className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalFuelAllocation)}</div>
                                <div className="text-sm text-gray-600">Total Fuel Allocation</div>
                            </div>
                        </div>
                    </div>

                    {/* Expense Statistics Card */}
                    {stats.totalExpenses > 0 && (
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <span className="mr-2">💸</span>
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
                            <span className="mr-2">💰</span>
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
                                <span className={`text-lg font-bold ${stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(stats.netProfit)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 px-3 bg-purple-50 rounded-lg">
                                <span className="text-sm font-medium text-gray-700">Profit Margin</span>
                                <span className={`text-lg font-bold ${stats.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {stats.profitMargin.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Stats;
