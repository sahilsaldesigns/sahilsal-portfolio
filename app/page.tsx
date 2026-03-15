import ClientPage from "./(main)/[...filename]/client-page";
import client from "../tina/__generated__/client";
import PageWithIntro from "./components/ui/PageWithIntro";
import HomeBgLines from "./components/ui/HomeBgLines";
import HomeAnimWrapper from "./components/ui/HomeAnimWrapper";

export default async function HomePage() {
  let data: any = null;
  
  try {
    data = await client.queries.page({ relativePath: "home.mdx" });
  } catch (error) {
    console.warn("Failed to fetch home page data from Tina:", error);
    // Return empty page during build failures
    return (
      <PageWithIntro>
        <div className="hero-section-container relative">
          <section className="home-hero-section text-center z-10">Loading...</section>
        </div>
      </PageWithIntro>
    );
  }

  if (!data?.data?.page) {
    return (
      <PageWithIntro>
        <div className="hero-section-container relative">
          <section className="home-hero-section text-center z-10">Page not found</section>
        </div>
      </PageWithIntro>
    );
  }

  return (
    <PageWithIntro>
      <HomeAnimWrapper>
        <div className="hero-section-container relative">
          <section className="home-hero-section  text-center z-10 bg-[radial-gradient(circle,white_0%,rgba(255,255,255,0)_80%)]">
            <ClientPage {...data} className={"radial-fade pt-21 px-4 relative z-1"} />
          </section>

          <HomeBgLines />
        </div>
      </HomeAnimWrapper>
    </PageWithIntro>
  );
}