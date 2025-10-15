import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import lineClamp from "@tailwindcss/line-clamp";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      animation: {
        shake: "shake 1s ease-in-out infinite",
      },
    },
  },
  plugins: [lineClamp],
};
export default config;
