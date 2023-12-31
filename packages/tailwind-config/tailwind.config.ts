import type { Config } from "tailwindcss";

export default {
  theme: {
    extend: {},
  },
  plugins: [],
  // We want each package to be responsible for its own content.
} satisfies Omit<Config, "content">;
