import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "bg-gray-100",
    "text-gray-700",
    "bg-green-100",
    "text-green-700",
    "bg-blue-100",
    "text-blue-700",
    "bg-red-100",
    "text-red-700",
    "bg-yellow-100",
    "text-yellow-700",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "rgba(var(--background))",
        darkBackground: "rgba(var(--dark-background))",
        backgroundHover: "rgba(var(--backgroundHover))",
        darkBackgroundHover: "rgba(var(--darkBackgroundHover))",
        text: "rgba(var(--text))",
        darkText: "rgba(var(--dark-text))",
        secondaryText: "rgba(var(--secondary-text))",
        darkSecondaryText: "rgba(var(--dark-secondary-text))",
        border: "rgba(var(--border))",
        darkBorder: "rgba(var(--dark-border))",
        card: "rgba(var(--card))",
        darkCard: "rgba(var(--dark-card))",
        primary: "rgba(var(--primary))",
        secondary: "rgba(var(--secondary))",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
