import ClientPage from "../[...filename]/client-page";
import client from "../../tina/__generated__/client";

export default async function AboutPage() {
  const data = await client.queries.page({ relativePath: "about.mdx" });
  return <ClientPage {...data} />;
}
