import { mkdir, copyFile, cp, rm } from "node:fs/promises";
import path from "node:path";
const destination = path.resolve("dist");
if (destination !== path.join(process.cwd(), "dist"))
  throw new Error("Unexpected build directory");
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
for (const file of [
  "index.html",
  "styles.css",
  "script.js",
  "catalog.js",
  "tools.json",
  "favicon.ico",
  "smlc_logo.png",
]) {
  await copyFile(file, path.join(destination, file));
}
await cp("assets", path.join(destination, "assets"), { recursive: true });
console.log(
  "Static site built in dist/; maintenance records are not published.",
);
