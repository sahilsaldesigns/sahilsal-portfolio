"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ScrollStackGallery(props) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const images = props.images;
  const n = images.length;

  // Heading fade on scroll start (0 → 5%)
  const headingOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const headingY = useTransform(scrollYProgress, [0, 0.05], ["0%", "-40%"]);

  return (
    <section ref={ref} className="relative h-[500vh]">

      {/* --- Centered Heading (kept OUTSIDE sticky layer) --- */}
      <motion.h1
        style={{ opacity: headingOpacity, y: headingY }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
        z-[999] text-center text-xl md:text-3xl lg:text-4xl font-semibold pointer-events-none"
      >
        Photograph’s and Memories
      </motion.h1>

      {/* --- Scroll Indicator --- */}
      <motion.div
        style={{ opacity: headingOpacity }}
        className="fixed left-1/2 top-[60%] -translate-x-1/2 
        z-[999] flex flex-col items-center text-gray-500 pointer-events-none"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span className="text-sm md:text-base">Scroll Down</span>
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="mt-1"
        >
          <path d="M12 5v14m0 0l-6-6m6 6l6-6" />
        </svg>
      </motion.div>

      {/* --- Sticky Image Container --- */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        {images.map((src, i) => {
          const start = i / n;
          const end = (i + 1) / n;
          const mid = start + 0.5 / n;

          const y = useTransform(scrollYProgress, [start, end], ["100%", "0%"]);
          const opacity = useTransform(scrollYProgress, [start, mid], [0, 1]);

          let scale = 1;
          if (i < n - 1) {
            const nextStart = (i + 1) / n;
            const nextMid = nextStart + 0.5 / n;
            scale = useTransform(
              scrollYProgress,
              [Math.max(nextMid - 0.1, 0), nextMid],
              [1, 0.9]
            );
          }

          return (
            <motion.div
              key={i}
              style={{ y, opacity, scale }}
              className="absolute inset-0 flex items-center justify-center will-change-transform z-10"
            >
              <motion.img
                src={src}
                alt={`Photo ${i + 1}`}
                draggable={false}
                className="
                  w-[70vw] max-w-[500px]
                  h-auto max-h-[80vh]
                  object-cover rounded-3xl shadow-2xl
                  md:w-[50vw] md:max-w-[600px]
                "
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
