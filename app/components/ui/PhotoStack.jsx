"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const images = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1529119368496-2dfda6ec2804?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=80",
];

export default function ScrollStackGallery() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section ref={ref} className="relative h-[500vh] bg-neutral-950">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        {images.map((src, i) => {
          const start = i / images.length;
          const end = (i + 1) / images.length;

          // Each image moves upward
          const y = useTransform(scrollYProgress, [start, end], ["100%", "0%"]);

          // --- New part: scale down the current image as next one approaches ---
          // The previous image scales down gradually from 1 to 0.9 as we scroll through the next section
          const scale = useTransform(
            scrollYProgress,
            [end - 0.2, end],
            [1, 0.9]
          );

          // Fade next one slightly
          const opacity = useTransform(scrollYProgress, [start, end], [1, 1]);

          return (
            <motion.div
              key={i}
              style={{ y, opacity, scale }}
              className="absolute inset-0 flex items-center justify-center will-change-transform"
            >
              <motion.img
                src={src}
                alt={`Photo ${i + 1}`}
                className="w-[60vw] h-[80vh] object-cover rounded-3xl shadow-2xl"
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
