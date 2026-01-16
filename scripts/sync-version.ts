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

const buildNumber = process.env.GITHUB_RUN_NUMBER;
const version = buildNumber ? `${packageJson.version}.${buildNumber}` : packageJson.version;

manifest.version = version;

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

console.log(`Synced version ${version} to manifest.json`);
