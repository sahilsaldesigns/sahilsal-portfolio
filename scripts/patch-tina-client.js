/**
 * Patches tina/__generated__/client.js after `tinacms build --local` on Windows.
 *
 * Problem: TinaCMS generates an absolute cacheDir path (e.g. "C:/dev-vn/...").
 * During next build, the client code does path.join(os.tmpdir(), cacheDir) which
 * on Windows concatenates two absolute paths into an invalid path, causing ENOENT.
 *
 * Fix: Remove the cacheDir property so the client skips disk caching.
 */
const fs = require("fs");
const path = require("path");

const clientPath = path.join(__dirname, "..", "tina", "__generated__", "client.js");

if (!fs.existsSync(clientPath)) {
  console.warn("patch-tina-client: client.js not found, skipping.");
  process.exit(0);
}

let content = fs.readFileSync(clientPath, "utf-8");
const patched = content.replace(/\bcacheDir:\s*"[^"]*",?\s*/g, "");

if (patched === content) {
  console.log("patch-tina-client: no cacheDir found, nothing to patch.");
} else {
  fs.writeFileSync(clientPath, patched, "utf-8");
  console.log("patch-tina-client: removed absolute cacheDir from client.js");
}
