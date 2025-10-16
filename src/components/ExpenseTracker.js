import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

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

            {/* Expense History */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Expenses</h3>

                {expenses.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-gray-400 text-6xl mb-4">💸</div>
                        <p className="text-gray-600">No expenses recorded yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {expenses
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .slice(0, 10) // Show last 10 expenses
                            .map((expense) => (
                                <div key={expense.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <span className="text-lg">{getCategoryIcon(expense.category)}</span>
                                                <span className="font-semibold text-gray-800">{expense.category}</span>
                                                <span className="text-gray-500 text-sm">
                                                    {expense.account === 'Fuel Account' ? '⛽' :
                                                        expense.account === 'Main Account' ? '💰' :
                                                            expense.account === 'Cash Account' ? '💵' :
                                                                expense.account === 'Platform Account' ? '📱' : '💳'}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {formatDate(expense.createdAt)} at {new Date(expense.createdAt).toLocaleTimeString()}
                                            </div>
                                            {expense.description && (
                                                <div className="text-sm text-gray-500 mt-1 italic">
                                                    "{expense.description}"
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-red-600">
                                                    -{formatCurrency(expense.amount)}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteExpense(expense.id)}
                                                className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                title="Delete expense"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        {expenses.length > 10 && (
                            <div className="text-center pt-4">
                                <p className="text-sm text-gray-500">
                                    Showing last 10 expenses. Total expenses: {expenses.length}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExpenseTracker;
