import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#10B981", // Emerald 500
          foreground: "hsl(var(--primary-foreground))",
          hover: "#059669", // Emerald 600
          glow: "#34D399", // Emerald 400
        },
        secondary: {
          DEFAULT: "#0D9488", // Teal 600
          foreground: "hsl(var(--secondary-foreground))",
          hover: "#0F766E", // Teal 700
          glow: "#2DD4BF", // Teal 400
        },
        accent: {
          DEFAULT: "#4ADE80", // Neon Green
          foreground: "hsl(var(--accent-foreground))",
          hover: "#22C55E",
          glow: "#86EFAC",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'neon-glow': '0 0 15px rgba(16, 185, 129, 0.5), 0 0 30px rgba(16, 185, 129, 0.3)',
        'neon-hover': '0 0 25px rgba(16, 185, 129, 0.6), 0 0 45px rgba(16, 185, 129, 0.4)',
        'accent-glow': '0 0 15px rgba(74, 222, 128, 0.5), 0 0 30px rgba(74, 222, 128, 0.3)',
        'accent-hover': '0 0 25px rgba(74, 222, 128, 0.6), 0 0 45px rgba(74, 222, 128, 0.4)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
