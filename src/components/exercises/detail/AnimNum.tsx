"use client";

import React, { useState, useEffect, useRef } from "react";

export function AnimNum({
  to,
  duration = 900,
}: {
  to: number;
  duration?: number;
}) {
  const [val, setVal] = useState<number>(0);
  const t0 = useRef<number | null>(null);

  useEffect(() => {
    t0.current = null;
    let raf: number;

    const tick = (ts: number) => {
      if (!t0.current) {
        t0.current = ts;
        setVal(0);
      }

      const elapsed = ts - t0.current;
      const p = Math.min(elapsed / duration, 1);
      const progressValue = Math.round((1 - Math.pow(1 - p, 3)) * to);

      setVal(progressValue);

      if (p < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);

  return <>{val.toLocaleString()}</>;
}
