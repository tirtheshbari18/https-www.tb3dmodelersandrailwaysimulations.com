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
          navy: "#0B2852",
          navyDark: "#071c3b",
          white: "#FFFFFF",
          lightblue: "#A7D2F7",
          green: "#39FF00",
          darktext: "#101C32",
          lightgrey: "#F5F6F8",
          orange: "#FF6600",
          lavender: "#ECE8F8",
          purple: "#2A1E68",
          // Backward compatibility aliases
          skyblue: "#A7D2F7",
          gray: "#F5F6F8",
          border: "#E5E7EB",
          dark: "#0B2852",
          text: "#101C32",
          ticker: "#FF6600",
        },
        railway: {
          darkest: "#0B2852",
          dark: "#0F172A",
          card: "#182234",
          border: "#28354D",
          accent: "#D21312",
          gold: "#F59E0B",
          silver: "#94A3B8",
          blue: "#0B2852",
          teal: "#0D9488",
        },
      },
      fontFamily: {
        sans: ["'Josefin Sans'", "Century Gothic", "sans-serif"],
        josefin: ["'Josefin Sans'", "Century Gothic", "sans-serif"],
        futura: ["'Josefin Sans'", "sans-serif"],
        futuraBook: ["'Josefin Sans'", "sans-serif"],
        futuraLight: ["'Josefin Sans'", "sans-serif"],
        helveticaBold: ["'Josefin Sans'", "sans-serif"],
        helveticaRoman: ["'Josefin Sans'", "sans-serif"],
        avenir: ["'Josefin Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
