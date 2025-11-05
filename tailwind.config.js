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
          200: "#bbd2ed",
          300: "#729fdc",
          400: "#648ddb",
          500: "#2677cc",
          600: "#2482c5",
          700: "#0043ce",
          800: "#1164c9",
          900: "#0f62fe",
        },
        // 나머지 그대로 복붙
      },
      fontFamily: {
        sans: ["Pretendard", "sans-serif"],
      },
      // spacing, borderRadius, boxShadow 등 그대로 유지
    },
  },
  plugins: [],
};
