/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        responsive: ['clamp(1rem, 2vw + 0.5rem, 2rem)', { lineHeight: '1.4' }],
      },
      
      screens: {
        sm: '640px',  
        md: '768px',  
        lg: '1024px', 
        xl: '1280px', 
      },
    },
  },
  plugins: [
    
    function ({ addBase }) {
      addBase({
        'h1': { fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' },
        'h2': { fontSize: 'clamp(1.25rem, 2.5vw, 2rem)' },
        'h3': { fontSize: 'clamp(1.125rem, 2vw, 1.75rem)' },
        'p': { fontSize: 'clamp(1rem, 1.5vw, 1.25rem)' },
      });
    },
  ],
};
