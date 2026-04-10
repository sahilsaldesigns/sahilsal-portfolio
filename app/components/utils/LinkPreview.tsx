"use client";

import React, { useRef, useState, useEffect } from "react";
import MediumIcon from "../icons/Medium";

interface LinkData {
  title: string;
  image?: string;
  iconNode?: React.ReactNode;
}

// Hardcoded mapping keyed by LinkedIn profile slug
const LINK_DATA_MAP: Record<string, LinkData> = {
  shailendrasalekar: {
    title: "Associate Director- Visual Design @Titan",
    image: "/uploads/img/shailendra-salekar.png",
  },
  akshaysalekar17: {
    title: "Founder @Magnetize Studio",
    image: "/uploads/img/akshay-salekar.png",
  },
};

function getLinkData(href: string): LinkData | null {
  // LinkedIn
  const linkedInMatch = href.match(/linkedin\.com\/in\/([^/?#]+)/);
  if (linkedInMatch) {
    const slug = linkedInMatch[1].replace(/\/$/, "");
    return LINK_DATA_MAP[slug] ?? null;
  }
  // Medium
  if (/medium\.com/.test(href)) {
    return {
      title: "",
      iconNode: <MediumIcon className="w-5 h-4 shrink-0" />,
    };
  }
  return null;
}

const CARD_MAX_WIDTH = 350;

interface LinkPreviewProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function LinkPreview({ href, children, className }: LinkPreviewProps) {
  // Desktop hover state
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<"top" | "bottom">("top");
  const [offsetX, setOffsetX] = useState(0);

  // Mobile tap state
  const [tapped, setTapped] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const containerRef = useRef<HTMLSpanElement>(null);
  const hoverCountRef = useRef(0);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const linkData = getLinkData(href);

  // Mobile = touch device AND small screen (≤768px)
  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none) and (max-width: 768px)").matches);
  }, []);

  // Dismiss inline card on outside tap
  useEffect(() => {
    if (!tapped) return;
    const handler = (e: TouchEvent | MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setTapped(false);
      }
    };
    document.addEventListener("touchstart", handler);
    return () => document.removeEventListener("touchstart", handler);
  }, [tapped]);

  // ── Desktop hover handlers ──────────────────────────────────────────────────
  const scheduleHide = () => {
    hideTimerRef.current = setTimeout(() => {
      if (hoverCountRef.current === 0) setVisible(false);
    }, 120);
  };

  const cancelHide = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  };

  const handleAnchorEnter = () => {
    if (isTouch) return;
    hoverCountRef.current++;
    cancelHide();

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPosition(rect.top > 280 ? "top" : "bottom");

      const vw = window.innerWidth;
      const margin = 12;
      const cardWidth = Math.min(CARD_MAX_WIDTH, vw - margin * 2);
      const cardHalf = cardWidth / 2;
      const anchorCentre = rect.left + rect.width / 2;
      let shift = 0;
      if (anchorCentre - cardHalf < margin) shift = margin - (anchorCentre - cardHalf);
      else if (anchorCentre + cardHalf > vw - margin) shift = vw - margin - (anchorCentre + cardHalf);
      setOffsetX(shift);
    }

    setTimeout(() => setVisible(true), 150);
  };

  const handleAnchorLeave = () => {
    if (isTouch) return;
    hoverCountRef.current = Math.max(0, hoverCountRef.current - 1);
    scheduleHide();
  };

  const handleCardEnter = () => {
    hoverCountRef.current++;
    cancelHide();
  };

  const handleCardLeave = () => {
    hoverCountRef.current = Math.max(0, hoverCountRef.current - 1);
    scheduleHide();
  };

  // ── Mobile tap handler ──────────────────────────────────────────────────────
  const handleLinkClick = (e: React.MouseEvent) => {
    if (!isTouch || !linkData) return;
    if (!tapped) {
      e.preventDefault();
      setTapped(true);
    }
    // second tap: let href navigate normally
  };

  useEffect(() => () => { if (hideTimerRef.current) clearTimeout(hideTimerRef.current); }, []);

  return (
    <span ref={containerRef} className="relative inline-block">
      {/* Link text */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={handleAnchorEnter}
        onMouseLeave={handleAnchorLeave}
        onClick={handleLinkClick}
        className={
          className ??
          "relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-current after:transition-[width] after:duration-300 after:ease-in-out hover:after:w-full"
        }
      >
        {children}
      </a>

      {/* ── Desktop hover card ─────────────────────────────────────────────── */}
      {linkData && !isTouch && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={handleCardEnter}
          onMouseLeave={handleCardLeave}
          style={{
            left: `calc(50% + ${offsetX}px)`,
            transform: `translateX(-50%) ${
              visible
                ? "translateY(0) scale(1)"
                : position === "top"
                ? "translateY(6px) scale(0.97)"
                : "translateY(-6px) scale(0.97)"
            }`,
            pointerEvents: visible ? "auto" : "none",
            textDecoration: "none",
            width: "max-content",
            maxWidth: `min(${CARD_MAX_WIDTH}px, calc(100vw - 24px))`,
          }}
          className={`absolute z-[9999] cursor-pointer ${
            position === "top" ? "bottom-full mb-3" : "top-full mt-3"
          } transition-all duration-200 ease-out ${visible ? "opacity-100" : "opacity-0"}`}
        >
          <span className={`relative block${visible ? " link-preview-bounce" : ""}`}>
            <span
              className="flex items-center gap-2 xs:gap-3 px-3 xs:px-4 py-2.5 xs:py-3 rounded-2xl"
              style={{ background: "#141414" }}
            >
              <span className={`flex-shrink-0 w-7 h-7 xs:w-9 xs:h-9 rounded-xl overflow-hidden flex items-center justify-center ${linkData.image ? "bg-neutral-700" : "bg-black"}`}>
                {linkData.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={linkData.image} alt="" className="w-full h-full object-cover" />
                ) : linkData.iconNode}</span>
              {linkData.title && (
                <span className="text-white text-xs xs:text-sm font-medium leading-snug min-w-0 break-words mob:whitespace-nowrap">
                  {linkData.title}
                </span>
              )}
            </span>

            {/* Triangle arrow */}
            <span
              className="absolute w-0 h-0"
              style={{
                left: `calc(50% - ${offsetX}px)`,
                transform: "translateX(-50%)",
                ...(position === "top"
                  ? {
                      bottom: -8,
                      borderLeft: "8px solid transparent",
                      borderRight: "8px solid transparent",
                      borderTop: "8px solid #141414",
                    }
                  : {
                      top: -8,
                      borderLeft: "8px solid transparent",
                      borderRight: "8px solid transparent",
                      borderBottom: "8px solid #141414",
                    }),
              }}
            />
          </span>
        </a>
      )}

      {/* ── Mobile inline tap card ─────────────────────────────────────────── */}
      {linkData && isTouch && (
        <span
          aria-hidden={!tapped}
          style={{
            pointerEvents: tapped ? "auto" : "none",
            transform: tapped ? "translateY(0) scale(1)" : "translateY(-4px) scale(0.97)",
            width: "max-content",
          }}
          className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 transition-all duration-200 ease-out max-w-[225px] mob:max-w-[calc(100vw-24px)] ${
            tapped ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Triangle arrow pointing up to the link */}
          <span
            className="absolute w-0 h-0 left-1/2 -translate-x-1/2"
            style={{
              top: -8,
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderBottom: "8px solid #141414",
            }}
          />
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl no-underline"
            style={{ background: "#141414" }}
          >
            <span className={`flex-shrink-0 w-7 h-7 rounded-xl overflow-hidden flex items-center justify-center ${linkData.image ? "bg-neutral-700" : "bg-black"}`}>
              {linkData.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={linkData.image} alt="" className="w-full h-full object-cover" />
              ) : linkData.iconNode}
            </span>
            {linkData.title && (
              <span className="text-white text-xs font-medium leading-snug break-words mob:whitespace-nowrap min-w-[126px] mob:min-w-0">
                {linkData.title}
              </span>
            )}
            {/* "Open" hint */}
            <span className="text-neutral-400 text-base ml-1">↗</span>
          </a>
        </span>
      )}
    </span>
  );
}
