import { globalIgnores } from "eslint/config"
import importPlugin from "eslint-plugin-import"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import unusedImports from "eslint-plugin-unused-imports"
import neostandard, { resolveIgnoresFromGitignore } from "neostandard"

const files = ["**/*.{ts,tsx}"]

export default [
  globalIgnores(resolveIgnoresFromGitignore()),
  ...neostandard({ ts: true, noStyle: true }),
  {
    files,
    rules: {
      "no-console": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      // This fake mirrors the snake_case Seam Connect API, so snake_case
      // identifiers are the convention throughout.
      camelcase: "off",
    },
  },
  {
    files,
    plugins: {
      "unused-imports": unusedImports,
      import: importPlugin,
    },
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          fixStyle: "inline-type-imports",
        },
      ],
      "import/no-duplicates": ["error", { "prefer-inline": true }],
      "import/no-cycle": [
        "error",
        {
          ignoreExternal: true,
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["..", "../**"],
              message:
                "Import by path alias instead, e.g., lib/foo/bar.ts or fixtures/get-test-server.ts.",
            },
          ],
        },
      ],
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    files,
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^\\u0000"],
            ["^node:"],
            ["^@?\\w"],
            ["@seamapi/fake-seam-connect"],
            ["^fixtures/", "^lib/", "^nsm", "^pages"],
            ["^"],
            ["^\\."],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
    },
  },
]
