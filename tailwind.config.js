/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // C3RRO Design System Colors
      colors: {
        // Primary colors
        text: '#33302F',
        greydark: '#5E5A58',
        grey: '#BDB2AA',
        greylight: '#D9D8CD',
        bluegreen: '#4AB79F', // Primary action color
        blue: '#4597BF',
        bluedark: '#407188',
        bluelight: '#93D2E1',

        // Secondary colors
        red: '#C04343',
        orange: '#E18E2A',
        yellow: '#F8C36E',
        yellowlight: '#FEF4DC',

        // Extended colors
        greendark: '#205959',
        green: '#3E7263',
        greenlight: '#89A767',
        yellowgreen: '#B1B52E',
        white: '#FFFFFF',

        // Keep neutral palette for backward compatibility
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      // Typography (Jost for headings, Lato for body)
      fontFamily: {
        sans: ['Lato', 'system-ui', 'sans-serif'],
        heading: ['Jost', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      // Spacing system (xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px)
      spacing: {
        'xs': '0.25rem',  // 4px
        'sm': '0.5rem',   // 8px
        'md': '1rem',     // 16px
        'lg': '1.5rem',   // 24px
        'xl': '2rem',     // 32px
        '2xl': '3rem',    // 48px
        // Keep old names for backward compatibility
        'gutter': '8px',
        'section': '16px',
        'panel': '24px',
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'base': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'lg': ['16px', { lineHeight: '24px', fontWeight: '500' }],
        'xl': ['18px', { lineHeight: '28px', fontWeight: '600' }],
        'h4': ['16px', { lineHeight: '24px', fontWeight: '600' }],
        'h3': ['18px', { lineHeight: '28px', fontWeight: '600' }],
        'h2': ['20px', { lineHeight: '32px', fontWeight: '600' }],
        'h1': ['24px', { lineHeight: '36px', fontWeight: '700' }],
      },
      // Shadows from design system
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        'focus': '0 0 0 3px rgba(74, 183, 159, 0.1), 0 0 0 2px rgba(74, 183, 159, 1)',
      },
      // Border radius from design system
      borderRadius: {
        'sm': '0.125rem',  // 2px
        'md': '0.375rem',  // 6px
        'lg': '0.5rem',    // 8px
        'xl': '0.75rem',   // 12px
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-in-out',
        'fade-out': 'fadeOut 200ms ease-in-out',
        'slide-in-left': 'slideInLeft 300ms ease-out',
        'slide-in-right': 'slideInRight 300ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
