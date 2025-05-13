/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
      extend: {
        colors: {
          background: "oklch(var(--background))",
          foreground: "oklch(var(--foreground))",
          primary: "oklch(var(--primary))",
          "primary-foreground": "oklch(var(--primary-foreground))",
          sidebar: "oklch(var(--sidebar))",
          muted: "oklch(var(--muted))",
          "muted-foreground": "oklch(var(--muted-foreground))",
        },
        borderRadius: {
          sm: "calc(var(--radius) - 4px)",
          md: "calc(var(--radius) - 2px)",
          lg: "var(--radius)",
          xl: "calc(var(--radius) + 4px)",
        },
      },
    },
    plugins: [
      require("tailwindcss-animate"), // optional, only if you're using animation utilities
    ],
  };
  