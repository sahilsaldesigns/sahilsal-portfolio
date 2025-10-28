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
  const [current, setCurrent] = useState(1); // middle card active

  // Called when container rise animation completes
  const handleContainerComplete = () => {
    // start spreading cards
    setBloom(true);
    // show arrows slightly after bloom begins
    setTimeout(() => setShowArrows(true), 600);
  };

  const handleNext = () => current < cards.length - 1 && setCurrent(current + 1);
  const handlePrev = () => current > 0 && setCurrent(current - 1);

  return (
    <section className="relative flex h-[480px] w-full items-center justify-center overflow-hidden bg-slate-50">
      {/* Animated container: moves up as a single deck */}
      <motion.div
        className="relative flex h-[320px] w-[760px] items-center justify-center"
        initial={{ y: 220, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
        onAnimationComplete={handleContainerComplete}
      >
        {cards.map((card, index) => {
          const isActive = index === current;

          // stacking offsets for the deck look (applies while bloom === false)
          const stackTop = -index * 10; // vertical offset so cards peek from behind
          const stackRotate = (index - 1) * 2.5; // slight tilt differences

          // target spread positions (when bloom === true)
          const spreadX = bloom ? (index - 1) * 260 : 0; // left:-260, center:0, right:260
          const spreadRotate = bloom ? (index === 0 ? -10 : index === 2 ? 10 : 0) : stackRotate;

          return (
            <motion.div
              key={card.id}
              // each card starts visually stacked (top + small rotate)
              initial={{ x: 0, y: 0, rotate: stackRotate, opacity: 0, scale: 0.96 }}
              // animate either to spread or remain stacked (toggled by `bloom`)
              animate={{
                x: spreadX,
                rotate: spreadRotate,
                opacity: 1,
                scale: isActive ? 1 : 0.96,
              }}
              transition={{
                // when bloom, stagger each card slightly
                duration: bloom ? 0.8 : 0.6,
                delay: bloom ? index * 0.12 : 0.05 * index,
                ease: [0.3, 0.7, 0.2, 1],
              }}
              className={`absolute flex h-[300px] w-[220px] items-center justify-center rounded-2xl bg-white shadow-2xl transition-all ${
                isActive ? "z-30" : "z-20"
              }`}
              // keep the initial stacked vertical offset visually
              style={{ top: stackTop }}
            >
              <div className="w-full h-full p-4 flex flex-col">
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

      {/* arrows appear after bloom */}
      {showArrows && (
        <>
          <button
            onClick={handlePrev}
            disabled={current === 0}
            className={`absolute left-8 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-opacity ${
              current === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
          >
            <ChevronLeft />
          </button>

          <button
            onClick={handleNext}
            disabled={current === cards.length - 1}
            className={`absolute right-8 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-opacity ${
              current === cards.length - 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
          >
            <ChevronRight />
          </button>
        </>
      )}
    </section>
  );
}
