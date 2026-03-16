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
            className={`transition-colors text-base ${isActive ? "text-black" : "hover:text-black/70"}`}
          >
            {item?.label || item?.href}
          </Link>
        );
      })}
      {resumeItem && (
        <Link
          href={resumeItem.href}
          target={resumeItem.target || "_blank"}
          className="px-5 py-2 rounded-full border-3 border-gray-300 text-stone-700 text-sm hover:border-gray-400 hover:text-black transition-colors"
        >
          {resumeItem.label || "Resume"}
        </Link>
      )}
    </nav>
  );
}
