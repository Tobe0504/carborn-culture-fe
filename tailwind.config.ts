import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FFFFFF",
        cream: "#F7F7F7",
        sand: "#F3F3F3",
        line: "#E6E6E6",
        stone: "#6E6E6E",
        ink: {
          DEFAULT: "#111111",
          soft: "#333333",
        },
        saffron: "#E3B21C",
        whatsapp: "#1F9D55",
      },
      fontFamily: {
        sans: ["Jost", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Jost", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": ["12px", "16px"],
        xs: ["13px", "19px"],
        sm: ["15px", "23px"],
      },
      maxWidth: {
        site: "1440px",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        "fade-in": "fade-in 0.4s ease-out both",
      },
    },
  },
  plugins: [],
} satisfies Config;
