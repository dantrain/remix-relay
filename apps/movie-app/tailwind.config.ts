import type { Config } from "tailwindcss";
import sharedConfig from "@remix-relay/tailwind-config";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./node_modules/@remix-relay/ui/dist/index.js",
  ],
  presets: [sharedConfig],
} satisfies Config;
