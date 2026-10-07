import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FFFFFA",
        cream: "#F5F4EF",
        sand: "#EDECE8",
        line: "#E3E1DA",
        stone: "#767676",
        ink: {
          DEFAULT: "#000000",
          soft: "#2B2B2B",
        },
        saffron: "#E3B21C",
        whatsapp: "#1F9D55",
      },
      fontFamily: {
        sans: ["Newsreader", "Georgia", "serif"],
        serif: ["Newsreader", "Georgia", "serif"],
      },
      fontSize: {
        "2xs": ["11px", "16px"],
        xs: ["13px", "18px"],
        sm: ["15px", "22px"],
      },
      letterSpacing: {
        label: "0.01em",
        wide2: "0.01em",
      },
      maxWidth: {
        site: "1600px",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.6s ease-out both",
      },
    },
  },
  plugins: [],
} satisfies Config;
