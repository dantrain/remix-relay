import sharedConfig from "@repo/tailwind-config";
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}"],
  presets: [sharedConfig],
} satisfies Config;
