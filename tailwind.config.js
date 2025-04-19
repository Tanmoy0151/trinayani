/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
        secondary: {
          50: "#eef2ff",
          100: "#e0e7ff", 
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        'server-error': {
          '0%': { transform: 'translateX(-4px)' },
          '50%': { transform: 'translateX(40px)' },
          '100%': { transform: 'translateX(-4px)' },
        },
        'smoke': {
          '0%': { transform: 'translateY(0)', opacity: '0' },
          '40%': { transform: 'translateY(-10px)', opacity: '0.6' },
          '80%': { transform: 'translateY(-20px)', opacity: '0.2' },
          '100%': { transform: 'translateY(-30px)', opacity: '0' },
        }
      },
      animation: {
        'server-error': 'server-error 3s ease-in-out infinite',
        'smoke': 'smoke 3s ease-out infinite',
      }
    },
  },
  plugins: [],
}; 