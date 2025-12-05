"use client";

import Link from "next/link";
import {
  FaLinkedinIn,
  FaMediumM,
  FaBehance,
  FaDribbble,
} from "react-icons/fa";

const ICONS: any = {
  linkedin: <FaLinkedinIn className="text-white text-sm" />,
  medium: <FaMediumM className="text-white text-sm" />,
  behance: <FaBehance className="text-white text-sm" />,
  dribbble: <FaDribbble className="text-white text-sm" />,
};

export default function SocialLinks({ links = [] }: { links: any[] }) {    
  if (!links || links.length === 0) return null;

  return (
    <div className="w-full flex justify-center py-16">
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
              className="
                h-10 w-10 
                bg-black 
                rounded-lg 
                flex items-center justify-center
                hover:scale-105 transition-transform
              "
            >
              {ICONS[item.icon]}
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
