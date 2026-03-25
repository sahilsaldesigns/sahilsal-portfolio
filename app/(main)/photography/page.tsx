import ClientPage from "../[...filename]/client-page";
import client from "../../../tina/__generated__/client";

export default async function PhotographyPage() {
  let data: any = null;
  try {
    data = await client.queries.page({ relativePath: "photography.mdx" });
  } catch (error) {
    console.warn("Failed to fetch photography page data from Tina:", error);
  }

  if (!data?.data?.page) return null;

  return <>
    <ClientPage {...data} />
  </>;
}
