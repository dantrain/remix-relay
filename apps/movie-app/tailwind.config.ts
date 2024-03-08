import sharedConfig from "@remix-relay/tailwind-config";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./node_modules/@remix-relay/ui/dist/index.js",
  ],
  presets: [sharedConfig],
} satisfies Config;
