"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";

export default function MobileMenu({ nav }: { nav: {
  target: string; href: string; label?: string
}[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const lastPathRef = useRef<string | null>(null);

  // Close on route change
  useEffect(() => {
    const last = lastPathRef.current;
    if (last && last !== pathname && open) setOpen(false);
    lastPathRef.current = pathname;
  }, [pathname]);

  // Sticky header only while menu is open (mobile only)
  useEffect(() => {
    const wrapper = document.getElementById("mobile-header-wrapper");
    if (!wrapper) return;
    if (open) {
      wrapper.style.position = "sticky";
      wrapper.style.top = "0";
      wrapper.style.zIndex = "1000";
      wrapper.style.backgroundColor = "white";
    } else {
      wrapper.style.position = "";
      wrapper.style.top = "";
      wrapper.style.zIndex = "";
      wrapper.style.backgroundColor = "";
    }
  }, [open]);

  const resumeItem = nav.find(item => item.label?.toLowerCase() === "resume");
  const navItems = nav.filter(item => item.label?.toLowerCase() !== "resume");

  return (
    <div className="relative">
      {/* 3-bar (decreasing) → X hamburger */}
      <button
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        className="relative flex items-center justify-center w-12 h-12 focus:outline-none"
      >
        <div className="flex flex-col items-end gap-[6px]">
          {/* Top bar — longest */}
          <span
            className="h-[2px] rounded-2xl bg-current transition-all duration-300 ease-in-out"
            style={{
              width: "26px",
              transformOrigin: "center",
              transform: open ? "translateY(7.5px) rotate(45deg)" : "none",
            }}
          />
          {/* Middle bar — medium, dissolves on open */}
          <span
            className="h-[2px] rounded-2xl bg-current transition-all duration-200 ease-in-out"
            style={{
              width: "18px",
              opacity: open ? 0 : 1,
              transform: open ? "scaleX(0)" : "scaleX(1)",
              transformOrigin: "center",
            }}
          />
          {/* Bottom bar — shortest, grows + rotates to form X */}
          <span
            className="h-[2px] rounded-2xl bg-current transition-all duration-300 ease-in-out"
            style={{
              width: open ? "26px" : "13px",
              transformOrigin: "center",
              transform: open ? "translateY(-8.5px) rotate(-45deg)" : "none",
            }}
          />
        </div>
      </button>

      {/* Transparent backdrop to dismiss */}
      <div
        className={`fixed inset-0 z-998 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Compact dropdown card */}
      <div
        className={`fixed left-0 right-0 top-20 pt-[12px] z-999 bg-white shadow-md overflow-hidden transition-all duration-300 ease-[cubic-bezier(.2,.9,.2,1)] origin-top ${
          open
            ? "opacity-100 scale-y-100 pointer-events-auto"
            : "opacity-0 scale-y-90 pointer-events-none"
        }`}
      >
        {navItems.map((item, i) => {
          const isActive =
            pathname === item.href ||
            (pathname.startsWith(item.href) && item.href !== "/");
          return (
            <div
              key={i}
              className="transition-all duration-300 ease-out"
              style={{
                transitionDelay: open ? `${i * 55}ms` : "0ms",
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(10px)",
              }}
            >
              {i > 0 && <div className="h-px bg-gray-100" />}
              <Link
                href={item.href}
                target={item.target || "_self"}
                className={`block px-5 py-4 text-base font-medium transition-colors ${
                  isActive ? "text-gray-900" : "text-gray-400"
                }`}
                onClick={() => setOpen(false)}
              >
                {item.label || item.href}
              </Link>
            </div>
          );
        })}

        {resumeItem && (
          <div
            className="px-4 pb-4 pt-2 transition-all duration-300 ease-out"
            style={{
              transitionDelay: open ? `${navItems.length * 55}ms` : "0ms",
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(10px)",
            }}
          >
            <Link
              href={resumeItem.href}
              target={resumeItem.target || "_blank"}
              className="block w-full text-center py-3.5 bg-gray-900 text-white text-sm font-semibold rounded-full"
              onClick={() => setOpen(false)}
            >
              {resumeItem.label || "Resume"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
