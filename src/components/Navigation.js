import React from 'react';

const Navigation = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
        { id: 'ride', label: 'Ride', icon: '🚗' },
        { id: 'accounts', label: 'Accounts', icon: '💰' },
        { id: 'expenses', label: 'Expenses', icon: '💸' }
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
            <div className="flex">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`flex-1 flex flex-col items-center py-2 px-1 ${activeTab === tab.id
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                            }`}
                    >
                        <span className="text-lg mb-1">{tab.icon}</span>
                        <span className="text-xs font-medium">{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Navigation;
