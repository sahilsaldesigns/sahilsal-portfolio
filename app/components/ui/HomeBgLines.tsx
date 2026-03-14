"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useIntro } from "../../providers/IntroProvider";

const lines = [
  {
    key: "desk-left",
    wrapperClass: "hidden md:block absolute left-0 top-8 max-w-[440px] w-1/2 overflow-hidden",
    edgeClass: "bg-reveal-edge bg-reveal-left",
    src: "uploads/img/home-desk-left-line.svg",
    width: 800,
    height: 500,
  },
  {
    key: "desk-right",
    wrapperClass: "hidden md:block absolute right-0 max-w-[440px] w-1/2 overflow-hidden ml-auto",
    edgeClass: "bg-reveal-edge bg-reveal-right",
    src: "uploads/img/home-desk-right-line.svg",
    width: 800,
    height: 500,
  },
  {
    key: "mob-left",
    wrapperClass: "block md:hidden absolute -left-5 top-[28%] min-[424px]:top-[32%] min-[569px]:top-[28%] max-w-[164px] w-1/2 overflow-hidden",
    edgeClass: "bg-reveal-edge bg-reveal-left",
    src: "uploads/img/home-mob-left-line.svg",
    width: 400,
    height: 400,
  },
  {
    key: "mob-right",
    wrapperClass: "block md:hidden absolute -right-2 top-0 max-w-[145px] w-1/2 overflow-hidden ml-auto",
    edgeClass: "bg-reveal-edge bg-reveal-right",
    src: "uploads/img/home-mob-right-line.svg",
    width: 400,
    height: 400,
  },
];

export default function HomeBgLines() {
  const { phase } = useIntro();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (phase === 'lines') setAnimate(true);
  }, [phase]);

  return (
    <div className="bg-container pointer-events-none h-full">
      {lines.map(({ key, wrapperClass, edgeClass, src, width, height }) => (
        <div key={key} className={wrapperClass}>
          {animate && (
            <>
              <div className={edgeClass} />
              <Image
                src={src}
                alt={`${key} background line`}
                width={width}
                height={height}
                className="w-full"
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
}
