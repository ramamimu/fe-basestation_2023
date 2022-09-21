/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      gridRow: {
        "span-7": "span 7 / span 16",
        "span-8": "span 8 / span 16",
        "span-9": "span 9 / span 16",
        "span-10": "span 10 / span 16",
        "span-11": "span 11 / span 16",
        "span-12": "span 12 / span 16",
        "span-13": "span 13 / span 16",
        "span-14": "span 14 / span 16",
        "span-15": "span 15 / span 16",
        "span-16": "span 16 / span 16",
      },
      gridCol: {
        "span-7": "span 7 / span 16",
        "span-8": "span 8 / span 16",
        "span-9": "span 9 / span 16",
        "span-10": "span 10 / span 16",
        "span-11": "span 11 / span 16",
        "span-12": "span 12 / span 16",
        "span-13": "span 13 / span 16",
        "span-14": "span 14 / span 16",
        "span-15": "span 15 / span 16",
        "span-16": "span 16 / span 16",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
