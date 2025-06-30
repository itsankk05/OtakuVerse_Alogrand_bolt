/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Responsive breakpoints
      screens: {
        'xs': '320px',
        'sm': '375px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1440px',
        '2xl': '1920px',
        // Custom breakpoints for specific use cases
        'mobile': {'max': '767px'},
        'tablet': {'min': '768px', 'max': '1023px'},
        'desktop': {'min': '1024px'},
        'wide': {'min': '1440px'},
        'ultra': {'min': '1920px'},
      },
      
      // Responsive spacing scale
      spacing: {
        'responsive-xs': 'clamp(0.25rem, 1vw, 0.5rem)',
        'responsive-sm': 'clamp(0.5rem, 2vw, 1rem)',
        'responsive-md': 'clamp(1rem, 3vw, 1.5rem)',
        'responsive-lg': 'clamp(1.5rem, 4vw, 2rem)',
        'responsive-xl': 'clamp(2rem, 5vw, 3rem)',
        'responsive-2xl': 'clamp(3rem, 6vw, 4rem)',
      },
      
      // Responsive font sizes
      fontSize: {
        'responsive-xs': ['clamp(0.75rem, 1.5vw, 0.875rem)', { lineHeight: '1.4' }],
        'responsive-sm': ['clamp(0.875rem, 2vw, 1rem)', { lineHeight: '1.5' }],
        'responsive-base': ['clamp(1rem, 2.5vw, 1.125rem)', { lineHeight: '1.6' }],
        'responsive-lg': ['clamp(1.125rem, 3vw, 1.25rem)', { lineHeight: '1.5' }],
        'responsive-xl': ['clamp(1.25rem, 3.5vw, 1.5rem)', { lineHeight: '1.4' }],
        'responsive-2xl': ['clamp(1.5rem, 4vw, 2rem)', { lineHeight: '1.3' }],
        'responsive-3xl': ['clamp(1.875rem, 4.5vw, 2.5rem)', { lineHeight: '1.2' }],
        'responsive-4xl': ['clamp(2.25rem, 5vw, 3rem)', { lineHeight: '1.1' }],
        'responsive-5xl': ['clamp(2.5rem, 6vw, 4rem)', { lineHeight: '1' }],
      },
      
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#5b5bd6',
          700: '#4f46e5',
          800: '#4338ca',
          900: '#3730a3',
        },
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21d4',
          900: '#581c87',
        },
        anime: {
          purple: '#8b45ff',
          pink: '#ff006e',
          cyan: '#00d4ff',
          yellow: '#ffbe0b',
          green: '#8ecae6',
        },
        neon: {
          pink: '#ff006e',
          purple: '#8b45ff',
          blue: '#00d4ff',
          green: '#06ffa5',
          yellow: '#ffbe0b',
        }
      },
      
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'inter': ['Inter', 'sans-serif'],
        'jetbrains': ['JetBrains Mono', 'monospace'],
      },
      
      // Responsive container sizes
      maxWidth: {
        'responsive-sm': 'min(100%, 640px)',
        'responsive-md': 'min(100%, 768px)',
        'responsive-lg': 'min(100%, 1024px)',
        'responsive-xl': 'min(100%, 1280px)',
        'responsive-2xl': 'min(100%, 1536px)',
        'responsive-full': '100%',
      },
      
      // Responsive grid templates
      gridTemplateColumns: {
        'responsive-1': 'repeat(1, minmax(0, 1fr))',
        'responsive-2': 'repeat(auto-fit, minmax(300px, 1fr))',
        'responsive-3': 'repeat(auto-fit, minmax(250px, 1fr))',
        'responsive-4': 'repeat(auto-fit, minmax(200px, 1fr))',
        'responsive-auto': 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
      },
      
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-in': 'slide-in 0.6s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-out',
      },
      
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #8b45ff, 0 0 10px #8b45ff' },
          '100%': { boxShadow: '0 0 10px #8b45ff, 0 0 20px #8b45ff' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        bounceGentle: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0)' }
        }
      },
      
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'anime-gradient': 'linear-gradient(135deg, #8b45ff 0%, #ff006e 50%, #00d4ff 100%)',
        'hero-gradient': 'radial-gradient(ellipse at center, rgba(139, 69, 255, 0.3) 0%, rgba(0, 0, 0, 0.8) 70%)',
        'responsive-gradient': 'linear-gradient(135deg, var(--tw-gradient-stops))',
      },
      
      // Responsive aspect ratios
      aspectRatio: {
        'video': '16 / 9',
        'square': '1 / 1',
        'portrait': '3 / 4',
        'landscape': '4 / 3',
        'wide': '21 / 9',
        'ultra-wide': '32 / 9',
      },
      
      // Responsive border radius
      borderRadius: {
        'responsive-sm': 'clamp(0.25rem, 1vw, 0.5rem)',
        'responsive-md': 'clamp(0.5rem, 2vw, 0.75rem)',
        'responsive-lg': 'clamp(0.75rem, 2.5vw, 1rem)',
        'responsive-xl': 'clamp(1rem, 3vw, 1.5rem)',
      },
      
      // Responsive shadows
      boxShadow: {
        'responsive-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'responsive-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'responsive-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'responsive-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'responsive-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'glow-purple': '0 0 20px rgba(139, 69, 255, 0.5), 0 0 40px rgba(139, 69, 255, 0.3)',
        'glow-pink': '0 0 20px rgba(255, 0, 110, 0.5), 0 0 40px rgba(255, 0, 110, 0.3)',
        'glow-cyan': '0 0 20px rgba(0, 212, 255, 0.5), 0 0 40px rgba(0, 212, 255, 0.3)',
      },
      
      // Responsive z-index scale
      zIndex: {
        'modal': '1000',
        'overlay': '900',
        'dropdown': '800',
        'header': '700',
        'footer': '600',
      },
      
      // Responsive transitions
      transitionDuration: {
        'fast': '150ms',
        'normal': '300ms',
        'slow': '500ms',
        'slower': '750ms',
        'slowest': '1000ms',
      },
      
      // Responsive transforms
      scale: {
        '102': '1.02',
        '103': '1.03',
        '104': '1.04',
        '105': '1.05',
      },
    },
  },
  plugins: [
    // Custom plugin for responsive utilities
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Responsive container utility
        '.container-responsive': {
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4'),
          '@screen sm': {
            paddingLeft: theme('spacing.6'),
            paddingRight: theme('spacing.6'),
          },
          '@screen md': {
            paddingLeft: theme('spacing.8'),
            paddingRight: theme('spacing.8'),
          },
          '@screen lg': {
            maxWidth: theme('maxWidth.7xl'),
          },
          '@screen xl': {
            maxWidth: theme('maxWidth.7xl'),
          },
        },
        
        // Responsive grid utility
        '.grid-responsive': {
          display: 'grid',
          gap: theme('spacing.4'),
          gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
          '@screen sm': {
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: theme('spacing.6'),
          },
          '@screen md': {
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          },
          '@screen lg': {
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: theme('spacing.8'),
          },
        },
        
        // Responsive flex utility
        '.flex-responsive': {
          display: 'flex',
          flexDirection: 'column',
          gap: theme('spacing.4'),
          '@screen md': {
            flexDirection: 'row',
            gap: theme('spacing.6'),
          },
        },
        
        // Responsive text utility
        '.text-responsive': {
          fontSize: theme('fontSize.sm'),
          lineHeight: theme('lineHeight.relaxed'),
          '@screen md': {
            fontSize: theme('fontSize.base'),
          },
          '@screen lg': {
            fontSize: theme('fontSize.lg'),
          },
        },
        
        // Responsive padding utility
        '.p-responsive': {
          padding: theme('spacing.4'),
          '@screen md': {
            padding: theme('spacing.6'),
          },
          '@screen lg': {
            padding: theme('spacing.8'),
          },
        },
        
        // Responsive margin utility
        '.m-responsive': {
          margin: theme('spacing.4'),
          '@screen md': {
            margin: theme('spacing.6'),
          },
          '@screen lg': {
            margin: theme('spacing.8'),
          },
        },
      }
      
      addUtilities(newUtilities)
    }
  ],
};