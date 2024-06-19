/* eslint-disable @typescript-eslint/no-var-requires */
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
        fade: "fade 200ms ease-in 500ms both",
        "slide-down":
          "slide-down 150ms cubic-bezier(0.215, 0.610, 0.355, 1.000)",
        "slide-up": "slide-up 150ms cubic-bezier(0.215, 0.610, 0.355, 1.000)",
      },
      keyframes: {
        fade: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-down": {
          from: { height: "0" },
          to: { height: "var(--radix-collapsible-content-height)" },
        },
        "slide-up": {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: "0" },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/forms"),
    require("tailwind-scrollbar")({
      nocompatible: true,
      // preferredStrategy: "pseudoelements",
    }),
  ],
  presets: [sharedConfig],
} satisfies Config;
