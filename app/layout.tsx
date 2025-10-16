import type { Metadata } from "next";
import { Lustria, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const lustria = Lustria({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-lustria",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  title: "Sahil Salekar",
  description: "Portfolio of Sahil Salekar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lustria.variable} ${plusJakarta.variable}`}>
      <body
        className="antialiased font-sans">{children}
      </body>
    </html>
  );
}
