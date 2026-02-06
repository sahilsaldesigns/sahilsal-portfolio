"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

export default function ScrollStackGallery(props) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const images = props.images;
  const n = images.length;

  // Audio setup
  const audioContextRef = useRef(null);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const [lastPlayedIndex, setLastPlayedIndex] = useState(-1);

  useEffect(() => {
    // Initialize Web Audio API context
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
  }, []);

  // Function to play iOS-style thin tick sound for scroll down
const createClickNoise = (ctx, now, duration = 0.008) => {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  source.connect(gain);
  gain.connect(ctx.destination);

  source.start(now);
  source.stop(now + duration);
};

const playScrollDownSound = () => {
  if (!audioContextRef.current) return;

  const ctx = audioContextRef.current;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  // Bright, thin click
  filter.type = "highpass";
  filter.frequency.setValueAtTime(1400, now);

  osc.type = "triangle"; // closer to iOS than sine
  osc.frequency.setValueAtTime(2300, now);
  osc.frequency.exponentialRampToValueAtTime(1800, now + 0.015);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.18, now + 0.0015);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

  osc.start(now);
  osc.stop(now + 0.02);

  // add micro noise click
  createClickNoise(ctx, now);
};

const playScrollUpSound = () => {
  if (!audioContextRef.current) return;

  const ctx = audioContextRef.current;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  filter.type = "highpass";
  filter.frequency.setValueAtTime(1200, now);

  osc.type = "triangle";
  osc.frequency.setValueAtTime(1900, now);
  osc.frequency.exponentialRampToValueAtTime(1500, now + 0.015);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.14, now + 0.0015);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

  osc.start(now);
  osc.stop(now + 0.02);

  createClickNoise(ctx, now);
};


  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const isScrollingDown = latest > lastScrollPosition;
      
      // Find current image index based on scroll position
      let currentIndex = -1;
      for (let i = 0; i < n; i++) {
        const start = i / n;
        const mid = start + 0.5 / n;
        
        if (latest >= mid) {
          currentIndex = i;
        }
      }

      // Play sound when crossing image boundaries
      if (currentIndex !== lastPlayedIndex && currentIndex >= 0) {
        if (isScrollingDown) {
          playScrollDownSound();
        } else {
          playScrollUpSound();
        }
        setLastPlayedIndex(currentIndex);
      }

      setLastScrollPosition(latest);
    });

    return () => unsubscribe();
  }, [scrollYProgress, n, lastScrollPosition, lastPlayedIndex]);

  // Heading fade on scroll start (0 → 5%)
  const headingOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const headingY = useTransform(scrollYProgress, [0, 0.05], ["0%", "-40%"]);

  return (
    <section ref={ref} className="relative h-[500vh]">

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
          Spotted something you liked? Let's take it to the 'gram
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
