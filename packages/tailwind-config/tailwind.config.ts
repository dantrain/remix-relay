import type { Config } from "tailwindcss";

const config = {
  theme: {
    extend: {},
  },
  plugins: [],
  // We want each package to be responsible for its own content.
} satisfies Omit<Config, "content">;

export default config;
