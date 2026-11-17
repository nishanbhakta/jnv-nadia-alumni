/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#FFF9F2',
          100: '#FFF0DE',
          200: '#FEDDB8',
          300: '#FCC78C',
          400: '#FFAF59',
          500: '#FF9933', // Primary Saffron
          600: '#E67E14',
          700: '#C26107',
          800: '#9B4B08',
          900: '#7E3C0B',
        },
        navodaya: {
          green: '#138808', // Primary Green
          lightGreen: '#EAF7EB',
          darkGreen: '#0D6205',
          navy: '#0B2545',
          dark: '#202124',
          surface: '#F8F9FA',
          border: '#E5E7EB',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
