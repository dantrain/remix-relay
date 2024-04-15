import type { Config } from "tailwindcss";
import sharedConfig from "@remix-relay/tailwind-config";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  corePlugins: {
    preflight: false,
  },
  presets: [sharedConfig],
} satisfies Config;
