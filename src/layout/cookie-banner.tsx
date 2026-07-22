import { useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/constants";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEYS.cookieConsent)) setShow(true);
    } catch {
      /* storage blocked */
    }
  }, []);

  if (!show) return null;

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEYS.cookieConsent, "accepted");
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-3xl rounded-lg border border-border bg-card text-card-foreground shadow-elite-lg"
    >
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          We use cookies to enhance your browsing experience and analyse traffic.
        </p>
        <button
          type="button"
          onClick={accept}
          className="self-start sm:self-auto rounded-md bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground hover:bg-primary/90"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
