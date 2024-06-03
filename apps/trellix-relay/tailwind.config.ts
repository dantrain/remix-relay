import type { Config } from "tailwindcss";
import sharedConfig from "@remix-relay/tailwind-config";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./node_modules/@remix-relay/ui/dist/index.js",
  ],
  theme: {
    extend: {
      animation: {
        fade: "fade 400ms ease-in 50ms both",
      },
      keyframes: {
        fade: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
    },
  },
  presets: [sharedConfig],
} satisfies Config;
