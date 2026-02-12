"use client";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

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

const CardContent = ({ card , cardWidth, cardHeight, isActive, bloom }) => (
  <div
    className="rounded-3xl overflow-hidden relative border border-transparent hover:border-[#FBE2AC] hover:shadow-[0px_10px_60px_0px_#FAE1AB4F]  transition-[border-color,box-shadow] duration-300 ease-in-out"
    style={{ width: cardWidth, height: cardHeight }}
  >
    <div 
      className={`w-full h-full rounded-2xl overflow-hidden bg-white shadow-inner flex flex-col relative ${card.comingSoon ? 'blur-sm' : 'p-6'}`}
      
    >
      <div className="flex-1 overflow-hidden relative border border-gray-200 rounded-xl">
        <Image
          src={card.image}
          alt={card.title}
          width={400}
          height={300}
          className="w-full h-full object-cover"
        />
      </div>
      
      <motion.div
        className={`bg-white ${card.comingSoon ? '' : 'px-4 py-4'} `}
        initial={{ opacity: 0 }}
        animate={{
          opacity: bloom ? (isActive ? 1 : 0.4) : 0,
        }}
        transition={{
          duration: 0.6,
          delay: bloom ? 0.3 : 0,
        }}
      >
        <p className="text-center font-medium leading-tight text-[14px] text-gray-800">
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
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut",
              repeatDelay: 1,
            }}
          />
          
          <span className="relative z-10 text-white --font-lustria tracking-wider">
            COMING SOON
          </span>
        </div>
      </div>
    )}
  </div>
);

export default function CardSlider(props) {
  const [bloom, setBloom] = useState(false);
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);
  const cards = props && props.cards ? props.cards : defaultCards;

  useEffect(() => {
    const detect = () => setIsMobile(window.innerWidth < 768);
    detect();
    window.addEventListener("resize", detect);
    return () => window.removeEventListener("resize", detect);
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

    return () => observer.disconnect();
  }, []);

  const handleContainerComplete = () => {
    setTimeout(() => setBloom(true), 1200);
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
    <section ref={sectionRef} className="relative w-full h-[608px] flex  justify-center overflow-hidden bg-white">
      <Image
        src="/uploads/img/card-slider-bg.png"
        alt="Card slider background"
        width={1920}
        height={608}
        className="absolute inset-0 w-full h-full z-1"
      />

      {/* Content Layer */}
      <motion.div
        className="relative flex h-[400px] w-full max-w-[1200px] items-center justify-center z-2 mt-15"
        initial={{ y: 150, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: 150, opacity: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        onAnimationComplete={isInView ? handleContainerComplete : undefined}
      >
        {(props && props.cards ? props.cards : defaultCards).map((card, index) => {
          const isActive = index === current;

          const cardWidth = 300;
          const cardHeight = 300;
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

          const cardElement = (
            <CardContent 
              card={card} 
              cardWidth={cardWidth} 
              cardHeight={cardHeight}
              isActive={isActive}
              bloom={bloom}
            />
          );

          return (
            <motion.div
              key={card.id || index}
              drag={isMobile && isActive ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0}
              dragMomentum={false}
              onDragEnd={isMobile && isActive ? handleDragEnd : undefined}
              onHoverStart={() => !isMobile && setCurrent(index)}
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
                stiffness: 80,
                damping: 20,
              }}
            >
              {card.caseStudySlug && !card.comingSoon ? (
                <Link href={`/case-studies/${card.caseStudySlug}`}>
                  {cardElement}
                </Link>
              ) : (
                cardElement
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}