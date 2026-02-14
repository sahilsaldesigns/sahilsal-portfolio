"use client";

import React from "react";
import { useIntro } from "../../providers/IntroProvider";
import PageIntro from "./PageIntro";

export default function PageWithIntro({ children }: { children: React.ReactNode }) {
  const { hasNavigated, markAsNavigated } = useIntro();

  if (!hasNavigated) {
    return <PageIntro onComplete={markAsNavigated} />;
  }

  return <>{children}</>;
}