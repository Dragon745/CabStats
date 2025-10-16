// Calculation utilities for CabStats
export const calculateProfit = (fare, fees) => {
    const totalFees = fees.airportFee + fees.platformFee + fees.tolls + fees.otherFees;
    return fare - totalFees;
};

export const calculateProfitPerKm = (profit, km) => {
    if (km <= 0) return 0;
    return profit / km;
};

export const calculateProfitPerMin = (profit, durationMinutes) => {
    if (durationMinutes <= 0) return 0;
    return profit / durationMinutes;
};

export const calculateFuelAllocation = (profit) => {
    return profit * 0.5; // 50% of profit
};

export const calculateDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return Math.round((end - start) / (1000 * 60)); // Duration in minutes
};

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

export const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

export const getRideTypes = () => [
    'Uber',
    'Rapido',
    'Ola',
    'Private',
    'Other'
];

export const getPaymentMethods = () => [
    'Cash Account',
    'Main Account',
    'Platform Account'
];

export const getExpenseCategories = () => [
    'Airport Fee',
    'Cigarette',
    'Cleaning',
    'Food',
    'Fuel',
    'Goodies',
    'Other',
    'Other Fees',
    'Parking Fee',
    'Platform Fee',
    'Rent',
    'Tolls',
    'Water',
    'Withdrawals'
];
