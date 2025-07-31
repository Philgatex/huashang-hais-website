/** @type {import('tailwindcss').Config} */
module.exports = {
  // Enable dark mode based on adding/removing 'dark' class on the HTML element
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F0FF',   // Very light blue, for subtle backgrounds
          100: '#CCE0FF',  // Lighter blue
          200: '#99C2FF',  // Light blue
          300: '#66A3FF',  // Standard light blue
          400: '#3385FF',  // Medium blue
          500: '#0066FF',  // Default primary blue
          600: '#0052CC',  // Darker blue for hover
          700: '#003D99',  // Even darker blue
          800: '#002966',  // Deep blue, good for backgrounds
          900: '#001433',  // Very deep blue, almost black-blue
        },
        accent: {
          50: '#FFF0E6',   // Very light orange/peach
          100: '#FFE0CC',  // Lighter orange
          200: '#FFC299',  // Light orange
          300: '#FFA366',  // Standard accent orange
          400: '#FF8533',  // Medium accent orange
          500: '#FF6600',  // Default accent orange
          600: '#CC5200',  // Darker accent orange for hover
          700: '#993D00',  // Even darker orange
          800: '#662900',  // Deep orange
          900: '#331400',  // Very deep orange, almost brown
        },
        neutral: {
          50: '#FDFDFD',   // Off-white, soft background
          100: '#F5F5F5',  // Very light gray
          200: '#E0E0E0',  // Light gray
          300: '#C2C2C2',  // Medium light gray
          400: '#A3A3A3',  // Medium gray
          500: '#858585',  // Standard gray
          600: '#666666',  // Darker gray
          700: '#474747',  // Even darker gray
          800: '#292929',  // Deep gray, dark text
          900: '#1A1A1A',  // Very deep gray, almost black
        },
        'white-custom': '#FFFFFF', // Pure white, for text on dark backgrounds
        'black-custom': '#000000', // Pure black
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'], // Bold, modern headings
        body: ['Open Sans', 'sans-serif'],     // Readable body text
      },
      backgroundImage: {
        'hr-hero-bg': "url('/hr-hero-bg.jpg')",
        'pattern-squares': "url(\"data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 0h3v3H0V0zm3 3h3v3H3V3z'/%3E%3C/g%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'strong': '0 10px 20px rgba(0, 0, 0, 0.08)',
        'smooth': '0 5px 15px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}