import ClientPage from "./[...filename]/client-page";
import client from "../tina/__generated__/client";
import CardSlider from "./components/ui/CardSlider";
import Image from "next/image";
import SocialLinks from "./components/ui/SocialLinks";

export default async function HomePage() {
  const data = await client.queries.page({ relativePath: "home.mdx" });
  const globalData = await client.queries.global({
    relativePath: "global.json",
  });

  return (
    <>
      <div className="hero-section-container relative py-20">
        <section className="home-hero-section text-center z-10 bg-[radial-gradient(circle,white_0%,rgba(255,255,255,0)_80%)]">
          <ClientPage {...data} />
        </section>
        <div className="bg-container">
          <div className="bg-reveal-edge"></div>
          <Image src="uploads/hero-line-3.svg" alt="background image" width={500} height={500} className="w-full" />
        </div>
      </div>

      <CardSlider />
      <SocialLinks links={globalData.data.global.socialLinks ?? []} />
    </>
  );
}
