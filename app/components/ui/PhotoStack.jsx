"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
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
  // Last image completion point
  const lastImageStart = (n - 1) / n;
  const lastImageMid = lastImageStart + 0.5 / n;

  // CTA opacity ONLY after last image is fully visible
  const ctaOpacity = useTransform(
    scrollYProgress,
    [lastImageMid, lastImageMid + 0.05],
    [0, 1]
  );

  const ctaY = useTransform(
    scrollYProgress,
    [lastImageMid, lastImageMid + 0.05],
    ["20px", "0px"]
  );

  // First image timing
  const firstImageStart = 0 / n; // = 0
  const firstImageMid = firstImageStart + 0.5 / n;

  // Fixed heading fades in with first image, fades out with last image
  const fixedHeadingOpacity = useTransform(
    scrollYProgress,
    [firstImageMid, firstImageMid + 0.05, lastImageStart, lastImageStart + 0.05],
    [0, 1, 1, 0]
  );

  const fixedHeadingY = useTransform(
    scrollYProgress,
    [firstImageMid, firstImageMid + 0.05, lastImageStart, lastImageStart + 0.05],
    ["-10px", "0px", "0px", "-20px"]
  );


  return (
    <section ref={ref} className="relative h-[500vh]">
      <motion.h1
        style={{ opacity: fixedHeadingOpacity, y: fixedHeadingY }}
        className="
    fixed top-10 left-1/2 -translate-x-1/2
    z-30
    text-center text-lg md:text-2xl lg:text-3xl
    font-semibold
    pointer-events-none
  "
      >
        Photograph's and Memories
      </motion.h1>


      {/* --- Centered Heading and Scroll Indicator wrapped in animated div --- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* --- Centered Heading (kept OUTSIDE sticky layer) --- */}
        <motion.h1
          style={{ opacity: headingOpacity, y: headingY }}
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
    z-999 text-center text-xl md:text-3xl lg:text-4xl font-semibold pointer-events-none"
        >
          Photograph's and Memories
        </motion.h1>

        {/* --- Scroll Indicator --- */}
        <motion.div
          style={{ opacity: headingOpacity }}
          className="fixed left-1/2 top-[60%] -translate-x-1/2 
    z-999 flex flex-col items-center text-gray-500 pointer-events-none"
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
      </motion.div>

      {/* --- Sticky Image Container --- */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center mb-15">
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
                  object-cover rounded-3xl 
                  md:w-[50vw] md:max-w-[600px]
                "
              />
            </motion.div>
          );
        })}
      </div>
      <motion.div
        style={{ opacity: ctaOpacity, y: ctaY }}
        className="sticky top-[80vh] z-20 flex flex-col items-center justify-center text-center"
      >
        <p className="text-gray-500 mb-6 max-w-md">
          Spotted something you liked? Let’s take it to the ’gram
        </p>
        <button
          className=" group flex items-center gap-3 px-6 py-3 rounded-full bg-black text-white border border-black shadow-sm hover:shadow-lg hover:bg-white hover:text-black hover:cursor-pointer transform hover:-translate-y-1 transition-all duration-300 ease-out">
          <span
            className=" w-6 h-6 flex items-center justify-center rounded-lg bg-transparent transition-colors duration-300 ease-out group-hover:bg-linear-to-tr group-hover:from-[#F58529] group-hover:via-[#DD2A7B] group-hover:to-[#515BD4] " >
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

    </section>
  );
}