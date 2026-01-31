import type { Linter } from "eslint";
import config from "@remix-relay/eslint-config/node";

const eslintConfig: Linter.Config[] = [
  ...config,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  { ignores: ["apps/**", "packages/**"] },
];

export default eslintConfig;
