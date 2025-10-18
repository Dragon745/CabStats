import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const RideTracker = () => {
    const {
        activeRide,
        currentSession,
        startRide,
        endRide,
        deleteRide,
        getRideTypes,
        getPaymentMethods,
        formatTime,
        calculateDuration,
        rides,
        formatCurrency,
        formatDate
    } = useApp();

    const [rideData, setRideData] = useState({
        km: '',
        fare: '',
        airportFee: '',
        platformFee: '',
        tolls: '',
        otherFees: '',
        rideType: '',
        paymentMethod: ''
    });

    const [showForm, setShowForm] = useState(false);

    const handleStartRide = async () => {
        if (!currentSession) {
            alert('Please start a session first');
            return;
        }
        try {
            await startRide();
            setShowForm(false);
        } catch (error) {
            alert('Failed to start ride: ' + error.message);
        }
    };

    const handleEndRide = () => {
        setShowForm(true);
    };

    const handleSubmitRide = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!rideData.km || !rideData.fare || !rideData.rideType || !rideData.paymentMethod) {
            alert('Please fill in all required fields (Distance, Fare, Ride Type, Payment Method)');
            return;
        }

        // Validate numeric fields
        const km = parseFloat(rideData.km);
        const fare = parseFloat(rideData.fare);

        if (isNaN(km) || km <= 0) {
            alert('Please enter a valid distance (km)');
            return;
        }

        if (isNaN(fare) || fare <= 0) {
            alert('Please enter a valid fare amount');
            return;
        }

        try {
            await endRide(rideData);
            setRideData({
                km: '',
                fare: '',
                airportFee: '',
                platformFee: '',
                tolls: '',
                otherFees: '',
                rideType: '',
                paymentMethod: ''
            });
            setShowForm(false);
        } catch (error) {
            alert('Failed to save ride: ' + error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRideData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDeleteRide = async (rideId) => {
        if (window.confirm('Are you sure you want to delete this ride? This will reverse all account changes.')) {
            try {
                await deleteRide(rideId);
                alert('Ride deleted successfully!');
            } catch (error) {
                alert('Failed to delete ride: ' + error.message);
            }
        }
    };

    const getRideDuration = () => {
        if (!activeRide) return 0;
        return calculateDuration(activeRide.startTime, new Date().toISOString());
    };

    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}:${mins.toString().padStart(2, '0')}`;
    };

    if (showForm) {
        return (
            <div className="p-4">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Complete Ride</h2>

                    <form onSubmit={handleSubmitRide} className="space-y-4">
                        {/* Basic Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    name="km"
                                    value={rideData.km}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fare (₹)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="fare"
                                    value={rideData.fare}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        {/* Fees */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Airport Fee (₹)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="airportFee"
                                    value={rideData.airportFee}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Platform Fee (₹)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="platformFee"
                                    value={rideData.platformFee}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tolls (₹)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="tolls"
                                    value={rideData.tolls}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Other Fees (₹)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="otherFees"
                                    value={rideData.otherFees}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Ride Type and Payment */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ride Type</label>
                                <select
                                    name="rideType"
                                    value={rideData.rideType}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select Type</option>
                                    {getRideTypes().map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                <select
                                    name="paymentMethod"
                                    value={rideData.paymentMethod}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select Method</option>
                                    {getPaymentMethods().map(method => (
                                        <option key={method} value={method}>{method}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold"
                            >
                                Complete Ride
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                {!activeRide ? (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Start New Ride</h2>
                        <button
                            onClick={handleStartRide}
                            className="bg-green-600 text-white py-4 px-8 rounded-lg font-semibold text-lg"
                        >
                            Start Ride
                        </button>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Active Ride</h2>
                        <div className="mb-6">
                            <div className="text-4xl font-bold text-blue-600 mb-2">
                                {formatDuration(getRideDuration())}
                            </div>
                            <div className="text-gray-600">Duration</div>
                        </div>
                        <div className="mb-6">
                            <div className="text-lg text-gray-600 mb-1">Started at</div>
                            <div className="text-xl font-semibold">{formatTime(activeRide.startTime)}</div>
                        </div>
                        <button
                            onClick={handleEndRide}
                            className="bg-red-600 text-white py-4 px-8 rounded-lg font-semibold text-lg"
                        >
                            End Ride
                        </button>
                    </div>
                )}
            </div>

            {/* Ride History Section */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Rides</h3>

                {rides.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-gray-400 text-6xl mb-4">🚗</div>
                        <p className="text-gray-600">No rides recorded yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {rides
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .slice(0, 5) // Show only last 5 rides
                            .map((ride) => (
                                <div key={ride.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${ride.rideType === 'Uber' ? 'bg-black text-white' :
                                                    ride.rideType === 'Ola' ? 'bg-yellow-500 text-black' :
                                                        ride.rideType === 'Rapido' ? 'bg-red-500 text-white' :
                                                            ride.rideType === 'Private' ? 'bg-green-500 text-white' :
                                                                'bg-gray-500 text-white'
                                                    }`}>
                                                    {ride.rideType}
                                                </span>
                                                <span className="text-gray-500 text-sm">
                                                    {ride.paymentMethod === 'Cash Account' ? '💵' :
                                                        ride.paymentMethod === 'Main Account' ? '💰' :
                                                            ride.paymentMethod === 'Platform Account' ? '📱' : '💳'}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {formatDate(ride.createdAt)} at {formatTime(ride.startTime)}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="text-right">
                                                <div className={`text-lg font-bold ${ride.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {formatCurrency(ride.profit)}
                                                </div>
                                                <div className="text-sm text-gray-500">Profit</div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteRide(ride.id)}
                                                className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                title="Delete ride"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <div className="text-gray-500">Fare</div>
                                            <div className="font-semibold">{formatCurrency(ride.fare)}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Distance</div>
                                            <div className="font-semibold">{ride.km} km</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Duration</div>
                                            <div className="font-semibold">
                                                {Math.floor((new Date(ride.endTime) - new Date(ride.startTime)) / (1000 * 60))} min
                                            </div>
                                        </div>
                                    </div>

                                    {(ride.airportFee > 0 || ride.platformFee > 0 || ride.tolls > 0 || ride.otherFees > 0) && (
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <div className="text-sm text-gray-500 mb-1">Fees</div>
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                {ride.airportFee > 0 && (
                                                    <div className="flex justify-between">
                                                        <span>Airport:</span>
                                                        <span>{formatCurrency(ride.airportFee)}</span>
                                                    </div>
                                                )}
                                                {ride.platformFee > 0 && (
                                                    <div className="flex justify-between">
                                                        <span>Platform:</span>
                                                        <span>{formatCurrency(ride.platformFee)}</span>
                                                    </div>
                                                )}
                                                {ride.tolls > 0 && (
                                                    <div className="flex justify-between">
                                                        <span>Tolls:</span>
                                                        <span>{formatCurrency(ride.tolls)}</span>
                                                    </div>
                                                )}
                                                {ride.otherFees > 0 && (
                                                    <div className="flex justify-between">
                                                        <span>Other:</span>
                                                        <span>{formatCurrency(ride.otherFees)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <div className="grid grid-cols-2 gap-4 text-xs">
                                            <div>
                                                <div className="text-gray-500">Profit/km</div>
                                                <div className="font-semibold">{formatCurrency(ride.profitPerKm)}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500">Fuel Allocation</div>
                                                <div className="font-semibold text-blue-600">{formatCurrency(ride.fuelAllocation)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        {rides.length > 5 && (
                            <div className="text-center pt-4">
                                <p className="text-sm text-gray-500">
                                    Showing last 5 rides. Total rides: {rides.length}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RideTracker;
