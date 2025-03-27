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
        surface1: "#FFFFFF",
        surface2: "#F5F5F7",
        surface3: "#DEDFE8",
        primary: "#9d6cba",
        secondary: "#bd90d6",
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
    themes: [
      {
        rostheme: {
          primary: "#9d6cba",
        },
      },
    ],
  },
  plugins: [daisyui],
} satisfies Config;
