"use client";
import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useIntro } from "../../providers/IntroProvider";

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
    title: "AI that runs your work in the background",
    image: "/uploads/img/2.jpg",
    comingSoon: true,
  },
  {
    id: 3,
    title: "Management app for owners of homes & hostels",
    image: "/uploads/img/3.png",
    comingSoon: true,
  },
];

const CardContent = ({ card, cardWidth, cardHeight, isActive, bloom }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!card.comingSoon || !cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate position relative to card center
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Parallax offset - INVERTED (button moves away from cursor)
    const offsetX = -((x - centerX) / centerX) * 20;
    const offsetY = -((y - centerY) / centerY) * 20;
    
    setMousePosition({ x: offsetX, y: offsetY });
  };

  const handleMouseEnter = () => {
    if (card.comingSoon) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      className="rounded-4xl overflow-hidden relative border border-transparent hover:border-[#FBE2AC] hover:shadow-[0px_10px_60px_0px_#FAE1AB4F] transition-[border-color,box-shadow] duration-300 ease-in-out"
      style={{ width: cardWidth, height: cardHeight }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-full h-full rounded-4xl overflow-hidden bg-white shadow-inner flex flex-col relative p-6 sm:p-4 md:p-6">
        <div className="flex-1 overflow-hidden relative border border-gray-200 rounded-xl">
          <Image
            src={card.image}
            alt={card.title}
            width={322}
            height={230}
            draggable={false}
            className="w-full h-full object-cover pointer-events-none select-none"
          />
        </div>

        <motion.div
          className="bg-white  pt-4  sm:pt-3 md:pt-6"
          initial={{ opacity: 0 }}
          animate={{
            opacity: bloom ? (isActive ? 1 : 0.4) : 0,
          }}
          transition={{
            duration: 0.6,
            delay: bloom ? 0.3 : 0,
          }}
        >
          <p className="text-center leading-6.5 md:leading-8 md:*:text-[20px]!  text-[16px]!  text-black! tracking-[-2%] font-[family-name:var(--font-lustria)]">
            {card.title}
          </p>
        </motion.div>
      </div>

      {/* Coming Soon Hover Overlay with Parallax Button */}
      {card.comingSoon && (
        <motion.div
          className="absolute inset-0 rounded-3xl flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop Blur */}
          <div className="absolute inset-0 backdrop-blur-md bg-black/30 rounded-3xl transition-all" />
          
          {/* Parallax Button */}
          <motion.div
            className="relative z-10 bg-black px-3 py-3 rounded-2xl shadow-lg"
            animate={{
              x: mousePosition.x,
              y: mousePosition.y,
            }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 15,
              mass: 0.1,
            }}
          >
            <span className="text-white font-normal tracking-[-2%] text-base font-(family-name:--font-lustria)">
              COMING SOON
            </span>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default function CardSlider(props) {
  const router = useRouter();
  const { phase } = useIntro();
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
  const inViewTimeoutRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const cards = props && props.cards ? props.cards : defaultCards;
  const mobileThreshold = 1060;

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
    // Don't observe until content phase is ready
    if (phase !== 'lines') return;

    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Small delay so HomeBgLines animation starts first
          inViewTimeoutRef.current = setTimeout(() => setIsInView(true), 400);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [phase]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      clearTimeout(animationTimeoutRef.current);
      clearTimeout(bloomTimeoutRef.current);
      clearTimeout(inViewTimeoutRef.current);
    };
  }, []);

  const handleContainerComplete = useCallback(() => {
    bloomTimeoutRef.current = setTimeout(() => setBloom(true), 1200);
  }, []);

  const handleDragStart = useCallback((event, info) => {
    if (isAnimatingRef.current) return;
    event.preventDefault?.();
    setIsDragging(true);
    setDragStartX(info.point.x);
  }, []);

  const handleDragEnd = useCallback((event, info) => {
    if (isAnimatingRef.current) return;

    const offset = info.offset.x;
    const velocity = info.velocity.x;
    const threshold = 80;
    const dragDistance = Math.abs(info.point.x - dragStartX);

    // If drag distance is very small (< 10px), treat as tap/click
    if (dragDistance < 10) {
      setIsDragging(false);
      return;
    }

    isAnimatingRef.current = true;
    setIsAnimating(true);

    if (offset < -threshold || velocity < -300) {
      setCurrent((c) => Math.min(c + 1, cards.length - 1));
    } else if (offset > threshold || velocity > 300) {
      setCurrent((c) => Math.max(c - 1, 0));
    }

    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    animationTimeoutRef.current = setTimeout(() => {
      isAnimatingRef.current = false;
      setIsDragging(false);
      setIsAnimating(false);
    }, 700);
  }, [dragStartX, cards.length]);

  const handleCardClick = useCallback((card, index) => {
    // Prevent interaction while dragging or slide animation is in progress
    if (isDragging || isAnimating) {
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
  }, [isDragging, isAnimating, isMobile, current, router]);

  const handleDotClick = useCallback((index) => {
    if (!isAnimatingRef.current && index !== current) {
      isAnimatingRef.current = true;
      setIsAnimating(true);
      setCurrent(index);

      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }

      animationTimeoutRef.current = setTimeout(() => {
        isAnimatingRef.current = false;
        setIsAnimating(false);
      }, 700);
    }
  }, [current]);

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
      className="relative w-auto h-[580px] md:h-[608px] sm:h-[580px] [@media(max-width:364px)]:h-[480px] flex justify-center overflow-hidden bg-white -mx-4"
    >
      <Image
        src="/uploads/img/card-slider-bg-mob.svg"
        alt="Card slider background"
        width={500}
        height={608}
        sizes="(max-width: 429px) 100vw, 0px"
        className="absolute inset-0 w-full h-full z-1 object-cover [@media(min-width:365px)]:hidden"
      />
      <Image
        src="/uploads/img/card-slider-bg.png"
        alt="Card slider background"
        width={1920}
        height={608}
        sizes="(max-width: 429px) 0px, 100vw"
        className="absolute inset-0 w-full h-full z-1 object-cover hidden [@media(min-width:365px)]:block [@media(min-width:1330px)]:object-fill"
      />

      {/* Content Layer */}
      <motion.div
        className="relative flex h-[400px] md:h-[400px] [@media(max-width:364px)]:h-[315px] w-full max-w-[1200px] items-center justify-center z-2 md:mt-15 mt-7 px-4"
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
              drag={isMobile && isActive && !isAnimating ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              dragMomentum={false}
              onDragStart={isMobile && isActive ? handleDragStart : undefined}
              onDragEnd={isMobile && isActive ? handleDragEnd : undefined}
              onHoverStart={() => !isMobile && setCurrent(index)}
              onClick={() => handleCardClick(card, index)}
              className="absolute flex flex-col items-center cursor-pointer select-none"
              style={{ touchAction: isMobile && isActive ? "pan-y" : "auto" }}
              initial={{ x: 0, rotate: (index - 1) * 3, opacity: 0 }}
              animate={{
                x: xOffset,
                rotate: bloom ? 0 : (index - 1) * 3,
                opacity: 1,
                scale: isMobile ? 1 : (isActive ? 1 : 0.95),
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
        <div className="absolute bottom-[120px] min-[365px]:bottom-[140px] left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
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