"use client";

import { TinaMarkdown } from "tinacms/dist/rich-text";
import Image from "next/image";
import Link from "next/link";
import { Container } from "../../../components/layout/Container";

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

  return (
    <div className="animate-fadeInUp">
      {/* Hero Section */}
      {caseStudy.heroImage && (
        <div className="relative w-full h-96 md:h-[500px] overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image
            src={caseStudy.heroImage}
            alt={caseStudy.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}

      <Container>
        <div className="py-12 md:py-20">
          {/* Back Link */}
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-8 transition-colors font-medium"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            <span>Back to Case Studies</span>
          </Link>

          {/* Title and Description */}
          <div className="mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              {caseStudy.title}
            </h1>

            {caseStudy.description && (
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
                {caseStudy.description}
              </p>
            )}
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-16 md:mb-20 pb-12 md:pb-16 border-b border-gray-200 dark:border-gray-800">
            {caseStudy.clientName && (
              <div className="group">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Client
                </p>
                <p className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                  {caseStudy.clientName}
                </p>
              </div>
            )}

            {caseStudy.role && (
              <div className="group">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Role
                </p>
                <p className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                  {caseStudy.role}
                </p>
              </div>
            )}

            {caseStudy.projectDate && (
              <div className="group">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Date
                </p>
                <p className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                  {caseStudy.projectDate}
                </p>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-16 md:mb-20 prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-blue-600 hover:prose-a:text-blue-700 dark:prose-a:text-blue-400 dark:hover:prose-a:text-blue-300 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-li:text-gray-700 dark:prose-li:text-gray-300">
            <TinaMarkdown content={caseStudy.body} />
          </div>

          {/* Tags */}
          {caseStudy.tags && caseStudy.tags.length > 0 && (
            <div className="pt-12 md:pt-16 border-t border-gray-200 dark:border-gray-800">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">
                Tags
              </p>
              <div className="flex flex-wrap gap-3">
                {caseStudy.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-16 md:mt-20 pt-12 border-t border-gray-200 dark:border-gray-800">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition-all font-medium hover:shadow-lg transform hover:scale-105 duration-200"
            >
              <span className="transition-transform group-hover:-translate-x-1">←</span>
              <span>View All Case Studies</span>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
