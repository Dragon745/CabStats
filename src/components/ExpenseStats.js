import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
    FaChartBar,
    FaArrowLeft,
    FaMoneyBillWave,
    FaCalendarAlt,
    FaClock,
    FaWallet,
    FaReceipt,
    FaChartPie,
    FaTrendingDown,
    FaPlane,
    FaSmoking,
    FaBroom,
    FaUtensils,
    FaGasPump,
    FaCandyCane,
    FaBox,
    FaCreditCard,
    FaParking,
    FaMobile,
    FaHome,
    FaRoad,
    FaTint,
    FaCoffee,
    FaCoins,
    FaList,
    FaChartLine,
    FaExclamationTriangle,
    FaInfoCircle
} from 'react-icons/fa';
import { FaArrowTrendUp } from 'react-icons/fa6';

const ExpenseStats = ({ onBack }) => {
    const {
        expenses,
        formatCurrency,
        formatDate,
        getExpenseStats,
        getExpenseCategories
    } = useApp();

    const today = new Date().toISOString().split('T')[0];
    const [viewMode, setViewMode] = useState('allTime');
    const [selectedDate, setSelectedDate] = useState(today);
    const [selectedMonth, setSelectedMonth] = useState(today.slice(0, 7));

    // Calculate expense statistics based on view mode
    const stats = (() => {
        switch (viewMode) {
            case 'daily':
                return getExpenseStats('daily', selectedDate, selectedDate);
            case 'weekly':
                const endDate = new Date(selectedDate);
                const startDate = new Date(endDate);
                startDate.setDate(startDate.getDate() - 6);
                return getExpenseStats('weekly', startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]);
            case 'monthly':
                return getExpenseStats('monthly', selectedMonth + '-01', selectedMonth + '-31');
            case 'allTime':
            default:
                return getExpenseStats('allTime', null, null);
        }
    })();

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Airport Fee': return <FaPlane className="w-4 h-4 text-blue-600" />;
            case 'Cigarette': return <FaSmoking className="w-4 h-4 text-gray-600" />;
            case 'Cleaning': return <FaBroom className="w-4 h-4 text-green-600" />;
            case 'Food': return <FaUtensils className="w-4 h-4 text-orange-600" />;
            case 'Fuel': return <FaGasPump className="w-4 h-4 text-red-600" />;
            case 'Goodies': return <FaCandyCane className="w-4 h-4 text-pink-600" />;
            case 'Other': return <FaBox className="w-4 h-4 text-gray-600" />;
            case 'Other Fees': return <FaCreditCard className="w-4 h-4 text-purple-600" />;
            case 'Parking Fee': return <FaParking className="w-4 h-4 text-yellow-600" />;
            case 'Platform Fee': return <FaMobile className="w-4 h-4 text-indigo-600" />;
            case 'Rent': return <FaHome className="w-4 h-4 text-teal-600" />;
            case 'Tea': return <FaCoffee className="w-4 h-4 text-amber-600" />;
            case 'Tolls': return <FaRoad className="w-4 h-4 text-cyan-600" />;
            case 'Water': return <FaTint className="w-4 h-4 text-blue-500" />;
            case 'Withdrawals': return <FaCoins className="w-4 h-4 text-green-500" />;
            default: return <FaReceipt className="w-4 h-4 text-gray-600" />;
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Airport Fee': return 'bg-blue-50 border-blue-200 text-blue-800';
            case 'Cigarette': return 'bg-gray-50 border-gray-200 text-gray-800';
            case 'Cleaning': return 'bg-green-50 border-green-200 text-green-800';
            case 'Food': return 'bg-orange-50 border-orange-200 text-orange-800';
            case 'Fuel': return 'bg-red-50 border-red-200 text-red-800';
            case 'Goodies': return 'bg-pink-50 border-pink-200 text-pink-800';
            case 'Other': return 'bg-gray-50 border-gray-200 text-gray-800';
            case 'Other Fees': return 'bg-purple-50 border-purple-200 text-purple-800';
            case 'Parking Fee': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            case 'Platform Fee': return 'bg-indigo-50 border-indigo-200 text-indigo-800';
            case 'Rent': return 'bg-teal-50 border-teal-200 text-teal-800';
            case 'Tea': return 'bg-amber-50 border-amber-200 text-amber-800';
            case 'Tolls': return 'bg-cyan-50 border-cyan-200 text-cyan-800';
            case 'Water': return 'bg-blue-50 border-blue-200 text-blue-800';
            case 'Withdrawals': return 'bg-green-50 border-green-200 text-green-800';
            default: return 'bg-gray-50 border-gray-200 text-gray-800';
        }
    };

    const getAccountIcon = (account) => {
        switch (account) {
            case 'Cash Account': return <FaCoins className="w-4 h-4 text-green-600" />;
            case 'Main Account': return <FaWallet className="w-4 h-4 text-blue-600" />;
            case 'Platform Account': return <FaMobile className="w-4 h-4 text-purple-600" />;
            case 'Fuel Account': return <FaGasPump className="w-4 h-4 text-red-600" />;
            default: return <FaWallet className="w-4 h-4 text-gray-600" />;
        }
    };

    return (
        <div className="p-4 space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-lg p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={onBack}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            <FaArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <h2 className="text-xl font-bold text-gray-800 flex items-center">
                            <FaChartBar className="w-6 h-6 text-red-600 mr-2" />
                            Expense Statistics
                        </h2>
                    </div>
                </div>

                {/* View Mode Toggle */}
                <div className="mb-4">
                    <div className="flex bg-gray-100 rounded-lg p-1 overflow-x-auto">
                        {[
                            { key: 'daily', label: 'Daily', icon: FaCalendarAlt },
                            { key: 'weekly', label: 'Weekly', icon: FaChartLine },
                            { key: 'monthly', label: 'Monthly', icon: FaChartPie },
                            { key: 'allTime', label: 'All Time', icon: FaArrowTrendUp }
                        ].map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setViewMode(key)}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${viewMode === key
                                    ? 'bg-white text-red-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Date/Month Selectors */}
                {viewMode === 'daily' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Date
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                        <div className="mt-2 text-sm text-gray-600">
                            Showing expenses for {formatDate(selectedDate)}
                        </div>
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
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                        <div className="mt-2 text-sm text-gray-600">
                            Showing expenses for {selectedMonth}
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
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                        <div className="mt-2 text-sm text-gray-600">
                            Showing expenses for 7 days ending on {formatDate(selectedDate)}
                        </div>
                    </div>
                )}

                {viewMode === 'allTime' && (
                    <div className="mt-2 text-sm text-gray-600">
                        Showing all recorded expenses
                    </div>
                )}
            </div>

            {/* Empty State */}
            {stats.totalCount === 0 ? (
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="text-gray-400 text-6xl mb-4">💸</div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Expenses Found</h3>
                    <p className="text-gray-500">
                        {viewMode === 'daily'
                            ? `No expenses recorded for ${formatDate(selectedDate)}`
                            : viewMode === 'weekly'
                                ? `No expenses recorded in the 7 days ending on ${formatDate(selectedDate)}`
                                : viewMode === 'monthly'
                                    ? `No expenses recorded in ${selectedMonth}`
                                    : 'No expenses recorded yet'
                        }
                    </p>
                    {expenses.length === 0 && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <strong>Tip:</strong> Add some expenses first using the Expense Tracker to see statistics here.
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {/* Overview Card */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <FaMoneyBillWave className="w-5 h-5 text-red-600 mr-2" />
                            Overview
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalExpenses)}</div>
                                <div className="text-sm text-gray-600">Total Expenses</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{stats.totalCount}</div>
                                <div className="text-sm text-gray-600">Total Transactions</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{Object.keys(stats.categoryBreakdown).length}</div>
                                <div className="text-sm text-gray-600">Categories Used</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">{formatCurrency(stats.averageExpense)}</div>
                                <div className="text-sm text-gray-600">Avg per Expense</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">{formatCurrency(stats.highestExpense)}</div>
                                <div className="text-sm text-gray-600">Highest Expense</div>
                            </div>
                        </div>
                    </div>

                    {/* Category Breakdown Card */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <FaChartPie className="w-5 h-5 text-blue-600 mr-2" />
                            Category Breakdown
                        </h3>
                        <div className="space-y-3">
                            {Object.entries(stats.categoryBreakdown)
                                .sort(([, a], [, b]) => b.total - a.total)
                                .map(([category, data]) => {
                                    const percentage = stats.totalExpenses > 0 ? (data.total / stats.totalExpenses) * 100 : 0;
                                    return (
                                        <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                {getCategoryIcon(category)}
                                                <div>
                                                    <div className="font-medium text-gray-800">{category}</div>
                                                    <div className="text-sm text-gray-600">{data.count} transactions</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-red-600">{formatCurrency(data.total)}</div>
                                                <div className="text-sm text-gray-600">{percentage.toFixed(1)}% of total</div>
                                                <div className="text-xs text-gray-500">{formatCurrency(data.total / data.count)} avg</div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>

                    {/* Account Usage Card */}
                    {Object.keys(stats.accountBreakdown).length > 0 && (
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <FaWallet className="w-5 h-5 text-green-600 mr-2" />
                                Account Usage
                            </h3>
                            <div className="space-y-3">
                                {Object.entries(stats.accountBreakdown)
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([account, total]) => {
                                        const percentage = stats.totalExpenses > 0 ? (total / stats.totalExpenses) * 100 : 0;
                                        return (
                                            <div key={account} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    {getAccountIcon(account)}
                                                    <div className="font-medium text-gray-800">{account}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-green-600">{formatCurrency(total)}</div>
                                                    <div className="text-sm text-gray-600">{percentage.toFixed(1)}% of total</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    )}

                    {/* Day of Week Analysis */}
                    {Object.keys(stats.dayOfWeekExpenses).length > 0 && (
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <FaCalendarAlt className="w-5 h-5 text-purple-600 mr-2" />
                                Day of Week Analysis
                            </h3>
                            <div className="grid grid-cols-7 gap-2">
                                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => {
                                    const amount = stats.dayOfWeekExpenses[day] || 0;
                                    const maxAmount = Math.max(...Object.values(stats.dayOfWeekExpenses));
                                    const intensity = maxAmount > 0 ? amount / maxAmount : 0;
                                    return (
                                        <div key={day} className={`text-center p-3 rounded-lg border ${intensity > 0.7 ? 'bg-red-50 border-red-200' :
                                            intensity > 0.4 ? 'bg-orange-50 border-orange-200' :
                                                intensity > 0 ? 'bg-yellow-50 border-yellow-200' :
                                                    'bg-gray-50 border-gray-200'
                                            }`}>
                                            <div className="text-xs font-medium text-gray-700 mb-1">{day.slice(0, 3)}</div>
                                            <div className={`text-lg font-bold ${intensity > 0.7 ? 'text-red-600' :
                                                intensity > 0.4 ? 'text-orange-600' :
                                                    intensity > 0 ? 'text-yellow-600' :
                                                        'text-gray-600'
                                                }`}>
                                                {formatCurrency(amount)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Top Expenses Card */}
                    {stats.topExpenses.length > 0 && (
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <FaList className="w-5 h-5 text-orange-600 mr-2" />
                                Top Expenses
                            </h3>
                            <div className="space-y-3">
                                {stats.topExpenses.map((expense, index) => (
                                    <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-bold text-orange-600">{index + 1}</span>
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-800">{expense.category}</div>
                                                <div className="text-sm text-gray-600">{formatDate(expense.createdAt)}</div>
                                                {expense.description && (
                                                    <div className="text-xs text-gray-500">{expense.description}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-red-600">{formatCurrency(expense.amount)}</div>
                                            <div className="text-sm text-gray-600">{expense.account || 'Fuel Account'}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Spending Insights Card */}
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg shadow-lg p-6 border border-red-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <FaInfoCircle className="w-5 h-5 text-red-600 mr-2" />
                            Spending Insights
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white rounded-lg p-4 border border-red-200">
                                <div className="flex items-center space-x-2 mb-2">
                                    <FaArrowTrendUp className="w-4 h-4 text-red-500" />
                                    <span className="text-sm font-medium text-gray-700">Most Frequent Category</span>
                                </div>
                                <div className="text-lg font-bold text-red-600">{stats.mostFrequentCategory}</div>
                                <div className="text-xs text-gray-600">
                                    {stats.categoryBreakdown[stats.mostFrequentCategory]?.count || 0} transactions
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-orange-200">
                                <div className="flex items-center space-x-2 mb-2">
                                    <FaExclamationTriangle className="w-4 h-4 text-orange-500" />
                                    <span className="text-sm font-medium text-gray-700">Highest Spending Day</span>
                                </div>
                                <div className="text-lg font-bold text-orange-600">
                                    {Object.entries(stats.dayOfWeekExpenses).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A'}
                                </div>
                                <div className="text-xs text-gray-600">
                                    {formatCurrency(Object.values(stats.dayOfWeekExpenses).sort((a, b) => b - a)[0] || 0)}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ExpenseStats;
