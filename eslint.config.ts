import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";
import tsParser from "@typescript-eslint/parser";
import * as pluginJest from "eslint-plugin-jest";

export default defineConfig([
  globalIgnores(["**/dist/**", "**/node_modules/**", "**/coverage/**"]),
  {
    files: [["**/*.ts"]],
    plugins: {
      jest: pluginJest,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parser: tsParser,
    },
    rules: {
      "no-console": "off", // We are building cli tool :)
      "no-unused-vars": "warn",
    },
  },
]);
