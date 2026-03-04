"use client";

import { useEffect, useRef, useState } from "react";

interface PreviewData {
  title?: string | null;
  description?: string | null;
  siteName?: string | null;
  url: string;
}

interface LinkPreviewProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

function getInitials(title: string | null | undefined) {
  if (!title) return "in";
  return title.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function parseName(title: string | null | undefined) {
  if (!title) return null;
  const sep = title.indexOf(" - ");
  return sep > -1 ? title.slice(0, sep).trim() : title.trim();
}

function parseHeadline(title: string | null | undefined) {
  if (!title) return null;
  const sep = title.indexOf(" - ");
  if (sep === -1) return null;
  return title.slice(sep + 3).replace(/\s*\|\s*LinkedIn\s*$/i, "").trim();
}

const CARD_WIDTH = 320;

export default function LinkPreview({ href, children, className }: LinkPreviewProps) {
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState<"top" | "bottom">("top");
  const [offsetX, setOffsetX] = useState(0);

  const containerRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const hoverCountRef = useRef(0);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchedRef = useRef(false);

  const fetchPreview = async () => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    setLoading(true);
    try {
      const res = await fetch(`/api/link-preview?url=${encodeURIComponent(href)}`);
      const data = await res.json();
      if (!data.error) setPreview(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

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
    fetchPreview();

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

    setTimeout(() => setVisible(true), 180);
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

  const isLinkedIn = href.includes("linkedin.com");
  const name = isLinkedIn ? parseName(preview?.title) : null;
  const headline = isLinkedIn ? parseHeadline(preview?.title) : null;
  const initials = getInitials(name || preview?.title);
  const isActive = visible && (preview || loading);

  return (
    <span ref={containerRef} className="relative inline-block">
      {/* Anchor text */}
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

      {/* ── Hover card (is itself an <a> so clicking anywhere opens the link) ── */}
      <a
        ref={cardRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={handleCardEnter}
        onMouseLeave={handleCardLeave}
        style={{
          left: `calc(50% + ${offsetX}px)`,
          transform: `translateX(-50%) ${
            isActive
              ? "translateY(0) scale(1)"
              : position === "top"
              ? "translateY(6px) scale(0.97)"
              : "translateY(-6px) scale(0.97)"
          }`,
          pointerEvents: isActive ? "auto" : "none",
          textDecoration: "none",
        }}
        className={`
          absolute z-50 w-80 cursor-pointer
          ${position === "top" ? "bottom-full mb-3" : "top-full mt-3"}
          transition-all duration-200 ease-out
          ${isActive ? "opacity-100" : "opacity-0"}
        `}
      >
        {/* Card shell */}
        <span
          className="block rounded-2xl overflow-hidden bg-white"
          style={{
            boxShadow:
              "0 4px 6px -1px rgba(0,0,0,0.07), 0 20px 40px -8px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.05)",
          }}
        >
          {/* Loading skeleton */}
          {loading && !preview && (
            <span className="block p-5 space-y-3 animate-pulse">
              <span className="flex items-center gap-3">
                <span className="block w-11 h-11 rounded-full bg-gray-100 flex-shrink-0" />
                <span className="flex-1 space-y-2">
                  <span className="block h-3.5 bg-gray-100 rounded-full w-2/3" />
                  <span className="block h-2.5 bg-gray-100 rounded-full w-full" />
                </span>
              </span>
              <span className="block h-2.5 bg-gray-100 rounded-full w-full" />
              <span className="block h-2.5 bg-gray-100 rounded-full w-4/5" />
              <span className="block h-2.5 bg-gray-100 rounded-full w-3/5" />
            </span>
          )}

          {preview && (
            <span className="block">
              {/* ── LinkedIn card ── */}
              {isLinkedIn ? (
                <>
                  <span className="flex items-start gap-3.5 p-5 pb-4">
                    <span
                      className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-base tracking-wide select-none"
                      style={{ background: "linear-gradient(135deg, #0A66C2 0%, #0077B5 100%)" }}
                    >
                      {initials}
                    </span>
                    <span className="flex-1 min-w-0 pt-0.5">
                      {name && (
                        <span className="block text-[15px] font-semibold text-gray-900 leading-tight truncate">
                          {name}
                        </span>
                      )}
                      {headline && (
                        <span className="block text-[11px] text-gray-500 leading-snug mt-0.5 line-clamp-2">
                          {headline}
                        </span>
                      )}
                    </span>
                  </span>

                  <span className="block mx-5 border-t border-gray-100" />

                  {preview.description && (
                    <span className="block px-5 pt-3.5 pb-1">
                      <span className="block text-[11.5px] text-gray-600 leading-relaxed line-clamp-4">
                        {preview.description}
                      </span>
                    </span>
                  )}

                  <span className="flex items-center justify-between px-5 py-3.5">
                    <span className="flex items-center gap-1.5">
                      <LinkedInIcon className="w-3.5 h-3.5 fill-[#0A66C2]" />
                      <span className="text-[10.5px] font-medium text-[#0A66C2]">LinkedIn</span>
                    </span>
                    <span className="flex items-center gap-1 text-[10.5px] font-medium text-[#0A66C2]">
                      View profile
                      <ArrowIcon className="w-3 h-3 stroke-[#0A66C2]" />
                    </span>
                  </span>
                </>
              ) : (
                /* ── Generic link card ── */
                <>
                  <span className="block p-5 space-y-2.5">
                    <span className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://www.google.com/s2/favicons?sz=32&domain=${new URL(href).hostname}`}
                        alt=""
                        className="w-4 h-4 rounded object-contain flex-shrink-0"
                      />
                      <span className="text-[10.5px] font-medium text-gray-400 uppercase tracking-wider truncate">
                        {preview.siteName ?? new URL(href).hostname}
                      </span>
                    </span>
                    {preview.title && (
                      <span className="block text-[13.5px] font-semibold text-gray-900 leading-snug line-clamp-2">
                        {preview.title}
                      </span>
                    )}
                    {preview.description && (
                      <span className="block text-[11.5px] text-gray-500 leading-relaxed line-clamp-3">
                        {preview.description}
                      </span>
                    )}
                  </span>
                  <span className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/60">
                    <span className="text-[10px] text-gray-400 truncate max-w-[70%]">
                      {new URL(href).hostname}
                    </span>
                    <span className="flex items-center gap-1 text-[10.5px] font-medium text-gray-500">
                      Open link
                      <ArrowIcon className="w-3 h-3 stroke-gray-500" />
                    </span>
                  </span>
                </>
              )}
            </span>
          )}
        </span>

        {/* Caret */}
        <span
          className={`absolute w-3 h-3 bg-white rotate-45 ${position === "top" ? "-bottom-1.5" : "-top-1.5"}`}
          style={{
            left: `calc(50% - ${offsetX}px)`,
            transform: "translateX(-50%) rotate(45deg)",
            boxShadow:
              position === "top"
                ? "2px 2px 4px rgba(0,0,0,0.06)"
                : "-2px -2px 4px rgba(0,0,0,0.06)",
          }}
        />
      </a>
    </span>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" className={className} strokeWidth={1.8}>
      <path d="M2 6h8M6.5 2.5L10 6l-3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}