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

  const n = images.length;

  return (
    <section ref={ref} className="relative h-[500vh] bg-neutral-950">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        {images.map((src, i) => {
          const start = i / n;
          const end = (i + 1) / n;
          const mid = start + 0.5 / n; // 50% point of this image's reveal

          // incoming image motion: from below -> in place
          const y = useTransform(scrollYProgress, [start, end], ["100%", "0%"]);

          // incoming image opacity: fade from 0.6 -> 1 between start -> mid
          const opacity = useTransform(scrollYProgress, [start, mid], [0, 1]);

          // previous image scale: depends on THIS image's mid.
          // previous index is i - 1. For the very first image there's no previous, but this transform is safe.
          // Scale previous image down when current (this) image reaches ~50% (mid).
          // We compute a transform keyed to scrollYProgress so that when progress in [mid - 0.1, mid] we scale 1 -> 0.9
          const prevScale = useTransform(
            scrollYProgress,
            [Math.max(mid - 0.1, 0), mid],
            [1, 0.9]
          );

          // We want to apply prevScale to the *previous* image. To keep code simple we derive the scale
          // for the current layer as follows:
          // - For the current (top) image we use its own scale (default 1).
          // - For the previous image, we'll render the same component but set style.scale to prevScale.
          //
          // So here, set `layerScale` to:
          // - if there's a next image (i < n - 1) we compute a scale that responds to the *next* image mid
          //   (so the next image's mid will scale this layer down). That gives the desired behavior:
          //   when next image reaches 50%, this (current) image scales down.
          let layerScale = 1;
          if (i < n - 1) {
            const nextStart = (i + 1) / n;
            const nextMid = nextStart + 0.5 / n;
            layerScale = useTransform(
              scrollYProgress,
              [Math.max(nextMid - 0.1, 0), nextMid],
              [1, 0.9]
            );
          } else {
            // last image: no next image, keep scale 1
            layerScale = 1;
          }

          // For the current image component we want to use:
          // y = y
          // opacity = opacity
          // scale = layerScale (so it will scale down when the *next* image reaches its mid)
          //
          // Note: hook rules require consistent hooks order — using useTransform inside the map is okay
          // because it's executed in the same order each render.

          return (
            <motion.div
              key={i}
              style={{ y, opacity, scale: layerScale }}
              className="absolute inset-0 flex items-center justify-center will-change-transform"
            >
              <motion.img
                src={src}
                alt={`Photo ${i + 1}`}
                className="w-[60vw] h-[80vh] object-cover rounded-3xl shadow-2xl"
                draggable={false}
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
