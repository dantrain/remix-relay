import type { Linter } from "eslint";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";
import baseConfig from "./base.js";

const pluginReactCompiler = await import("eslint-plugin-react-compiler");

export default [
  ...baseConfig,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  pluginJsxA11y.flatConfigs.recommended,
  pluginReactCompiler.configs.recommended,
  {
    languageOptions: {
      ...pluginReact.configs.flat.recommended?.languageOptions,
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    plugins: {
      "react-hooks": pluginReactHooks,
    },
    // Pinned rather than "detect" because eslint-plugin-react's version
    // detection uses context.getFilename(), removed in ESLint 10.
    settings: { react: { version: "19.2" } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      "react/no-unescaped-entities": ["error", { forbid: [">", "}"] }],
    },
  },
] as Linter.Config[];
