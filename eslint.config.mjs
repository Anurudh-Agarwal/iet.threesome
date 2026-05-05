import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...tseslint.configs.recommendedTypeChecked,

  prettierConfig,                      // must be last — disables conflicting rules

  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      // ── Semicolons ──────────────────────────────
      "semi":                              "off",      // off — TS version handles it
      "@typescript-eslint/semi":           ["error", "always"],
      "semi-style":                        ["error", "last"],
      "semi-spacing":                      ["error", { before: false, after: true }],

      // ── TypeScript ───────────────────────────────
      "no-unused-vars":                    "off",      // off — TS version handles it
      "@typescript-eslint/no-unused-vars": ["error", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      }],
      "@typescript-eslint/no-explicit-any":            "error",
      "@typescript-eslint/no-floating-promises":       "error",
      "@typescript-eslint/await-thenable":             "error",
      "@typescript-eslint/consistent-type-imports":   ["error", {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      }],

      // ── Best practices ───────────────────────────
      "eqeqeq":           ["error", "always"],
      "no-var":            "error",
      "prefer-const":      "error",
      "prefer-template":   "error",
      "object-shorthand":  "error",
      "no-console":       ["warn", { allow: ["warn", "error"] }],
    },
  },

  // Test file relaxations
  {
    files: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
    rules: {
      "no-console":                              "off",
      "@typescript-eslint/no-explicit-any":      "off",
      "@typescript-eslint/no-floating-promises": "off",
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
  ]),
]);

export default eslintConfig;