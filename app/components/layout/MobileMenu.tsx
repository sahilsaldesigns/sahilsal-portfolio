"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";

export default function MobileMenu({ nav }: { nav: { href: string; label?: string }[] }) {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();
  const lastPathRef = useRef<string | null>(null);

  // Close the menu when the pathname actually changes
  useEffect(() => {
    const last = lastPathRef.current;
    if (last && last !== pathname && open) {
      setOpen(false);
    }
    lastPathRef.current = pathname;
  }, [pathname, open]);

  return (
    <div className="relative">
      <button
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        className="z-9999999999 relative flex flex-col items-center justify-center w-10 h-10 rounded-md focus:outline-none"
      >
        <span
          className={`block w-6 h-0.5 bg-current transition-transform duration-300 ease-in-out transform origin-center ${
            open ? "translate-y-0 rotate-45" : "-translate-y-1.5"
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-current my-1 transition-all duration-300 ease-in-out ${
            open ? "opacity-0 scale-0" : "opacity-100 scale-100"
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-current transition-transform duration-300 ease-in-out transform origin-center ${
            open ? "translate-y-0 -rotate-45" : "translate-y-1.5"
          }`}
        />
      </button>

      {/* Overlay menu */}
      <div
        className={`fixed inset-0 bg-white z-999999999 transform transition-all duration-300 ease-[cubic-bezier(.2,.9,.2,1)] pointer-events-auto ${
          open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
        style={{
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-6">
          {nav.map((item, i) => {
             const isActive =
          pathname === item.href ||
          (pathname.startsWith(item.href) && item.href !== "/");
            return(
              <Link
                key={i}
                href={item.href}
                 className={`text-2xl font-medium  transition-colors ${
                    isActive ? "text-black" : "text-black/60"
            }`}              
              >
                {item.label || item.href}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
