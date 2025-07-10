/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Scan all JS/TS/JSX/TSX files in src folder
    "./public/index.html"          // Also scan your main HTML file if you have it
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}