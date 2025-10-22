import ClientPage from "../[...filename]/client-page";
import client from "../../tina/__generated__/client";

export default async function PhotographyPage() {
  // Expecting a Tina page at content/page/photography.mdx - create it if you
  // want editable content. For now, attempt to load it and fall back to an
  // empty body.
  const data = await client.queries.page({ relativePath: "photography.mdx" });
  return <ClientPage {...data} />;
}
