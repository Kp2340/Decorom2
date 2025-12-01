import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-center">Privacy Policy</h1>

            <div className="space-y-6 text-gray-700">
                <section>
                    <h2 className="text-xl font-semibold mb-3 text-black">1. Information We Collect</h2>
                    <p>
                        When you visit Decorom, we collect certain information about your device, your interaction with the Site, and information necessary to process your purchases. We may also collect additional information if you contact us for customer support.
                    </p>
                    <ul className="list-disc ml-6 mt-2 space-y-1">
                        <li><strong>Personal Information:</strong> Name, billing address, shipping address, payment information, email address, and phone number.</li>
                        <li><strong>Device Information:</strong> Version of web browser, IP address, time zone, cookie information, what sites or products you view, search terms, and how you interact with the Site. We collect this for fraud detection and to optimize our site.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-black">2. How We Use Your Information</h2>
                    <p>
                        We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations).
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-black">3. Cookies</h2>
                    <p>
                        We use cookies to improve your experience on our website. Cookies are small files that a site or its service provider transfers to your computer's hard drive through your Web browser (if you allow) that enables the site's or service provider's systems to recognize your browser and capture and remember certain information.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-black">4. Data Security</h2>
                    <p>
                        We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. Our website is scanned on a regular basis for security holes and known vulnerabilities in order to make your visit to our site as safe as possible.
                    </p>
                    <p className="mt-2">
                        Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems, and are required to keep the information confidential. In addition, all sensitive/credit information you supply is encrypted via Secure Socket Layer (SSL) technology.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-black">5. Contact Us</h2>
                    <p>
                        For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at <a href="mailto:kushpatel2354@gmail.com" className="text-blue-600 hover:underline">kushpatel2354@gmail.com</a>.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
