import Link from "next/link";
import fs from "fs";
import path from "path";
import React from "react";
import Image from "next/image";
import { ExperimentalGetTinaClient } from "../../../tina/__generated__/types";
import ActiveNav from "./ActiveNav";
import MobileMenu from "./MobileMenu";
import globalJsonFallback from "../../../content/global/global.json";

type NavItem = { href: string; label?: string; target: string };
function readGlobalFile() {
  try {
    const file = path.join(process.cwd(), "content", "global", "global.json");
    const raw = fs.readFileSync(file, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return { header: { nav: [] } };
  }
}

export default async function Header() {
  let globalData: any = null;

  try {
    const tina = ExperimentalGetTinaClient();
    const res = await tina.global({ relativePath: "global.json" });
    globalData = res?.data?.global;
  } catch (e) {
    // fallback
  }

  if (!globalData?.header?.nav?.length) {
    globalData = globalJsonFallback;
  }

  const nav: NavItem[] = (globalData?.header?.nav as NavItem[]) || [];
  const logo = globalData?.header?.logo || "";

  return (
      <header className="flex justify-between items-center py-4 md:pt-8 md:pb-0 z-50">
        {logo ? (
          <Link href={"/"} aria-label="Go to homepage">
            <Image
              src={logo}
              alt={globalData?.header?.logo_alt || "Sahil Salekar Logo"}
              width={48}
              height={48}
              className="w-8 h-8 md:w-12 md:h-12"
              priority
            />
          </Link>
        ) : null}

        <div className="hidden md:block">
          <ActiveNav nav={nav} />
        </div>

        <div className="md:hidden absolute right-[18px] top-[18px]">
          <MobileMenu nav={nav} />
        </div>

      </header>
  );
}
