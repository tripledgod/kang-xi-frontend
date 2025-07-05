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
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
              marginLeft: 'auto',
              marginRight: 'auto',
              display: 'block',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            },
            p: {
              marginTop: '1rem',
              marginBottom: '1rem',
              color: '#585550',
              lineHeight: '1.75',
            },
            h1: {
              color: '#7B6142',
              marginTop: '2rem',
              marginBottom: '1.5rem',
              fontWeight: '600',
            },
            h2: {
              color: '#7B6142',
              marginTop: '1.5rem',
              marginBottom: '1rem',
              fontWeight: '600',
            },
            h3: {
              color: '#7B6142',
              marginTop: '1.25rem',
              marginBottom: '0.75rem',
              fontWeight: '600',
            },
            ul: {
              marginTop: '1rem',
              marginBottom: '1rem',
            },
            ol: {
              marginTop: '1rem',
              marginBottom: '1rem',
            },
            li: {
              marginTop: '0.25rem',
              marginBottom: '0.25rem',
              color: '#585550',
            },
            blockquote: {
              borderLeftColor: '#7B6142',
              backgroundColor: '#FDFBF1',
              fontStyle: 'italic',
              color: '#585550',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
            },
          },
        },
      },
    },
  },
  plugins: [typography],
};
