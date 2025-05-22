/** @type {import('tailwindcss').Config} */
export default {
content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class', // Adicionando suporte ao modo escuro
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        dark: {
          100: '#E0E1E6',
          200: '#C2C3CC',
          300: '#A3A5B3',
          400: '#85889A',
          500: '#666A80',
          600: '#4D5066',
          700: '#33364D',
          800: '#1A1C33',
          900: '#0D0E1A',
        },
        pink: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        purple: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #ec4899, #8b5cf6)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.bg-gradient-primary': {
          'background-image': 'linear-gradient(to right, #ec4899, #8b5cf6)',
        },
        '.bg-transparent': {
          'background-color': 'transparent',
        },
        '.text-adjust-none': {
          '-webkit-text-size-adjust': '100%',
          'text-size-adjust': '100%', // Corrigido para compatibilidade
        },
        '.font-smooth': {
          '-webkit-font-smoothing': 'antialiased',
          'font-smoothing': 'antialiased', // Removido -moz-osx-font-smoothing
        },
        '.gap-optimized': {
          'gap': '20px',
        }
      };
      addUtilities(newUtilities);
    },
  ],
};
