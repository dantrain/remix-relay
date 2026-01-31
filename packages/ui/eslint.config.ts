import type { Linter } from "eslint";
import config from "@remix-relay/eslint-config/react";

const eslintConfig: Linter.Config[] = [
  ...config,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];

export default eslintConfig;
