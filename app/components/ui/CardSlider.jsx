"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const cards = [
  {
    id: 1,
    title: "Dine-In Redefined: Streamlining Experiences For Brewpub Patrons",
    image: "/uploads/img/1.png",
  },
  {
    id: 2,
    title: "Dine-In Redefined: Streamlining Experiences For Brewpub Patrons",
    image: "/uploads/img/2.png",
  },
  {
    id: 3,
    title: "Dine-In Redefined: Streamlining Experiences For Brewpub Patrons",
    image: "/uploads/img/3.png",
  },
];

export default function CardSlider() {
  const [bloom, setBloom] = useState(false);
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const detect = () => setIsMobile(window.innerWidth < 768);
    detect();
    window.addEventListener("resize", detect);
    return () => window.removeEventListener("resize", detect);
  }, []);

  const handleContainerComplete = () => {
    setTimeout(() => setBloom(true), 800);
  };

  const handleDragEnd = (event, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    const threshold = 80;

    if (offset < -threshold || velocity < -300)
      setCurrent((c) => Math.min(c + 1, cards.length - 1));
    else if (offset > threshold || velocity > 300)
      setCurrent((c) => Math.max(c - 1, 0));
  };

  return (
    <section className="relative w-full py-10 bg-white flex flex-col items-center">
      <motion.div
        className="relative flex h-[330px] w-full max-w-[900px] items-center justify-center"
        initial={{ y: 150, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        onAnimationComplete={handleContainerComplete}
      >
        {cards.map((card, index) => {
          const isActive = index === current;

          const cardWidth = 310;
          const cardHeight = 250;
          const slideWidth = 350;

          let xOffset = 0;
          if (bloom) {
            if (isMobile) {
              const activeOffset = slideWidth * current;
              xOffset = index * slideWidth - activeOffset;
            } else {
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
              // 🔥 NEW: Hover activates card (desktop only)
              onHoverStart={() => {
                if (!isMobile) setCurrent(index);
              }}
              // Tap still works on mobile
              onTap={() => isMobile && setCurrent(index)}
              className="absolute flex flex-col items-center cursor-pointer"
              initial={{ x: 0, rotate: (index - 1) * 3, opacity: 0 }}
              animate={{
                x: xOffset,
                rotate: bloom ? 0 : (index - 1) * 3,
                opacity: 1,
                scale: isActive ? 1 : 0.95,
                zIndex: isActive ? 40 : 20,
              }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 20,
              }}
            >
              <div
                className="rounded-2xl bg-white shadow-xl overflow-hidden"
                style={{ width: cardWidth, height: cardHeight }}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {bloom && (
                <motion.p
                  className="mt-4 w-[260px] text-center font-medium leading-tight text-[15px]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: isActive ? 1 : 0.4, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {card.title}
                </motion.p>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
