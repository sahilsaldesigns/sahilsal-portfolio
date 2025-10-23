import PostClient from "./client-page";
import client from "../../../tina/__generated__/client";

export async function generateStaticParams() {
  const posts = await client.queries.postConnection();
  const paths = posts.data?.postConnection?.edges?.map((edge) => ({
    slug: edge?.node?._sys?.filename,
  }));

  return paths || [];
}

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
  const relativePath = `${params.slug}.md`;
  const data = await client.queries.post({ relativePath });
  return <PostClient {...data} />;
}
