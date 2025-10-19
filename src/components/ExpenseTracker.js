import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
    FaPlane, FaSmoking, FaBroom, FaUtensils,
    FaGasPump, FaCandyCane, FaBox, FaCreditCard,
    FaParking, FaMobile, FaHome, FaRoad,
    FaTint, FaMoneyBillWave, FaWallet, FaTrashAlt,
    FaPlus, FaSpinner, FaCheck, FaTimes,
    FaReceipt, FaChartBar, FaExclamationCircle,
    FaInfoCircle, FaCalendar, FaClock, FaEdit,
    FaCoffee
} from 'react-icons/fa';
import { MdCategory, MdAccountBalance } from 'react-icons/md';

const ExpenseTracker = () => {
    const {
        addExpense,
        deleteExpense,
        getExpenseCategories,
        accounts,
        expenses,
        formatCurrency,
        formatDate
    } = useApp();

    const [expenseData, setExpenseData] = useState({
        category: '',
        amount: '',
        account: '',
        description: ''
    });

    const [loading, setLoading] = useState(false);
    const [animatedTotal, setAnimatedTotal] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!expenseData.category || !expenseData.amount) {
            alert('Please fill in all required fields');
            return;
        }

        // For non-fuel expenses, account is required
        if (expenseData.category !== 'Fuel' && !expenseData.account) {
            alert('Please select an account for this expense');
            return;
        }

        setLoading(true);
        try {
            await addExpense(expenseData);
            setExpenseData({
                category: '',
                amount: '',
                account: '',
                description: ''
            });
            alert('Expense recorded successfully!');
        } catch (error) {
            alert('Failed to record expense: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setExpenseData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDeleteExpense = async (expenseId) => {
        if (window.confirm('Are you sure you want to delete this expense? This will reverse the account deduction.')) {
            try {
                await deleteExpense(expenseId);
                alert('Expense deleted successfully!');
            } catch (error) {
                alert('Failed to delete expense: ' + error.message);
            }
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Airport Fee': return FaPlane;
            case 'Cigarette': return FaSmoking;
            case 'Cleaning': return FaBroom;
            case 'Food': return FaUtensils;
            case 'Fuel': return FaGasPump;
            case 'Goodies': return FaCandyCane;
            case 'Other': return FaBox;
            case 'Other Fees': return FaCreditCard;
            case 'Parking Fee': return FaParking;
            case 'Platform Fee': return FaMobile;
            case 'Tea': return FaCoffee;
            case 'Water': return FaTint;
            case 'Withdrawals': return FaMoneyBillWave;
            default: return FaReceipt;
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Fuel': return 'from-blue-500 to-blue-600';
            case 'Food': return 'from-orange-500 to-orange-600';
            case 'Airport Fee': return 'from-sky-500 to-sky-600';
            case 'Tolls': return 'from-gray-500 to-gray-600';
            case 'Parking Fee': return 'from-green-500 to-green-600';
            case 'Tea': return 'from-amber-500 to-amber-600';
            case 'Cigarette': return 'from-slate-500 to-slate-600';
            case 'Cleaning': return 'from-teal-500 to-teal-600';
            case 'Goodies': return 'from-pink-500 to-pink-600';
            case 'Platform Fee': return 'from-indigo-500 to-indigo-600';
            case 'Other Fees': return 'from-yellow-500 to-yellow-600';
            case 'Withdrawals': return 'from-red-500 to-red-600';
            default: return 'from-red-500 to-red-600';
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-pink-100 p-4 space-y-6 pb-20">
            {/* Hero Expense Form Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
                {/* Hero Header */}
                <div className="relative overflow-hidden bg-gradient-to-r from-red-500 via-pink-600 to-red-700 rounded-2xl shadow-2xl p-6 text-white mb-6">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full -translate-y-12 translate-x-12"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full translate-y-8 -translate-x-8"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                <FaReceipt className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Record Expense</h2>
                                <p className="text-sm opacity-80">Track your business expenses</p>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center space-x-2">
                                <MdCategory className="w-4 h-4 text-gray-500" />
                                <span>Category *</span>
                            </div>
                        </label>
                        <select
                            name="category"
                            value={expenseData.category}
                            onChange={handleInputChange}
                            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-lg font-medium"
                            required
                        >
                            <option value="">Select Category</option>
                            {getExpenseCategories().map(category => {
                                const IconComponent = getCategoryIcon(category);
                                return (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center space-x-2">
                                <FaMoneyBillWave className="w-4 h-4 text-gray-500" />
                                <span>Amount (₹) *</span>
                            </div>
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            name="amount"
                            value={expenseData.amount}
                            onChange={handleInputChange}
                            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-lg font-medium"
                            placeholder="Enter amount"
                            required
                        />
                    </div>

                    {/* Account (only for non-fuel expenses) */}
                    {expenseData.category && expenseData.category !== 'Fuel' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center space-x-2">
                                    <MdAccountBalance className="w-4 h-4 text-gray-500" />
                                    <span>Deduct from Account *</span>
                                </div>
                            </label>
                            <select
                                name="account"
                                value={expenseData.account}
                                onChange={handleInputChange}
                                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-lg font-medium"
                                required
                            >
                                <option value="">Select Account</option>
                                {accounts.map(account => {
                                    const IconComponent = getAccountIcon(account.name);
                                    return (
                                        <option key={account.id} value={account.name}>
                                            {account.name} - {formatCurrency(account.balance)}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    )}

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center space-x-2">
                                <FaEdit className="w-4 h-4 text-gray-500" />
                                <span>Description</span>
                            </div>
                        </label>
                        <input
                            type="text"
                            name="description"
                            value={expenseData.description}
                            onChange={handleInputChange}
                            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-lg font-medium"
                            placeholder="Optional description"
                        />
                    </div>

                    {/* Info for Fuel expenses */}
                    {expenseData.category === 'Fuel' && (
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
                            <div className="flex items-start space-x-3">
                                <FaInfoCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div className="text-sm text-blue-800">
                                    <strong>Note:</strong> Fuel expenses will be automatically deducted from Fuel Account.
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg transform hover:scale-[1.02] disabled:opacity-50"
                    >
                        {loading ? <FaSpinner className="w-5 h-5 animate-spin" /> : <FaPlus className="w-5 h-5" />}
                        <span>{loading ? 'Recording...' : 'Record Expense'}</span>
                    </button>
                </form>
            </div>

            {/* Account Balances */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                        <MdAccountBalance className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">Account Balances</h3>
                        <p className="text-sm text-gray-600">Current account status</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {accounts.map((account, index) => {
                        const IconComponent = getAccountIcon(account.name);
                        return (
                            <div
                                key={account.id}
                                className="group bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] border border-gray-200"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <IconComponent className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-700">{account.name}</div>
                                        </div>
                                    </div>
                                    <div className={`text-lg font-bold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatCurrency(account.balance)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Expense History */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl">
                        <FaChartBar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">Recent Expenses</h3>
                        <p className="text-sm text-gray-600">Track your expense history</p>
                    </div>
                </div>

                {expenses.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaReceipt className="w-10 h-10 text-gray-400" />
                        </div>
                        <h4 className="text-xl font-semibold text-gray-600 mb-3">No Expenses Yet</h4>
                        <p className="text-gray-500 mb-6">Start tracking your business expenses to see them here</p>
                        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 max-w-md mx-auto">
                            <div className="flex items-center space-x-2 text-red-800">
                                <FaInfoCircle className="w-4 h-4" />
                                <span className="text-sm">Use the form above to record your first expense</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {expenses
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .slice(0, 10)
                            .map((expense, index) => {
                                const CategoryIcon = getCategoryIcon(expense.category);
                                const AccountIcon = getAccountIcon(expense.account);
                                const gradientClass = getCategoryColor(expense.category);

                                return (
                                    <div
                                        key={expense.id}
                                        className="group bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-5 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${gradientClass} text-white text-sm font-semibold flex items-center space-x-2`}>
                                                        <CategoryIcon className="w-4 h-4" />
                                                        <span>{expense.category}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1 text-gray-500">
                                                        <AccountIcon className="w-4 h-4" />
                                                        <span className="text-sm">{expense.account}</span>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-600 flex items-center space-x-2">
                                                    <FaCalendar className="w-3 h-3" />
                                                    <span>{formatDate(expense.createdAt)}</span>
                                                    <FaClock className="w-3 h-3" />
                                                    <span>{new Date(expense.createdAt).toLocaleTimeString()}</span>
                                                </div>
                                                {expense.description && (
                                                    <div className="text-sm text-gray-500 mt-2 italic bg-gray-50 rounded-lg p-2">
                                                        "{expense.description}"
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="text-right">
                                                    <div className="text-xl font-bold text-red-600">
                                                        -{formatCurrency(expense.amount)}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteExpense(expense.id)}
                                                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
                                                    title="Delete expense"
                                                >
                                                    <FaTrashAlt className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                        {expenses.length > 10 && (
                            <div className="text-center pt-4">
                                <div className="bg-gray-50 rounded-xl p-3">
                                    <p className="text-sm text-gray-600">
                                        Showing last 10 expenses. Total expenses: <span className="font-semibold text-gray-800">{expenses.length}</span>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExpenseTracker;
