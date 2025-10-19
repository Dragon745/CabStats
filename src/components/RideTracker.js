import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
    FaCar,
    FaPlay,
    FaStop,
    FaClock,
    FaTachometerAlt,
    FaRoute,
    FaMoneyBillWave,
    FaReceipt,
    FaCheckCircle,
    FaSpinner,
    FaTimes,
    FaTrashAlt,
    FaTaxi,
    FaMobile,
    FaWallet,
    FaInfoCircle
} from 'react-icons/fa';

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
    const [isLoading, setIsLoading] = useState(false);
    const [rideDuration, setRideDuration] = useState(0);

    // Live timer for active ride
    useEffect(() => {
        let interval;
        if (activeRide) {
            interval = setInterval(() => {
                const now = new Date().getTime();
                const start = new Date(activeRide.startTime).getTime();
                setRideDuration(Math.floor((now - start) / 1000));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [activeRide]);

    const handleStartRide = async () => {
        if (!currentSession) {
            alert('Please start a session first');
            return;
        }
        setIsLoading(true);
        try {
            await startRide();
            setShowForm(false);
        } catch (error) {
            alert('Failed to start ride: ' + error.message);
        } finally {
            setIsLoading(false);
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

        setIsLoading(true);
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
        } finally {
            setIsLoading(false);
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

    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getPaymentIcon = (paymentMethod) => {
        switch (paymentMethod) {
            case 'Cash Account': return FaMoneyBillWave;
            case 'Main Account': return FaWallet;
            case 'Platform Account': return FaMobile;
            default: return FaWallet;
        }
    };

    const getRideTypeColor = (rideType) => {
        switch (rideType) {
            case 'Uber': return 'from-gray-800 to-gray-900';
            case 'Ola': return 'from-yellow-500 to-yellow-600';
            case 'Rapido': return 'from-red-500 to-red-600';
            case 'Private': return 'from-green-500 to-green-600';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    if (showForm) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 pb-20">
                {/* Hero Header */}
                <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl shadow-2xl p-6 text-white mb-6">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full -translate-y-12 translate-x-12"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full translate-y-8 -translate-x-8"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                <FaCheckCircle className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Complete Ride</h2>
                                <p className="text-sm opacity-80">Enter ride details to finish</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
                    <form onSubmit={handleSubmitRide} className="space-y-6">
                        {/* Primary Metrics */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                                <FaRoute className="w-5 h-5 text-blue-600" />
                                <span>Ride Details</span>
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center space-x-2">
                                            <FaTachometerAlt className="w-4 h-4 text-gray-500" />
                                            <span>Distance (km)</span>
                                        </div>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        name="km"
                                        value={rideData.km}
                                        onChange={handleInputChange}
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg font-medium"
                                        placeholder="Enter distance"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center space-x-2">
                                            <FaMoneyBillWave className="w-4 h-4 text-gray-500" />
                                            <span>Fare (₹)</span>
                                        </div>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="fare"
                                        value={rideData.fare}
                                        onChange={handleInputChange}
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-lg font-medium"
                                        placeholder="Enter fare"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Fees Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                                <FaReceipt className="w-5 h-5 text-orange-600" />
                                <span>Fees & Charges</span>
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Airport Fee (₹)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="airportFee"
                                        value={rideData.airportFee}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Platform Fee (₹)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="platformFee"
                                        value={rideData.platformFee}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tolls (₹)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="tolls"
                                        value={rideData.tolls}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Other Fees (₹)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="otherFees"
                                        value={rideData.otherFees}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Ride Type and Payment */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                                <FaCar className="w-5 h-5 text-purple-600" />
                                <span>Ride Information</span>
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Ride Type</label>
                                    <select
                                        name="rideType"
                                        value={rideData.rideType}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                        required
                                    >
                                        <option value="">Select Type</option>
                                        {getRideTypes().map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                                    <select
                                        name="paymentMethod"
                                        value={rideData.paymentMethod}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                        required
                                    >
                                        <option value="">Select Method</option>
                                        {getPaymentMethods().map(method => (
                                            <option key={method} value={method}>{method}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3 pt-6">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
                            >
                                <FaTimes className="w-4 h-4" />
                                <span>Cancel</span>
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg"
                            >
                                {isLoading ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaCheckCircle className="w-4 h-4" />}
                                <span>Complete Ride</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 space-y-6 pb-20">
            {/* No Active Ride State */}
            {!activeRide ? (
                <div className="relative overflow-hidden bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 rounded-2xl shadow-xl p-8 text-white">
                    {/* Animated Background */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full animate-pulse delay-1000"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                                <FaCar className="w-10 h-10" />
                            </div>

                            <h2 className="text-3xl font-bold mb-3">Ready to Drive</h2>
                            <p className="text-lg opacity-90 mb-6">Start a new ride to begin tracking your journey</p>

                            <div className="flex items-center justify-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium">Ready</span>
                            </div>

                            <button
                                onClick={handleStartRide}
                                disabled={isLoading}
                                className="bg-white/20 backdrop-blur-sm text-white py-4 px-8 rounded-xl font-semibold text-lg hover:bg-white/30 transition-all duration-300 flex items-center justify-center space-x-3 mx-auto shadow-lg transform hover:scale-[1.02] disabled:opacity-50"
                            >
                                {isLoading ? <FaSpinner className="w-5 h-5 animate-spin" /> : <FaPlay className="w-5 h-5" />}
                                <span>Start Ride</span>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                /* Active Ride State */
                <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl shadow-2xl p-8 text-white">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                    <FaCar className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">Active Ride</h2>
                                    <p className="text-sm opacity-80">Currently in progress</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                                <span className="text-xs font-medium">LIVE</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <FaClock className="w-5 h-5 opacity-70" />
                                    <span className="text-sm opacity-70">Duration</span>
                                </div>
                                <div className="text-3xl font-bold">{formatDuration(rideDuration)}</div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <FaClock className="w-5 h-5 opacity-70" />
                                    <span className="text-sm opacity-70">Started At</span>
                                </div>
                                <div className="text-lg font-bold">{formatTime(activeRide.startTime)}</div>
                            </div>
                        </div>

                        <div className="text-center">
                            <button
                                onClick={handleEndRide}
                                className="bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center space-x-3 mx-auto shadow-lg transform hover:scale-[1.02]"
                            >
                                <FaStop className="w-5 h-5" />
                                <span>End Ride</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Ride History Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                        <FaTaxi className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">Recent Rides</h3>
                        <p className="text-sm text-gray-600">Your latest completed rides</p>
                    </div>
                </div>

                {rides.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaCar className="w-10 h-10 text-gray-400" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-600 mb-2">No Rides Yet</h4>
                        <p className="text-gray-500">Start your first ride to see it here</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {rides
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .slice(0, 5)
                            .map((ride, index) => {
                                const PaymentIcon = getPaymentIcon(ride.paymentMethod);
                                const gradientClass = getRideTypeColor(ride.rideType);

                                return (
                                    <div
                                        key={ride.id}
                                        className="group bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-5 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${gradientClass} text-white text-sm font-semibold`}>
                                                        {ride.rideType}
                                                    </div>
                                                    <div className="flex items-center space-x-1 text-gray-500">
                                                        <PaymentIcon className="w-4 h-4" />
                                                        <span className="text-sm">{ride.paymentMethod}</span>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {formatDate(ride.createdAt)} at {formatTime(ride.startTime)}
                                                </div>

                                                {/* Location Information */}
                                                {(ride.startLocation || ride.endLocation) && (
                                                    <div className="mt-2 space-y-1">
                                                        {ride.startLocation && (
                                                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                                <span>Start: {ride.startLocation.areaName}</span>
                                                            </div>
                                                        )}
                                                        {ride.endLocation && (
                                                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                                                                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                                                <span>End: {ride.endLocation.areaName}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="text-right">
                                                    <div className={`text-xl font-bold ${ride.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {formatCurrency(ride.profit)}
                                                    </div>
                                                    <div className="text-sm text-gray-500">Profit</div>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteRide(ride.id)}
                                                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
                                                    title="Delete ride"
                                                >
                                                    <FaTrashAlt className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 mb-4">
                                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-3 text-center">
                                                <div className="flex items-center justify-center mb-1">
                                                    <FaMoneyBillWave className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <div className="text-sm font-bold text-blue-600">{formatCurrency(ride.fare)}</div>
                                                <div className="text-xs text-gray-600">Fare</div>
                                            </div>
                                            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-3 text-center">
                                                <div className="flex items-center justify-center mb-1">
                                                    <FaTachometerAlt className="w-4 h-4 text-green-600" />
                                                </div>
                                                <div className="text-sm font-bold text-green-600">{ride.km} km</div>
                                                <div className="text-xs text-gray-600">Distance</div>
                                            </div>
                                            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-3 text-center">
                                                <div className="flex items-center justify-center mb-1">
                                                    <FaClock className="w-4 h-4 text-purple-600" />
                                                </div>
                                                <div className="text-sm font-bold text-purple-600">
                                                    {Math.floor((new Date(ride.endTime) - new Date(ride.startTime)) / (1000 * 60))}m
                                                </div>
                                                <div className="text-xs text-gray-600">Duration</div>
                                            </div>
                                        </div>

                                        {(ride.airportFee > 0 || ride.platformFee > 0 || ride.tolls > 0 || ride.otherFees > 0) && (
                                            <div className="bg-gray-50 rounded-xl p-3 mb-4">
                                                <div className="text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                                                    <FaReceipt className="w-4 h-4 text-gray-500" />
                                                    <span>Fees Breakdown</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    {ride.airportFee > 0 && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Airport:</span>
                                                            <span className="font-semibold">{formatCurrency(ride.airportFee)}</span>
                                                        </div>
                                                    )}
                                                    {ride.platformFee > 0 && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Platform:</span>
                                                            <span className="font-semibold">{formatCurrency(ride.platformFee)}</span>
                                                        </div>
                                                    )}
                                                    {ride.tolls > 0 && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Tolls:</span>
                                                            <span className="font-semibold">{formatCurrency(ride.tolls)}</span>
                                                        </div>
                                                    )}
                                                    {ride.otherFees > 0 && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Other:</span>
                                                            <span className="font-semibold">{formatCurrency(ride.otherFees)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                                            <div className="text-center">
                                                <div className="text-sm text-gray-500">Profit/km</div>
                                                <div className={`font-bold ${ride.profitPerKm >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {formatCurrency(ride.profitPerKm)}
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm text-gray-500">Fuel Allocation</div>
                                                <div className="font-bold text-blue-600">{formatCurrency(ride.fuelAllocation)}</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                        {rides.length > 5 && (
                            <div className="text-center pt-4">
                                <div className="bg-gray-50 rounded-xl p-3">
                                    <p className="text-sm text-gray-600">
                                        Showing last 5 rides. Total rides: <span className="font-semibold text-gray-800">{rides.length}</span>
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

export default RideTracker;
