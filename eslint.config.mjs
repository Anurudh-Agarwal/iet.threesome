import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier"; // ✅ add this

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...tseslint.configs.recommendedTypeChecked,

  prettierConfig,

  {
    plugins: {
      prettier: prettierPlugin, // ✅ add this
    },

    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      "prettier/prettier": "warn", // ✅ shows warning if not formatted

      // ── TypeScript ───────────────────────────────
      "no-unused-vars":                    "off",
      "@typescript-eslint/no-unused-vars": ["error", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      }],
      "@typescript-eslint/no-explicit-any":          "error",
      "@typescript-eslint/no-floating-promises":     "error",
      "@typescript-eslint/await-thenable":           "error",
      "@typescript-eslint/consistent-type-imports":  ["error", {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      }],

      // ── Best practices ───────────────────────────
      "eqeqeq":          ["error", "always"],
      "no-var":           "error",
      "prefer-const":     "error",
      "prefer-template":  "error",
      "object-shorthand": "error",
      "no-console":      ["warn", { allow: ["warn", "error"] }],
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

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
  ]),
]);

export default eslintConfig;