/* @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        "deeper": "#0a1014",
        "deep": "#0c1317",
        "darkblue": "#130C25",
        "orange": "#E97000",
        "green": "#128C7E",
        "light": "rgba(52, 63, 70, 0.5)",
        "lighter": "#0c1317",
        "textblack": "#2E3D48",
      },
      fontFamily: {
        "Inter": ["Inter"],
        "Syne": ["Syne"],
        "Roboto": ["Roboto"],
      },
    },
  },
  plugins: [],
}