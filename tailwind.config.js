/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#f5f5ee",
          subtle: "#eaeae2",
          card: "#f0f0e8",
          dark: "#d8d8ce",
          muted: "#c4c4bb",
          dim: "#8a8a82",
        },
        surface: {
          DEFAULT: "#ffffff",
          subtle: "#f8f8f4",
          card: "#f0f0e8",
          dark: "#181817",
          'dark-subtle': "#222220",
          'dark-elevated': "#2b2b2a",
        },
        charcoal: {
          DEFAULT: "#2b2b2a",
          dark: "#1a1a19",
          light: "#3a3a39",
          muted: "#5e5e57",
          dim: "#8a8a82",
          border: "rgba(43, 43, 42, 0.1)",
        },
        void: "#0e0e0e",
      },
      fontFamily: {
        brand: ['"Cabinet Grotesk"', '"Space Grotesk"', '"Syne"', '"Clash Display"', 'sans-serif'],
        display: ['"Geist"', '"General Sans"', '"Söhne"', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', 'sans-serif'],
        sans: ['"Geist"', '"Inter"', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', 'sans-serif'],
        mono: ['"Geist Mono"', '"JetBrains Mono"', '"IBM Plex Mono"', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
      },
    },
  },
  plugins: [],
};
