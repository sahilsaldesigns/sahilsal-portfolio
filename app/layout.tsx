import React from "react";
import "../styles/globals.css";
import { Lustria, Plus_Jakarta_Sans } from "next/font/google";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { Container } from "./components/layout/Container";
import { IntroProvider } from "./providers/IntroProvider";
import type { Metadata } from "next";

const lustria = Lustria({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-lustria",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const siteUrl = "https://sahilsal.com";
const pageTitle = "Sahil Salekar — UI/UX Designer";
const pageDescription =
  "Designing UI for ad tech and digital products. Currently at Media.net, Mumbai.";
const ogImage = `${siteUrl}/uploads/img/og-image.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: pageTitle,
    template: `%s | Sahil Salekar`,
  },
  description: pageDescription,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Sahil Salekar",
    title: pageTitle,
    description: pageDescription,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: pageTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [ogImage],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Sahil Salekar",
  url: siteUrl,
  image: ogImage,
  description: pageDescription,
  jobTitle: "UI Designer",
  worksFor: {
    "@type": "Organization",
    name: "Media.net",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Mumbai",
    addressCountry: "IN",
  },
  sameAs: [
    "https://www.linkedin.com/in/sahilsal/",
    "https://www.behance.net/sahilsal",
    "https://dribbble.com/sahilsal",
    "https://medium.com/@sahil.saldesigns",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${lustria.variable} ${plusJakarta.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-screen flex-col overflow-x-hidden">
        <div className="flex-1">
          <div id="mobile-header-wrapper">
            <Container>
              <Header />
            </Container>
          </div>
          <main className="">
            <IntroProvider>
              {children}
            </IntroProvider>
          </main>
        </div>

        <Container>
          <Footer />
        </Container>
      </body>
    </html>
  );
}