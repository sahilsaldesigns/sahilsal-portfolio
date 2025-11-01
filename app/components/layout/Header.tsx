import Link from "next/link";
import fs from "fs";
import path from "path";
import React from "react";
import { ExperimentalGetTinaClient } from "../../../tina/__generated__/types";
import ActiveNav from "./ActiveNav"; // 👈 small client component

type NavItem = { href: string; label?: string };

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
    <header className="flex justify-between py-8">
      {logo ? (
        <Link href={"/"}>
          <img
            src={logo}
            alt={globalData?.header?.logo_alt || "Sahil Salekar Logo"}
            style={{ height: 36 }}
          />
        </Link>
      ) : null}

      {/* ✅ Small client-only part */}
      <ActiveNav nav={nav} />
    </header>
  );
}
