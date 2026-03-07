"use client";

import { usePathname } from "next/navigation";
import SocialLinks from "./SocialLinks";

const LINKS = [
  { icon: "linkedin", url: "https://www.linkedin.com/in/sahilsal/" },
  { icon: "medium", url: "https://medium.com/@sahil.saldesigns" },
  { icon: "behance", url: "https://www.behance.net/sahilsal" },
  { icon: "dribbble", url: "https://dribbble.com/sahilsal" },
];

export default function FooterSocialLinks() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <SocialLinks
      links={LINKS}
      className="w-full flex justify-center mb-6"
    />
  );
}
