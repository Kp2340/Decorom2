import { useEffect, useState } from "react";
import { getFreeDeliveryOffer } from "../api/promos.api";
import {
  DELIVERY_CHARGE,
  FREE_DELIVERY_CODE,
  getMidnightIST,
  isFreeDeliveryOpen,
} from "../utils/deliveryUtils";

/**
 * The free-delivery offer, preferring the server's own deadline so the countdown matches the
 * instant the backend enforces rather than each browser's local midnight.
 *
 * Falls back to a locally computed IST end-of-day if the request fails, so the banner and the
 * checkout maths still work offline or during a backend blip. The fallback is presentation only
 * — the server always re-decides the waiver at checkout.
 */
export default function useFreeDeliveryOffer() {
  const [offer, setOffer] = useState(() => ({
    code: FREE_DELIVERY_CODE,
    active: isFreeDeliveryOpen(),
    deliveryCharge: DELIVERY_CHARGE,
    deadline: getMidnightIST(),
    source: "local",
  }));

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await getFreeDeliveryOffer();
        const data = res?.data ?? res;
        if (cancelled || !data) return;

        setOffer({
          code: data.code || FREE_DELIVERY_CODE,
          active: Boolean(data.active),
          deliveryCharge:
            typeof data.deliveryCharge === "number" ? data.deliveryCharge : DELIVERY_CHARGE,
          deadline: data.deadline ? new Date(data.deadline) : getMidnightIST(),
          source: "server",
        });
      } catch {
        // Keep the local fallback already in state.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return offer;
}
