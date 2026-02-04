import ClientPage from "../[...filename]/client-page";
import client from "../../../tina/__generated__/client";
import Image from "next/image";

export default async function AboutPage() {
  const data = await client.queries.page({ relativePath: "about.mdx" });
  return <section className="relative">
    <ClientPage {...data} />
    <div className="bg-container pointer-events-none h-full">
              {/* LEFT LINE */}
              <div className="absolute left-0 top-8 max-w-[245px]  w-1/2 overflow-hidden">
                <div className="bg-reveal-edge bg-reveal-left"></div>
                <Image
                  src="uploads/img/about-desk-left-line.svg"
                  alt="left background line"
                  width={800}
                  height={500}
                  className="w-full"
                />
              </div>
    
              {/* RIGHT LINE */}
              <div className="absolute top-1/2 right-0 max-w-[270px] w-1/2 overflow-hidden ml-auto">
                <div className="bg-reveal-edge bg-reveal-right"></div>
                <Image
                  src="uploads/img/about-desk-right-line.svg"
                  alt="right background line"
                  width={800}
                  height={500}
                  className="w-full"
                />
              </div>
            </div>
  </section>
  
  ;
}
