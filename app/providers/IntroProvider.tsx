"use client";

import React from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";

export type Phase = 'waiting' | 'content' | 'lines';

type IntroContextType = {
  hasNavigated: boolean;
  phase: Phase;
  startIntroExit: () => void;
  markAsNavigated: () => void;
};

const IntroContext = createContext<IntroContextType | undefined>(undefined);

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [hasNavigated, setHasNavigated] = useState(false);
  const [phase, setPhase] = useState<Phase>('waiting');
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    };
  }, []);

  const startIntroExit = () => {
    setPhase('content');
    phaseTimerRef.current = setTimeout(() => setPhase('lines'), 1200);
  };

  const markAsNavigated = () => {
    setHasNavigated(true);
  };

  return (
    <IntroContext.Provider value={{ hasNavigated, phase, startIntroExit, markAsNavigated }}>
      {children}
    </IntroContext.Provider>
  );
}

export function useIntro() {
  const context = useContext(IntroContext);
  if (!context) {
    throw new Error("useIntro must be used within IntroProvider");
  }
  return context;
}
