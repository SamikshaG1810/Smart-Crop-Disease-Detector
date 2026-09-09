/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAFAFA",
        surface: "#FFFFFF",
        brand: {
          dark: "#14251B",
          darker: "#0D1811",
          forest: "#1B3B2B",
          sage: "#7C8B6B",
          sageLight: "#E8EFE5",
          accent: "#2D5A3C",
          leaf: "#16A34A",
          muted: "#9CA894"
        },
        slate: {
          textDark: "#111111",
          textMuted: "#6B7280",
          border: "#E5E7EB",
          cardBg: "#FFFFFF"
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.03)',
        'soft-md': '0 4px 12px -2px rgba(20, 37, 27, 0.06), 0 2px 6px -1px rgba(20, 37, 27, 0.04)',
        'soft-lg': '0 12px 24px -4px rgba(20, 37, 27, 0.08), 0 4px 10px -2px rgba(20, 37, 27, 0.04)',
        'soft-xl': '0 20px 32px -6px rgba(20, 37, 27, 0.12), 0 8px 16px -4px rgba(20, 37, 27, 0.06)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      }
    },
  },
  plugins: [],
}
