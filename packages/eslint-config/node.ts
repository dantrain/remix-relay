import type { Linter } from "eslint";
import globals from "globals";
import tseslint from "typescript-eslint";
import baseConfig from "./base.js";

export default [
  ...baseConfig,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
] as Linter.Config[];
