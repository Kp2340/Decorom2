/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary, #2C3E50)",
          hover: "var(--color-primary-hover, #1A252F)",
        },
        surface: "var(--color-surface, #FFFFFF)",
        accent: {
          DEFAULT: "var(--color-accent, #E59500)",
          hover: "var(--color-accent-hover, #CC8400)",
        },
        navy: "var(--color-navy, #0F172A)",
        cream: {
          DEFAULT: "var(--color-cream, #FFFDD0)",
          light: "var(--color-cream-light, #FFF8E1)",
        },
        slateText: "var(--color-text-secondary, #334155)",
        subtleBorder: "var(--color-border-subtle, #E2E8F0)",
      },
    },
  },
  plugins: [],
};
