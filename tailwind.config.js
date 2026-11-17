/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep Crimson Maroon / Burgundy - Exact mock-up brand identity
        maroon: {
          50: '#FDF2F4',
          100: '#F7EFF3',
          200: '#F8CBD4',
          300: '#F1A2B2',
          400: '#E56D86',
          500: '#D03C5F',
          600: '#B02547',
          700: '#8E1734',
          800: '#760A21', // Primary brand deep crimson maroon from mockup
          900: '#60081A', // Dark hover maroon
          950: '#3A0612', // Darkest Charcoal Maroon
        },
        // Muted Warm Gold - Premium Academic Accent
        gold: {
          50: '#FDFBF7',
          100: '#F9F4E8',
          200: '#F2E6CA',
          300: '#E8D3A3',
          400: '#D8BC76',
          500: '#C5A059', // Muted Gold Accent
          600: '#A8823F',
          700: '#87642F',
          800: '#6D5028',
          900: '#594123',
        },
        // Charcoal & Neutral Foundation
        charcoal: {
          50: '#F7F7F6',
          100: '#EFEFEA',
          200: '#DDDCD5',
          300: '#C5C3B8',
          400: '#A4A194',
          500: '#78756A',
          600: '#5C5950',
          700: '#43413B',
          800: '#2A2925',
          900: '#1C1B18', // Dark Charcoal Primary Text
          950: '#12110F',
        },
        // Off-white / Ivory surfaces
        ivory: {
          DEFAULT: '#FBFBF9',
          surface: '#F8F8F5',
          card: '#FFFFFF',
          border: '#E8E7E2',
        },
        // Saffron & Green for subtle tricolour accents
        saffron: {
          50: '#FFF9F2',
          100: '#FFF0DE',
          200: '#FEDDB8',
          300: '#FCC78C',
          400: '#FFAF59',
          500: '#FF9933',
          600: '#E67E14',
          700: '#C26107',
          800: '#9B4B08',
          900: '#7E3C0B',
        },
        navodaya: {
          green: '#138808',
          lightGreen: '#EAF7EB',
          darkGreen: '#0D6205',
          maroon: '#75142B',
          gold: '#C5A059',
          charcoal: '#1C1B18',
          surface: '#FBFBF9',
          border: '#E8E7E2',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Merriweather', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(28, 27, 24, 0.03)',
        'card': '0 2px 6px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(28, 27, 24, 0.05)',
        'elevated': '0 10px 30px -4px rgba(117, 20, 43, 0.08), 0 4px 10px -2px rgba(0, 0, 0, 0.03)',
        'gold': '0 0 0 1px rgba(197, 160, 89, 0.3), 0 2px 8px rgba(197, 160, 89, 0.15)',
      }
    },
  },
  plugins: [],
}
