import React from "react";
import "../styles/globals.css";
import { Lustria, Plus_Jakarta_Sans } from "next/font/google";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { Container } from "./components/layout/Container";
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
  return (
    <html lang="en" className={`${lustria.variable} ${plusJakarta.variable}`}>
      <body className="flex flex-col justify-between">
        <div className="flex-1">
          <Container>
            <Header />
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
