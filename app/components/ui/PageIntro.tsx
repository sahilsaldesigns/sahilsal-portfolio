"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function PageIntro({
  onExitStart,
  onExitEnd,
}: {
  onExitStart: () => void;
  onExitEnd: () => void;
}) {
  const [isExiting, setIsExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Tune this one number ──────────────────────────────────────────────────
  // Glare (shineSweep) + breathe both start at 2.9s CSS delay.
  //   4900ms = one full cycle   (2.9s delay + 2s animation)
  //   4000ms = visible midpoint (glare sweep is at ~65% through)
  //   3300ms = just started     (glare barely visible)
  const INTRO_DURATION_MS = 4900;
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setIsExiting(true);
      onExitStart();
    }, INTRO_DURATION_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [onExitStart]);

  const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.animationName === 'screenSlideUp') {
      onExitEnd();
    }
  };

  return (
    <div
      className={`page-intro${isExiting ? " is-exiting" : ""}`}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="logo-wrapper">
        <div className="logo-shine-mask">
          <Image
            src="/uploads/img/base-logo.svg"
            alt="Logo"
            width={62}
            height={62}
            className="intro-logo"
          />
        </div>
      </div>
    </div>
  );
}
