import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  // Global ignores MUST come first to prevent ESLint from traversing ignored directories
  globalIgnores([
    // eslint-config-next claims node_modules is ignored by default but it's NOT in their ignores array.
    // ESLint 9+ does not ignore node_modules by default.
    "node_modules/**",
    ".next/**",
    ".open-next/**",
    ".wrangler/**",
    ".git/**",
    "dist/**",
    "build/**",
    "coverage/**",
    "out/**",
    "next-env.d.ts",
  ]),
  ...nextVitals,
  ...nextTs,
]);

export default eslintConfig;
