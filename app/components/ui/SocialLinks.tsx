"use client";

import Link from "next/link";
import {
  FaLinkedinIn,
  FaBehance,
} from "react-icons/fa";
import Dribble from "./../icons/Dribble"
import Medium from "./../icons/Medium"

const ICONS: any = {
  linkedin: {component : <FaLinkedinIn className="text-white w-[18px] h-[18px] md:w-4 md:h-4" aria-hidden="true" />, hoverBg : "hover:bg-[#0077b7]", bgColor: "bg-black", label: "LinkedIn" },
  medium: {component: <Medium className="text-white w-[18px] h-[18px] md:w-5.5 md:h-7" />, hoverBg : "hover:bg-black", bgColor: "bg-black", className: "justify-end", label: "Medium" },
  behance: {component: <FaBehance className="text-white w-[18px] h-[18px] md:w-4 md:h-4" aria-hidden="true" />, hoverBg : "hover:bg-[#1769ff]", bgColor: "bg-black", label: "Behance" },
  dribbble: {component: <Dribble className="text-black fill-black w-6 h-6 md:w-8 md:h-8" hoverColor="#EA4C89" />, hoverBg : "hover:bg-white", bgColor: "bg-white", label: "Dribbble" },
};

export default function SocialLinks({ links = [], className }: { links: any[]; className?: string }) {
  if (!links || links.length === 0) return null;

  return (
    <div className={className ?? "w-full flex justify-center relative top-[-72px] min-[416px]:top-[-108px] md:top-[-116px] z-1"}>
      <div className="
        px-[25px] py-4 md:p-6 md:py-[23pxtext-center font-medium leading-tight text-[20px]!  sm:text-[12px] text-black!]
        bg-white border-[3px] border-[#E7E7E7]
        rounded-[30px]
        flex items-center gap-[25px] md:gap-8
      ">
        {links.map((item, index) => (
          <div key={index} className="flex items-center gap-[25px] md:gap-6">

            {/* Social Link */}
            <Link
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${ICONS[item.icon].label} (opens in new tab)`}
              className={`
                h-6 w-6 md:h-7 md:w-7
                ${ICONS[item.icon].hoverBg} ${ICONS[item.icon].bgColor}
                rounded-lg
                flex items-center justify-center
                hover:scale-105 transition-all duration-300
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black
                ${ICONS[item.icon].className || ""}
              `}
            >
              {ICONS[item.icon].component}
            </Link>

            {/* Vertical Divider (except last item) */}
            {index < links.length - 1 && (
              <span className="h-5 w-px bg-[#dadada]"></span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
