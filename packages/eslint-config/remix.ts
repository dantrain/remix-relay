import type { Linter } from "eslint";
import globals from "globals";
import reactConfig from "./react.js";

export default [
  ...reactConfig,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    settings: {
      formComponents: ["Form"],
      linkComponents: [
        { name: "Link", linkAttribute: "to" },
        { name: "NavLink", linkAttribute: "to" },
      ],
    },
  },
] as Linter.Config[];
