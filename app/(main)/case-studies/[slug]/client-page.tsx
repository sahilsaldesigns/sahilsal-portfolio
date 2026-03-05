"use client";

import Image from "next/image";
import { useEffect } from "react";
import { Container } from "../../../components/layout/Container";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { ReactLenis } from 'lenis/react';

interface CaseStudyData {
  query: string;
  variables: {
    relativePath: string;
  };
  data: {
    caseStudy: any;
  };
}

export default function CaseStudyPage(props: CaseStudyData) {
  const { caseStudy } = props.data;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("cs-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    const elements = document.querySelectorAll("[data-cs-animate]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  if (!caseStudy) {
    return <div className="py-20 text-center">Loading...</div>;
  }

  return (
    <>
      <ReactLenis root />
      <div className="min-h-screen">
        <Container>
          <div className="py-12 md:py-16">
            {/* Title */}
            <h1
              data-cs-animate
              className="cs-animate text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            >
              {caseStudy.title}
            </h1>

            {/* Description */}
            {caseStudy.description && (
              <p
                data-cs-animate
                style={{ transitionDelay: "80ms" }}
                className="cs-animate text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-4xl"
              >
                {caseStudy.description}
              </p>
            )}

            {/* Tags */}
            {caseStudy.tags && caseStudy.tags.length > 0 && (
              <div
                data-cs-animate
                style={{ transitionDelay: "160ms" }}
                className="cs-animate flex flex-wrap"
              >
                {caseStudy.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="py-2 text-gray-700 text-sm font-medium"
                  >
                    {index > 0 && <span className="mx-2 text-gray-400">|</span>}{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Container>

        {/* Hero Media */}
        {caseStudy.heroMedia && (
          <div
            data-cs-animate
            style={{ transitionDelay: "240ms" }}
            className="cs-animate px-5"
          >
            {caseStudy.heroMedia.mediaType === "image" &&
              caseStudy.heroMedia.image && (
                <div className="relative w-full h-[400px] md:h-[600px] lg:h-[700px] overflow-hidden rounded-2xl bg-gray-100">
                  <Image
                    src={caseStudy.heroMedia.image}
                    alt={caseStudy.title}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              )}

            {caseStudy.heroMedia.mediaType === "video" &&
              caseStudy.heroMedia.videoUrl && (
                <div className="relative w-[85vw] mx-auto overflow-hidden rounded-[55px] bg-white border-2 border-white">
                  <video
                    src={caseStudy.heroMedia.videoUrl}
                    autoPlay
                    muted
                    loop
                    className="w-full h-full bg-white border-2 border-white scale-[1.05]"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
          </div>
        )}

        <Container>
          <div className="py-16 md:py-20">
            {/* Content Blocks */}
            {caseStudy.contentBlocks && caseStudy.contentBlocks.length > 0 && (
              <div>
                {caseStudy.contentBlocks.map((block: any, index: number) => (
                  <div key={index}>
                    {/* Divider above each block except the first */}
                    {index > 0 && (
                      <hr
                        data-cs-animate
                        className="cs-animate border-gray-200 mb-10"
                      />
                    )}

                    {/* Block Header with Icon */}
                    <div
                      data-cs-animate
                      className="cs-animate flex items-center gap-4 mb-6"
                    >
                      {block.icon && (
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                          <Image
                            src={block.icon}
                            alt="Section icon"
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                        </div>
                      )}
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        {block.title}
                      </h2>
                    </div>

                    {/* Block Content */}
                    {block.content && (
                      <div
                        data-cs-animate
                        style={{ transitionDelay: "80ms" }}
                        className="cs-animate cs-prose prose prose-lg max-w-none mb-10
                        prose-headings:font-bold prose-headings:text-gray-900
                        prose-h3:text-2xl prose-h4:text-xl
                        prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                        prose-strong:text-gray-900 prose-strong:font-semibold
                        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-700 hover:prose-a:underline
                        prose-ul:list-disc prose-ol:list-decimal
                        prose-li:text-gray-700"
                      >
                        <TinaMarkdown content={block.content} />
                      </div>
                    )}

                    {/* Block Media */}
                    {block.media && block.media.length > 0 && (
                      <div className="flex flex-col gap-6 mb-10">
                        {block.media.map((mediaItem: any, mediaIndex: number) => (
                          <div
                            key={mediaIndex}
                            data-cs-animate
                            style={{ transitionDelay: `${mediaIndex * 80}ms` }}
                            className="cs-animate w-full"
                          >
                            {mediaItem.type === "image" && mediaItem.image && (
                              <div className="relative w-full overflow-hidden rounded-xl bg-gray-100">
                                <Image
                                  src={mediaItem.image}
                                  alt={mediaItem.alt || `Media ${mediaIndex + 1}`}
                                  fill
                                  className="static!"
                                />
                              </div>
                            )}
                            {mediaItem.type === "video" && mediaItem.videoUrl && (
                              <div className="relative w-full overflow-hidden rounded-xl bg-gray-900">
                                <video
                                  src={mediaItem.videoUrl}
                                  className="w-full h-full"
                                >
                                  Your browser does not support the video tag.
                                </video>
                                {mediaItem.alt && (
                                  <p className="text-sm text-gray-600 mt-2">
                                    {mediaItem.alt}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Container>
      </div>
    </>
  );
}
