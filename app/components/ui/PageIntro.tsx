"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

const INTRO_DURATION_MS = 4900;

export default function PageIntro({
  onExitStart,
  onExitEnd,
}: {
  onExitStart: () => void;
  onExitEnd: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    if (!container || !wrapper) return;

    const h = wrapper.offsetHeight || 62;

    // Promote to GPU layer, position below viewport, and reveal (CSS starts at opacity:0)
    gsap.set(wrapper, {
      xPercent: -50,
      y: window.innerHeight / 2 + h / 2,
      scale: 0.85,
      opacity: 1,
      force3D: true,
    });

    let breatheTween: gsap.core.Tween | null = null;

    // Throw logo up to center
    const throwTween = gsap.to(wrapper, {
      delay: 0.6,
      y: 0,
      yPercent: -50,
      scale: 1,
      duration: 2.2,
      ease: "expo.out",
      force3D: true,
      onComplete: () => {
        breatheTween = gsap.to(wrapper, {
          scale: 1.08,
          duration: 1,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          force3D: true,
        });
      },
    });

    // Slide the loader off-screen
    const exitTimer = setTimeout(() => {
      onExitStart();
      throwTween.kill();
      breatheTween?.kill();
      gsap.to(container, {
        yPercent: -100,
        duration: 1.2,
        ease: "power3.inOut",
        force3D: true,
        onComplete: onExitEnd,
      });
    }, INTRO_DURATION_MS);

    return () => {
      clearTimeout(exitTimer);
      throwTween.kill();
      breatheTween?.kill();
    };
  }, [onExitStart, onExitEnd]);

  return (
    <div ref={containerRef} className="page-intro">
      <div ref={wrapperRef} className="logo-wrapper">
        <div className="logo-shine-mask">
          <Image
            src="/uploads/img/base-logo.svg"
            alt="Sahil Salekar"
            width={62}
            height={62}
            className="intro-logo"
            priority
          />
        </div>
      </div>
    </div>
  );
}
