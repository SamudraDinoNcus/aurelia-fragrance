import type { Config } from "tailwindcss";

/**
 * Design tokens pada file ini diekstrak langsung dari template visual
 * `frontend-parfume.zip` (index.html, dashboard.html, product.html, dst).
 * Jangan ubah value warna/spacing/font di bawah tanpa diskusi tim desain,
 * karena dipakai sebagai "source of truth" tampilan brand Aurélia.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- Shadcn/UI compatibility layer (dipakai oleh komponen ui/*) ---
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        // --- Brand tokens literal (1:1 dari template HTML, dipakai bebas
        //     untuk menyalin class langsung dari mockup ke komponen React) ---
        "accent-gold": "#C9A36A",
        "accent-amber-deep": "#B5651D",
        "accent-amber-light": "#D98E4A",
        "text-muted": "#8A8378",

        surface: "#fef8f7",
        "surface-neutral": "#F0ECE6",
        "surface-bright": "#fef8f7",
        "surface-dim": "#ded9d8",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f8f2f1",
        "surface-container": "#f2edeb",
        "surface-container-high": "#ece7e6",
        "surface-container-highest": "#e7e1e0",
        "surface-variant": "#e7e1e0",

        "on-background": "#1d1b1b",
        "on-surface": "#1d1b1b",
        "on-surface-variant": "#4e4541",
        "on-primary": "#ffffff",
        "on-primary-container": "#8f817b",
        "primary-container": "#221a16",

        outline: "#807570",
        "outline-variant": "#d1c4be",

        error: "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        full: "9999px",
      },
      spacing: {
        "container-margin-mobile": "20px",
        "container-margin": "80px",
        gutter: "24px",
        "section-gap": "120px",
      },
      fontFamily: {
        serif: ["var(--font-eb-garamond)"],
        sans: ["var(--font-inter)"],
        "display-hero": ["var(--font-eb-garamond)"],
        "display-hero-mobile": ["var(--font-eb-garamond)"],
        "headline-lg": ["var(--font-eb-garamond)"],
        "headline-md": ["var(--font-eb-garamond)"],
        "body-lg": ["var(--font-inter)"],
        "body-md": ["var(--font-inter)"],
        "label-md": ["var(--font-inter)"],
        "label-sm": ["var(--font-inter)"],
        caption: ["var(--font-inter)"],
      },
      fontSize: {
        "display-hero": ["64px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "400" }],
        "display-hero-mobile": ["40px", { lineHeight: "1.2", fontWeight: "400" }],
        "headline-lg": ["32px", { lineHeight: "1.2", fontWeight: "400" }],
        "headline-md": ["28px", { lineHeight: "1.3", fontWeight: "400" }],
        "body-lg": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        "label-md": ["14px", { lineHeight: "1.2", letterSpacing: "0.05em", fontWeight: "500" }],
        "label-sm": ["13px", { lineHeight: "1.2", letterSpacing: "0.03em", fontWeight: "400" }],
        caption: ["12px", { lineHeight: "1.4", fontWeight: "400" }],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
