import type { Rule, Issue } from "../types.js";

// [physical, logical, exactAllowed]
const MAP: [string, string, boolean][] = [
  ["ml", "ms", false], ["mr", "me", false],
  ["pl", "ps", false], ["pr", "pe", false],
  ["left", "start", false], ["right", "end", false],
  ["text-left", "text-start", true], ["text-right", "text-end", true],
  ["float-left", "float-start", true], ["float-right", "float-end", true],
  ["border-l", "border-s", true], ["border-r", "border-e", true],
  ["rounded-l", "rounded-s", true], ["rounded-r", "rounded-e", true],
];

function convert(token: string): string | null {
  const i = token.lastIndexOf(":");
  const variants = i >= 0 ? token.slice(0, i + 1) : "";
  let base = i >= 0 ? token.slice(i + 1) : token;
  const neg = base.startsWith("-") ? "-" : "";
  if (neg) base = base.slice(1);

  for (const [from, to, exactOk] of MAP) {
    if (base.startsWith(from + "-")) {
      return variants + neg + to + base.slice(from.length);
    }
    if (exactOk && base === from) return variants + neg + to;
  }
  return null;
}

export const tailwindPhysical: Rule = {
  id: "tailwind-physical",
  run({ file, content }) {
    const issues: Issue[] = [];
    content.split("\n").forEach((line, idx) => {
      const re = /[\w:\-\[\]\.\/%]+/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(line))) {
        const fix = convert(m[0]);
        if (fix) {
          issues.push({
            file,
            line: idx + 1,
            column: m.index + 1,
            ruleId: "tailwind-physical",
            message: "Use a logical property instead of a physical direction",
            found: m[0],
            fix,
          });
        }
      }
    });
    return issues;
  },
};
