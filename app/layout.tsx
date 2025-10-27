import React from "react";
import "../styles/globals.css";
import { Lustria, Plus_Jakarta_Sans } from "next/font/google";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { Container } from "./components/layout/Container";
import Image from "next/image";

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
          <main className="mt-14">
            <div className="hero-section-container relative pt-20">
              <section className="home-hero-section text-center z-10 bg-[radial-gradient(circle,_white_0%,_rgba(255,255,255,0)_80%)]">{children}</section>
              <div className="bg-container">
                <div className="bg-reveal"></div>
                <Image
                  src="uploads/hero-line.svg"
                  alt="background image"
                  width={500}
                  height={500}
                  className="w-full"
                />
              </div>
            </div>
            <section className="text-center hidden">SLIDER SECTION</section>
          </main>
        </div>

        <Container>
          <Footer />
        </Container>
      </body>
    </html>
  );
}
