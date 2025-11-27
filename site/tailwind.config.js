/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      /**
       * Define a modern colour palette inspired by 2025 web design trends.  
       * Verdant green evokes nature and sustainability, sunny yellow adds
       * energetic highlights, and terracotta red provides warmth for accents.  
       * Each colour includes a default, dark and light shade for more control.
       */
      colors: {
        primary: {
          DEFAULT: '#4caf50', // Verdant Green – radiant and natural
          dark: '#388e3c',    // deeper shade for hover states
          light: '#81c784',   // lighter variant for backgrounds
        },
        accent: {
          DEFAULT: '#ffdd44', // Sunny Yellow – playful highlight
          dark: '#f4c534',
          light: '#ffe97d',
        },
        secondary: {
          DEFAULT: '#e2725b', // Terracotta Red – warm accent
          dark: '#c75a43',
          light: '#eb9a87',
        },
        neutral: {
          DEFAULT: '#f5f5f5', // light neutral background
          dark: '#e0e0e0',
        },
      },
    },
  },
  plugins: [],
};