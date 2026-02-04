"use client";

import { createContext, useContext, useState } from "react";

type IntroContextType = {
  hasNavigated: boolean;
  markAsNavigated: () => void;
};

const IntroContext = createContext<IntroContextType | undefined>(undefined);

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [hasNavigated, setHasNavigated] = useState(false);

  const markAsNavigated = () => {
    setHasNavigated(true);
  };

  return (
    <IntroContext.Provider value={{ hasNavigated, markAsNavigated }}>
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