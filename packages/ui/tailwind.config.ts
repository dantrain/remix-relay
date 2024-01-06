import sharedConfig from "@remix-relay/tailwind-config";
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  corePlugins: {
    preflight: false,
  },
  presets: [sharedConfig],
} satisfies Config;
