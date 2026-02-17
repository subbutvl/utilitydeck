const fs = require("fs");
const path = require("path");

const MODULES_DIR = path.join(__dirname, "..", "modules");

const replacements = [
  ["bg-[#0a0a0a]", "bg-[var(--bg-page)]"],
  ["bg-[#070707]", "bg-[var(--bg-page)]"],
  ["bg-[#111]", "bg-[var(--bg-card)]"],
  ["bg-[#111111]", "bg-[var(--bg-card)]"],
  ["bg-black", "bg-[var(--bg-input)]"],
  ["bg-neutral-900", "bg-[var(--bg-card)]"],
  ["bg-neutral-950/50", "bg-[var(--bg-card)]/50"],
  ["bg-neutral-950", "bg-[var(--bg-card)]"],
  ["bg-neutral-800", "bg-[var(--bg-hover)]"],
  ["text-white", "text-[var(--text-primary)]"],
  ["text-neutral-200", "text-[var(--text-primary)]"],
  ["text-neutral-300", "text-[var(--text-primary)]"],
  ["text-neutral-400", "text-[var(--text-muted)]"],
  ["text-neutral-500", "text-[var(--text-muted)]"],
  ["text-neutral-600", "text-[var(--text-muted)]"],
  ["text-neutral-700", "text-[var(--text-muted)]"],
  ["text-neutral-800", "text-[var(--text-muted)]"],
  ["border-neutral-800", "border-[var(--border)]"],
  ["border-neutral-900", "border-[var(--border)]"],
  ["border-neutral-700", "border-[var(--border)]"],
  ["border-neutral-500", "border-[var(--border-hover)]"],
  ["divide-neutral-800/30", "divide-[var(--border)]/30"],
  ["hover:border-neutral-600", "hover:border-[var(--border-hover)]"],
  ["hover:border-neutral-500", "hover:border-[var(--border-hover)]"],
  ["focus:border-neutral-600", "focus:border-[var(--border-hover)]"],
  ["hover:bg-neutral-800", "hover:bg-[var(--bg-hover)]"],
  ["hover:bg-neutral-700", "hover:bg-[var(--bg-hover)]"]
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat?.isDirectory()) results = results.concat(walk(full));
    else if (file.endsWith(".tsx")) results.push(full);
  }
  return results;
}

const files = walk(MODULES_DIR);
let count = 0;
for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  let changed = false;
  for (const [from, to] of replacements) {
    if (content.includes(from)) {
      content = content.split(from).join(to);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(file, content);
    count++;
  }
}
console.log("Applied theme vars to", count, "files");
