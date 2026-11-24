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
        /* SMA dark green, gold and cream brand palette */
        background: "#F8F5ED",
        surface: "#FFFFFF",
        foreground: "#183C2C",
        line: "#D8C69E",
        white: "#FFFFFF",

        primary: {
          DEFAULT: "#123F2B",
          deep: "#0B2D20",
        },
        mocha: {
          DEFAULT: "#C6A052",
          700: "#183C2C",
          600: "#6F756D",
        },
        espresso: "#0B2D20",
        gold: {
          DEFAULT: "#C6A052",
          600: "#C6A052",
          400: "#D8C69E",
        },
        champagne: {
          DEFAULT: "#F8F5ED",
          100: "#FFFFFF",
          200: "#F8F5ED",
          300: "#D8C69E",
        },
        charcoal: {
          DEFAULT: "#0B2D20",
          700: "#183C2C",
          500: "#6F756D",
        },
        stone: "#6F756D",

        /* Semantic aliases */
        midnight: "#0B2D20",
        deep: "#0B2D20",
        copper: {
          DEFAULT: "#C6A052",
          600: "#183C2C",
          400: "#D8C69E",
        },
        ivory: {
          DEFAULT: "#F8F5ED",
          100: "#FFFFFF",
          200: "#F8F5ED",
          300: "#D8C69E",
        },

        /* Legacy aliases remapped for the SMA palette */
        ink: {
          DEFAULT: "#123F2B",
          800: "#0B2D20",
          700: "#183C2C",
          600: "#6F756D",
        },
        navy: {
          DEFAULT: "#123F2B",
          light: "#183C2C",
        },
        cream: {
          DEFAULT: "#F8F5ED",
          light: "#FFFFFF",
        },
        muted: "#6F756D",
        success: "#C6A052",
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
        soft: "0 1px 2px rgba(11,45,32,0.10), 0 12px 30px -18px rgba(11,45,32,0.22)",
        lift: "0 30px 60px -34px rgba(11,45,32,0.5)",
        glow: "0 0 0 1px rgba(198,160,82,0.22), 0 20px 50px -28px rgba(198,160,82,0.35)",
        luxe: "0 40px 80px -40px rgba(11,45,32,0.6)",
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
