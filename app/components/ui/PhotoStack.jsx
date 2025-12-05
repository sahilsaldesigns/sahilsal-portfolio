"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const defaultImages = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1529119368496-2dfda6ec2804?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=80",
];

export default function ScrollStackGallery(props) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const images = props && props.images ? props.images : defaultImages;
  const n = images.length;

  return (
    <section ref={ref} className="relative h-[500vh]">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        {images.map((src, i) => {
          const start = i / n;
          const end = (i + 1) / n;
          const mid = start + 0.5 / n; // midpoint of this image's section

          // --- Motion logic ---
          // Each image slides upward from 100% -> 0% of its container
          const y = useTransform(scrollYProgress, [start, end], ["100%", "0%"]);

          // Fade in from transparent -> visible as it enters
          const opacity = useTransform(scrollYProgress, [start, mid], [0, 1]);

          // Scale down slightly when the *next* image reaches halfway
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
              className="absolute inset-0 flex items-center justify-center will-change-transform"
            >
              <motion.img
                src={src}
                alt={`Photo ${i + 1}`}
                draggable={false}
                className="w-[60vw] h-[80vh] object-cover rounded-3xl shadow-2xl"
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
