import React from 'react';

const ShippingPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-center">Shipping Policy</h1>

            <div className="space-y-6 text-gray-700">
                <section>
                    <h2 className="text-xl font-semibold mb-3 text-black">1. Order Processing</h2>
                    <p>
                        All orders are processed within <strong>2-3 business days</strong>. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-black">2. Shipping Rates & Delivery Estimates</h2>
                    <p>
                        Shipping charges for your order will be calculated and displayed at checkout.
                    </p>
                    <p className="mt-2">
                        <strong>Delivery timeline depends on the location in India (Standard 5-7 days).</strong>
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-black">3. Shipment Confirmation & Order Tracking</h2>
                    <p>
                        You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-black">4. Damages</h2>
                    <p>
                        Decorom is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier to file a claim. Please save all packaging materials and damaged goods before filing a claim.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default ShippingPolicy;
