import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "rgb(var(--cream) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        burgundy: "rgb(var(--burgundy) / <alpha-value>)",
        gold: "rgb(var(--gold) / <alpha-value>)",
        sage: "rgb(var(--sage) / <alpha-value>)",
        paper: "rgb(var(--paper) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        ivory: "rgb(var(--ivory) / <alpha-value>)",
        night: "rgb(var(--night) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
