import ClientPage from "./client-page";
import client from "../../tina/__generated__/client";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const pages = await client.queries.pageConnection();
  const paths = pages.data?.pageConnection?.edges?.map((edge) => ({
    filename: edge?.node?._sys.breadcrumbs,
  }));

  return paths || [];
}

export default async function Page({
  params,
}: {
  params: { filename: string[] };
}) {
  // Build a relativePath from the catch-all params (supports nested paths)
  const relPath = Array.isArray(params.filename)
    ? params.filename.join("/")
    : params.filename;
  const relativePath = `${relPath}.mdx`;

  let result;
  try {
    result = await client.queries.page({
      relativePath,
    });
  } catch (err) {
    // If Tina client throws because the record is missing, return 404.
    // Otherwise rethrow so the error surfaces (network/auth issues shouldn't be masked).
    const message = err?.message || (err && JSON.stringify(err)) || "";
    if (typeof message === "string" && message.includes("Unable to find record")) {
      notFound();
    }
    throw err;
  }

  // If Tina returned but the page is missing, return a 404
  if (!result?.data?.page) {
    notFound();
  }

  return <ClientPage {...result} />;
}
