import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, state, hash } = useLocation();

  useEffect(() => {
    if (!state?.fromSection && !hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, state, hash]);

  return null;
}
