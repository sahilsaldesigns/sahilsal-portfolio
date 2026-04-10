"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ActiveNav({ nav }: {
  nav: {
    target: string; href: string; label?: string
  }[]
}) {
  const pathname = usePathname();
  const navItems = nav.filter(item => item.label?.toLowerCase() !== "resume");
  const resumeItem = nav.find(item => item.label?.toLowerCase() === "resume");

  return (
    <nav className="flex items-center gap-6 text-stone-500">
      {navItems.map((item, i) => {
        const isActive =
          pathname === item.href ||
          (pathname.startsWith(item.href) && item.href !== "/");

        return (
          <Link
            key={i}
            href={item.href}
            target={item.target || "_self"}
            className={`transition-colors text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded ${isActive ? "text-black" : "hover:text-black/70"}`}
          >
            {item?.label || item?.href}
          </Link>
        );
      })}
      {resumeItem && (
        <Link
          href={resumeItem.href}
          target={resumeItem.target || "_blank"}
          aria-label="Resume (PDF, opens in new tab)"
          className="px-[15px] py-1.5 rounded-xl border-2 text-[18px] leading-[30px] text-black border-gray-300 hover:shadow hover:border-black hover:text-white hover:bg-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
        >
          {resumeItem.label || "Resume"}
        </Link>
      )}
    </nav>
  );
}
