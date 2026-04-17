"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import SocialLinks from "./SocialLinks";

const LINKS = [
  { icon: "linkedin", url: "https://www.linkedin.com/in/sahilsal/" },
  { icon: "medium", url: "https://medium.com/@sahil.saldesigns" },
  { icon: "behance", url: "https://www.behance.net/sahilsal" },
  { icon: "dribbble", url: "#" },
];

export default function FooterSocialLinks() {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/photography") return null;

  return (
    <>
      {(pathname === "/about" || pathname.startsWith("/case-studies/")) && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-screen max-h-[158px] h-full pointer-events-none -z-10">
          <Image
            src="/uploads/img/about-footer-bg.svg"
            alt=""
            fill
            className="object-cover object-top"
          />
        </div>
      )}
      <SocialLinks
        links={LINKS}
        className="w-full flex justify-center mb-[34px]"
      />
    </>
  );
}
