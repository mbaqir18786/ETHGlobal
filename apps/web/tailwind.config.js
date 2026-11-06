/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#F4F2EC",
        dark: "#171717",
        surface: "#FFFFFF",
        surfaceMuted: "#ECEAE3",
        accent: {
          lime: "#C6F36B",
          limeSoft: "#E3F7A6",
          blue: "#5E7ED8",
        },
        state: {
          danger: "#D94F4F",
          dangerSoft: "#FCE8E8",
          warning: "#D9A441",
          warningSoft: "#FEF4E2",
          success: "#2E7D52",
          successSoft: "#E8F5EE",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
      },
      boxShadow: {
        neo: "3px 3px 0px #171717",
        neoSm: "2px 2px 0px #171717",
        neoLg: "5px 5px 0px #171717",
      },
      borderWidth: {
        neo: "2px",
      },
    },
  },
  plugins: [],
};
