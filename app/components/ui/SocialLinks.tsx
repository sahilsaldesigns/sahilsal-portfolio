"use client";

import Link from "next/link";
import {
  FaLinkedinIn,
  FaBehance,
} from "react-icons/fa";
import Dribble from "./../icons/Dribble"
import Medium from "./../icons/Medium"

const ICONS: any = {
  linkedin: {component : <FaLinkedinIn className="text-white text-sm w-5 h-5" />, hoverBg : "hover:bg-[#0077b7]", bgColor: "bg-black" ,},
  medium: {component: <Medium className="text-white text-sm w-7 h-7" />, hoverBg : "hover:bg-black", bgColor: "bg-black" ,className: "justify-end" },
  behance: {component: <FaBehance className="text-white text-sm w-5 h-5 " />, hoverBg : "hover:bg-[#1769ff]", bgColor: "bg-black" },
  dribbble: {component: <Dribble className="text-black fill-black text-sm w-8 h-8" hoverColor="#EA4C89" />, hoverBg : "hover:bg-white", bgColor: "bg-white" },
};

export default function SocialLinks({ links = [] }: { links: any[] }) {    
  if (!links || links.length === 0) return null;
  
  return (
    <div className="w-full flex justify-center relative top-[-110px] z-1">
      <div className="
        px-8 py-4 
        bg-white border border-[#e5e5e5]
        rounded-[40px]
        shadow-md
        flex items-center gap-6
      ">
        {links.map((item, index) => (
          <div key={index} className="flex items-center gap-6">
            
            {/* Social Link */}
            <Link
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                h-8 w-8 
                ${ICONS[item.icon].hoverBg} ${ICONS[item.icon].bgColor}
                rounded-lg 
                flex items-center justify-center
                hover:scale-105  transition-all duration-300
                ${
                 ICONS[item.icon].className || ""
                }
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
