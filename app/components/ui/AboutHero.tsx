"use client";

import { TinaMarkdown } from "tinacms/dist/rich-text";

interface AboutHeroProps {
  name?: string;
  description?: any;
  image?: string;
}

export default function AboutHero({ name, description, image }: AboutHeroProps) {
  return (
    <section className="w-full py-16">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: Text Content */}
        <div className="space-y-6">
          {name && <h2 className="text-4xl md:text-5xl font-lustria">{name}</h2>}
          {description && (
            <div className="text-base leading-relaxed text-gray-700">
              <TinaMarkdown content={description} />
            </div>
          )}
        </div>

        {/* Right: Image */}
        {image && (
          <div className="flex items-center justify-center">
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