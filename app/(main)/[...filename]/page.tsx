import ClientPage from "./client-page";
import client from "../../../tina/__generated__/client";
import { notFound } from "next/navigation";
import Image from "next/image";

export async function generateStaticParams() {
  try {
    const pages = await client.queries.pageConnection();
    const paths = pages.data?.pageConnection?.edges?.map((edge) => ({
      filename: edge?.node?._sys.breadcrumbs,
    }));
    return paths || [];
  } catch (error) {
    console.warn("Failed to fetch page connection from Tina:", error);
    // Return empty array to allow build to continue
    return [];
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ filename: string[] }>;
}) {
  const { filename } = await params;
  // Build a relativePath from the catch-all params (supports nested paths)
  const relPath = Array.isArray(filename)
    ? filename.join("/")
    : filename;
  const relativePath = `${relPath}.mdx`;

  let result;
  try {
    result = await client.queries.page({
      relativePath,
    });
  } catch (err) {
    // If Tina client throws because the record is missing, return 404.
    // For network/connection errors during build, log and skip
    const message = err?.message || (err && JSON.stringify(err)) || "";
    if (typeof message === "string" && message.includes("Unable to find record")) {
      notFound();
    }
    // For fetch/connection errors during build, return 404
    if (typeof message === "string" && (message.includes("fetch failed") || message.includes("ECONNREFUSED"))) {
      console.warn("Tina server unavailable, returning 404 for:", relativePath);
      notFound();
    }
    throw err;
  }

  // If Tina returned but the page is missing, return a 404
  if (!result?.data?.page) {
    notFound();
  }

  if (relativePath === "about.mdx") {
    return (
      <section className="relative overflow-hidden">
        <ClientPage {...result} className="relative z-2" />

        {/* LEFT LINE — desktop only */}
        <div className="hidden md:block absolute left-0 top-[156px] max-w-[245px] w-1/2 overflow-hidden pointer-events-none">
          <div className="bg-reveal-edge bg-reveal-left"></div>
          <Image src="/uploads/img/about-desk-left-line.svg" alt="left background line" width={800} height={500} className="w-full" />
        </div>

        {/* RIGHT LINE — desktop only */}
        <div className="hidden md:block absolute top-1/2 right-0 max-w-[270px] w-1/2 overflow-hidden ml-auto pointer-events-none">
          <div className="bg-reveal-edge bg-reveal-right"></div>
          <Image src="/uploads/img/about-desk-right-line.svg" alt="right background line" width={800} height={500} className="w-full" />
        </div>

        {/* LEFT LINE — mobile only */}
        <div className="block md:hidden absolute left-0 bottom-5 max-w-[60px] w-1/2 overflow-hidden pointer-events-none">
          <div className="bg-reveal-edge bg-reveal-left"></div>
          <Image src="/uploads/img/about-mob-left-line.svg" alt="left background line" width={800} height={500} className="w-full" />
        </div>

        {/* RIGHT LINE — mobile only */}
        <div className="block md:hidden absolute -right-[25px] top-[38%] max-w-20 w-1/2 overflow-hidden pointer-events-none">
          <div className="bg-reveal-edge bg-reveal-right"></div>
          <Image src="/uploads/img/about-mob-right-line.svg" alt="right background line" width={800} height={500} className="w-full" />
        </div>
      </section>
    );
  }

  return <ClientPage {...result} />;
}
