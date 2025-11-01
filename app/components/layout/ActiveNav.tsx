"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ActiveNav({ nav }: { nav: { href: string; label?: string }[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex gap-6 text-stone-500">
      {nav.map((item, i) => {
        const isActive =
          pathname === item.href ||
          (pathname.startsWith(item.href) && item.href !== "/");

        return (
          <Link
            key={i}
            href={item.href}
            className={`transition-colors ${
              isActive ? "text-black" : "hover:text-black/70"
            }`}
          >
            {item?.label || item?.href}
          </Link>
        );
      })}
    </nav>
  );
}
