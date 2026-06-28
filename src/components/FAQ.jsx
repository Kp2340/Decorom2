import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What types of nameplates does Decorom make?",
    a: "We craft custom nameplates in acrylic, wood, stainless steel, mild steel, and laser-cut designs — with LED or non-LED options, in multiple sizes.",
  },
  {
    q: "Can I fully customise the name, design, and font?",
    a: "Yes! Every nameplate starts with a free consultation. You choose the name, font, material, finish, and size — we build it exactly to your vision.",
  },
  {
    q: "How long does delivery take?",
    a: "Ready within 2–3 working days from design confirmation. Delivery within Ahmedabad is typically next day after dispatch.",
  },
  {
    q: "Do you ship outside Ahmedabad?",
    a: "Yes — we ship across Gujarat and all major Indian cities. Contact us for shipping charges and timelines to your location.",
  },
  {
    q: "What payment methods do you accept?",
    a: "All major UPI apps (GPay, PhonePe, Paytm), debit/credit cards, and net banking — processed securely via PhonePe gateway.",
  },
  {
    q: "What materials are available?",
    a: "Acrylic, aluminium, natural wood, stainless steel, and mild steel — each with different aesthetics from sleek modern to premium elegant design.",
  },
];

const FAQ = () => {
  const [open, setOpen] = useState(null);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <p className="text-gray-500 mt-1.5 text-sm">Everything you need to know before ordering.</p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="font-semibold text-gray-900 text-sm md:text-base pr-4">{faq.q}</span>
                <ChevronDown
                  className="w-5 h-5 flex-shrink-0 text-gray-400 transition-transform duration-300"
                  style={{ transform: open === i ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>

              {/* Smooth animated answer */}
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: open === i ? "200px" : "0px" }}
              >
                <p className="px-5 pb-4 pt-1 text-gray-500 text-sm leading-relaxed border-t border-gray-100">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-7 text-sm text-gray-500">
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
