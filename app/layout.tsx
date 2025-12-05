import React from "react";
import "../styles/globals.css";
import { Lustria, Plus_Jakarta_Sans } from "next/font/google";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { Container } from "./components/layout/Container";
import MobileMenu from "./components/layout/MobileMenu";
import fs from "fs";
import path from "path";
import { ExperimentalGetTinaClient } from "../tina/__generated__/types";
// CardSlider and Image removed; layout does not use them directly

const lustria = Lustria({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-lustria",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata = {
  title: "Portfolio",
  description: "Sahil Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // read nav data (same fallback logic as Header)
  let globalData: any = null;

  try {
    const tina = ExperimentalGetTinaClient();
    // @ts-expect-error - server api
    // eslint-disable-next-line no-undef
    // fetch tina global
    // Note: keep the same fallback as Header
    // we call tina.global similar to Header
    // but if this fails we'll read local file
    // using readGlobalFile below
    // (we don't await here because ExperimentalGetTinaClient returns a client for sync use)
    // Actually call the client synchronously as Header does.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const res = tina ? tina.global({ relativePath: "global.json" }) : null;
    // res may be a promise; try to handle gracefully by awaiting if needed
    if (res && typeof res.then === "function") {
      // it's a promise; await it
      // Note: RootLayout is a server component but not async; keep fallback simple
      // We'll fallback to reading the local file instead to avoid making RootLayout async here.
      globalData = null;
    } else {
      globalData = res?.data?.global;
    }
  } catch (e) {
    // fallback
  }

  function readGlobalFile() {
    try {
      const file = path.join(process.cwd(), "content", "global", "global.json");
      const raw = fs.readFileSync(file, "utf8");
      return JSON.parse(raw);
    } catch (e) {
      return { header: { nav: [] } };
    }
  }

  if (!globalData) {
    globalData = readGlobalFile();
  }

  const nav: { href: string; label?: string }[] = (globalData?.header?.nav as
    | { href: string; label?: string }[])
    || [];

  return (
    <html lang="en" className={`${lustria.variable} ${plusJakarta.variable}`}>
      <body className="flex flex-col justify-between">
        <div className="flex-1">
          <Container>
            <div className="relative">
              <Header />
              {/* Persistent mobile menu placed in layout so it isn't unmounted during navigation */}
              <div className="md:hidden absolute right-6 top-8">
                {/* @ts-ignore server -> client prop passing */}
                <MobileMenu nav={nav} />
              </div>
            </div>
          </Container>
          <main className="mt-14">{children}</main>
        </div>

        <Container>
          <Footer />
        </Container>
      </body>
    </html>
  );
}
