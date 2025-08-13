/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Colores principales
        'app-primary': '#2563EB',
        'app-primary-hover': '#1D4ED8',
        'app-primary-light': '#EFF6FF',
        'app-primary-dark': '#3B82F6',
        'app-primary-dark-hover': '#2563EB',
        'app-primary-dark-light': '#1E293B',
        
        // Fondos
        'app-bg': '#FFFFFF',
        'app-bg-secondary': '#F9FAFB',
        'app-bg-tertiary': '#F3F4F6',
        'app-bg-dark': '#111827',
        'app-bg-dark-secondary': '#1F2937',
        'app-bg-dark-tertiary': '#374151',
        
        // Texto
        'app-text': '#111827',
        'app-text-secondary': '#6B7280',
        'app-text-tertiary': '#9CA3AF',
        'app-text-inverted': '#FFFFFF',
        'app-text-dark': '#F9FAFB',
        'app-text-dark-secondary': '#D1D5DB',
        'app-text-dark-tertiary': '#9CA3AF',
        'app-text-dark-inverted': '#111827',
        
        // Bordes
        'app-border': '#E5E7EB',
        'app-border-secondary': '#D1D5DB',
        'app-border-dark': '#374151',
        'app-border-dark-secondary': '#4B5563',
        
        // Cards
        'app-card': '#FFFFFF',
        'app-card-border': '#F3F4F6',
        'app-card-dark': '#1F2937',
        'app-card-dark-border': '#374151',
        
        // Botones
        'app-btn-primary': '#2563EB',
        'app-btn-primary-text': '#FFFFFF',
        'app-btn-secondary': '#F3F4F6',
        'app-btn-secondary-text': '#374151',
        'app-btn-danger': '#DC2626',
        'app-btn-danger-text': '#FFFFFF',
        'app-btn-primary-dark': '#3B82F6',
        'app-btn-secondary-dark': '#374151',
        'app-btn-secondary-dark-text': '#D1D5DB',
        'app-btn-danger-dark': '#EF4444',
        
        // Estados
        'app-success': '#059669',
        'app-warning': '#D97706',
        'app-error': '#DC2626',
        'app-info': '#0284C7',
        'app-success-dark': '#10B981',
        'app-warning-dark': '#F59E0B',
        'app-error-dark': '#EF4444',
        'app-info-dark': '#06B6D4',
      },
    },
  },
  plugins: [],
}

