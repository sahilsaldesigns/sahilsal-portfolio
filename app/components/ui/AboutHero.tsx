"use client";

import Image from "next/image";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import React, { useEffect, useRef, useState } from "react";
import LinkPreview from "../utils/LinkPreview";

interface AboutHeroProps {
  name?: string;
  description?: any;
  image?: string;
  imageMobile?: string;
  useSameImageMobile?: boolean;
}

// TinaMarkdown component overrides — swap plain <a> tags for LinkPreview
const tinaComponents = {
  a: ({ url, children }: { url: string; children: React.ReactNode }) => (
    <LinkPreview href={url}>{children}</LinkPreview>
  ),
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="mb-4">{children}</p>
  ),
};

export default function AboutHero({ name, description, image, imageMobile, useSameImageMobile }: AboutHeroProps) {
  const mobileImage = useSameImageMobile === false && imageMobile ? imageMobile : image;
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-[26px] md:py-16">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
        {/* Left: Text Content */}
        <div
          className={`order-2 md:order-1 space-y-6 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
          }`}
        >
          {name && <h2 className="text-[24px] md:text-5xl font-lustria mb-4 md:mb-6">{name}</h2>}
          {description && (
            <div className="text-[16px] leading-[26px] md:text-[18px] md:leading-8 tracking-normal capitalize text-gray-700">
              {/* Pass tinaComponents to override how links are rendered */}
              <TinaMarkdown content={description} components={tinaComponents} />
            </div>
          )}
        </div>

        {/* Right: Image */}
        {image && (
          <div
            className={`order-1 md:order-2 flex items-center justify-center transition-all duration-1000 ease-out ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            {/* Mobile image */}
            <Image
              src={mobileImage!}
              alt=""
              aria-hidden="true"
              width={750}
              height={550}
              quality={100}
              className="block w-full md:hidden  shadow-lg object-cover rounded-[30px] md:rounded-4xl"
              priority
            />
            {/* Desktop image */}
            <Image
              src={image}
              alt={name || "About Hero"}
              width={400}
              height={400}
              className="hidden md:block w-full h-auto rounded-3xl shadow-lg object-contain max-w-sm"
              priority
            />
          </div>
        )}
      </div>
    </section>
  );
}