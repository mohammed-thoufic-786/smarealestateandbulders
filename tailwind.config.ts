import type { Config } from "tailwindcss";

type FontSizeToken = [string, { lineHeight: string; letterSpacing?: string }];

const xs: FontSizeToken = ["clamp(0.8125rem, 0.78rem + 0.18vw, 0.875rem)", { lineHeight: "1.5" }];
const sm: FontSizeToken = ["clamp(0.875rem, 0.84rem + 0.3vw, 1rem)", { lineHeight: "1.6" }];
const base: FontSizeToken = ["clamp(0.9375rem, 0.875rem + 0.35vw, 1.125rem)", { lineHeight: "1.7" }];
const lg: FontSizeToken = ["clamp(1.125rem, 1.05rem + 0.45vw, 1.375rem)", { lineHeight: "1.25" }];
const xl: FontSizeToken = ["clamp(1.25rem, 1.1rem + 0.7vw, 1.5rem)", { lineHeight: "1.25" }];
const twoXl: FontSizeToken = ["clamp(1.375rem, 1.2rem + 0.85vw, 1.75rem)", { lineHeight: "1.2" }];
const threeXl: FontSizeToken = ["clamp(1.75rem, 1.5rem + 1.1vw, 2.25rem)", { lineHeight: "1.18" }];
const fourXl: FontSizeToken = ["clamp(2rem, 1.75rem + 1.4vw, 2.5rem)", { lineHeight: "1.1" }];
const section: FontSizeToken = [
  "clamp(1.75rem, 1.125rem + 2.1vw, 3.25rem)",
  { lineHeight: "1.18", letterSpacing: "-0.015em" },
];
const subheading: FontSizeToken = [
  "clamp(1.125rem, 1rem + 0.9vw, 1.5rem)",
  { lineHeight: "1.25", letterSpacing: "-0.01em" },
];
const nav: FontSizeToken = ["clamp(0.9375rem, 0.875rem + 0.35vw, 1.0625rem)", { lineHeight: "1.4" }];
const heading: FontSizeToken = [
  "clamp(1.75rem, 1.4rem + 1.3vw, 2.75rem)",
  { lineHeight: "1.18", letterSpacing: "-0.015em" },
];
const subtitle: FontSizeToken = ["clamp(0.9375rem, 0.875rem + 0.4vw, 1.125rem)", { lineHeight: "1.5" }];

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Black + Gold ultra luxury palette */
        background: "#F5F1E8",
        surface: "#FDFBF6",
        foreground: "#0D0D0D",
        line: "#D8CDB6",
        white: "#EDEDED",

        mocha: {
          DEFAULT: "#BFA054",
          700: "#8F7437",
          600: "#6E5829",
        },
        espresso: "#0D0D0D",
        gold: {
          DEFAULT: "#BFA054",
          600: "#8F7437",
          400: "#D4B36A",
        },
        champagne: {
          DEFAULT: "#F5F1E8",
          100: "#FDFBF6",
          200: "#EDE6D7",
          300: "#D8CDB6",
        },
        charcoal: {
          DEFAULT: "#0D0D0D",
          700: "#2A261E",
          500: "#7A6F59",
        },
        stone: "#7A6F59",

        /* Semantic aliases */
        midnight: "#0D0D0D",
        deep: "#17150F",
        copper: {
          DEFAULT: "#BFA054",
          600: "#8F7437",
          400: "#D4B36A",
        },
        ivory: {
          DEFAULT: "#F5F1E8",
          100: "#FDFBF6",
          200: "#EDE6D7",
          300: "#D8CDB6",
        },

        /* Legacy aliases remapped for the black + gold palette */
        ink: {
          DEFAULT: "#0D0D0D",
          800: "#17150F",
          700: "#2A261E",
          600: "#7A6F59",
        },
        navy: {
          DEFAULT: "#0D0D0D",
          light: "#2A261E",
        },
        cream: {
          DEFAULT: "#F5F1E8",
          light: "#FDFBF6",
        },
        muted: "#7A6F59",
        success: "#BFA054",
        danger: "#C9845A",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs,
        sm,
        base,
        lg,
        xl,
        "2xl": twoXl,
        "3xl": threeXl,
        "4xl": fourXl,
        eyebrow: xs,
        nav,
        heading,
        subtitle,
        subheading,
        section,
        property: xl,
        price: twoXl,
        "display-1": ["clamp(2.75rem, 6vw, 5rem)", { lineHeight: "1.04", letterSpacing: "-0.02em" }],
        "display-2": ["clamp(2rem, 4.5vw, 3.25rem)", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
        "display-3": section,
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(13,13,13,0.12), 0 12px 30px -18px rgba(13,13,13,0.24)",
        lift: "0 30px 60px -34px rgba(13,13,13,0.55)",
        glow: "0 0 0 1px rgba(191,160,84,0.22), 0 20px 50px -28px rgba(191,160,84,0.35)",
        luxe: "0 40px 80px -40px rgba(13,13,13,0.7)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fade-in 0.5s ease both",
        "scale-in": "scale-in 0.4s cubic-bezier(0.22,1,0.36,1) both",
        marquee: "marquee 40s linear infinite",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
