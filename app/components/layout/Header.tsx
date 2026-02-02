import Link from "next/link";
import fs from "fs";
import path from "path";
import React from "react";
import { ExperimentalGetTinaClient } from "../../../tina/__generated__/types";
import ActiveNav from "./ActiveNav";
import StickyHeaderWrapper from "../utils/StickyHeaderWrapper";
import MobileMenu from "./MobileMenu";

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

  if (!globalData) {
    globalData = readGlobalFile();
  }

  const nav: NavItem[] = (globalData?.header?.nav as NavItem[]) || [];
  const logo = globalData?.header?.logo || "";

  return (
    <StickyHeaderWrapper>
      <header className="flex justify-between items-center py-8">
        {logo ? (
          <Link href={"/"}>
            <img
              src={logo}
              alt={globalData?.header?.logo_alt || "Sahil Salekar Logo"}
              style={{ height: 48  ,width: 48}}
            />
          </Link>
        ) : null}

        <div className="hidden md:block">
          <ActiveNav nav={nav} />
        </div>

        <div className="md:hidden absolute right-6 top-8">
          <MobileMenu nav={nav} />
        </div>

      </header>
    </StickyHeaderWrapper>
  );
}
