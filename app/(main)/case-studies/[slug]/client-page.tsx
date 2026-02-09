"use client";

import Image from "next/image";
import { Container } from "../../../components/layout/Container";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import {
  Target,
  AlertCircle,
  Lightbulb,
  TrendingUp,
  Code,
  BookOpen,
  Users,
  Workflow,
} from "lucide-react";

interface CaseStudyData {
  query: string;
  variables: {
    relativePath: string;
  };
  data: {
    caseStudy: any;
  };
}

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  overview: Target,
  challenge: AlertCircle,
  solution: Lightbulb,
  results: TrendingUp,
  technology: Code,
  learning: BookOpen,
  users: Users,
  process: Workflow,
};

export default function CaseStudyPage(props: CaseStudyData) {
  const { caseStudy } = props.data;

  console.log(caseStudy);

  if (!caseStudy) {
    return <div className="py-20 text-center">Loading...</div>;
  }

  const renderIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || Target;
    return <IconComponent className="w-6 h-6" />;
  };

  return (
    <div className="min-h-screen animate-fadeInUp">
      <Container>
        <div className="py-16 md:py-20">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {caseStudy.title}
          </h1>

          {/* Description */}
          {caseStudy.description && (
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-4xl">
              {caseStudy.description}
            </p>
          )}

          {/* Tags */}
          {caseStudy.tags && caseStudy.tags.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-12">
              {caseStudy.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Hero Media */}
          {caseStudy.heroMedia && (
            <div className="mb-16 md:mb-20">
              {caseStudy.heroMedia.mediaType === "image" &&
                caseStudy.heroMedia.image && (
                  <div className="relative w-full h-[400px] md:h-[600px] lg:h-[700px] overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
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
                  <div className="relative w-full aspect-video overflow-hidden rounded-2xl bg-gray-900">
                    <video
                      src={caseStudy.heroMedia.videoUrl}
                      controls
                      className="w-full h-full"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
            </div>
          )}

          {/* Content Blocks */}
          {caseStudy.contentBlocks && caseStudy.contentBlocks.length > 0 && (
            <div className="space-y-16 md:space-y-20">
              {caseStudy.contentBlocks.map((block: any, index: number) => (
                <div key={index}>
                  {/* Block Header with Icon */}
                  <div className="flex items-center gap-4 mb-6">
                    {block.icon && (
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        {renderIcon(block.icon)}
                      </div>
                    )}
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                      {block.title}
                    </h2>
                  </div>

                  {/* Block Content */}
                  {block.content && (
                    <div className="prose prose-lg dark:prose-invert max-w-none mb-8
                      prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
                      prose-h3:text-2xl prose-h4:text-xl
                      prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
                      prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
                      prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-700 hover:prose-a:underline
                      dark:prose-a:text-blue-400 dark:hover:prose-a:text-blue-300
                      prose-ul:list-disc prose-ol:list-decimal
                      prose-li:text-gray-700 dark:prose-li:text-gray-300
                      prose-hr:border-gray-300 dark:prose-hr:border-gray-700 prose-hr:my-8">
                      <TinaMarkdown content={block.content} />
                    </div>
                  )}

                  {/* Block Media */}
                  {block.media && block.media.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      {block.media.map((mediaItem: any, mediaIndex: number) => {
                        const colSpan =
                          mediaItem.layout === "full"
                            ? "md:col-span-2 lg:col-span-3"
                            : mediaItem.layout === "half"
                              ? "md:col-span-1 lg:col-span-2"
                              : "md:col-span-1 lg:col-span-1";

                        return (
                          <div key={mediaIndex} className={colSpan}>
                            {mediaItem.type === "image" && mediaItem.image && (
                              <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                                <Image
                                  src={mediaItem.image}
                                  alt={mediaItem.alt || `Media ${mediaIndex + 1}`}
                                  fill
                                  className="object-cover"
                                />
                                {mediaItem.alt && (
                                  <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm p-3">
                                    {mediaItem.alt}
                                  </p>
                                )}
                              </div>
                            )}
                            {mediaItem.type === "video" && mediaItem.videoUrl && (
                              <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-gray-900">
                                <video
                                  src={mediaItem.videoUrl}
                                  controls
                                  className="w-full h-full"
                                >
                                  Your browser does not support the video tag.
                                </video>
                                {mediaItem.alt && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                    {mediaItem.alt}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Optional Divider */}
                  {block.showDivider && (
                    <hr className="border-gray-200 dark:border-gray-800 my-12" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}