"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";

gsap.registerPlugin(ScrollTrigger);

// Wrapper — sets dimensions, clips the fill image
const WRAP_CLASS = `
  relative overflow-hidden
  w-[82vw] h-[109vw] max-h-[72vh]
  md:w-[42vw] md:h-[56vw] md:max-h-[78vh]
  lg:w-[36vw] lg:h-[48vw] lg:max-h-[none]
  xl:w-[30vw] xl:h-[40vw]
  2xl:w-[26vw] 2xl:h-[35vw]
  rounded-xl md:rounded-[30px]
  shadow-[0_4px_20px_rgba(0,0,0,0.12)]
`;

export default function ScrollStackGallery({ images }) {
  const sectionRef        = useRef(null);
  const cardRefs          = useRef([]);
  const initialHeadingRef = useRef(null);
  const arrowsRef         = useRef(null);
  const fixedHeadingRef   = useRef(null);
  const ctaRef            = useRef(null);

  const n             = images.length;
  const sectionHeight = `${(n + 1) * 100}vh`;

  const [imagesReady, setImagesReady] = useState(false);

  // Keep Lenis and ScrollTrigger on the same RAF tick
  useLenis(ScrollTrigger.update);

  useEffect(() => {
    document.body.classList.add("photo-page-active");
    return () => document.body.classList.remove("photo-page-active");
  }, []);

  // Next Image handles decoding/optimisation — trigger ready on mount
  useEffect(() => {
    setImagesReady(true);
  }, []);

  useEffect(() => {
    if (!imagesReady) return;
    const section = sectionRef.current;
    if (!section) return;

    const cards = cardRefs.current.filter(Boolean);

    gsap.set(cards,                    { y: "100%", opacity: 0, scale: 1, force3D: true });
    gsap.set(fixedHeadingRef.current,  { opacity: 0, y: -10 });
    gsap.set(ctaRef.current,           { opacity: 0, y: 20 });

    const firstMid  = 0.5 / n;
    const lastStart = (n - 1) / n;
    const lastMid   = lastStart + 0.5 / n;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
    tl.set({}, {}, 1);

    tl.to(initialHeadingRef.current, { opacity: 0, y: "-40%", duration: 0.05, ease: "none" }, 0);
    tl.to(arrowsRef.current,         { opacity: 0,            duration: 0.05, ease: "none" }, 0);
    tl.to(fixedHeadingRef.current,   { opacity: 1, y: 0,      duration: 0.04, ease: "none" }, firstMid);
    tl.to(fixedHeadingRef.current,   { opacity: 0,            duration: 0.04, ease: "none" }, lastStart);
    tl.to(ctaRef.current,            { opacity: 1, y: 0,      duration: 0.04, ease: "none" }, lastMid);

    cards.forEach((card, i) => {
      const segStart = i / n;
      const segMid   = segStart + 0.5 / n;
      const segEnd   = (i + 1) / n;

      tl.to(card, { y: "0%",    duration: segEnd - segStart, ease: "none" }, segStart);
      tl.to(card, { opacity: 1, duration: (segMid - segStart) * 0.5, ease: "none" }, segStart);

    });

    return () => { tl.kill(); };
  }, [images, n, imagesReady]);

  return (
    <>

      <h1
        ref={fixedHeadingRef}
        aria-hidden="true"
        className="fixed top-10 left-1/2 -translate-x-1/2 z-30 text-center text-lg md:text-2xl lg:text-3xl pointer-events-none"
      >
        {"Photograph's & Memories"}
      </h1>

      <section ref={sectionRef} style={{ height: sectionHeight }} className="relative">
        <h1
          ref={initialHeadingRef}
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[999] text-center text-[24px] md:text-[44px] pointer-events-none"
        >
          {"Photograph's & Memories"}
        </h1>

        <div ref={arrowsRef} className="fixed left-1/2 top-[60%] -translate-x-1/2 z-[999] pointer-events-none">
          <div className="relative w-4 h-[54px]">
            {[0, 0.533, 1.067].map((delay) => (
              <div key={delay} className="absolute left-0 top-0 photo-scroll-arrow" style={{ animationDelay: `${delay}s` }}>
                <svg aria-hidden="true" focusable="false" width="16" height="10" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.75 0.75L5.75 5.75L10.75 0.75" stroke="#111011" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            ))}
          </div>
        </div>

        <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center" style={{ visibility: imagesReady ? 'visible' : 'hidden' }}>
          {images.map((src, i) => (
            <div
              key={src}
              ref={el => { cardRefs.current[i] = el; }}
              className="absolute inset-0 flex items-center justify-center will-change-transform z-10"
            >
              <div className={WRAP_CLASS}>
                <Image
                  src={src}
                  alt={`Photo ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 82vw, (max-width: 1024px) 42vw, (max-width: 1280px) 36vw, 30vw"
                  className="object-cover"
                  draggable={false}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div ref={ctaRef} className="flex flex-col items-center justify-center text-center pt-16 pb-6 px-4">
        <p className="text-[18px] leading-[30px] md:text-base md:leading-normal text-[#757575] mb-6 max-w-md">
          {"Spotted something you liked? Let's take it to the 'gram"}
        </p>
        <a
          href="https://www.instagram.com/saahil.sal/?hl=en"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit saahil.sal on Instagram (opens in new tab)"
          className="group relative flex items-center gap-3 px-6 py-3 rounded-full bg-black text-white border border-black shadow-sm overflow-hidden cursor-pointer transition-all duration-[400ms] ease-in-out hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black"
        >
          <span
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%)",
              backgroundSize: "200% 100%",
              backgroundPositionX: "200%",
              animation: "glare 4s linear infinite",
            }}
          />
          <span className="relative w-6 h-6">
            <Image src="/uploads/img/instagram-logo.svg" width={24} height={24} alt="Instagram Logo"
              className="absolute inset-0 transition-opacity duration-300 opacity-100 group-hover:opacity-0" />
            <Image src="/uploads/img/instagram-logo-hover.svg" width={24} height={24} alt="" aria-hidden="true"
              className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
          </span>
          saahil.sal
        </a>
        <style>{`
          @keyframes glare {
            0%    { background-position-x: 150%; animation-timing-function: ease-in-out; }
            40%   { background-position-x: -50%; }
            99.9% { background-position-x: -50%; }
            100%  { background-position-x: 150%; }
          }
        `}</style>
        <hr className="w-full max-w-[962px] mx-auto mt-12" style={{ borderColor: "#D8D8D8" }}/>
      </div>
    </>
  );
}
