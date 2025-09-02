/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Colores principales IPAE
        'ipae-primary': 'rgb(45,60,150)',
        'ipae-primary-hover': 'rgb(35,45,120)',
        'ipae-primary-light': 'rgb(232,232,229)',
        'ipae-primary-dark': 'rgb(65,85,180)',
        'ipae-primary-dark-hover': 'rgb(55,75,160)',
        'ipae-primary-dark-light': '#2B2B2B',
        'ipae-accent': 'rgb(240,60,70)',
        'ipae-accent-dark': 'rgb(255,80,90)',
        
        // Fondos IPAE
        'ipae-bg': '#FFFFFF',
        'ipae-bg-secondary': 'rgb(232,232,229)',
        'ipae-bg-tertiary': 'rgb(240,245,250)',
        'ipae-bg-accent': 'rgb(248,248,248)',
        'ipae-bg-dark': '#1A1A1A',
        'ipae-bg-dark-secondary': '#2B2B2B',
        'ipae-bg-dark-tertiary': '#363636',
        'ipae-bg-dark-accent': '#424242',
        
        // Texto IPAE
        'ipae-text': 'rgb(111,111,110)',
        'ipae-text-secondary': 'rgb(80,80,80)',
        'ipae-text-tertiary': 'rgb(135,135,135)',
        'ipae-text-muted': 'rgb(150,150,150)',
        'ipae-text-inverted': '#FFFFFF',
        'ipae-text-dark': '#FFFFFF',
        'ipae-text-dark-secondary': '#F0F0F0',
        'ipae-text-dark-tertiary': '#E0E0E0',
        'ipae-text-dark-muted': '#CCCCCC',
        'ipae-text-dark-inverted': '#1A1A1A',
        
        // Bordes IPAE
        'ipae-border': 'rgb(232,232,229)',
        'ipae-border-secondary': 'rgb(200,200,200)',
        'ipae-border-light': 'rgb(245,245,245)',
        'ipae-border-dark': '#424242',
        'ipae-border-dark-secondary': '#525252',
        'ipae-border-dark-light': '#363636',
        
        // Cards IPAE
        'ipae-card': '#FFFFFF',
        'ipae-card-border': 'rgb(232,232,229)',
        'ipae-card-accent': 'rgb(248,248,248)',
        'ipae-card-dark': '#2B2B2B',
        'ipae-card-dark-border': '#424242',
        'ipae-card-dark-accent': '#363636',
        
        // Botones IPAE
        'ipae-btn-primary': 'rgb(45,60,150)',
        'ipae-btn-primary-text': '#FFFFFF',
        'ipae-btn-secondary': 'rgb(232,232,229)',
        'ipae-btn-secondary-text': 'rgb(111,111,110)',
        'ipae-btn-accent': 'rgb(0,173,238)',
        'ipae-btn-accent-text': '#FFFFFF',
        'ipae-btn-danger': 'rgb(240,60,70)',
        'ipae-btn-danger-text': '#FFFFFF',
        'ipae-btn-primary-dark': 'rgb(65,85,180)',
        'ipae-btn-secondary-dark': '#424242',
        'ipae-btn-secondary-dark-text': '#E0E0E0',
        'ipae-btn-accent-dark': 'rgb(20,193,255)',
        'ipae-btn-accent-dark-text': '#FFFFFF',
        'ipae-btn-danger-dark': 'rgb(255,80,90)',
        
        // Estados IPAE
        'ipae-success': 'rgb(76,175,80)',
        'ipae-warning': 'rgb(255,193,7)',
        'ipae-error': 'rgb(240,60,70)',
        'ipae-info': 'rgb(0,173,238)',
        'ipae-success-dark': 'rgb(96,195,100)',
        'ipae-warning-dark': 'rgb(255,213,27)',
        'ipae-error-dark': 'rgb(255,80,90)',
        'ipae-info-dark': 'rgb(20,193,255)',
        
        // Colores específicos IPAE
        'ipae-brand-primary': 'rgb(45,60,150)',
        'ipae-brand-secondary': 'rgb(240,60,70)',
        'ipae-brand-neutral': 'rgb(111,111,110)',
        'ipae-brand-accent': 'rgb(0,173,238)',
        'ipae-brand-light': 'rgb(232,232,229)',
        'ipae-brand-primary-dark': 'rgb(65,85,180)',
        'ipae-brand-secondary-dark': 'rgb(255,80,90)',
        'ipae-brand-neutral-dark': 'rgb(150,150,150)',
        'ipae-brand-accent-dark': 'rgb(20,193,255)',
        'ipae-brand-light-dark': '#424242',
      },
    },
  },
  plugins: [],
}

