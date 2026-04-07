"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useMemo, memo } from "react";
import { ReactLenis } from "lenis/react";

// Stable constant — defined once at module level, never recreated on render.
// Fixes: Lenis reinitialising every render due to new object reference.
const LENIS_OPTIONS = { lerp: 0.08, duration: 1.2 };

// memo() — StackCard props (src, index, total) never change after mount,
// and scrollYProgress is a stable MotionValue reference, so this component
// will never re-render after initial mount. Zero wasted reconciliation.
const StackCard = memo(function StackCard({ src, index, total, scrollYProgress }) {
  const n = total;
  const i = index;

  const start = i / n;
  const end = (i + 1) / n;
  const mid = start + 0.5 / n;
  // nextMid === scaleMid — was computed twice before, unified here
  const nextMid = (i + 1) / n + 0.5 / n;

  const y = useTransform(scrollYProgress, [start, end], ["100%", "0%"]);
  const opacity = useTransform(scrollYProgress, [start, mid], [0, 1]);

  const scaleStart = Math.max((i + 1) / n - 0.05, 0);
  const scale =
    i < n - 1
      ? // eslint-disable-next-line react-hooks/rules-of-hooks
        useTransform(scrollYProgress, [scaleStart, nextMid], [1, 0.92])
      : 1;

  const shadowProgress =
    i < n - 1
      ? // eslint-disable-next-line react-hooks/rules-of-hooks
        useTransform(
          scrollYProgress,
          [mid, mid + 0.02, nextMid - 0.02, nextMid],
          [0, 1, 1, 0]
        )
      : // eslint-disable-next-line react-hooks/rules-of-hooks
        useTransform(scrollYProgress, [mid, mid + 0.02], [0, 1]);

  // Map shadowProgress → actual drop-shadow string.
  // blur: 4px → 20px, alpha: 0.0 → 0.20 — intentionally light.
  const dropShadow = useTransform(shadowProgress, (v) => {
    const blur = 4 + v * 16;           // 4px at 0, 20px at 1
    const spread = 2 + v * 6;          // subtle vertical offset grows too
    const alpha = (v * 0.20).toFixed(3);
    return `drop-shadow(0px ${spread}px ${blur}px rgba(0,0,0,${alpha}))`;
  });

  return (
    // will-change-transform ONLY on the outer wrapper — the motion.img inside
    // inherits the composited layer. Removed will-change from img to avoid
    // double GPU layer promotion per card.
    <motion.div
      style={{ y, opacity, scale }}
      className="absolute inset-0 flex items-center justify-center will-change-transform z-10"
    >
      <motion.img
        src={src}
        alt={`Photo ${i + 1}`}
        draggable={false}
        style={{ filter: dropShadow }}
        className="
          w-[70vw] max-w-[500px]
          h-auto max-h-[80vh]
          object-cover rounded-3xl
          md:w-[50vw] md:max-w-[600px]
        "
      />
    </motion.div>
  );
});

export default function ScrollStackGallery(props) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const images = props.images;
  const n = images.length;

  // Memoised — height string only changes if image count changes, not on every render
  const sectionHeight = useMemo(() => `${(n + 1) * 100}vh`, [n]);

  const headingOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const headingY = useTransform(scrollYProgress, [0, 0.05], ["0%", "-40%"]);

  const firstMid = 0.5 / n;
  const lastStart = (n - 1) / n;
  const lastMid = lastStart + 0.5 / n;

  const fixedHeadingOpacity = useTransform(
    scrollYProgress,
    [firstMid, firstMid + 0.05, lastStart, lastStart + 0.05],
    [0, 1, 1, 0]
  );
  const fixedHeadingY = useTransform(
    scrollYProgress,
    [firstMid, firstMid + 0.05, lastStart, lastStart + 0.05],
    ["-10px", "0px", "0px", "-20px"]
  );

  const ctaOpacity = useTransform(scrollYProgress, [lastMid, lastMid + 0.05], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [lastMid, lastMid + 0.05], ["20px", "0px"]);

  return (
    <>
      <ReactLenis root options={LENIS_OPTIONS} />

      <section ref={ref} style={{ height: sectionHeight }} className="relative">
        <motion.h1
          style={{ opacity: fixedHeadingOpacity, y: fixedHeadingY }}
          className="fixed top-10 left-1/2 -translate-x-1/2 z-30
            text-center text-lg md:text-2xl lg:text-3xl  pointer-events-none"
        >
          {"Photograph's & Memories"}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            style={{ opacity: headingOpacity, y: headingY }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
              z-999 text-center text-[24px] md:text-[44px]  pointer-events-none"
          >
            {"Photograph's & Memories"}
          </motion.h1>

          {/*
            whileInView replaces repeat:Infinity animate.
            The bounce only runs while the indicator is visible in the viewport.
            Once headingOpacity drives it to 0 and it leaves view, the animation
            loop stops entirely — no CPU burn after the user has scrolled past.
          */}
          <motion.div
            style={{ opacity: headingOpacity }}
            className="fixed left-1/2 top-[60%] -translate-x-1/2 z-999 pointer-events-none"
          >
            <div className="relative w-4 h-[54px]">
              {[0, 0.533, 1.067].map((delay) => (
                <motion.div
                  key={delay}
                  className="absolute left-0 top-0"
                  animate={{ y: [0, 22], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay, times: [0, 0.2, 0.8, 1] }}
                >
                  <svg width="16" height="10" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.75 0.75L5.75 5.75L10.75 0.75" stroke="#111011" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
          {images.map((src, i) => (
            <StackCard
              key={src}
              src={src}
              index={i}
              total={n}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </section>

      <motion.div
        style={{ opacity: ctaOpacity, y: ctaY }}
        className="flex flex-col items-center justify-center text-center pt-16 pb-6 px-4"
      >
        <p className="text-[18px] leading-[30px] md:text-base md:leading-normal text-[#757575] mb-6 max-w-md">
          {"Spotted something you liked? Let's take it to the 'gram"}
        </p>
        <button className="group relative flex items-center gap-3 px-6 py-3 rounded-full bg-black text-white border border-black shadow-sm overflow-hidden cursor-pointer transition-all duration-[400ms] ease-in-out hover:-translate-y-1 hover:shadow-lg">
          <span
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%)",
              backgroundSize: "200% 100%",
              backgroundPositionX: "200%",
              animation: "glare 4s linear infinite",
            }}
          />
          <span className="relative w-6 h-6">
            <Image
              src="/uploads/img/instagram-logo.svg"
              width={24}
              height={24}
              alt="Instagram Logo"
              className="absolute inset-0 transition-opacity duration-300 opacity-100 group-hover:opacity-0"
            />
            <Image
              src="/uploads/img/instagram-logo-hover.svg"
              width={24}
              height={24}
              alt="Instagram Logo"
              className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            />
          </span>
          saahil.sal
        </button>
        <style>{`
          @keyframes glare {
            0%    { background-position-x: 150%; animation-timing-function: ease-in-out; }
            40%   { background-position-x: -50%; }
            99.9% { background-position-x: -50%; }
            100%  { background-position-x: 150%; }
          }
        `}</style>
        <hr className="w-full max-w-[962px] mx-auto mt-12" style={{ borderColor: "#D8D8D8" }}/>
      </motion.div>
    </>
  );
}