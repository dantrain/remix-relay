import formsPlugin from "@tailwindcss/forms";
import scrollbarPlugin from "tailwind-scrollbar";
import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";
import plugin from "tailwindcss/plugin";
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
    plugin(({ addVariant }) => {
      addVariant("pointer-coarse", "@media (pointer: coarse)");
      addVariant("pointer-fine", "@media (pointer: fine)");
    }),
    animatePlugin,
    formsPlugin,
    scrollbarPlugin({
      nocompatible: true,
      // preferredStrategy: "pseudoelements",
    }),
  ],
  presets: [sharedConfig],
} satisfies Config;
