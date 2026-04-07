import ClientPage from "../[...filename]/client-page";
import client from "../../../tina/__generated__/client";
import Image from "next/image";

export default async function AboutPage() {
  let data: any = null;
  try {
    data = await client.queries.page({ relativePath: "about.mdx" });
  } catch (error) {
    console.warn("Failed to fetch about page data from Tina:", error);
  }

  if (!data?.data?.page) return null;

  return <section className="relative overflow-hidden">
    <ClientPage {...data} className="relative z-2" />
              {/* LEFT LINE — desktop only */}
              <div className="hidden md:block absolute left-0 top-[156px] max-w-[245px] w-1/2 overflow-hidden pointer-events-none">
                <div className="bg-reveal-edge bg-reveal-left"></div>
                <Image
                  src="/uploads/img/about-desk-left-line.svg"
                  alt="left background line"
                  width={800}
                  height={500}
                  className="w-full"
                />
              </div>

              {/* RIGHT LINE — desktop only */}
              <div className="hidden md:block absolute top-1/2 right-0 max-w-[270px] w-1/2 overflow-hidden ml-auto pointer-events-none">
                <div className="bg-reveal-edge bg-reveal-right"></div>
                <Image
                  src="/uploads/img/about-desk-right-line.svg"
                  alt="right background line"
                  width={800}
                  height={500}
                  className="w-full"
                />
              </div>

              {/* LEFT LINE — mobile only */}
              <div className="block md:hidden absolute left-0 bottom-5 max-w-[60px] w-1/2 overflow-hidden pointer-events-none">
                <div className="bg-reveal-edge bg-reveal-left"></div>
                <Image
                  src="/uploads/img/about-mob-left-line.svg"
                  alt="left background line"
                  width={800}
                  height={500}
                  className="w-full"
                />
              </div>

              {/* RIGHT LINE — mobile only */}
              <div className="block md:hidden absolute -right-[25px] top-[38%] max-w-20 w-1/2 overflow-hidden pointer-events-none">
                <div className="bg-reveal-edge bg-reveal-right"></div>
                <Image
                  src="/uploads/img/about-mob-right-line.svg"
                  alt="right background line"
                  width={800}
                  height={500}
                  className="w-full"
                />
              </div>
  </section>
  
  ;
}
