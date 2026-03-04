"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { ReactLenis } from "lenis/react";

function StackCard({ src, index, total, scrollYProgress }) {
  const n = total;
  const i = index;

  const start = i / n;
  const end = (i + 1) / n;
  const mid = start + 0.5 / n;
  const nextMid = (i + 1) / n + 0.5 / n;

  const y = useTransform(scrollYProgress, [start, end], ["100%", "0%"]);
  const opacity = useTransform(scrollYProgress, [start, mid], [0, 1]);

  const scaleStart = Math.max((i + 1) / n - 0.05, 0);
  const scaleMid = (i + 1) / n + 0.5 / n;
  const scale =
    i < n - 1
      ? // eslint-disable-next-line react-hooks/rules-of-hooks
        useTransform(scrollYProgress, [scaleStart, scaleMid], [1, 0.92])
      : 1;

  // Shadow intensity: fades IN as this card arrives, fades OUT as the next card covers it.
  // Last card: fades in and stays.
  // We interpolate a 0→1 value and map it to drop-shadow blur/opacity in the style.
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
}

export default function ScrollStackGallery(props) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const images = props.images;
  const n = images.length;

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
      <ReactLenis root options={{ lerp: 0.08, duration: 1.2 }} />

      <section ref={ref} style={{ height: `${(n + 1) * 100}vh` }} className="relative">
        <motion.h1
          style={{ opacity: fixedHeadingOpacity, y: fixedHeadingY }}
          className="fixed top-10 left-1/2 -translate-x-1/2 z-30
            text-center text-lg md:text-2xl lg:text-3xl font-semibold pointer-events-none"
        >
          {"Photograph's and Memories"}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            style={{ opacity: headingOpacity, y: headingY }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
              z-[999] text-center text-xl md:text-3xl lg:text-4xl font-semibold pointer-events-none"
          >
            {"Photograph's and Memories"}
          </motion.h1>

          <motion.div
            style={{ opacity: headingOpacity }}
            className="fixed left-1/2 top-[60%] -translate-x-1/2
              z-[999] flex flex-col items-center text-gray-500 pointer-events-none"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <span className="text-sm md:text-base">Scroll Down</span>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-1">
              <path d="M12 5v14m0 0l-6-6m6 6l6-6" />
            </svg>
          </motion.div>
        </motion.div>

        <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
          {images.map((src, i) => (
            <StackCard
              key={i}
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
        className="flex flex-col items-center justify-center text-center py-16"
      >
        <p className="text-gray-500 mb-6 max-w-md">
          {"Spotted something you liked? Let's take it to the 'gram"}
        </p>
        <button className="group flex items-center gap-3 px-6 py-3 rounded-full bg-black text-white border border-black shadow-sm hover:shadow-lg hover:bg-white hover:text-black hover:cursor-pointer transform hover:-translate-y-1 transition-all duration-300 ease-out">
          <span className="w-6 h-6 flex items-center justify-center rounded-lg bg-transparent transition-colors duration-300 ease-out group-hover:bg-linear-to-tr group-hover:from-[#F58529] group-hover:via-[#DD2A7B] group-hover:to-[#515BD4]">
            <Image
              src="/uploads/img/instagram-logo.svg"
              width={24}
              height={24}
              alt="Instagram Logo"
              className="transition-all duration-300 ease-out group-hover:invert-0"
            />
          </span>
          Saahil.sal
        </button>
      </motion.div>
    </>
  );
}