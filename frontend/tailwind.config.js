/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#000000',
        secondary: '#FFFFFF',
        /*
         * Administrator LOGIN only.
         *
         * The sign-in screen is a deliberately dark gateway — charcoal with a
         * muted gold accent, per its approved design. Additive tokens, so no
         * public page is affected.
         */
        admin: {
          bg: '#0F0F10',      // page background
          panel: '#1A1A1C',   // login card
          field: '#232326',   // input wells
          border: '#2E2E32',  // hairline borders
          muted: '#8A8A90',   // secondary text
        },
        /*
         * Administrator PORTAL — the application behind the login.
         *
         * Light, not dark: the approved report design is a professional legal
         * document, so the portal is off-white paper with deep charcoal ink and
         * hairline rules. Deliberately distinct from the dark login gateway and
         * from the public site's pure white.
         */
        portal: {
          bg: '#FAFAF9',      // page background, warm off-white
          surface: '#FFFFFF', // cards and tables
          raised: '#F5F5F4',  // hover rows, inset wells
          border: '#E7E5E4',  // hairline rules
          ink: '#1C1917',     // primary text
          muted: '#78716C',   // secondary text
          subtle: '#A8A29E',  // tertiary text, axis labels
        },
        /*
         * Status treatments, taken from the report design: muted green for
         * positive/active, amber for pending/attention, charcoal for neutral,
         * restrained red reserved for genuinely destructive states. Every pair
         * is a tinted background with a darker foreground, never a saturated
         * fill.
         */
        state: {
          successBg: '#ECFDF5', successFg: '#15803D',
          warningBg: '#FEF6E7', warningFg: '#A16207',
          neutralBg: '#F5F5F4', neutralFg: '#44403C',
          dangerBg: '#FEF2F2',  dangerFg: '#B91C1C',
          infoBg: '#F0F4F8',    infoFg: '#3B5266',
        },
        /*
         * About page editorial palette. Warm paper and deep charcoal to sit
         * beside the existing gold accent. Additive tokens — nothing outside
         * the About page references them.
         */
        ivory: {
          DEFAULT: '#F7F4EE',
          200: '#EDE7DB',   // hairlines on ivory
        },
        charcoal: {
          DEFAULT: '#141414',
          800: '#1C1C1C',   // raised panels on charcoal
        },
        gold: {
          300: '#E8C88A',
          400: '#DCB26A',
          500: '#C9974A',     // primary accent
          600: '#A87C36',
        },
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
