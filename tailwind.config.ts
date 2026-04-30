// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: "#D4A348",
          dark: "#1A1A1A",
          grey: "#4B5563",
          bg: "#F9FAFB",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
    },
  },
  plugins: [],
};

export default config;
