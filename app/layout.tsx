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

const siteUrl = "https://www.sahilsal.com";
const personName = "Sahil Salekar";
const personDescription =
  "Sahil Salekar is a UI designer based in Mumbai, India, currently designing at Media.net. Driven by a passion for crafting purposeful designs, his journey from aspiring automobile photographer to UI designer is a testament to embracing change and discovering one's true calling.";
const personImage = `${siteUrl}/uploads/img/sahil-sal.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: personName,
    template: `%s | ${personName}`,
  },
  description: personDescription,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "profile",
    url: siteUrl,
    siteName: personName,
    title: personName,
    description: personDescription,
    images: [
      {
        url: personImage,
        width: 800,
        height: 800,
        alt: personName,
      },
    ],
    firstName: "Sahil",
    lastName: "Salekar",
  },
  twitter: {
    card: "summary",
    title: personName,
    description: personDescription,
    images: [personImage],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: personName,
  url: siteUrl,
  image: personImage,
  description: personDescription,
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