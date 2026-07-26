import { Truck } from "lucide-react";
import useCountdown from "../hooks/useCountdown";
import useFreeDeliveryOffer from "../hooks/useFreeDeliveryOffer";

/**
 * "Free delivery until midnight" headline with a live countdown.
 *
 * Styled on TrustBadges.jsx (the existing full-width yellow strip) rather than introduced as a
 * site-wide announcement bar: Header.jsx is `fixed h-16`, App.jsx compensates with `pt-16`, and
 * Hero.jsx hardcodes `calc(100vh - 64px)`, so a global bar would mean editing all three.
 *
 * @param {"strip"|"inline"} variant  strip = full-width page banner, inline = inside a card
 */
const FreeDeliveryBanner = ({ variant = "strip", className = "" }) => {
  const offer = useFreeDeliveryOffer();
  const { label, expired } = useCountdown(offer.deadline);

  if (!offer.active || expired) return null;

  if (variant === "inline") {
    return (
      <div
        className={`flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2 ${className}`}
      >
        <Truck className="h-4 w-4 shrink-0 text-green-700" aria-hidden="true" />
        <p className="text-[11px] font-bold leading-snug text-green-800">
          FREE delivery on this best seller —{" "}
          <span className="font-mono tabular-nums text-rose-600">{label}</span> left
        </p>
      </div>
    );
  }

  return (
    <section
      className={`border-y border-yellow-200 bg-yellow-100 py-3 ${className}`}
      aria-live="polite"
    >
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 text-center">
        <Truck className="h-5 w-5 text-gray-900" aria-hidden="true" />
        <p className="text-sm font-black uppercase tracking-wide text-gray-900">
          Free delivery on all best sellers
        </p>
        <p className="text-xs font-semibold text-gray-700">
          Order before midnight ·{" "}
          <span className="font-mono tabular-nums font-black text-rose-600">{label}</span> left
        </p>
      </div>
    </section>
  );
};

export default FreeDeliveryBanner;
