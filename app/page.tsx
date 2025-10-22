import ClientPage from "./[...filename]/client-page";
import client from "../tina/__generated__/client";

export default async function HomePage() {
  const data = await client.queries.page({ relativePath: "home.mdx" });
  return <ClientPage {...data} />;
}
