import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What types of nameplates does Decorom make?",
    a: "We craft a wide range of custom nameplates in acrylic, wooden, stainless steel, mild steel and laser-cut designs with LED or non-LED. All are available in multiple sizes and can be fully personalised for your home or office entrance.",
  },
  {
    q: "Can I fully customise the name, design, and font?",
    a: "Absolutely. Every nameplate starts with a free design consultation. You choose the name, preferred font style, material, finish, and size. Our team works with you to ensure the final product perfectly matches your vision.",
  },
  {
    q: "How long does delivery take?",
    a: "Most custom nameplates are ready within 2–3 working days from design confirmation. Delivery within Ahmedabad is typically 1 day after dispatch. You'll receive a tracking link once your order ships.",
  },
  {
    q: "Do you ship outside Ahmedabad?",
    a: "Yes! We ship across Gujarat and all major cities in India. Shipping charges and timelines vary by location. Contact us for a quick quote if you're outside Ahmedabad.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major UPI apps (GPay, PhonePe, Paytm), debit/credit cards, net banking for online orders via PhonePe Payment Gateway.",
  },
  {
    q: "What materials are available?",
    a: "Our nameplates are crafted from premium acrylic, aluminium, natural wood, brushed stainless steel, mild steel. Each material offers different aesthetics — from sleek modern looks to warm, rustic finishes. We'll help you pick the best match for your home.",
  },
];

const FAQ = () => {
  const [open, setOpen] = useState(null);

  return (
    <section className="py-14 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <p className="text-gray-500 mt-2 text-sm">Everything you need to know before ordering.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="font-semibold text-gray-900 text-sm md:text-base pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 text-gray-400 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4 bg-gray-50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-center mt-8 text-sm text-gray-500">
          Still have questions?{" "}
          <a href="/contact" className="text-pink-600 hover:underline font-medium">
            Get in touch →
          </a>
        </p>
      </div>
    </section>
  );
};

export default FAQ;
