
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "scale-100",
    "opacity-100",
    "scale-95",
    "opacity-0",
    "backdrop-blur-sm",
    "bg-red-600",
    "text-white",
    "invisible",
    "visible",
  ],
  theme: { extend: {} },
  plugins: [],
}
