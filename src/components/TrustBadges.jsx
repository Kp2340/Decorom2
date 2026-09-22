import { ShieldCheck, Truck, PackageCheck, Palette, Layers, Gift } from "lucide-react";

const TRUST_BADGES = [
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    desc: "PhonePe Verified",
    tag: "100% Safe",
  },
  {
    icon: Truck,
    title: "7-Day Delivery",
    desc: "Guaranteed in Gujarat",
    tag: "Fast & Tracked",
  },
  {
    icon: PackageCheck,
    title: "Free Delivery",
    desc: "On orders > ₹2,000",
    tag: "Automated",
  },
  {
    icon: Palette,
    title: "Custom Design",
    desc: "Free Consultation",
    tag: "Live Preview",
  },
  {
    icon: Layers,
    title: "Bulk Discounts",
    desc: "Contact Us Directly",
    tag: "B2B / Villas",
  },
  {
    icon: Gift,
    title: "First Order Offer",
    desc: "Use Code: FIRST500",
    tag: "Special Saving",
  },
];

const TrustBadges = ({ variant = "strip", className = "" }) => {
  if (variant === "compact") {
    return (
      <div className={`grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3.5 bg-[#0F172A] border border-slate-800 rounded-xl ${className}`}>
        {TRUST_BADGES.map((b, i) => {
          const Icon = b.icon;
          return (
            <div key={i} className="flex items-start gap-2 py-1">
              <div className="p-1.5 rounded-md bg-slate-800 text-[#E59500] shadow-2xs shrink-0">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white leading-tight truncate">
                  {b.title}
                </p>
                <p className="text-[10px] text-slate-400 leading-tight truncate">
                  {b.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Default full-width strip (for Homepage bottom of 100vh hero)
  return (
    <section className={`bg-[#0F172A]/95 backdrop-blur-md border-t border-slate-800/90 py-2 sm:py-2.5 overflow-hidden transition-colors duration-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pr-16 sm:pr-20 md:pr-20 2xl:pr-8">
        <div className="flex overflow-x-auto no-scrollbar gap-2 px-1 md:grid md:grid-cols-6 md:gap-2.5">
          {TRUST_BADGES.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="shrink-0 flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg bg-slate-800/70 border border-slate-700/50 shadow-2xs transition-colors duration-200 hover:border-amber-400/50 min-w-[130px] md:min-w-0"
              >
                <div className="p-1 sm:p-1.5 rounded-md bg-[#0F172A] text-[#E59500] shrink-0">
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-bold text-white leading-tight whitespace-nowrap md:truncate">
                    {b.title}
                  </p>
                  <p className="text-[9px] sm:text-[11px] text-slate-400 leading-tight whitespace-nowrap md:truncate">
                    {b.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
