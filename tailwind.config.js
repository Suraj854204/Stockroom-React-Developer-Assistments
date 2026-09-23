/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#14171F",
        surface: "#F7F7FA",
        panel: "#FFFFFF",
        border: "#E2E4EA",
        indigo: {
          50: "#EEF0FA",
          100: "#D9DDF2",
          400: "#5E6FB8",
          500: "#3B4C9B",
          600: "#2F3D80",
          700: "#252F63",
        },
        amber: {
          50: "#FCF3E3",
          400: "#EFB55E",
          500: "#E8A33D",
          600: "#C6832A",
        },
        success: "#2F9E63",
        danger: {
          50: "#FBEAEA",
          500: "#D5484B",
          600: "#B93A3D",
        },
        muted: "#6B7080",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(20, 23, 31, 0.06)",
        panel: "0 1px 3px rgba(20, 23, 31, 0.08), 0 1px 2px rgba(20,23,31,0.04)",
      },
    },
  },
  plugins: [],
};
