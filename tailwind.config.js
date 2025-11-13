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
          50: "#e8efff",
          100: "#d2def7",
          200: "#B4C9E8",
          300: "#729fdc",
          400: "#648DDB",
          500: "#5480C9",
          600: "#2482c5",
          700: "#0043ce",
          800: "#1164c9",
          900: "#0f62fe",
        },
        gray: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e8e8e8",
          300: "#d3d3d3",
          400: "#999999",
          500: "#666666",
          600: "#4a4a4a",
          700: "#414141",
          800: "#2c2c2c",
          900: "#1a1a1a",
        },
      },
      fontFamily: {
        sans: ["Pretendard", "sans-serif"],
      },
      keyframes: {
        slideDown: {
          "0%": {
            transform: "translateY(-20px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        slideUp: {
          "0%": {
            transform: "translateY(100%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        fadeInUp: {
          "0%": {
            transform: "translateY(20px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
      },
      animation: {
        slideDown: "slideDown 0.3s ease-out",
        slideUp: "slideUp 0.3s ease-out",
        "fade-in-up": "fadeInUp 0.3s ease-out",
      },
      // spacing, borderRadius, boxShadow 등 그대로 유지
    },
  },
  plugins: [],
};
