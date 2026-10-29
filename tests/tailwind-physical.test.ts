import { describe, it, expect } from "vitest";
import { tailwindPhysical } from "../src/rules/tailwind-physical";

const ctx = (content: string) => ({ file: "Test.tsx", content });

describe("tailwind-physical", () => {
  it("flags ml-4 -> ms-4", () => {
    const issues = tailwindPhysical.run(ctx('className="ml-4"'));
    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatchObject({
      ruleId: "tailwind-physical",
      found: "ml-4",
      fix: "ms-4",
      line: 1,
      column: 12,
    });
  });

  it("flags -ml-2 -> -ms-2", () => {
    const issues = tailwindPhysical.run(ctx('className="-ml-2"'));
    expect(issues).toHaveLength(1);
    expect(issues[0].found).toBe("-ml-2");
    expect(issues[0].fix).toBe("-ms-2");
    expect(issues[0].line).toBe(1);
    expect(issues[0].column).toBe(12);
  });

  it("flags md:pl-6 -> md:ps-6", () => {
    const issues = tailwindPhysical.run(ctx('className="md:pl-6"'));
    expect(issues).toHaveLength(1);
    expect(issues[0].found).toBe("md:pl-6");
    expect(issues[0].fix).toBe("md:ps-6");
    expect(issues[0].line).toBe(1);
    expect(issues[0].column).toBe(12);
  });

  it("flags text-left -> text-start", () => {
    const issues = tailwindPhysical.run(ctx('className="text-left"'));
    expect(issues).toHaveLength(1);
    expect(issues[0].found).toBe("text-left");
    expect(issues[0].fix).toBe("text-start");
  });

  it("flags rounded-l-lg -> rounded-s-lg", () => {
    const issues = tailwindPhysical.run(ctx('className="rounded-l-lg"'));
    expect(issues).toHaveLength(1);
    expect(issues[0].found).toBe("rounded-l-lg");
    expect(issues[0].fix).toBe("rounded-s-lg");
  });

  it("tracks correct line and column across multiple lines", () => {
    const issues = tailwindPhysical.run(
      ctx(`<div className="ml-4">\n  <span className="md:pl-6 text-left">\n    <div className="-ml-2 rounded-l-lg">`)
    );
    expect(issues).toEqual([
      {
        file: "Test.tsx",
        line: 1,
        column: 17,
        ruleId: "tailwind-physical",
        message: "Use a logical property instead of a physical direction",
        found: "ml-4",
        fix: "ms-4",
      },
      {
        file: "Test.tsx",
        line: 2,
        column: 20,
        ruleId: "tailwind-physical",
        message: "Use a logical property instead of a physical direction",
        found: "md:pl-6",
        fix: "md:ps-6",
      },
      {
        file: "Test.tsx",
        line: 2,
        column: 28,
        ruleId: "tailwind-physical",
        message: "Use a logical property instead of a physical direction",
        found: "text-left",
        fix: "text-start",
      },
      {
        file: "Test.tsx",
        line: 3,
        column: 21,
        ruleId: "tailwind-physical",
        message: "Use a logical property instead of a physical direction",
        found: "-ml-2",
        fix: "-ms-2",
      },
      {
        file: "Test.tsx",
        line: 3,
        column: 27,
        ruleId: "tailwind-physical",
        message: "Use a logical property instead of a physical direction",
        found: "rounded-l-lg",
        fix: "rounded-s-lg",
      },
    ]);
  });

  it("does not flag logical properties", () => {
    const issues = tailwindPhysical.run(ctx('className="ms-4 me-2 text-start"'));
    expect(issues).toHaveLength(0);
  });

  it("does not flag unrelated classes", () => {
    const issues = tailwindPhysical.run(ctx('className="flex"'));
    expect(issues).toHaveLength(0);
  });

  it("does not flag mlx-4", () => {
    const issues = tailwindPhysical.run(ctx('className="mlx-4"'));
    expect(issues).toHaveLength(0);
  });
});
