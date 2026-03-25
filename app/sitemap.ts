import { MetadataRoute } from "next";
import client from "../tina/__generated__/client";

const BASE_URL = "https://www.sahilsal.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/photography`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  let caseStudyRoutes: MetadataRoute.Sitemap = [];
  try {
    const result = await client.queries.caseStudyConnection();
    const edges = result.data?.caseStudyConnection?.edges ?? [];
    caseStudyRoutes = edges
      .filter((edge) => edge?.node?._sys?.filename)
      .map((edge) => ({
        url: `${BASE_URL}/case-studies/${edge!.node!._sys.filename}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.9,
      }));
  } catch {
    // Tina unavailable during local build — case studies omitted
  }

  return [...staticRoutes, ...caseStudyRoutes];
}
