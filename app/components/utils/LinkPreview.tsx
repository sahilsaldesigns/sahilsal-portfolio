"use client";

import React, { useRef, useState, useEffect } from "react";

interface LinkData {
  title: string;
  image: string;
}

// Hardcoded mapping keyed by LinkedIn profile slug
const LINK_DATA_MAP: Record<string, LinkData> = {
  shailendrasalekar: {
    title: "Associate Director- Visual Design @Titan",
    image: "/uploads/img/sahil-sal.png", // placeholder — swap when ready
  },
  akshaysalekar17: {
    title: "Founder @Magnetize Studio",
    image: "/uploads/img/sahil-sal.png", // placeholder — swap when ready
  },
};

function getLinkData(href: string): LinkData | null {
  const match = href.match(/linkedin\.com\/in\/([^/?#]+)/);
  if (match) {
    const slug = match[1].replace(/\/$/, "");
    return LINK_DATA_MAP[slug] ?? null;
  }
  return null;
}

const CARD_WIDTH = 320;

interface LinkPreviewProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function LinkPreview({ href, children, className }: LinkPreviewProps) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<"top" | "bottom">("top");
  const [offsetX, setOffsetX] = useState(0);

  const containerRef = useRef<HTMLSpanElement>(null);
  const hoverCountRef = useRef(0);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const linkData = getLinkData(href);

  const scheduleHide = () => {
    hideTimerRef.current = setTimeout(() => {
      if (hoverCountRef.current === 0) setVisible(false);
    }, 120);
  };

  const cancelHide = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  };

  const handleAnchorEnter = () => {
    hoverCountRef.current++;
    cancelHide();

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPosition(rect.top > 280 ? "top" : "bottom");

      const cardHalf = CARD_WIDTH / 2;
      const anchorCentre = rect.left + rect.width / 2;
      const vw = window.innerWidth;
      const margin = 12;
      let shift = 0;
      if (anchorCentre - cardHalf < margin) shift = margin - (anchorCentre - cardHalf);
      else if (anchorCentre + cardHalf > vw - margin) shift = vw - margin - (anchorCentre + cardHalf);
      setOffsetX(shift);
    }

    setTimeout(() => setVisible(true), 150);
  };

  const handleAnchorLeave = () => {
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
        className={
          className ??
          "underline underline-offset-2 decoration-blue-400/60 text-blue-600 hover:text-blue-700 transition-colors duration-150"
        }
      >
        {children}
      </a>

      {/* Hover card — only rendered if we have data for this link */}
      {linkData && (
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
            width: CARD_WIDTH,
          }}
          className={`absolute z-50 cursor-pointer ${
            position === "top" ? "bottom-full mb-3" : "top-full mt-3"
          } transition-all duration-200 ease-out ${visible ? "opacity-100" : "opacity-0"}`}
        >
          {/* Dark card shell with bounce animation */}
          <span
            className={`flex items-center gap-3 px-4 rounded-2xl${visible ? " link-preview-bounce" : ""}`}
            style={{ background: "#141414", height: 55 }}
          >
            {/* Profile image */}
            <span className="flex-shrink-0 w-9 h-9 rounded-full overflow-hidden bg-neutral-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={linkData.image}
                alt=""
                className="w-full h-full object-cover"
              />
            </span>

            {/* Role / title */}
            <span className="text-white text-sm font-medium leading-tight truncate">
              {linkData.title}
            </span>
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
        </a>
      )}
    </span>
  );
}
