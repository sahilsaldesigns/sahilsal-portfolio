"use client";

import Image from "next/image";
import { useIntro } from "../../providers/IntroProvider";

export default function HomeBgLines() {
  const { phase } = useIntro();

  if (phase !== 'lines') return null;

  return (
    <div className="bg-container pointer-events-none h-full">
      {/* DESKTOP — LEFT LINE */}
      <div className="hidden md:block absolute left-0 top-8 max-w-[440px] w-1/2 overflow-hidden">
        <div className="bg-reveal-edge bg-reveal-left"></div>
        <Image
          src="uploads/img/home-desk-left-line.svg"
          alt="left background line"
          width={800}
          height={500}
          className="w-full"
        />
      </div>

      {/* DESKTOP — RIGHT LINE */}
      <div className="hidden md:block absolute right-0 max-w-[440px] w-1/2 overflow-hidden ml-auto">
        <div className="bg-reveal-edge bg-reveal-right"></div>
        <Image
          src="uploads/img/home-desk-right-line.svg"
          alt="right background line"
          width={800}
          height={500}
          className="w-full"
        />
      </div>

      {/* MOBILE — LEFT LINE (bottom) */}
      <div className="block md:hidden absolute -left-5 top-[28%] min-[424px]:top-[32%] min-[569px]:top-[28%] max-w-[164px] w-1/2 overflow-hidden">
        <div className="bg-reveal-edge bg-reveal-left"></div>
        <Image
          src="uploads/img/home-mob-left-line.svg"
          alt="left background line"
          width={400}
          height={400}
          className="w-full"
        />
      </div>

      {/* MOBILE — RIGHT LINE (top) */}
      <div className="block md:hidden absolute -right-2 top-0 max-w-[145px] w-1/2 overflow-hidden ml-auto">
        <div className="bg-reveal-edge bg-reveal-right"></div>
        <Image
          src="uploads/img/home-mob-right-line.svg"
          alt="right background line"
          width={400}
          height={400}
          className="w-full"
        />
      </div>
    </div>
  );
}
