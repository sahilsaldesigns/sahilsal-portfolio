"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const cards = [
  { id: 1, title: "Dine-in redefined: Streamlining experiences for brewpub patrons" },
  { id: 2, title: "Dine-in redefined: Streamlining experiences for brewpub patrons" },
  { id: 3, title: "Dine-in redefined: Streamlining experiences for brewpub patrons" },
];

export default function CardSlider() {
  const [bloom, setBloom] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // 📱 Mobile detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🌼 Bloom animation trigger
  const handleContainerComplete = () => {
    setTimeout(() => {
      setBloom(true);
      setTimeout(() => setShowArrows(true), 500);
    }, 1200);
  };

  // Navigation
  const handleNext = () => setCurrent((c) => Math.min(c + 1, cards.length - 1));
  const handlePrev = () => setCurrent((c) => Math.max(c - 1, 0));

  // Swipe handling
  const handleDragEnd = (event, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    const swipeThreshold = 80;

    if (offset < -swipeThreshold || velocity < -300) handleNext();
    else if (offset > swipeThreshold || velocity > 300) handlePrev();
  };

  return (
    <section className="relative flex h-[480px] w-full items-center justify-center overflow-hidden bg-white">
      <img
        src="/uploads/img/card-slider-bg.png"
        alt="Card slider background"
        className="absolute inset-0 w-full h-full z-1"
      />

      <motion.div
        className="relative flex h-80 w-[760px] items-center justify-center z-2"
        initial={{ y: 220, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        onAnimationComplete={handleContainerComplete}
      >
        {cards.map((card, index) => {
          const isActive = index === current;

          // 🌟 FINAL FIX — REAL CARD WIDTH + SPACING
          const slideWidth = 390; // 370px card + spacing

          // original stacked slight rotation
          const stackRotate = (index - 1) * 4;
          const targetRotate = bloom ? 0 : stackRotate;

          // Positioning logic
          let xOffset = 0;

          if (bloom) {
            if (isMobile) {
              // mobile center active card
              const activeOffset = slideWidth * current;
              xOffset = index * slideWidth - activeOffset;
            } else {
              // desktop spread
              xOffset = (index - 1) * slideWidth;
            }
          }

          return (
            <motion.div
              key={card.id}
              drag={isMobile && isActive ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0}
              dragMomentum={false}
              onDragEnd={isMobile && isActive ? handleDragEnd : undefined}
              onTap={() => !isActive && setCurrent(index)}
              initial={{ x: 0, rotate: stackRotate, opacity: 0 }}
              animate={{
                x: xOffset,
                rotate: targetRotate,
                opacity: 1,
                scale: isActive ? 1 : 0.95,
                zIndex: isActive ? 40 : 20,
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 18,
                mass: 1,
              }}
              className="absolute h-[366px] w-[370px] flex items-center justify-center rounded-2xl bg-white shadow-xl cursor-grab active:cursor-grabbing"
            >
              <div className="w-full h-full p-4 flex flex-col select-none">
                <div className="h-[120px] w-full bg-gray-200 mb-4 rounded-md flex items-center justify-center text-gray-500">
                  500 × 200
                </div>
                <h3 className="font-semibold mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600">
                  Sample description for {card.title}.
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Mobile arrows (disabled right now as per original code) */}
      {false && isMobile && (
        <>
          <button
            onClick={handlePrev}
            disabled={current === 0}
            className={`absolute left-4 z-30 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition ${
              current === 0
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            <ChevronLeft />
          </button>
          <button
            onClick={handleNext}
            disabled={current === cards.length - 1}
            className={`absolute right-4 z-30 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition ${
              current === cards.length - 1
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            <ChevronRight />
          </button>
        </>
      )}
    </section>
  );
}
