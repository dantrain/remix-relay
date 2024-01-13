/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ["@remix-relay/eslint-config/remix.js"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
};
