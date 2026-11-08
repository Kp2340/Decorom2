import { useEffect, useState } from "react";
import { formatCountdown } from "../utils/deliveryUtils";

/**
 * Ticks once a second toward `target` (a Date, ms number, or ISO string).
 *
 * Lifted out of PromoSection.jsx, where the ticker and formatter were file-local and
 * unexported, so the free-delivery banner can share the same behaviour.
 *
 * @returns {{ msLeft: number, label: string, expired: boolean }}
 */
export default function useCountdown(target) {
  const targetMs = (() => {
    if (!target) return null;
    if (target instanceof Date) return target.getTime();
    if (typeof target === "number") return target;
    const parsed = new Date(target).getTime();
    return Number.isNaN(parsed) ? null : parsed;
  })();

  const [msLeft, setMsLeft] = useState(() =>
    targetMs ? Math.max(0, targetMs - Date.now()) : 0
  );

  useEffect(() => {
    if (!targetMs) return undefined;

    const tick = () => setMsLeft(Math.max(0, targetMs - Date.now()));
    tick(); // avoid a one-second flash of a stale value
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  return {
    msLeft,
    label: formatCountdown(msLeft),
    expired: Boolean(targetMs) && msLeft <= 0,
  };
}
