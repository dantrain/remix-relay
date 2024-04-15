module.exports = {
  // This order matters! See https://github.com/tailwindlabs/prettier-plugin-tailwindcss/issues/191#issuecomment-1802830923
  plugins: [
    "prettier-plugin-organize-imports",
    "prettier-plugin-packagejson",
    "prettier-plugin-tailwindcss",
    "prettier-plugin-classnames",
    "prettier-plugin-merge",
  ],
  tailwindFunctions: ["cva", "cx", "twMerge"],
  customFunctions: ["cva", "cx", "twMerge"],
  endingPosition: "absolute-with-indent",
};
