"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function StickyHeaderWrapper({ children }) {
  const pathname = usePathname();
  const isPhotography = pathname === "/photography";
  const [isSticky, setIsSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    setHeaderHeight(headerRef.current?.offsetHeight || 0);
  }, []);

  useEffect(() => {
    const onOpen = () => setMenuOpen(true);
    const onClose = () => setMenuOpen(false);
    document.addEventListener("mobilemenu:open", onOpen);
    document.addEventListener("mobilemenu:close", onClose);
    return () => {
      document.removeEventListener("mobilemenu:open", onOpen);
      document.removeEventListener("mobilemenu:close", onClose);
    };
  }, []);

  useEffect(() => {
    setHeaderHeight(headerRef.current?.offsetHeight || 0);
  }, []);

  const lastScrollY = useRef(0);

  useEffect(() => {
    if (isPhotography) {
      setIsSticky(false);
      return;
    }
    const handleScroll = () => {
      const y = window.scrollY;
      const scrollingUp = y < lastScrollY.current;
      lastScrollY.current = y;

      if (y < 100) {
        setIsSticky(false);
        return;
      }
      setIsSticky(scrollingUp);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isPhotography]);

  return (
    <>
      {/* Prevent layout shift */}
      {isSticky && <div style={{ height: headerHeight }} />}

      {/* Normal header */}
      {!isSticky && (
        <div ref={headerRef}>
          {children}
        </div>
      )}

      {/* Sticky header with reveal */}
      <AnimatePresence>
        {isSticky && (
          <motion.div
            ref={headerRef}
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }}
            transition={{
              y: { type: "spring", stiffness: 260, damping: 30 },
              opacity: { duration: 0.2, ease: "easeOut" },
            }}
            className={`fixed top-0 left-0 right-0 z-50 [&_header]:md:!py-5  shadow-[0px_1px_17px_1px_#d3d3d3] ${menuOpen ? "bg-white" : "bg-white/80 backdrop-blur-lg"}`}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
