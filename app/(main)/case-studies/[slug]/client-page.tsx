"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Container } from "../../../components/layout/Container";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { ReactLenis, useLenis } from 'lenis/react';
import LinkPreview from "../../../components/utils/LinkPreview";

const tinaComponents = {
  a: (props: { url: string; children: import("react").ReactNode } | undefined) => {
    if (!props?.url) return <></>;
    return <LinkPreview href={props.url}>{props.children}</LinkPreview>;
  },
};

function ParallaxVideo({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useLenis(() => {
    if (!containerRef.current || !videoRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const maxOffset = rect.height * 0.05;
    const offset = Math.max(-maxOffset, Math.min(-rect.top * 0.08, maxOffset));
    videoRef.current.style.transform = `translateY(${offset}px) scale(1.05)`;
  });

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden rounded-[16px] lg:rounded-xl bg-gray-100">
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        aria-label="Case study video"
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
    const maxOffset = rect.height * 0.04;
    const offset = Math.max(-maxOffset, Math.min(-rect.top * 0.07, maxOffset));
    innerRef.current.style.transform = `translateY(${offset}px) scale(1.04)`;
  });

  return (
    <div ref={containerRef} className="w-full rounded-2xl lg:rounded-xl bg-gray-100 overflow-hidden">
      <div ref={innerRef} style={{ willChange: "transform" }}>
        <Image
          src={src}
          alt={alt}
          width={766}
          height={600}
          className="w-full h-auto lg:h-[600px] lg:object-cover block"
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
        <Container className="max-w-[766px]">
          <div className="pt-7 md:pt-16">
            {/* Title */}
            <h1
              data-cs-animate
              className="cs-animate text-gray-900 mb-4 text-[24px] leading-[30px] tracking-[-0.02em] lg:text-[44px] lg:leading-[55px]"
            >
              {caseStudy.title}
            </h1>

            {/* Description */}
            {caseStudy.description && (
              <p
                data-cs-animate
                style={{ transitionDelay: "80ms" }}
                className="cs-animate text-[#757575] mb-[16px] text-[16px] leading-[28px] tracking-normal lg:text-[17px]"
              >
                {caseStudy.description}
              </p>
            )}

            {/* Tags */}
            {caseStudy.tags && caseStudy.tags.length > 0 && (
              <div
                data-cs-animate
                style={{ transitionDelay: "160ms" }}
                className="cs-animate flex flex-wrap mb-[32px]"
              >
                {caseStudy.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="py-2 text-[#757575] text-sm font-medium"
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
                <div className="relative w-full h-[400px] md:h-[500px] lg:w-[960px] lg:h-[590px] lg:mx-auto overflow-hidden rounded-[16px] lg:rounded-2xl bg-gray-100">
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
                  className="relative w-full lg:w-[960px] lg:max-h-[590px] mx-auto overflow-hidden rounded-[16px] lg:rounded-[55px] bg-white border-2 border-white"
                >
                  <video
                    src={caseStudy.heroMedia.videoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls={false}
                    aria-label={`${caseStudy.title} hero video`}
                    className="w-full h-full bg-white border-2 border-white scale-110"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
          </div>
        )}

        <Container className="max-w-[766px]">
          <div className="pt-11 md:pt-20">
            {/* Content Blocks */}
            {caseStudy.contentBlocks && caseStudy.contentBlocks.length > 0 && (
              <div>
                {caseStudy.contentBlocks.map((block: any, index: number) => (
                  <div key={index}>
                    {/* Divider above block (controlled per-block) */}
                    {block.showDivider && (
                      <hr
                        data-cs-animate
                        className="cs-animate border-gray-200 mb-10"
                      />
                    )}

                    {/* Block Header with Icon */}
                    {(block.icon || block.title) && (
                      <div
                        data-cs-animate
                        className="cs-animate flex items-center gap-4 mb-[24px]"
                      >
                        {block.icon && (
                          <div className="shrink-0 w-12 h-12 flex items-center justify-center">
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
                          <h2 className="text-gray-900 text-[20px] leading-[100%] tracking-normal lg:text-[32px]">
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
                        className="cs-animate cs-prose prose max-w-none mb-10
                        prose-headings:font-bold prose-headings:text-gray-900
                        prose-h2:text-[20px] prose-h2:leading-[100%] prose-h2:tracking-normal prose-h2:mb-[24px] lg:prose-h2:text-[32px]
                        prose-h3:text-xl lg:prose-h3:text-2xl prose-h4:text-lg lg:prose-h4:text-xl
                        prose-p:text-[16px] prose-p:leading-[28px] prose-p:tracking-normal prose-p:text-[#757575] prose-p:mb-[24px] lg:prose-p:text-[17px]
                        prose-strong:text-gray-900 prose-strong:font-semibold
                        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-700 hover:prose-a:underline
                        prose-ul:list-disc prose-ol:list-decimal
                        prose-li:text-[#757575]"
                      >
                        <TinaMarkdown content={block.content} components={tinaComponents} />
                      </div>
                    )}

                    {/* Block Media */}
                    {block.media && block.media.length > 0 && (
                      <div className="flex flex-col">
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
                              {mediaItem.caption && (
                                <p className="text-base text-gray-900 bg-gray-100 rounded-xl px-5 py-4 mb-6 leading-relaxed font-[family-name:var(--font-lustria)] capitalize">
                                  {mediaItem.caption.split('\n').map((line: string, i: number, arr: string[]) => (
                                    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                                  ))}
                                </p>
                              )}
                              {isImage && (
                                <ParallaxImage
                                  src={mediaItem.image}
                                  alt={mediaItem.alt || `Media ${mediaIndex + 1}`}
                                />
                              )}
                              {isVideo && (
                                <ParallaxVideo src={mediaItem.videoUrl} />
                              )}
                              <hr className="border-gray-200 mt-[25px] mb-[32px] lg:mt-12 lg:mb-12" />
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

          {/* Connect CTA */}
          <div data-cs-animate className="cs-animate ">
            <p className="text-center text-gray-400 text-[14px] leading-[28px] mb-10">
              Spotted Something You Liked? Let&apos;s Connect Over
            </p>
          </div>
        </Container>
      </div>
    </>
  );
}
