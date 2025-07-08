"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Wrench,
  ShoppingCart,
  Gift,
  CheckCircle,
  Shield,
  Phone,
  MapPin,
  Euro,
  Truck,
  Award,
  Clock,
  Star,
  Users,
  Zap,
  Heart,
  Leaf,
  ArrowRight,
  Calendar,
  Package,
  Home,
  Sparkles,
  TrendingUp,
  ThumbsUp,
  Settings,
  Gauge,
  Target,
  Lightbulb,
  ShieldCheck,
  Timer,
  CheckCircle2,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import Particles from "@/components/magicui/particles"
import { REPAIRABLE_APPLIANCES, SERVICE_ZONES, BUTTON_STYLES, CARD_STYLES, SPACING } from "@/lib/constants"
import PageContainer from "@/components/ui/PageContainer"

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState("repair")
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const reconditionedProducts = [
    { 
      category: "Lave-linge", 
      priceRange: "299€ - 599€", 
      savings: "60%", 
      warranty: "18 mois", 
      stock: 15,
      rating: 4.8,
      reviews: 127,
      image: "🧺",
      features: ["Garantie étendue", "Testé et certifié", "Livraison gratuite"]
    },
    { 
      category: "Réfrigérateur", 
      priceRange: "399€ - 899€", 
      savings: "50%", 
      warranty: "18 mois", 
      stock: 8,
      rating: 4.9,
      reviews: 89,
      image: "❄️",
      features: ["Économies d'énergie", "Fonctionnalités modernes", "Installation incluse"]
    },
    { 
      category: "Lave-vaisselle", 
      priceRange: "249€ - 499€", 
      savings: "55%", 
      warranty: "12 mois", 
      stock: 12,
      rating: 4.7,
      reviews: 156,
      image: "🍽️",
      features: ["Ultra-silencieux", "Programmes intelligents", "Raccordement inclus"]
    },
    { 
      category: "Four", 
      priceRange: "199€ - 449€", 
      savings: "45%", 
      warranty: "12 mois", 
      stock: 6,
      rating: 4.6,
      reviews: 73,
      image: "🔥",
      features: ["Pyrolyse", "Contrôle précis", "Installation rapide"]
    },
    { 
      category: "Micro-ondes", 
      priceRange: "89€ - 199€", 
      savings: "40%", 
      warranty: "6 mois", 
      stock: 10,
      rating: 4.5,
      reviews: 234,
      image: "📟",
      features: ["Fonctions multiples", "Design compact", "Livraison express"]
    },
  ]

  const testimonials = [
    {
      name: "Marie L.",
      location: "Paris 15e",
      rating: 5,
      text: "Intervention rapide et professionnelle. Mon lave-linge fonctionne parfaitement maintenant !",
      service: "Réparation lave-linge",
      avatar: "👩‍💼"
    },
    {
      name: "Pierre D.",
      location: "Boulogne-Billancourt",
      rating: 5,
      text: "Excellent service client et prix très corrects. Je recommande vivement !",
      service: "Achat reconditionné",
      avatar: "👨‍💻"
    },
    {
      name: "Sophie M.",
      location: "Saint-Denis",
      rating: 5,
      text: "Don d'appareil très simple et bon d'achat reçu rapidement. Service impeccable.",
      service: "Don d'appareil",
      avatar: "👩‍🏫"
    }
  ]

  const stats = [
    { icon: Users, value: "15,000+", label: "Clients satisfaits", color: "text-blue-600" },
    { icon: Wrench, value: "25,000+", label: "Réparations réussies", color: "text-primary" },
    { icon: Award, value: "35 ans", label: "D'expérience", color: "text-green-600" },
    { icon: Shield, value: "100%", label: "Garantie", color: "text-purple-600" },
  ]

  const features = [
    {
      icon: Timer,
      title: "Intervention rapide",
      description: "Intervention sous 24h dans la plupart des cas",
      color: "text-primary"
    },
    {
      icon: ShieldCheck,
      title: "Garantie incluse",
      description: "Toutes nos réparations sont garanties",
      color: "text-green-600"
    },
    {
      icon: Euro,
      title: "Prix transparents",
      description: "Devis gratuit et prix fixés à l'avance",
      color: "text-blue-600"
    },
    {
      icon: Wrench,
      title: "Techniciens experts",
      description: "Équipe qualifiée et expérimentée",
      color: "text-purple-600"
    }
  ]

  return (
    <PageContainer 
      headerProps={{
        showNavigation: true,
        showAuthButtons: true
      }}
      className="bg-gradient-to-br from-slate-50 via-white to-blue-50"
    >
      {/* Hero Section avec Particles */}
      <section className="relative overflow-hidden py-16 md:py-20 lg:py-24 px-4">
        <Particles className="absolute inset-0" quantity={30} color="#ffc200" vx={0.1} vy={0.1} />
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-poppins font-bold text-black">Services professionnels depuis 1989</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-cocogoose font-black text-black mb-6 leading-tight">
              Nos Services
              <span className="block text-primary">Complets</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 font-helvetica max-w-3xl mx-auto mb-8 leading-relaxed">
              Dépannage, reconditionnement et récupération d'appareils électroménagers. 
              Une solution complète et professionnelle pour tous vos besoins.
            </p>
            
            {/* Stats rapides */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-2xl md:text-3xl font-cocogoose font-black ${stat.color} mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600 font-helvetica">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className={`${BUTTON_STYLES.primary} rounded-full px-8 py-4 text-lg`}
              >
                <Link href="/">Demander une intervention</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className={`${BUTTON_STYLES.outline} rounded-full px-8 py-4 text-lg`}
              >
                <Link href="/reconditioned">Voir les reconditionnés</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`${SPACING.section.lg} px-4 bg-white`}>
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-cocogoose font-black text-black mb-4">
              Pourquoi nous choisir ?
            </h2>
            <p className="text-gray-600 font-helvetica text-lg max-w-2xl mx-auto">
              Notre expertise et notre engagement pour votre satisfaction
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`${CARD_STYLES.default} text-center group hover:scale-105 transition-all duration-300`}
              >
                <CardContent className="pt-6">
                  <div className={`${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="font-cocogoose font-black text-black text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600 font-helvetica text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 lg:py-24 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-cocogoose font-black text-black text-center mb-12">
            Pourquoi choisir <span className="text-primary">dédépanne&nbsp;?</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Bloc 1 : Artisan agréé */}
            <div className="bg-gray-50 border-2 border-black rounded-2xl p-8 flex flex-col items-center text-center shadow-lg">
              <div className="flex gap-4 mb-4">
                <img src="/whirpool.jpeg" alt="Whirlpool" className="h-10" />
                <img src="/rosieres.png" alt="Rosieres" className="h-10" />
              </div>
              <h3 className="font-cocogoose text-2xl text-black mb-2">Artisan agréé</h3>
              <p className="font-helvetica text-gray-700 mb-4">
                Artisan agréé Whirlpool et Rosieres avec 35 ans d'expérience. Disponible 5j/7 avec intervention à 95€.
              </p>
              <ul className="text-left mx-auto space-y-1 text-sm font-poppins text-black">
                <li>✓ Artisan agréé</li>
                <li>✓ 35 ans d'expérience</li>
                <li>✓ Intervention 95€</li>
              </ul>
            </div>
            {/* Bloc 2 : Jusqu'à 60% d'économies */}
            <div className="bg-gray-50 border-2 border-black rounded-2xl p-8 flex flex-col items-center text-center shadow-lg">
              <h3 className="font-cocogoose text-2xl text-black mb-2">Jusqu'à 60% d'économies</h3>
              <p className="font-helvetica text-gray-700 mb-4">
                Appareils reconditionnés par nos experts avec garantie 6 mois. Tests complets, nettoyage professionnel et remplacement des pièces usées.
              </p>
              <ul className="text-left mx-auto space-y-1 text-sm font-poppins text-black">
                <li>✓ Garantie 6 mois</li>
                <li>✓ Livraison gratuite</li>
                <li>✓ Installation incluse</li>
              </ul>
            </div>
            {/* Bloc 3 : Impact écologique positif */}
            <div className="bg-gray-50 border-2 border-black rounded-2xl p-8 flex flex-col items-center text-center shadow-lg">
              <h3 className="font-cocogoose text-2xl text-black mb-2">Impact écologique positif</h3>
              <p className="font-helvetica text-gray-700 mb-4">
                Récupération gratuite à domicile. Vos appareils sont reconditionnés ou recyclés selon les normes environnementales. Recevez un bon d'achat de 50€.
              </p>
              <ul className="text-left mx-auto space-y-1 text-sm font-poppins text-black">
                <li>✓ Récupération gratuite</li>
                <li>✓ Garantie 6 mois</li>
                <li>✓ Bon d'achat offert</li>
              </ul>
            </div>
          </div>
          {/* Bloc statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto text-center">
            <div>
              <div className="text-3xl font-cocogoose font-black text-primary mb-1">7000+</div>
              <div className="text-sm text-gray-700 font-helvetica">Clients satisfaits</div>
            </div>
            <div>
              <div className="text-3xl font-cocogoose font-black text-primary mb-1">35</div>
              <div className="text-sm text-gray-700 font-helvetica">Années d'expérience</div>
            </div>
            <div>
              <div className="text-3xl font-cocogoose font-black text-primary mb-1">6</div>
              <div className="text-sm text-gray-700 font-helvetica">Années d'artisanat</div>
            </div>
            <div>
              <div className="text-3xl font-cocogoose font-black text-primary mb-1">5j/7</div>
              <div className="text-sm text-gray-700 font-helvetica">Disponibilité</div>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className={`${SPACING.section.lg} px-4 bg-gray-50`}>
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-cocogoose font-black text-black mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-gray-600 font-helvetica text-lg max-w-2xl mx-auto">
              La satisfaction de nos clients est notre priorité
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className={`${CARD_STYLES.default} group hover:scale-105 transition-all duration-300`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 font-helvetica mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{testimonial.avatar}</div>
                      <div>
                        <div className="font-poppins font-bold text-black">{testimonial.name}</div>
                        <div className="text-sm text-gray-600 font-helvetica">{testimonial.location}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-primary text-primary">
                      {testimonial.service}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className={`${SPACING.section.lg} px-4 bg-primary/5`}>
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-cocogoose font-black text-black mb-6">
            Prêt à nous faire confiance ?
          </h2>
          <p className="text-gray-600 font-helvetica text-lg max-w-2xl mx-auto mb-8">
            Rejoignez des milliers de clients satisfaits qui nous font confiance pour leurs appareils électroménagers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className={`${BUTTON_STYLES.primary} rounded-full px-8 py-4 text-lg`}
            >
              <Link href="/" className="flex items-center gap-2">
                Demander une intervention
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className={`${BUTTON_STYLES.outline} rounded-full px-8 py-4 text-lg`}
            >
              <Link href="/reconditioned" className="flex items-center gap-2">
                Voir les reconditionnés
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      
    </PageContainer>
  )
}
