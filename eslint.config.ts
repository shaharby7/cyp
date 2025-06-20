import globals from "globals";
import { defineConfig } from "eslint/config";
import tsParser from "@typescript-eslint/parser";
import * as pluginJest from "eslint-plugin-jest";

export default defineConfig([
  {
    files: ["**/*.ts"],
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
      "no-console": "warn",
      "no-unused-vars": "warn",
    },
  },
]);
