/**
 * Tailwind CSS Play CDN Configuration
 * SOTO BPS Lamongan v2
 */
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Instrument Serif"', 'serif'],
      },
      colors: {
        brand: {
          red: '#E34A32',
          orange: '#F05A3C',
          dark: '#2E3034',
          body: '#55575c',
          bg: '#ECEDEE',
          surface: '#F4F5F5',
          darkcard: '#171719',
          darksub: '#202024'
        }
      },
      letterSpacing: {
        heading: '-0.035em',
        serif: '-0.01em',
      }
    }
  }
};
