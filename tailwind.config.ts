import type { Config } from "tailwindcss";
import daisyui from "daisyui";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#D63185",
        secondary: "#F8A8DB",
        error: "#CC2936",
        confirmation: "#4A8D4E",
        selected: "#E287E3",
        unselected: "#B8B8B8",
        txton1: "#2C3E50",
        txton2: "#9A9A9A",
        txton3: "#F7F7F7",
        dvc1: "#70D76E",
        dvc2: "#E1A842",
        dvc3: "#CF85DB",
        dvc4: "#63D0FF",
        dvc5: "#E95929",
        dvc6: "#E2AA96",
        dvc7: "#0B7AFF",
        dvc8: "#5A32DD",
        dvc9: "#226A21",
        dvc10: "#B57F50",
      },
    },
  },
  daisyui: {
    base: false,
    styled: true,
  },
  plugins: [daisyui],
} satisfies Config;
