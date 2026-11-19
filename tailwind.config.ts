import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vg: {
          navy: "#041229",
          navyDark: "#020b18",
          green: "#38D300",
          skyblue: "#9ac7f7",
          gray: "#d9d9d9",
          border: "#c5c5c5",
          dark: "#041229",
          text: "#041229",
          ticker: "#d32f2f",
        },
        railway: {
          darkest: "#070B14",
          dark: "#0F172A",
          card: "#182234",
          border: "#28354D",
          accent: "#D21312",
          gold: "#F59E0B",
          silver: "#94A3B8",
          blue: "#1E40AF",
          teal: "#0D9488",
        },
      },
      fontFamily: {
        futura: ["futura-lt-w01-book", "Century Gothic", "Arial", "sans-serif"],
        futuraBook: ["futura-lt-w01-book", "Century Gothic", "Arial", "sans-serif"],
        futuraLight: ["futura-lt-w01-light", "Century Gothic", "Arial", "sans-serif"],
        helveticaBold: ["helvetica-w01-bold", "Helvetica Neue", "Arial", "sans-serif"],
        helveticaRoman: ["helvetica-w01-roman", "Helvetica Neue", "Arial", "sans-serif"],
        avenir: ["avenir-lt-w01_35-light1475496", "Avenir", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
