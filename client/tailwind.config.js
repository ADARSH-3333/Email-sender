/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'claude-orange': '#C15F3C',
        'claude-gray': '#B1ADA1',
        'claude-cream': '#F4F3EE',
        'claude-white': '#FFFFFF',
      },
    },
  },
  plugins: [],
}