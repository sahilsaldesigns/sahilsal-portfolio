"use client";

import React from "react";
import { useIntro } from "../../providers/IntroProvider";

export default function HomeAnimWrapper({ children }: { children: React.ReactNode }) {
  const { phase } = useIntro();

  return (
    <div data-phase={phase}>
      {children}
    </div>
  );
}
