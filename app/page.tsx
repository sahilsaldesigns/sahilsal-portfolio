import ClientPage from "./(main)/[...filename]/client-page";
import client from "../tina/__generated__/client";
import Image from "next/image";
import PageWithIntro from "./components/ui/PageWithIntro";

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
      <div className="hero-section-container relative">
        <section className="home-hero-section  text-center z-10 bg-[radial-gradient(circle,white_0%,rgba(255,255,255,0)_80%)]">
          <ClientPage {...data} className={"radial-fade pt-21 px-4 relative z-1"} />
        </section>

        <div className="bg-container pointer-events-none h-full">
          {/* DESKTOP — LEFT LINE */}
          <div className="hidden md:block absolute left-0 top-8 max-w-[440px] w-1/2 overflow-hidden">
            <div className="bg-reveal-edge bg-reveal-left"></div>
            <Image
              src="uploads/img/home-desk-left-line.svg"
              alt="left background line"
              width={800}
              height={500}
              className="w-full"
            />
          </div>

          {/* DESKTOP — RIGHT LINE */}
          <div className="hidden md:block absolute right-0 max-w-[440px] w-1/2 overflow-hidden ml-auto">
            <div className="bg-reveal-edge bg-reveal-right"></div>
            <Image
              src="uploads/img/home-desk-right-line.svg"
              alt="right background line"
              width={800}
              height={500}
              className="w-full"
            />
          </div>

          {/* MOBILE — LEFT LINE (bottom) */}
          <div className="block md:hidden absolute -left-5 top-[28%] min-[424px]:top-[32%] min-[569px]:top-[28%] max-w-[164px] w-1/2 overflow-hidden">
            <div className="bg-reveal-edge bg-reveal-left"></div>
            <Image
              src="uploads/img/home-mob-left-line.svg"
              alt="left background line"
              width={400}
              height={400}
              className="w-full"
            />
          </div>

          {/* MOBILE — RIGHT LINE (top) */}
          <div className="block md:hidden absolute -right-2 top-0 max-w-[145px] w-1/2 overflow-hidden ml-auto">
            <div className="bg-reveal-edge bg-reveal-right"></div>
            <Image
              src="uploads/img/home-mob-right-line.svg"
              alt="right background line"
              width={400}
              height={400}
              className="w-full"
            />
          </div>
        </div>

      </div>
    </PageWithIntro>
  );
}