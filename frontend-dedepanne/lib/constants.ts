// Couleurs de la marque
export const BRAND_COLORS = {
  primary: '#ffc200', // Jaune dédépanne
  black: '#000000',
  white: '#ffffff',
  gray: {
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
  }
}

// Typographie
export const TYPOGRAPHY = {
  fonts: {
    cocogoose: 'font-cocogoose',
    poppins: 'font-poppins',
    helvetica: 'font-helvetica',
  },
  sizes: {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl',
  }
}

// Styles de boutons cohérents
export const BUTTON_STYLES = {
  primary: 'bg-primary text-black hover:bg-primary/90 font-bold border-2 border-black font-helvetica',
  outline: 'border-2 border-black text-black hover:bg-black hover:text-white font-bold font-helvetica',
  secondary: 'bg-gray-100 text-black hover:bg-gray-200 font-bold border-2 border-gray-300 font-helvetica',
}

// Styles de cartes cohérents
export const CARD_STYLES = {
  default: 'border-2 border-black shadow-lg hover:shadow-xl transition-shadow',
  elevated: 'border-2 border-black shadow-xl hover:shadow-2xl transition-all duration-300',
  subtle: 'border border-gray-200 shadow-sm hover:shadow-md transition-shadow',
}

// Espacements cohérents
export const SPACING = {
  section: {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-20',
    '2xl': 'py-24',
  },
  container: {
    sm: 'px-4',
    md: 'px-6',
    lg: 'px-8',
  }
}

// Codes postaux éligibles
export const ELIGIBLE_POSTAL_CODES = [
  "75001", "75002", "75003", "75004", "75005", "75006", "75007", "75008", "75009", "75010",
  "75011", "75012", "75013", "75014", "75015", "75016", "75017", "75018", "75019", "75020",
  "92100", "92200", "92300", "92400", "92500", "92600", "92700", "92800", "92900",
  "93100", "93200", "93300", "93400", "93500", "93600", "93700", "93800", "93900",
  "94100", "94200", "94300", "94400", "94500", "94600", "94700", "94800", "94900",
]

// Zones de service
export const SERVICE_ZONES = [
  { name: "Paris (75001-75020)", distance: "0-20km", avgResponse: "2h" },
  { name: "Hauts-de-Seine (92)", distance: "5-25km", avgResponse: "3h" },
  { name: "Seine-Saint-Denis (93)", distance: "8-30km", avgResponse: "4h" },
  { name: "Val-de-Marne (94)", distance: "10-35km", avgResponse: "4h" }
]

// Appareils réparables
export const REPAIRABLE_APPLIANCES = [
  {
    name: "Lave-linge",
    icon: "🧺",
    issues: ["Ne vidange plus", "N'essore plus", "Fuite d'eau", "Ne chauffe plus", "Tambour bloqué"],
    basePrice: 95,
    avgRepairTime: "2h",
    successRate: 92,
  },
  {
    name: "Lave-vaisselle",
    icon: "🍽️",
    issues: ["Ne lave plus", "Fuite", "Ne vidange plus", "Bras cassé", "Pompe défaillante"],
    basePrice: 95,
    avgRepairTime: "1h30",
    successRate: 89,
  },
  {
    name: "Réfrigérateur",
    icon: "❄️",
    issues: ["Ne refroidit plus", "Givre excessif", "Bruit anormal", "Joint défaillant", "Thermostat HS"],
    basePrice: 120,
    avgRepairTime: "2h30",
    successRate: 85,
  },
  {
    name: "Four",
    icon: "🔥",
    issues: ["Ne chauffe plus", "Porte qui ferme mal", "Programmateur HS", "Résistance grillée", "Ventilation"],
    basePrice: 110,
    avgRepairTime: "1h45",
    successRate: 91,
  },
  {
    name: "Micro-ondes",
    icon: "📟",
    issues: ["Ne chauffe plus", "Plateau ne tourne plus", "Porte défaillante", "Étincelles", "Bruit"],
    basePrice: 85,
    avgRepairTime: "1h",
    successRate: 94,
  },
  {
    name: "Sèche-linge",
    icon: "🌪️",
    issues: ["Ne sèche plus", "Surchauffe", "Tambour bloqué", "Condenseur bouché", "Filtre"],
    basePrice: 95,
    avgRepairTime: "2h",
    successRate: 88,
  },
]

// Métadonnées de l'application
export const APP_METADATA = {
  name: "dédépanne",
  description: "Votre partenaire de confiance pour tous vos dépannages d'électroménager",
  url: "https://dedepanne.fr",
  phone: "01 23 45 67 89",
  email: "contact@dedepanne.fr",
  address: "Paris, France",
  founded: 1989,
  experience: 35,
} 