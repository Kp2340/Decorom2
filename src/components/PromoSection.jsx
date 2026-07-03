import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { PROMO_CODES } from "../config/promos";
import { getVisiblePromos, getCountdownTarget } from "../utils/promoUtils";
import { validatePromoCode } from "../api/promos.api";

function formatCountdown(ms) {
  if (ms <= 0) return "00:00:00";
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

const badgeClasses = {
  green: "bg-green-100 text-green-700 border-green-200",
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  orange: "bg-orange-100 text-orange-700 border-orange-200",
};

const PromoCard = ({ code, appliedCode, applying, onApply, onRemove, expiredCodes }) => {
  const promo = PROMO_CODES[code];
  const [timeLeft, setTimeLeft] = useState(null);
  const isApplied = appliedCode === code;
  const isOtherApplied = appliedCode && appliedCode !== code;
  const isApplying = applying === code;
  const isExpired = expiredCodes.includes(code);

  useEffect(() => {
    const target = getCountdownTarget(code);
    if (!target) return;
    const tick = () => setTimeLeft(Math.max(0, target.getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [code]);

  if (isExpired) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{
        opacity: isOtherApplied ? 0.4 : 1,
        scale: isApplied ? 1.01 : 1,
        y: 0,
      }}
      transition={{ duration: 0.25 }}
      className={`relative border-2 rounded-2xl p-4 transition-all ${
        isApplied
          ? "border-green-400 bg-green-50 shadow-md"
          : "border-gray-100 bg-white"
      } ${isOtherApplied ? "pointer-events-none" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-2xl flex-shrink-0">{promo.icon}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="font-black text-gray-800 text-sm font-mono tracking-wider">{code}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeClasses[promo.badgeColor] || badgeClasses.blue}`}>
                {promo.label}
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-snug">{promo.description}</p>
            {timeLeft !== null && (
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="text-[10px] text-gray-400 font-medium">⏰ Expires in:</span>
                <span className="text-[11px] font-black text-rose-500 font-mono">{formatCountdown(timeLeft)}</span>
              </div>
            )}
            {promo.minOrderAmount > 0 && !isApplied && (
              <p className="text-[10px] text-amber-600 font-semibold mt-1">
                Min. order: ₹{promo.minOrderAmount.toLocaleString()}
              </p>
            )}
          </div>
        </div>

        <div className="flex-shrink-0">
          {isApplied ? (
            <div className="flex items-center gap-2">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-green-600 font-black text-xs"
              >
                ✓ Applied
              </motion.span>
              <button
                onClick={onRemove}
                className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 flex items-center justify-center text-xs font-bold transition-colors"
                title="Remove promo"
              >
                ×
              </button>
            </div>
          ) : (
            <button
              onClick={() => onApply(code)}
              disabled={isApplying}
              className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-black px-3 py-2 rounded-xl transition-all active:scale-95 disabled:opacity-60 flex items-center gap-1.5 shadow-sm"
            >
              {isApplying ? (
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Applying
                </span>
              ) : (
                "Apply →"
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const PromoSection = ({ basePrice, appliedCode, discountInfo, onApply, onRemove }) => {
  const [manualCode, setManualCode] = useState("");
  const [manualError, setManualError] = useState("");
  const [applying, setApplying] = useState(null);
  const [cardErrors, setCardErrors] = useState({});
  const [expiredCodes, setExpiredCodes] = useState([]);
  const visiblePromos = getVisiblePromos();

  // Track expired timers so we hide the card when countdown hits 0
  useEffect(() => {
    const id = setInterval(() => {
      const nowExpired = visiblePromos.filter((code) => {
        const target = getCountdownTarget(code);
        return target && new Date() >= target;
      });
      if (nowExpired.length > 0) {
        setExpiredCodes((prev) => [...new Set([...prev, ...nowExpired])]);
        // If currently applied code just expired, remove it
        if (appliedCode && nowExpired.includes(appliedCode)) {
          onRemove();
        }
      }
    }, 5000);
    return () => clearInterval(id);
  }, [visiblePromos, appliedCode, onRemove]);

  const handleApply = async (code) => {
    setApplying(code);
    setCardErrors({});
    try {
      const res = await validatePromoCode(code, basePrice);
      const data = res?.data ?? res;
      if (data.valid) {
        onApply(code, data);
      } else {
        setCardErrors((prev) => ({ ...prev, [code]: data.message }));
      }
    } catch {
      setCardErrors((prev) => ({ ...prev, [code]: "Could not validate code. Try again." }));
    } finally {
      setApplying(null);
    }
  };

  const handleManualApply = async () => {
    const code = manualCode.trim().toUpperCase();
    if (!code) return;
    setManualError("");
    setApplying("manual");
    try {
      const res = await validatePromoCode(code, basePrice);
      const data = res?.data ?? res;
      if (data.valid) {
        onApply(code, data);
        setManualCode("");
      } else {
        setManualError(data.message);
      }
    } catch {
      setManualError("Could not validate code. Try again.");
    } finally {
      setApplying(null);
    }
  };

  if (visiblePromos.length === 0 && !appliedCode) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
        <span className="w-5 h-5 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-xs">%</span>
        Available Offers
      </h3>

      {/* Promo Cards */}
      <div className="space-y-2">
        {visiblePromos.map((code) => (
          <div key={code}>
            <PromoCard
              code={code}
              basePrice={basePrice}
              appliedCode={appliedCode}
              applying={applying}
              onApply={handleApply}
              onRemove={onRemove}
              expiredCodes={expiredCodes}
            />
            <AnimatePresence>
              {cardErrors[code] && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-red-500 font-semibold mt-1 px-1"
                >
                  {cardErrors[code]}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Manual Entry */}
      {!appliedCode && (
        <div>
          <p className="text-[11px] text-gray-400 font-semibold mb-1.5">Have another code?</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => { setManualCode(e.target.value.toUpperCase()); setManualError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleManualApply()}
              placeholder="Enter promo code"
              className="flex-1 border-2 border-gray-100 rounded-xl px-3 py-2.5 text-sm font-mono font-bold uppercase focus:border-pink-500 outline-none transition-all tracking-widest"
              maxLength={20}
            />
            <button
              onClick={handleManualApply}
              disabled={!manualCode.trim() || applying === "manual"}
              className="bg-gray-800 hover:bg-gray-900 text-white text-xs font-black px-4 py-2 rounded-xl transition-all active:scale-95 disabled:opacity-40"
            >
              {applying === "manual" ? "..." : "Apply"}
            </button>
          </div>
          {manualError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-red-500 font-semibold mt-1 px-1"
            >
              {manualError}
            </motion.p>
          )}
        </div>
      )}

      {/* Discount Summary Line */}
      <AnimatePresence>
        {discountInfo && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-black text-sm">✓</span>
              <span className="text-green-700 text-xs font-bold">{discountInfo.message}</span>
            </div>
            <span className="text-green-700 font-black text-sm">−₹{discountInfo.deductionAmount?.toLocaleString()}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PromoSection;
