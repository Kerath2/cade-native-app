/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Colores principales peruanos
        'peru-primary': '#D87C7C',
        'peru-primary-hover': '#A65D5D',
        'peru-primary-light': '#F2E9E4',
        'peru-primary-dark': '#A65D5D',
        'peru-primary-dark-hover': '#8B4A4A',
        'peru-primary-dark-light': '#2B2B2B',
        'peru-accent': '#EAC36C',
        'peru-accent-dark': '#B8923E',
        
        // Fondos
        'peru-bg': '#FFFFFF',
        'peru-bg-secondary': '#F2E9E4',
        'peru-bg-tertiary': '#F8F3ED',
        'peru-bg-accent': '#FCF8F3',
        'peru-bg-dark': '#1A1A1A',
        'peru-bg-dark-secondary': '#2B2B2B',
        'peru-bg-dark-tertiary': '#363636',
        'peru-bg-dark-accent': '#424242',
        
        // Texto
        'peru-text': '#3C2A21',
        'peru-text-secondary': '#6D4C41',
        'peru-text-tertiary': '#8D6E63',
        'peru-text-muted': '#A1887F',
        'peru-text-inverted': '#FFFFFF',
        'peru-text-dark': '#F5F5F5',
        'peru-text-dark-secondary': '#E0E0E0',
        'peru-text-dark-tertiary': '#BDBDBD',
        'peru-text-dark-muted': '#9E9E9E',
        'peru-text-dark-inverted': '#1A1A1A',
        
        // Bordes
        'peru-border': '#E6D6C7',
        'peru-border-secondary': '#D7C4B0',
        'peru-border-light': '#F0E6D6',
        'peru-border-dark': '#424242',
        'peru-border-dark-secondary': '#525252',
        'peru-border-dark-light': '#363636',
        
        // Cards
        'peru-card': '#FFFFFF',
        'peru-card-border': '#F2E9E4',
        'peru-card-accent': '#FCF8F3',
        'peru-card-dark': '#2B2B2B',
        'peru-card-dark-border': '#424242',
        'peru-card-dark-accent': '#363636',
        
        // Botones
        'peru-btn-primary': '#D87C7C',
        'peru-btn-primary-text': '#FFFFFF',
        'peru-btn-secondary': '#F2E9E4',
        'peru-btn-secondary-text': '#6D4C41',
        'peru-btn-accent': '#EAC36C',
        'peru-btn-accent-text': '#5D4037',
        'peru-btn-danger': '#C5524A',
        'peru-btn-danger-text': '#FFFFFF',
        'peru-btn-primary-dark': '#A65D5D',
        'peru-btn-secondary-dark': '#424242',
        'peru-btn-secondary-dark-text': '#E0E0E0',
        'peru-btn-accent-dark': '#B8923E',
        'peru-btn-accent-dark-text': '#FFFFFF',
        'peru-btn-danger-dark': '#B85450',
        
        // Estados
        'peru-success': '#8FBF90',
        'peru-warning': '#EAC36C',
        'peru-error': '#C5524A',
        'peru-info': '#6D8CA0',
        'peru-success-dark': '#5C8B5E',
        'peru-warning-dark': '#B8923E',
        'peru-error-dark': '#B85450',
        'peru-info-dark': '#4A6573',
        
        // Colores temáticos peruanos
        'peru-terracotta': '#D87C7C',
        'peru-gold': '#EAC36C',
        'peru-sage': '#8FBF90',
        'peru-slate': '#6D8CA0',
        'peru-lavender': '#A88BBE',
        'peru-terracotta-dark': '#A65D5D',
        'peru-gold-dark': '#B8923E',
        'peru-sage-dark': '#5C8B5E',
        'peru-slate-dark': '#4A6573',
        'peru-lavender-dark': '#7A6490',
      },
    },
  },
  plugins: [],
}

