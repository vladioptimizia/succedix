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
      },
    },
  },
  plugins: [],
};

export default config;
