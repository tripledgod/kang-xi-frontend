import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            img: {
              marginLeft: 'auto',
              marginRight: 'auto',
              display: 'block',
            },
          },
        },
      },
    },
  },
  plugins: [typography],
};
