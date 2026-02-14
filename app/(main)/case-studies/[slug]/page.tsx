
import client from "../../../../tina/__generated__/client";
import CaseStudyPage from "./client-page";

export default async function CaseStudyDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const res = await client.queries.caseStudy({
    relativePath: `${params.slug}.mdx`,
  });

  return <CaseStudyPage {...res} />;
}
