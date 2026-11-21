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
        // TB PRO Official Color Palette
        tb: {
          navy: "#101D35",       // Primary Deep Navy Blue
          navyDark: "#0B1527",   // Ultra-deep Navy
          blue: "#174EA6",       // Secondary Railway Blue
          cyan: "#00B8D9",       // Electric Cyan Accent
          cyanHover: "#00E5FF",  // Vivid Cyan Hover
          lightgrey: "#F4F7FB",  // Clean Background
          card: "#FFFFFF",       // Pure White Cards
          text: "#172033",       // Dark Charcoal Main Text
          muted: "#64748B",      // Muted Slate Text
          offer: "#FF6B00",      // Special Offer Orange
          success: "#16A34A",    // Success Green
          border: "#E2E8F0",     // Border Grey
        },
        // Backward-compatibility aliases mapped to TB PRO brand colors
        vg: {
          navy: "#101D35",
          navyDark: "#0B1527",
          white: "#FFFFFF",
          lightblue: "#00B8D9",
          green: "#00B8D9",
          darktext: "#172033",
          lightgrey: "#F4F7FB",
          orange: "#FF6B00",
          lavender: "#F1F5F9",
          purple: "#174EA6",
          skyblue: "#00B8D9",
          gray: "#F4F7FB",
          border: "#E2E8F0",
          dark: "#101D35",
          text: "#172033",
          ticker: "#FF6B00",
        },
        railway: {
          darkest: "#101D35",
          dark: "#0F172A",
          card: "#182234",
          border: "#1E293B",
          accent: "#FF6B00",
          gold: "#F59E0B",
          silver: "#94A3B8",
          blue: "#174EA6",
          cyan: "#00B8D9",
          teal: "#00B8D9",
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
