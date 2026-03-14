"use client";

import React from "react";
import { useIntro } from "../../providers/IntroProvider";
import PageIntro from "./PageIntro";

export default function PageWithIntro({ children }: { children: React.ReactNode }) {
  const { hasNavigated, startIntroExit, markAsNavigated } = useIntro();

  return (
    <>
      {!hasNavigated && (
        <PageIntro onExitStart={startIntroExit} onExitEnd={markAsNavigated} />
      )}
      {children}
    </>
  );
}
