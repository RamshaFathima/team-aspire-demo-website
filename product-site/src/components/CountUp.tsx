"use client";

import { useEffect, useRef, useState } from "react";

/** Counts up when scrolled into view. Accepts values like "₹76,998", "1,240+", "92%". */
export default function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value.replace(/[\d,]+/, "0"));
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const match = value.match(/([\d,]+)/);
    if (!match) {
      setDisplay(value);
      return;
    }
    const target = Number(match[1].replace(/,/g, ""));

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(target * eased);
          setDisplay(value.replace(/[\d,]+/, current.toLocaleString("en-IN")));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        // rAF can be throttled in background tabs — always settle on the final value
        setTimeout(() => setDisplay(value), duration + 250);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{display}</span>;
}
