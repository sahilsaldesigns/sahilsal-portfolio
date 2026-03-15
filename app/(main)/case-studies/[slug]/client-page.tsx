"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Container } from "../../../components/layout/Container";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { ReactLenis, useLenis } from 'lenis/react';

function ParallaxVideo({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useLenis(() => {
    if (!containerRef.current || !videoRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const maxOffset = rect.height * 0.05;
    const offset = Math.max(-maxOffset, Math.min(-rect.top * 0.08, maxOffset));
    videoRef.current.style.transform = `translateY(${offset}px) scale(1.10)`;
  });

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden rounded-xl bg-gray-100">
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        style={{ willChange: "transform" }}
        className="w-full h-full"
      />
    </div>
  );
}

function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useLenis(() => {
    if (!containerRef.current || !innerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    // Subtle parallax: cap offset at 2.5% of height so scale(1.05) always covers it
    const maxOffset = rect.height * 0.05;
    const offset = Math.max(-maxOffset, Math.min(-rect.top * 0.08, maxOffset));
    innerRef.current.style.transform = `translateY(${offset}px) scale(1.10)`;
  });

  return (
    <div ref={containerRef} className="w-full rounded-xl bg-gray-100 overflow-hidden">
      <div ref={innerRef} style={{ willChange: "transform" }}>
        <Image
          src={src}
          alt={alt}
          width={1920}
          height={1080}
          className="w-full h-auto block"
        />
      </div>
    </div>
  );
}

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

  const heroContainerRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  useLenis(() => {
    if (!heroContainerRef.current || !heroVideoRef.current) return;
    const rect = heroContainerRef.current.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    // Video drifts slower than the page — classic depth parallax
    const offset = Math.max(-30, Math.min(-rect.top * 0.06, 30));
    heroVideoRef.current.style.transform = `translateY(${offset}px) scale(1.08)`;
  });

  const lenis = useLenis();

  // Lenis's built-in ResizeObserver only tracks the element's rendered size, not scrollHeight.
  // With html { height: auto }, the html element now grows with content, so Lenis's observer
  // fires correctly. We also force a resize after images load via the window load event.
  useEffect(() => {
    if (!lenis) return;
    const handleLoad = () => lenis.resize();
    if (document.readyState === 'complete') {
      lenis.resize();
    } else {
      window.addEventListener('load', handleLoad, { once: true });
    }
    return () => window.removeEventListener('load', handleLoad);
  }, [lenis]);

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
        {caseStudy.heroMedia &&
          ((caseStudy.heroMedia.mediaType === "image" && caseStudy.heroMedia.image) ||
           (caseStudy.heroMedia.mediaType === "video" && caseStudy.heroMedia.videoUrl)) && (
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
                <div
                  ref={heroContainerRef}
                  className="relative w-[85vw] mx-auto overflow-hidden rounded-[55px] bg-white border-2 border-white"
                >
                  <video
                    ref={heroVideoRef}
                    src={caseStudy.heroMedia.videoUrl}
                    autoPlay
                    muted
                    loop
                    style={{ willChange: "transform" }}
                    className="w-full h-full bg-white border-2 border-white scale-[1.15]"
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
                    {(block.icon || block.title) && (
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
                        {block.title && (
                          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            {block.title}
                          </h2>
                        )}
                      </div>
                    )}

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
                        {block.media.map((mediaItem: any, mediaIndex: number) => {
                          const isImage = mediaItem.type === "image" && mediaItem.image;
                          const isVideo = mediaItem.type === "video" && mediaItem.videoUrl;
                          if (!isImage && !isVideo) return null;
                          return (
                            <div
                              key={mediaIndex}
                              data-cs-animate
                              style={{ transitionDelay: `${mediaIndex * 80}ms` }}
                              className="cs-animate w-full"
                            >
                              {isImage && (
                                <ParallaxImage
                                  src={mediaItem.image}
                                  alt={mediaItem.alt || `Media ${mediaIndex + 1}`}
                                />
                              )}
                              {isVideo && (
                                <ParallaxVideo src={mediaItem.videoUrl} />
                              )}
                            </div>
                          );
                        })}
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
