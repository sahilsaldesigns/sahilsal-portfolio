"use client";

import React from "react";
import { createContext, useContext, useState } from "react";

export type Phase = 'waiting' | 'content' | 'lines';

type IntroContextType = {
  hasNavigated: boolean;
  phase: Phase;
  markAsNavigated: () => void;
};

const IntroContext = createContext<IntroContextType | undefined>(undefined);

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [hasNavigated, setHasNavigated] = useState(false);
  const [phase, setPhase] = useState<Phase>('waiting');

  const markAsNavigated = () => {
    setHasNavigated(true);
    setPhase('content');
    setTimeout(() => setPhase('lines'), 1200); // after hero fade-up (matches 1.2s animation)
  };

  return (
    <IntroContext.Provider value={{ hasNavigated, phase, markAsNavigated }}>
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