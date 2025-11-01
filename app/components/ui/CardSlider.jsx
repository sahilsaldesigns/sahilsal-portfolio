"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const cards = [
  { id: 1, title: "Card 1" },
  { id: 2, title: "Card 2" },
  { id: 3, title: "Card 3" },
];

export default function CardSlider() {
  const [bloom, setBloom] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  const [current, setCurrent] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size dynamically
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // below md breakpoint
    };
    handleResize(); // run initially
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleContainerComplete = () => {
    setTimeout(() => {
      setBloom(true);
      setTimeout(() => setShowArrows(true), 600);
    }, 1500);
  };

  const handleNext = () =>
    current < cards.length - 1 && setCurrent((c) => c + 1);
  const handlePrev = () => current > 0 && setCurrent((c) => c - 1);

  // For swipe gestures
  const handleDragEnd = (event, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    const swipeThreshold = 80; // min distance to trigger swipe

    if (offset < -swipeThreshold || velocity < -300) {
      handleNext();
    } else if (offset > swipeThreshold || velocity > 300) {
      handlePrev();
    } else {
      // snap back to current (framer will animate the x since animate prop uses current)
    }
  };

  return (
    <section className="relative flex h-[480px] w-full items-center justify-center overflow-hidden bg-slate-50">
      <motion.div
        className="relative flex h-[320px] w-[760px] items-center justify-center"
        initial={{ y: 220, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        onAnimationComplete={handleContainerComplete}
      >
        {cards.map((card, index) => {
          const stackTop = 0;
          const stackRotate = (index - 1) * 4;
          const spreadX = bloom ? (index - 1) * 260 : 0;
          const targetRotate = bloom ? 0 : stackRotate;

          // For mobile: slide horizontally instead of spread (only after bloom)
          const mobileOffset = bloom ? (index - current) * 260 : 0;

          const isActive = index === current;

          return (
            <motion.div
              key={card.id}
              // Only allow drag on the active card to avoid conflicting drag transforms
              drag={isMobile && isActive ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0}
              dragMomentum={false}
              onDragEnd={isMobile && isActive ? handleDragEnd : undefined}
              // allow tapping any card to focus it
              onTap={() => {
                if (!isActive) setCurrent(index);
              }}
              initial={{ x: 0, y: 0, rotate: stackRotate, opacity: 0 }}
              animate={{
                x: isMobile ? mobileOffset : spreadX,
                rotate: targetRotate,
                opacity: 1,
              }}
              transition={{
                duration: 0.8,
                delay: 0,
                ease: "easeOut",
              }}
              className={`absolute flex h-[300px] w-[220px] items-center justify-center rounded-2xl bg-white shadow-2xl ${
                isActive ? "z-40" : "z-20"
              }`}
              style={{ top: stackTop }}
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

      {/* Show arrows only if slider is active (mobile) */}
      {showArrows && isMobile && (
        <>
          <button
            onClick={handlePrev}
            disabled={current === 0}
            className={`absolute left-4 z-30 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-opacity ${
              current === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
          >
            <ChevronLeft />
          </button>
          <button
            onClick={handleNext}
            disabled={current === cards.length - 1}
            className={`absolute right-4 z-30 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-opacity ${
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
