import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = process.cwd();
const scanRoots = ["src", "public", ".github", "next.config.ts", "vercel.json"];
const blockedPatterns = [
  /(?:sk|rk|pk)-(?:live|test)?[_-]?[A-Za-z0-9]{20,}/g,
  /VERCEL_TOKEN\s*=\s*[^\s$<{][^\s]*/g,
  /(?:API_KEY|SECRET_KEY|ACCESS_TOKEN)\s*=\s*["'][^"']{8,}["']/g,
];

async function walk(path) {
  const info = await stat(path);
  if (info.isFile()) return [path];
  const entries = await readdir(path, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (["node_modules", ".next", ".git"].includes(entry.name)) continue;
    files.push(...await walk(join(path, entry.name)));
  }
  return files;
}

const targets = [];
for (const item of scanRoots) {
  try { targets.push(...await walk(join(root, item))); } catch { /* optional path */ }
}

const findings = [];
for (const file of targets) {
  const content = await readFile(file, "utf8").catch(() => "");
  for (const pattern of blockedPatterns) {
    const matches = content.match(pattern);
    if (matches?.length) findings.push({ file: relative(root, file), sample: matches[0].slice(0, 80) });
  }
}

if (findings.length) {
  console.error("Potential secrets found:");
  for (const finding of findings) console.error(`- ${finding.file}: ${finding.sample}`);
  process.exit(1);
}

console.log(`Secret scan passed (${targets.length} files).`);
