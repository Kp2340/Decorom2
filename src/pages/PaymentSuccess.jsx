import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const orderId = searchParams.get('orderId');

        if (!orderId) {
            setError('No order ID provided');
            setLoading(false);
            return;
        }

        // Fetch order details from backend
        fetch(`https://api.decorom.in/orders/${orderId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Order not found');
                }
                return response.json();
            })
            .then(data => {
                setOrderData(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [searchParams]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
                    <p className="mt-4 text-white text-xl font-semibold">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 via-pink-600 to-purple-700 px-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="mb-6">
                        <svg className="mx-auto h-20 w-20 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Order Not Found</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Success Animation Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">
                    {/* Header with Checkmark */}
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-8 text-center">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg animate-bounce-slow mb-4">
                            <svg className="w-16 h-16 text-green-500 animate-checkmark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">Payment Successful!</h1>
                        <p className="text-green-50 text-lg">Your order has been placed successfully</p>
                    </div>

                    {/* Order Details */}
                    <div className="p-8">
                        {/* Order ID */}
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-6 border-2 border-purple-200">
                            <p className="text-sm text-gray-600 mb-1">Order ID</p>
                            <p className="text-2xl font-bold text-purple-700 font-mono break-all">{orderData?.orderId}</p>
                        </div>

                        {/* Important Message */}
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700 font-semibold">
                                        We'll contact you soon to process your order manually and arrange delivery.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                Order Details
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-1">Category</p>
                                    <p className="text-lg font-semibold text-gray-800">{orderData?.category}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-1">Material</p>
                                    <p className="text-lg font-semibold text-gray-800">{orderData?.material}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-1">Size</p>
                                    <p className="text-lg font-semibold text-gray-800">{orderData?.size}</p>
                                </div>
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
                                    <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                                    <p className="text-2xl font-bold text-green-600">₹{orderData?.totalAmount?.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Customer Contact Info */}
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Contact Information
                            </h3>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span className="text-gray-800 font-medium">{orderData?.customerAddress?.fullName}</span>
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-gray-800">{orderData?.customerAddress?.email}</span>
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span className="text-gray-800">{orderData?.customerAddress?.phone}</span>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Delivery Address
                            </h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-800 leading-relaxed">
                                    {orderData?.customerAddress?.street}<br />
                                    {orderData?.customerAddress?.city}, {orderData?.customerAddress?.state}<br />
                                    {orderData?.customerAddress?.zipCode}
                                </p>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center"
                        >
                            <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Back to Home
                        </button>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="text-center mt-8 text-white">
                    <p className="text-sm opacity-90">Thank you for choosing Decorom! 🎨</p>
                    <p className="text-xs opacity-75 mt-2">Order placed on {new Date(orderData?.createdAt).toLocaleString()}</p>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes checkmark {
                    0% {
                        stroke-dashoffset: 100;
                    }
                    100% {
                        stroke-dashoffset: 0;
                    }
                }

                @keyframes bounce-slow {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out;
                }

                .animate-checkmark {
                    stroke-dasharray: 100;
                    animation: checkmark 0.6s ease-out 0.3s forwards;
                }

                .animate-bounce-slow {
                    animation: bounce-slow 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default PaymentSuccess;
