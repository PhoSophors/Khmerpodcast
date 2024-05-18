/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-color': 'var(--bg-color)',
        'white': 'var(--white)',
        'sider-item-selected': 'var(--sider-item-selected)',
        'indigo': {
          500: 'var(--indigo-500)',
          600: 'var(--indigo-600)',
          700: 'var(--indigo-700)',
          800: 'var(--indigo-800)',
        },
        'slate': {
          50: 'var(--slate-50)',
          100: 'var(--slate-100)',
          200: 'var(--slate-200)',
          300: 'var(--slate-300)',
          400: 'var(--slate-400)',
          500: 'var(--slate-500)',
          600: 'var(--slate-600)',
          700: 'var(--slate-700)',
          800: 'var(--slate-800)',
          900: 'var(--slate-900)',
        },
        'amber': {
          50: 'var(--amber-50)',
          100: 'var(--amber-100)',
          200: 'var(--amber-200)',
          300: 'var(--amber-300)',
          400: 'var(--amber-400)',
          500: 'var(--amber-500)',
        },
        'gray': {
          50: 'var(--gray-50)',
          100: 'var(--gray-100)',
          200: 'var(--gray-200)',
          300: 'var(--gray-300)',
          400: 'var(--gray-400)',
          500: 'var(--gray-500)',
          600: 'var(--gray-600)',
          700: 'var(--gray-700)',
          800: 'var(--gray-800)',
          900: 'var(--gray-900)',
        },
        'pink': {
          50: 'var(--pink-50)',
          100: 'var(--pink-100)',
          200: 'var(--pink-200)',
          300: 'var(--pink-300)',
          400: 'var(--pink-400)',
          500: 'var(--pink-500)',
          600: 'var(--pink-600)',
          700: 'var(--pink-700)',
          800: 'var(--pink-800)',
          900: 'var(--pink-900)',
        },
      },
    },
  },
  darkMode: 'class', // Enable dark mode using a class
  variants: {},
  plugins: [],
}
