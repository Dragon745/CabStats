import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const ExpenseTracker = () => {
    const {
        addExpense,
        getExpenseCategories,
        accounts,
        formatCurrency
    } = useApp();

    const [expenseData, setExpenseData] = useState({
        category: '',
        amount: '',
        account: '',
        description: ''
    });

    const [loading, setLoading] = useState(false);

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

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Cigarette': return '🚬';
            case 'Cleaning': return '🧽';
            case 'Food': return '🍽️';
            case 'Fuel': return '⛽';
            case 'Goodies': return '🍬';
            case 'Other': return '📦';
            case 'Rent': return '🏠';
            case 'Water': return '💧';
            case 'Withdrawals': return '💸';
            default: return '💰';
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
        <div className="p-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Record Expense</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category *
                        </label>
                        <select
                            name="category"
                            value={expenseData.category}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="">Select Category</option>
                            {getExpenseCategories().map(category => (
                                <option key={category} value={category}>
                                    {getCategoryIcon(category)} {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount (₹) *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            name="amount"
                            value={expenseData.amount}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter amount"
                            required
                        />
                    </div>

                    {/* Account (only for non-fuel expenses) */}
                    {expenseData.category && expenseData.category !== 'Fuel' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Deduct from Account *
                            </label>
                            <select
                                name="account"
                                value={expenseData.account}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="">Select Account</option>
                                {accounts.map(account => (
                                    <option key={account.id} value={account.name}>
                                        {getAccountIcon(account.name)} {account.name} ({formatCurrency(account.balance)})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <input
                            type="text"
                            name="description"
                            value={expenseData.description}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Optional description"
                        />
                    </div>

                    {/* Info for Fuel expenses */}
                    {expenseData.category === 'Fuel' && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="text-sm text-blue-800">
                                <strong>Note:</strong> Fuel expenses will be automatically deducted from Fuel Account.
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Recording...' : 'Record Expense'}
                    </button>
                </form>

                {/* Account Balances */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Account Balances</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {accounts.map(account => (
                            <div key={account.id} className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-lg">{getAccountIcon(account.name)}</span>
                                        <span className="text-sm font-medium text-gray-700">{account.name}</span>
                                    </div>
                                    <span className={`text-sm font-semibold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatCurrency(account.balance)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpenseTracker;
