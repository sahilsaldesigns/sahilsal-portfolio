import Link from "next/link";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: "3rem",
        }}
      >
        <header style={{display:"flex", gap: "18px"}}>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/photography">Photography</Link>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
