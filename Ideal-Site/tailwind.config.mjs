// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          ink: "#0B132B",
          sand: "#F5F3F0",
          coast: {
            DEFAULT: "#0F766E",
            50: "#E6F6F4",
            100: "#CFF0EC",
            200: "#9FE1D9",
            300: "#6FD3C7",
            400: "#3FC5B4",
            500: "#19B09E",
            600: "#0F766E",
            700: "#0C5D58",
            800: "#094642",
            900: "#062F2D"
          },
          coral: "#F97316",
          seafoam: "#10B981"
        },
        boxShadow: {
          soft: "0 8px 30px rgba(11,19,43,0.08)",
        },
        fontFamily: {
          // we'll hook these to next/font vars in layout.tsx
          sans: ["var(--font-inter)", "system-ui", "ui-sans-serif", "Arial"],
          display: ["var(--font-manrope)", "Inter", "system-ui", "ui-sans-serif"],
        },
      },
    },
    plugins: [],
  };
  