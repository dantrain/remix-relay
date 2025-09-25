const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["eslint:recommended", "prettier", "plugin:turbo/recommended"],
  plugins: ["only-warn"],
  globals: {
    React: true,
    JSX: true,
    NodeJS: true,
  },
  env: {
    browser: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/",
    "dist/",
  ],
  overrides: [
    {
      files: ["**/*.{js,jsx,ts,tsx}"],
      plugins: ["react", "jsx-a11y"],
      extends: [
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
        require.resolve("@vercel/style-guide/eslint/react"),
      ],
      settings: {
        react: {
          version: "detect",
        },
      },
      rules: {
        "react/no-unescaped-entities": ["error", { forbid: [">", "}"] }],
      },
    },
  ],
};
