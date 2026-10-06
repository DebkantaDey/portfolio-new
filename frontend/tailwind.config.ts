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
        navy: {
          DEFAULT: "#00007B",
          950: "#ffffff", // Pure White Background
          900: "#f8fafd", // Subtle clean off-white
          850: "#00007B", // Main Brand Primary #00007B
          800: "#000099",
          700: "#0000b8",
          600: "#1a1acc",
          100: "#e6e6ff",
          50: "#f0f0ff",
        },
        // Accent #0F9A73
        cyan: {
          DEFAULT: "#0F9A73", // Main Accent #0F9A73
          glow: "rgba(15, 154, 115, 0.35)",
          light: "#14be8e",
          dark: "#0b7356",
        },
        emerald: {
          DEFAULT: "#0F9A73",
          400: "#14be8e",
          500: "#0F9A73",
          600: "#0b7356",
        },
        accent: {
          DEFAULT: "#0F9A73",
          glow: "rgba(15, 154, 115, 0.35)",
          light: "#14be8e",
          dark: "#0b7356",
        },
        brand: {
          primary: "#00007B",
          accent: "#0F9A73",
          white: "#ffffff",
          dark: "#ffffff", // White background
          surface: "#f8fafd",
          surfaceLight: "#ffffff",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(15, 154, 115, 0.35)",
        "glow-lg": "0 0 35px -5px rgba(15, 154, 115, 0.5)",
        "glow-navy": "0 0 30px -5px rgba(0, 0, 123, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
