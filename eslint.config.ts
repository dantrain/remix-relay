import type { Linter } from "eslint";
import config from "@remix-relay/eslint-config/node";

export default [
  ...config,
  { ignores: ["apps/**", "packages/**"] },
] satisfies Linter.Config[];
