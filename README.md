# rtl-check

CLI tool that scans React/Next.js + Tailwind projects, detects RTL direction issues, and suggests logical-property fixes.

## Install

```bash
npm install
```

## Usage

```bash
npx tsx src/cli.ts <directory>
# e.g.
npx tsx src/cli.ts sandbox
```

Or build first, then run:

```bash
npm run build
node dist/cli.js <directory>
```

The tool scans `*.tsx`, `*.jsx`, and `*.html` files (ignoring `node_modules`, `.next`, and `dist`), reports physical Tailwind classes such as `ml-4`, `text-left`, `md:pr-2`, and suggests their logical equivalents (`ms-4`, `text-start`, `md:pe-2`).

Exit code is `1` when issues are found, `0` otherwise — suitable for CI.

## Rules

- `tailwind-physical` — flags physical direction classes and suggests logical replacements.

## Tests

```bash
npm test
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript with `tsc` |
| `npm run dev` | Run `src/cli.ts` with `tsx` |
| `npm test` | Run `vitest run` |

## License

MIT
