"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function PageIntro({
  onExitStart,
  onExitEnd,
}: {
  onExitStart: () => void;
  onExitEnd: () => void;
}) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const minTimer = new Promise<void>(resolve => setTimeout(resolve, 3100));
    const fontReady = Promise.race([
      document.fonts.ready,
      new Promise<void>(resolve => setTimeout(resolve, 5000)),
    ]);

    Promise.all([minTimer, fontReady]).then(() => {
      setIsExiting(true);
      onExitStart();
    });
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
            width={80}
            height={80}
            className="intro-logo"
          />
        </div>
      </div>
    </div>
  );
}
