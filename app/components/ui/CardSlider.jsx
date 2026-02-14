"use client";
import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const defaultCards = [
  {
    id: 1,
    title: "Designing wait-time visibility experience for busy brewpubs",
    image: "/uploads/img/1.png",
    caseStudySlug: "designing-wait-time-visibility-for-busy-brewpubs",
    comingSoon: false,
  },
  {
    id: 2,
    title: "Workly – AI that runs your work in the background",
    image: "/uploads/img/2.png",
    comingSoon: true,
  },
  {
    id: 3,
    title: "Management app for owners of homes & hostels",
    image: "/uploads/img/3.png",
    comingSoon: true,
  },
];

const CardContent = ({ card, cardWidth, cardHeight, isActive, bloom }) => (
  <div
    className="rounded-3xl overflow-hidden relative border border-transparent hover:border-[#FBE2AC] hover:shadow-[0px_10px_60px_0px_#FAE1AB4F] transition-[border-color,box-shadow] duration-300 ease-in-out"
    style={{ width: cardWidth, height: cardHeight }}
  >
    <div
      className={`w-full h-full rounded-2xl overflow-hidden bg-white shadow-inner flex flex-col relative ${
        card.comingSoon ? "blur-sm" : "p-6 sm:p-4"
      }`}
    >
      <div className="flex-1 overflow-hidden relative border border-gray-200 rounded-xl">
        <Image
          src={card.image}
          alt={card.title}
          width={322}
          height={230}
          className="w-full h-full object-cover"
        />
      </div>

      <motion.div
        className={`bg-white ${card.comingSoon ? "" : "px-4 py-4 sm:px-3 sm:py-3"} `}
        initial={{ opacity: 0 }}
        animate={{
          opacity: bloom ? (isActive ? 1 : 0.4) : 0,
        }}
        transition={{
          duration: 0.6,
          delay: bloom ? 0.3 : 0,
        }}
      >
        <p className="text-center font-medium leading-tight text-[14px] sm:text-[12px] text-gray-800">
          {card.title}
        </p>
      </motion.div>
    </div>

    {/* Coming Soon Overlay - Outside blurred content */}
    {card.comingSoon && (
      <div className="w-full h-full absolute top-0 left-0 inset-6 rounded-2xl bg-black/50 flex items-center justify-center overflow-hidden">
        {/* Coming Soon Text with Glare */}
        <div className="relative w-full bg-black/80 px-8 py-3 overflow-hidden">
          {/* Animated Glare Effect on band only */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut",
              repeatDelay: 1,
            }}
          />

          <span className="relative z-10 text-white font-lustria tracking-wider">
            COMING SOON
          </span>
        </div>
      </div>
    )}
  </div>
);

export default function CardSlider(props) {
  const router = useRouter();
  const [bloom, setBloom] = useState(false);
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const lastClickTime = useRef(0);
  const sectionRef = useRef(null);
  const animationTimeoutRef = useRef(null);
  const bloomTimeoutRef = useRef(null);
  const cards = props && props.cards ? props.cards : defaultCards;
  const mobileThreshold = 1020;

  useEffect(() => {
    const detect = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setIsMobile(width < mobileThreshold);
    };
    detect();
    window.addEventListener("resize", detect);
    return () => {
      window.removeEventListener("resize", detect);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.8 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      if (bloomTimeoutRef.current) {
        clearTimeout(bloomTimeoutRef.current);
      }
    };
  }, []);

  const handleContainerComplete = useCallback(() => {
    bloomTimeoutRef.current = setTimeout(() => setBloom(true), 1200);
  }, []);

  const handleDragStart = useCallback((event, info) => {
    setIsDragging(true);
    setDragStartX(info.point.x);
  }, []);

  const handleDragEnd = useCallback((event, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    const threshold = 80;
    const dragDistance = Math.abs(info.point.x - dragStartX);

    // If drag distance is very small (< 10px), treat as tap/click
    if (dragDistance < 10) {
      setIsDragging(false);
      return;
    }

    setIsAnimating(true);

    if (offset < -threshold || velocity < -300) {
      setCurrent((c) => Math.min(c + 1, cards.length - 1));
    } else if (offset > threshold || velocity > 300) {
      setCurrent((c) => Math.max(c - 1, 0));
    }

    // Clear any existing timeout before setting new one
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    // Small delay to prevent click event from firing and release animation lock
    animationTimeoutRef.current = setTimeout(() => {
      setIsDragging(false);
      setIsAnimating(false);
    }, 400);
  }, [dragStartX, cards.length]);

  const handleCardClick = useCallback((card, index) => {
    // Prevent navigation if we were dragging
    if (isDragging) {
      return;
    }

    // Prevent rapid clicks / double clicks (debounce)
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTime.current;
    
    // If clicked too fast (within 300ms), ignore
    if (timeSinceLastClick < 300) {
      return;
    }
    
    lastClickTime.current = now;

    if (isMobile) {
      // On mobile, only allow clicks on the active card
      if (index !== current) {
        // Clicking non-active cards does nothing
        return;
      }
      
      // If already active and has link (not coming soon), navigate
      if (card.caseStudySlug && !card.comingSoon) {
        router.push(`/case-studies/${card.caseStudySlug}`);
      }
      // If coming soon, do nothing (no navigation attempt)
    } else {
      // Desktop behavior - navigate immediately if has link
      if (card.caseStudySlug && !card.comingSoon) {
        router.push(`/case-studies/${card.caseStudySlug}`);
      }
    }
  }, [isDragging, isMobile, current, router]);

  const handleDotClick = useCallback((index) => {
    if (!isAnimating && index !== current) {
      setIsAnimating(true);
      setCurrent(index);
      
      // Clear any existing timeout before setting new one
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      
      animationTimeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
      }, 400);
    }
  }, [isAnimating, current]);

  // Get responsive card dimensions
  const getCardDimensions = useCallback(() => {
    if (windowWidth >= 1170) {
      // Desktop - Original dimensions
      return {
        cardWidth: 370,
        cardHeight: 365,
        slideWidth: 380,
      };
    } else if (windowWidth >= mobileThreshold) {
      // Tablet - Medium dimensions
      return {
        cardWidth: 333,
        cardHeight: 325,
        slideWidth: 345,
      };
    } else if (windowWidth >= 365) {
      // Mobile - Standard dimensions
      return {
        cardWidth: 343,
        cardHeight: 327,
        slideWidth: 360,
      };
    } else {
      // Small Mobile (<365px) - Compact dimensions
      return {
        cardWidth: 280,
        cardHeight: 275,
        slideWidth: 300,
      };
    }
  }, [windowWidth]);

  const { cardWidth, cardHeight, slideWidth } = getCardDimensions();

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[608px] md:h-[608px] sm:h-[608px] flex justify-center overflow-hidden bg-white"
    >
      <Image
        src="/uploads/img/card-slider-bg.png"
        alt="Card slider background"
        width={1920}
        height={608}
        className="absolute inset-0 w-full h-full z-1 object-cover"
      />

      {/* Content Layer */}
      <motion.div
        className="relative flex h-[400px] md:h-[400px] sm:h-[320px] w-full max-w-[1200px] items-center justify-center z-2 mt-15 px-4"
        initial={{ y: 150, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: 150, opacity: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        onAnimationComplete={isInView ? handleContainerComplete : undefined}
      >
        {cards.map((card, index) => {
          const isActive = index === current;

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
              key={card.id || index}
              drag={isMobile && isActive ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              dragMomentum={false}
              onDragStart={isMobile && isActive ? handleDragStart : undefined}
              onDragEnd={isMobile && isActive ? handleDragEnd : undefined}
              onHoverStart={() => !isMobile && setCurrent(index)}
              onClick={() => handleCardClick(card, index)}
              className="absolute flex flex-col items-center cursor-pointer"
              style={{ touchAction: isMobile && isActive ? "pan-y" : "auto" }}
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
                stiffness: 80,
                damping: 20,
              }}
            >
              <CardContent
                card={card}
                cardWidth={cardWidth}
                cardHeight={cardHeight}
                isActive={isActive}
                bloom={bloom}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Mobile Pagination Dots */}
      {isMobile && bloom && (
        <div className="absolute bottom-42 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === current
                  ? "bg-[#FBE2AC] w-6"
                  : "bg-gray-400/50 w-2 hover:bg-gray-400"
              }`}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}