import React from "react";
import SEO from "../components/SEO";

const PrivacyPolicy = () => {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="Decorom Privacy Policy. Learn how we collect, store, and process personal data, cookies, and custom design files under Indian DPDP Act 2023."
        url="https://www.decorom.in/privacy-policy"
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-3 text-center text-gray-900">Privacy Policy</h1>
        <p className="text-sm text-gray-500 text-center mb-8">Last Updated: August 23, 2026</p>

        <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold mb-3 text-gray-900">1. Information We Collect</h2>
            <p>
              Decorom ("we", "our", "us") collects personal information necessary to manufacture custom nameplates, process payment transactions, and arrange courier delivery across India:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-600">
              <li><strong>Personal Identifiers:</strong> Name, billing address, shipping address, 10-digit mobile number, and email address.</li>
              <li><strong>Custom Design Assets:</strong> Custom text, font selections, language scripts (Gujarati, Hindi, English), and vector logo uploads.</li>
              <li><strong>Technical Metadata:</strong> Device IP address, web browser version, time zone, referral URLs, and cookie consent preferences.</li>
            </ul>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold mb-3 text-gray-900">2. How We Use Your Information</h2>
            <p>
              Your information is strictly used to fulfill custom nameplate orders, send order status updates, process refunds, and deliver direct customer support via WhatsApp or email.
            </p>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold mb-3 text-gray-900">3. DPDP Act 2023 Compliance & User Rights</h2>
            <p>
              In compliance with the Digital Personal Data Protection (DPDP) Act 2023 of India and international standards, you have the right to:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-600">
              <li>Request summary or details of personal data processed by us.</li>
              <li>Request correction, updating, or erasure of custom design files and order history.</li>
              <li>Withdraw consent for marketing analytics cookies at any time via our Cookie Banner.</li>
            </ul>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold mb-3 text-gray-900">4. Payment Gateway & Security</h2>
            <p>
              Online payments are processed through PhonePe gateway using secure 256-bit SSL encryption. Decorom never stores credit/debit card credentials or UPI PINs on internal servers.
            </p>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold mb-3 text-gray-900">5. Grievance Officer & Contact Details</h2>
            <p>
              For data privacy inquiries or grievances, contact our Privacy Officer:
            </p>
            <p className="mt-2 text-gray-800 font-medium">
              Email: <a href="mailto:decorom213@gmail.com" className="text-pink-600 hover:underline">decorom213@gmail.com</a><br />
              Address: Shop A/7, Second Floor, Shreekunj Shopping Centre, Near HDFC Bank, K.K. Nagar, Ghatlodiya, Ahmedabad - 380061, Gujarat, India.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
