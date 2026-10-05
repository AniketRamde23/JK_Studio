import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#050505",
          stage: "#0D0D0D",
          curtain: "#151515",
          line: "#262626",
        },
        text: {
          DEFAULT: "#F2EFE9",
          muted: "#A0A0A0",
        },
        gold: {
          DEFAULT: "#C8A96B",
          hi: "#E3C98D",
          dark: "#96783B",
          dim: "rgba(200, 169, 107, 0.15)",
        },
        paper: {
          DEFAULT: "#EDE8DF",
          ink: "#14120F",
          muted: "#736F68",
          line: "#DCD6C9",
        },
        status: {
          available: "#4C9A6A",
          limited: "#D9A441",
          booked: "#6B6B6B",
          error: "#D9534F",
        },
        background: "#050505",
        border: "#262626",
        surface: {
          DEFAULT: "#0D0D0D",
          elevated: "#151515",
        }
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Bodoni Moda", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Instrument Sans", "Manrope", "-apple-system", "sans-serif"],
      },
      letterSpacing: {
        cinematic: "0.2em",
        tighter: "-0.02em",
      },
      animation: {
        'shutter': 'shutter 0.38s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        shutter: {
          '0%': { opacity: '0' },
          '20%': { opacity: '0.85' },
          '100%': { opacity: '0' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
