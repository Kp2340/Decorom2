const badges = [
  { icon: "✦", label: "100% Handcrafted in Ahmedabad" },
  { icon: "🚚", label: "Ships in 5–7 Days" },
  { icon: "⭐", label: "500+ Happy Customers" },
  { icon: "🎨", label: "Free Design Consultation" },
  { icon: "♻️", label: "Eco-Friendly Materials" },
];

const TrustBadges = () => (
  <section className="bg-yellow-100 border-y border-yellow-200 py-4 overflow-hidden">
    <div className="flex items-center justify-start md:justify-center gap-6 md:gap-10 px-6 overflow-x-auto scrollbar-hide whitespace-nowrap">
      {badges.map((b, i) => (
        <div key={i} className="flex items-center gap-2 shrink-0">
          <span className="text-lg leading-none">{b.icon}</span>
          <span className="text-sm font-medium text-gray-700">{b.label}</span>
          {i < badges.length - 1 && (
            <span className="hidden md:inline text-yellow-300 ml-6 select-none">|</span>
          )}
        </div>
      ))}
    </div>
  </section>
);

export default TrustBadges;
