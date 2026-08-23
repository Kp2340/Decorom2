import { useState, useMemo } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Helmet } from "react-helmet-async";

const DEFAULT_FAQS = [
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

const EXTENDED_FAQS = [
  {
    q: "Can I add LED lighting to my nameplate?",
    a: "Yes — most materials support front or back LED lighting as an add-on, priced based on your chosen material and size.",
  },
  {
    q: "Do you offer professional installation?",
    a: "Yes, professional installation is available as an add-on for a flat ₹500, so your nameplate is mounted correctly and securely.",
  },
  {
    q: "What sizes can I order?",
    a: "Custom sizes from 1×1 inch up to 96×96 inches — just enter your preferred dimensions in the price calculator on any product page.",
  },
  {
    q: "How is the price calculated for custom sizes?",
    a: "Price is based on total area (width × height), your chosen material, and any add-ons like LED lighting or installation — the price updates live as you adjust dimensions.",
  },
  {
    q: "Can I track my order after placing it?",
    a: "Yes — once your order is confirmed you'll get an Order ID you can use anytime to check its status.",
  },
  {
    q: "Do you make nameplates in Gujarati or other regional scripts?",
    a: "Yes — we've crafted nameplates in Gujarati, Hindi, and other regional scripts. Share your text via WhatsApp or our Custom Design page.",
  },
  {
    q: "Are your nameplates suitable for outdoor use?",
    a: "Acrylic, ACP, and steel nameplates are commonly used on exposed outdoor entrances; wooden nameplates suit covered or semi-covered spots best. Message us your entrance details and we'll recommend the right material.",
  },
  {
    q: "Do you make nameplates for offices or businesses, not just homes?",
    a: "Yes — alongside home nameplates, we design for offices, clinics, and businesses too.",
  },
  {
    q: "What if I want a design that isn't shown on the website?",
    a: "Share your vision on our Custom Design page or via WhatsApp — our artisans can create a completely bespoke nameplate for you.",
  },
  {
    q: "Can I speak to someone before placing an order?",
    a: "Absolutely — tap the WhatsApp icon on any page, or call us directly, and we'll help you choose the right design.",
  },
];

const ALL_FAQS = [...DEFAULT_FAQS, ...EXTENDED_FAQS];

const FAQ = () => {
  const [open, setOpen] = useState(null);
  const [query, setQuery] = useState("");

  const filteredFaqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DEFAULT_FAQS;
    return ALL_FAQS.filter(
      (faq) => faq.q.toLowerCase().includes(q) || faq.a.toLowerCase().includes(q),
    );
  }, [query]);

  // Generate valid schema.org/FAQPage JSON-LD Structured Data
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ALL_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <section className="py-12 bg-white">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <p className="text-gray-500 mt-1.5 text-sm">Everything you need to know before ordering.</p>
        </div>

        <div className="relative mb-6">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions…"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>

        {filteredFaqs.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-6">No questions match "{query}".</p>
        ) : (
          <div className="space-y-2">
            {filteredFaqs.map((faq) => (
              <div key={faq.q} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer"
                  onClick={() => setOpen(open === faq.q ? null : faq.q)}
                  aria-expanded={open === faq.q}
                >
                  <span className="font-semibold text-gray-900 text-sm md:text-base pr-4">{faq.q}</span>
                  <ChevronDown
                    className="w-5 h-5 shrink-0 text-gray-400 transition-transform duration-300"
                    style={{ transform: open === faq.q ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>

                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{ maxHeight: open === faq.q ? "200px" : "0px" }}
                >
                  <p className="px-5 pb-4 pt-1 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

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
