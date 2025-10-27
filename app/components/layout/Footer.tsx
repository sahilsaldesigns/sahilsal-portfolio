import fs from "fs";
import path from "path";
import React from "react";
import { ExperimentalGetTinaClient } from "../../../tina/__generated__/types";

function readGlobalFile() {
  try {
    const file = path.join(process.cwd(), "content", "global", "global.json");
    const raw = fs.readFileSync(file, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return { footer: {} };
  }
}

export default async function Footer() {
  let globalData: any = null;
  try {
    const tina = ExperimentalGetTinaClient();
    const res = await tina.global({ relativePath: "global.json" });
    globalData = res?.data?.global;
  } catch (e) {
    // fall back to file
  }

  if (!globalData) {
    globalData = readGlobalFile();
  }

  const copyright = globalData?.footer?.copyright || "";

  return (
    <footer className="text-center py-8">
      <div>{copyright}</div>
    </footer>
  );
}
