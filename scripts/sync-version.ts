import { readFileSync, writeFileSync } from "node:fs";

interface PackageJson {
  version: string;
}

interface Manifest {
  version: string;
  [key: string]: unknown;
}

const packageJson: PackageJson = JSON.parse(readFileSync("package.json", "utf-8"));
const manifestPath = "dist/manifest.json";
const manifest: Manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));

manifest.version = packageJson.version;

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

console.log(`Synced version ${packageJson.version} to manifest.json`);
