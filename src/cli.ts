#!/usr/bin/env node
import fg from "fast-glob";
import { readFileSync } from "node:fs";
import { rules } from "./rules/index.js";

const dir = process.argv[2] ?? ".";
const files = await fg(["**/*.{tsx,jsx,html}"], {
  cwd: dir,
  absolute: true,
  ignore: ["**/node_modules/**", "**/.next/**", "**/dist/**"],
});

let total = 0;
for (const file of files) {
  const content = readFileSync(file, "utf8");
  for (const rule of rules) {
    for (const i of rule.run({ file, content })) {
      total++;
      console.log(`${i.file}:${i.line}:${i.column}  ${i.found} → ${i.fix}`);
    }
  }
}
console.log(`\n${total} issue(s) in ${files.length} file(s)`);
process.exit(total ? 1 : 0);
