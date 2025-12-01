import React from 'react';

const RefundPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-center">Refund Policy</h1>

            <div className="space-y-6 text-gray-700">
                <section>
                    <h2 className="text-xl font-semibold mb-3 text-black">1. Returns</h2>
                    <p>
                        At Decorom, we strive to provide the best quality products. However, please note that <strong>since many products are customized (cut to size), we generally do not offer returns</strong> unless the item is defective or damaged upon arrival.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-black">2. Damaged or Defective Items</h2>
                    <p>
                        Refunds are only processed for damaged/defective items reported within <strong>24 hours of delivery</strong>. If you receive a damaged item, please contact us immediately with photographic evidence at <a href="mailto:decorom213@gmail.com" className="text-blue-600 hover:underline">decorom213@gmail.com</a>.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-black">3. Refund Process</h2>
                    <p>
                        Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
                    </p>
                    <p className="mt-2">
                        If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment. <strong>Refunds will be processed to the original payment method within 5-7 business days.</strong>
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-black">4. Cancellations</h2>
                    <p>
                        Orders can only be cancelled before they have been processed for shipping. Once an order has been processed or shipped, it cannot be cancelled.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default RefundPolicy;
