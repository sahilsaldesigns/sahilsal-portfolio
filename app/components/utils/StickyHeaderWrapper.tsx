"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function StickyHeaderWrapper({ children }) {
  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    setHeaderHeight(headerRef.current?.offsetHeight || 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg shadow-md z-50 px-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
