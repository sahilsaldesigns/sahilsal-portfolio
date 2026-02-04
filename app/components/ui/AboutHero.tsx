"use client";

import { TinaMarkdown } from "tinacms/dist/rich-text";
import { useEffect, useRef, useState } from "react";

interface AboutHeroProps {
  name?: string;
  description?: any;
  image?: string;
}

export default function AboutHero({ name, description, image }: AboutHeroProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-16">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: Text Content */}
        <div
          className={`space-y-6 transition-all duration-1000 ease-out ${
            isVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-12"
          }`}
        >
          {name && <h2 className="text-4xl md:text-5xl font-lustria">{name}</h2>}
          {description && (
            <div className="text-base leading-relaxed text-gray-700">
              <TinaMarkdown content={description} />
            </div>
          )}
        </div>

        {/* Right: Image */}
        {image && (
          <div
            className={`flex items-center justify-center transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-12"
            }`}
          >
            <img
              src={image}
              alt={name || "About Hero"}
              className="w-full h-auto rounded-3xl shadow-lg object-cover max-w-sm"
            />
          </div>
        )}
      </div>
    </section>
  );
}