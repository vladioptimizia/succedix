import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        success: "#10b981",
        danger: "#ef4444",
        info: "#3b82f6",
        warning: "#f59e0b",
        brand: {
          50: "#f0fdf9",
          500: "#10b981",
          600: "#059669",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient": "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(16,185,129,0.15), transparent)",
      },
    },
  },
  plugins: [],
};

export default config;
