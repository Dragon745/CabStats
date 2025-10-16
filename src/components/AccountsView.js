import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const AccountsView = () => {
    const {
        accounts,
        updateAccountBalance,
        formatCurrency,
        formatDate,
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

    const getAccountIcon = (accountName) => {
        switch (accountName) {
            case 'Main Account': return '💰';
            case 'Fuel Account': return '⛽';
            case 'Cash Account': return '💵';
            case 'Platform Account': return '📱';
            default: return '💳';
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
        <div className="p-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Account Management</h2>

                {/* Account Cards */}
                <div className="grid grid-cols-1 gap-4 mb-6">
                    {accounts.map((account) => (
                        <div key={account.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">{getAccountIcon(account.name)}</span>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">{account.name}</h3>
                                        <p className="text-sm text-gray-500">
                                            Last updated: {formatDate(account.updatedAt)}
                                        </p>
                                    </div>
                                </div>
                                <div className={`w-4 h-4 rounded-full ${getAccountColor(account.name)}`}></div>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className={`text-2xl font-bold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(account.balance)}
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedAccount(account);
                                        setShowAdjustmentForm(true);
                                    }}
                                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm font-medium hover:bg-gray-200"
                                >
                                    Adjust
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Combined Balance */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="text-center">
                        <div className="text-sm text-gray-600 mb-1">Combined Balance</div>
                        <div className={`text-3xl font-bold ${accounts.reduce((sum, acc) => sum + acc.balance, 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(accounts.reduce((sum, acc) => sum + acc.balance, 0))}
                        </div>
                    </div>
                </div>

                {/* Account Transfer Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">Transfer Between Accounts</h3>

                    <button
                        onClick={() => setShowAccountTransferForm(!showAccountTransferForm)}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold mb-4"
                    >
                        Transfer Money Between Accounts
                    </button>

                    {/* Account Transfer Form */}
                    {showAccountTransferForm && (
                        <form onSubmit={handleAccountTransfer} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-1">
                                        From Account
                                    </label>
                                    <select
                                        value={accountTransferFrom}
                                        onChange={(e) => setAccountTransferFrom(e.target.value)}
                                        className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {accounts.map(account => (
                                            <option key={account.id} value={account.name}>{account.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-1">
                                        To Account
                                    </label>
                                    <select
                                        value={accountTransferTo}
                                        onChange={(e) => setAccountTransferTo(e.target.value)}
                                        className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {accounts.map(account => (
                                            <option key={account.id} value={account.name}>{account.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                    Transfer Amount (₹)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={accountTransferAmount}
                                    onChange={(e) => setAccountTransferAmount(e.target.value)}
                                    className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Processing...' : 'Transfer'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Info */}
                    <div className="bg-blue-100 border border-blue-200 rounded-lg p-3 mt-4">
                        <div className="text-sm text-blue-800">
                            <strong>Note:</strong> Transfer money between any of your accounts.
                            This is useful for moving funds between Main Account, Cash Account, Platform Account, and Fuel Account.
                        </div>
                    </div>
                </div>

                {/* Fuel Transfer Section */}
                {pendingFuelTransfer > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                        <h3 className="text-lg font-semibold text-orange-800 mb-3">Fuel Transfer</h3>

                        <div className="bg-orange-100 border border-orange-300 rounded-lg p-3 mb-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-800 mb-1">
                                    {formatCurrency(pendingFuelTransfer)}
                                </div>
                                <div className="text-orange-600 text-sm">Pending Transfer to Fuel Account</div>
                            </div>
                        </div>

                        {/* Account Balances */}
                        <div className="space-y-2 mb-4">
                            <div className="bg-gray-100 rounded-lg p-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">Main Account Balance:</span>
                                    <span className={`font-semibold ${accounts.find(acc => acc.name === 'Main Account')?.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatCurrency(accounts.find(acc => acc.name === 'Main Account')?.balance || 0)}
                                    </span>
                                </div>
                            </div>
                            <div className="bg-gray-100 rounded-lg p-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">Cash Account Balance:</span>
                                    <span className={`font-semibold ${accounts.find(acc => acc.name === 'Cash Account')?.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatCurrency(accounts.find(acc => acc.name === 'Cash Account')?.balance || 0)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Transfer Options */}
                        <div className="space-y-3">
                            <button
                                onClick={() => setShowTransferAllForm(!showTransferAllForm)}
                                disabled={loading}
                                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Processing...' : 'Transfer All'}
                            </button>

                            <button
                                onClick={() => setShowFuelTransferForm(!showFuelTransferForm)}
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold"
                            >
                                Transfer Partial Amount
                            </button>
                        </div>

                        {/* Transfer All Form */}
                        {showTransferAllForm && (
                            <form onSubmit={(e) => { e.preventDefault(); handleFuelTransferAll(); }} className="space-y-4 mt-4">
                                <div>
                                    <label className="block text-sm font-medium text-orange-700 mb-1">
                                        Transfer From Account
                                    </label>
                                    <select
                                        value={fuelTransferFromAccount}
                                        onChange={(e) => setFuelTransferFromAccount(e.target.value)}
                                        className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    >
                                        <option value="Main Account">Main Account</option>
                                        <option value="Cash Account">Cash Account</option>
                                    </select>
                                </div>

                                <div className="bg-orange-100 border border-orange-300 rounded-lg p-3">
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-orange-800 mb-1">
                                            {formatCurrency(pendingFuelTransfer)}
                                        </div>
                                        <div className="text-orange-600 text-sm">Will be transferred to Fuel Account</div>
                                    </div>
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowTransferAllForm(false);
                                        }}
                                        className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-semibold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Processing...' : 'Transfer All'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Partial Transfer Form */}
                        {showFuelTransferForm && (
                            <form onSubmit={handleFuelTransferPartial} className="space-y-4 mt-4">
                                <div>
                                    <label className="block text-sm font-medium text-orange-700 mb-1">
                                        Transfer From Account
                                    </label>
                                    <select
                                        value={fuelTransferFromAccount}
                                        onChange={(e) => setFuelTransferFromAccount(e.target.value)}
                                        className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    >
                                        <option value="Main Account">Main Account</option>
                                        <option value="Cash Account">Cash Account</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-orange-700 mb-1">
                                        Transfer Amount (₹)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={fuelTransferAmount}
                                        onChange={(e) => setFuelTransferAmount(e.target.value)}
                                        className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                                        className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-semibold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Processing...' : 'Transfer'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Info */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                            <div className="text-sm text-blue-800">
                                <strong>Note:</strong> Fuel transfers move money from Main Account or Cash Account to Fuel Account.
                                Both "Transfer All" and "Transfer Partial" allow you to manually select the source account.
                                This helps track fuel expenses separately from other earnings.
                            </div>
                        </div>
                    </div>
                )}

                {/* Adjustment Form */}
                {showAdjustmentForm && selectedAccount && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-blue-800 mb-3">
                            Adjust {selectedAccount.name} Balance
                        </h3>

                        <form onSubmit={handleAdjustment} className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                    Adjustment Amount (₹)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={adjustmentAmount}
                                    onChange={(e) => setAdjustmentAmount(e.target.value)}
                                    className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter amount (+ for credit, - for debit)"
                                    required
                                />
                                <p className="text-xs text-blue-600 mt-1">
                                    Use positive numbers to add money, negative to subtract
                                </p>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAdjustmentForm(false);
                                        setSelectedAccount(null);
                                        setAdjustmentAmount('');
                                    }}
                                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Updating...' : 'Update Balance'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Info */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                    <div className="text-sm text-yellow-800">
                        <strong>Note:</strong> Manual adjustments should be used sparingly.
                        Most balance changes happen automatically through rides and expenses.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountsView;
