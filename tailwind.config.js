/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF5F0',
          100: '#FFEBE0',
          200: '#FFD6C1',
          300: '#FFC1A2',
          400: '#FFAC83',
          500: '#FF4500',
          600: '#E63E00',
          700: '#CC3600',
          800: '#B32F00',
          900: '#992800',
        },
        secondary: {
          50: '#E6F4FF',
          100: '#CCE8FF',
          200: '#99D1FF',
          300: '#66BAFF',
          400: '#33A3FF',
          500: '#0079D3',
          600: '#006BB8',
          700: '#005D9D',
          800: '#004F82',
          900: '#004167',
        },
        accent: {
          50: '#FFF7F3',
          100: '#FFEFE7',
          200: '#FFDCCF',
          300: '#FFB8A2',
          400: '#FF9474',
          500: '#FF8B60',
          600: '#FF7046',
          700: '#E5553C',
          800: '#CC4532',
          900: '#B33528',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}