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
        primary: "#0047AB", // Deep Blue
        secondary: "#F5F5F7", // Soft Grey
        textMain: "#111827", // Dark Grey for text
      },
    },
  },
  plugins: [],
};
export default config;