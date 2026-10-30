import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, relative, sep } from "node:path";

const SKIP_DIRS = new Set([
  ".git", ".next", ".vercel", ".wrangler", "node_modules",
  "test-results", "migrations", "bundles",
]);
const SKIP_PATHS = ["src/content"]; // lesson .mdx files; send a sample separately if needed
const SKIP_FILES = /^(package-lock\.json|tsconfig\.tsbuildinfo|next-env\.d\.ts|LICENSE.*|favicon\.ico)$/;
const TEXT_EXT = /\.(ts|tsx|mjs|css|json|jsonc|md|yml|prisma|toml|webmanifest|js)$/;
const MAX_CHARS = 400_000; // split a bundle into parts above this size

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    const rel = relative(".", full).split(sep).join("/");
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name) || SKIP_PATHS.includes(rel)) continue;
      walk(full, out);
    } else {
      if (SKIP_FILES.test(entry.name)) continue;
      if (entry.name.startsWith(".env") && entry.name !== ".env.example") continue;
      if (!TEXT_EXT.test(entry.name) && entry.name !== ".env.example") continue;
      out.push(rel);
    }
  }
  return out;
}

function groupOf(p) {
  if (p.startsWith("src/components/")) return "components";
  if (p.startsWith("src/app/api/")) return "api-routes";
  if (p.startsWith("src/app/")) return "app-pages";
  if (/^src\/(lib|hooks|middleware|types)\//.test(p) || p === "src/mdx-components.tsx") return "logic";
  if (/^(prisma|e2e|scripts|proxy-worker)\//.test(p)) return "prisma-tests-infra";
  return "config-and-docs";
}

const groups = {};
for (const p of walk(".").sort()) (groups[groupOf(p)] ??= []).push(p);

mkdirSync("bundles", { recursive: true });
for (const [name, files] of Object.entries(groups)) {
  let part = 1, buf = "";
  const flush = () => {
    if (!buf) return;
    writeFileSync(`bundles/${name}-${part++}.txt`, buf);
    buf = "";
  };
  for (const f of files) {
    const chunk = `\n===== FILE: ${f} =====\n${readFileSync(f, "utf8")}\n`;
    if (buf.length + chunk.length > MAX_CHARS) flush();
    buf += chunk;
  }
  flush();
}
console.log("Done. Upload everything in the ./bundles folder.");