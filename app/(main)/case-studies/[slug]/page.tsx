
import client from "../../../../tina/__generated__/client";
import CaseStudyPage from "./client-page";

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await client.queries.caseStudy({
    relativePath: `${slug}.mdx`,
  });

  return <CaseStudyPage {...res} />;
}
