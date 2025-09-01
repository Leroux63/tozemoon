import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: "#0B3A53",
        lunar: "#00A8B8",
        moon: "#F7931A",
        lightteal: "#66D1D8",
        dark: "#2B2B2B",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"],
        mono: ["var(--font-mono)"],
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.2)",
      },
    },
  },
  plugins: [],
} satisfies Config;