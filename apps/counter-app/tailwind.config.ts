import sharedConfig from "@remix-relay/tailwind-config";
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}"],
  presets: [sharedConfig],
} satisfies Config;
