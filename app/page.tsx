import type { Metadata } from "next";
import ClientPage from "./(main)/[...filename]/client-page";
import client from "../tina/__generated__/client";
import PageWithIntro from "./components/ui/PageWithIntro";
import HomeBgLines from "./components/ui/HomeBgLines";
import HomeAnimWrapper from "./components/ui/HomeAnimWrapper";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://sahilsal.com",
  },
};

const HERO_CONTAINER = "hero-section-container relative overflow-hidden";

export default async function HomePage() {
  let data: any = null;

  try {
    data = await client.queries.page({ relativePath: "home.mdx" });
  } catch (error) {
    console.warn("Failed to fetch home page data from Tina:", error);
    return (
      <PageWithIntro>
        <div className={HERO_CONTAINER}>
          <section className="home-hero-section text-center z-10">Loading...</section>
        </div>
      </PageWithIntro>
    );
  }

  if (!data?.data?.page) {
    return (
      <PageWithIntro>
        <div className={HERO_CONTAINER}>
          <section className="home-hero-section text-center z-10">Page not found</section>
        </div>
      </PageWithIntro>
    );
  }

  return (
    <PageWithIntro>
      <HomeAnimWrapper>
        <div className={HERO_CONTAINER}>
          <section className="home-hero-section  text-center z-10 bg-[radial-gradient(circle,white_0%,rgba(255,255,255,0)_80%)]">
            <ClientPage {...data} className={"radial-fade pt-8 md:pt-21 px-4 relative z-3"} />
          </section>

          <HomeBgLines />
        </div>
      </HomeAnimWrapper>
    </PageWithIntro>
  );
}