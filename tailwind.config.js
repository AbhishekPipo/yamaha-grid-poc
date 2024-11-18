/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  prefix: 'tw-', // Add prefix to avoid conflicts with Vuetify
  important: true, // Make Tailwind classes always take precedence
  theme: {
    extend: {},
  },
  plugins: [],
}
