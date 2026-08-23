import React from "react";
import SEO from "../components/SEO";

const TermsAndConditions = () => {
  return (
    <>
      <SEO
        title="Terms & Conditions"
        description="Decorom Terms and Conditions. Commercial rules covering custom nameplate design orders, intellectual property, payment policies, and Gujarat jurisdiction."
        url="https://www.decorom.in/terms"
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-3 text-center text-gray-900">
          Terms & Conditions
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8">Last Updated: August 23, 2026</p>

        <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold mb-3 text-gray-900">1. Commercial Terms & Custom Orders</h2>
            <p>
              Decorom manufactures customized handcrafted nameplates. By placing an order or submitting custom dimensions and text:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-600">
              <li>You confirm that all custom spelling, names, house numbers, and language script text submitted during checkout/inquiry are accurate. Decorom is not liable for errors present in customer-submitted text.</li>
              <li>Production begins after order/design confirmation. Custom orders cannot be canceled once laser cutting or fabrication has started.</li>
            </ul>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold mb-3 text-gray-900">2. Intellectual Property Rights</h2>
            <p>
              All proprietary design templates, vector layouts, graphics, branding, and content published on this website are owned by Decorom. Customers retain ownership of their custom personal family names and trade names submitted for customization.
            </p>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold mb-3 text-gray-900">3. Pricing & Payment Terms</h2>
            <p>
              All prices are in Indian Rupees (INR) and inclusive of applicable taxes. Live price estimations calculated by our custom price calculator are based on specified dimensions (width × height) and material selections. We reserve the right to revise pricing prior to order confirmation.
            </p>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold mb-3 text-gray-900">4. Limitation of Liability</h2>
            <p>
              In no event shall Decorom, its founders, or employees be liable for indirect, incidental, or consequential damages resulting from product misuse, improper self-installation, or weather exposure outside recommended material specifications.
            </p>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold mb-3 text-gray-900">5. Governing Law & Legal Jurisdiction</h2>
            <p>
              These Terms & Conditions are governed by and construed in accordance with the laws of India. Any legal proceedings or disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts located in <strong>Ahmedabad, Gujarat, India</strong>.
            </p>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold mb-3 text-gray-900">6. Contact Information</h2>
            <p>
              For questions regarding these Terms & Conditions, please email us at{" "}
              <a href="mailto:decorom213@gmail.com" className="text-pink-600 font-medium hover:underline">
                decorom213@gmail.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default TermsAndConditions;
