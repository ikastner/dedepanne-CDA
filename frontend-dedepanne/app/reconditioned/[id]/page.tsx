"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, Truck, Shield, CheckCircle, Wrench, ShoppingCart, Heart, Share2, Loader2 } from "lucide-react"
import Link from "next/link"
import { MultiStepLoader } from "@/components/ui/multi-step-loader"
import PageContainer from "@/components/ui/PageContainer"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useProducts } from "@/lib/contexts/ProductsContext"

// Types pour les produits reconditionnés
interface ReconditionedProduct {
  id: number
  name: string
  brand: string
  category: string
  price: number
  original_price: number
  condition: string
  warranty_months: number
  features: string[]
  description: string
  image_url: string
  is_available: boolean
  stock_quantity: number
  created_at: string
  average_rating: number
  review_count: number
  savings_percentage: number
  specifications: Record<string, string>
  reconditioning_details: string[]
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const {
    selectedProduct,
    loading,
    error,
    fetchProductById,
    clearError
  } = useProducts()

  const [isPurchaseRequestLoading, setIsPurchaseRequestLoading] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    message: "",
  })
  const [isFavorite, setIsFavorite] = useState(false)

  const purchaseRequestLoadingStates = [
    { text: "Vérification de la disponibilité..." },
    { text: "Analyse de votre demande..." },
    { text: "Transmission au service commercial..." },
    { text: "Génération de la demande..." },
    { text: "Envoi de la confirmation..." },
    { text: "Demande d'achat envoyée avec succès !" }
  ]

  useEffect(() => {
    fetchProductById(params.id)
  }, [params.id, fetchProductById])

  const handlePurchaseRequest = async () => {
    if (!selectedProduct || !customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    setIsPurchaseRequestLoading(true)
    
    // Simuler le traitement de la demande d'achat
    await new Promise((resolve) => setTimeout(resolve, 12000))
    
    setIsPurchaseRequestLoading(false)
    
    alert("Demande d'achat envoyée ! Un commercial vous contactera sous 24h pour finaliser votre commande.")
    
    // Reset form
    setCustomerInfo({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      message: "",
    })
  }

  if (loading) {
    return (
      <PageContainer>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-gray-600">Chargement du produit...</p>
          </div>
        </div>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <Shield className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-poppins font-bold text-black mb-2">
              Erreur de chargement
            </h3>
            <p className="text-gray-600 font-helvetica">{error}</p>
            <Button 
              onClick={clearError} 
              className="mt-4 bg-primary text-black hover:bg-primary/90"
            >
              Réessayer
            </Button>
          </div>
        </div>
      </PageContainer>
    )
  }

  if (!selectedProduct) {
    return (
      <PageContainer>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 mb-4">
              <Shield className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-poppins font-bold text-black mb-2">
              Produit non trouvé
            </h3>
            <p className="text-gray-600 font-helvetica">
              Le produit que vous recherchez n'existe pas ou n'est plus disponible.
            </p>
            <Link href="/reconditioned">
              <Button className="mt-4 bg-primary text-black hover:bg-primary/90">
                Retour aux produits
              </Button>
            </Link>
          </div>
        </div>
      </PageContainer>
    )
  }

  const discountPercentage = Math.round((1 - selectedProduct.price / selectedProduct.original_price) * 100)

  return (
    <PageContainer>
      <div>
        {/* Breadcrumb + bouton retour */}
        <div className="container mx-auto px-4 pt-6 pb-2">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/reconditioned" className="flex items-center gap-1 hover:text-primary transition-colors mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Retour</span>
            </Link>
            <span className="mx-1">/</span>
            <Link href="/reconditioned" className="hover:text-primary transition-colors">Appareils reconditionnés</Link>
            <span className="mx-1">/</span>
            <span className="font-bold text-black">{selectedProduct.name}</span>
          </div>
        </div>
        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Product Image */}
              <div className="flex-shrink-0 w-full md:w-1/2 flex justify-center">
                <img
                  src={selectedProduct.image_url}
                  alt={selectedProduct.name}
                  className="object-contain rounded-lg bg-gray-100 max-h-64 w-full"
                />
              </div>
              {/* Product Info */}
              <div className="flex-1 w-full md:w-1/2">
                <div className="font-cocogoose font-bold text-black text-2xl mb-2">
                  {selectedProduct.name}
                </div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-base text-gray-400 line-through">{selectedProduct.original_price}€</span>
                  <span className="text-2xl font-bold text-primary">{selectedProduct.price}€</span>
                </div>
                <div className="flex gap-2 text-sm text-gray-600 mb-2">
                  <span>Garantie : <span className="font-semibold text-black">{selectedProduct.warranty_months} mois</span></span>
                  <span>•</span>
                  <span>État : <span className="font-semibold text-black">{selectedProduct.condition}</span></span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedProduct.features.map((feature: string, index: number) => (
                    <span key={index} className="bg-gray-100 border border-gray-200 rounded px-2 py-0.5 text-xs text-gray-700">
                      {feature}
                    </span>
                  ))}
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-primary text-black hover:bg-primary/90 font-bold border-2 border-black font-helvetica py-3 text-lg mt-2"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Faire une demande d'achat
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-cocogoose text-black flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Demande d'achat
                      </DialogTitle>
                      <DialogDescription className="font-helvetica">
                        Remplissez ce formulaire pour faire une demande d'achat. Un commercial vous contactera sous 24h.
                      </DialogDescription>
                    </DialogHeader>
                    <form className="space-y-4 p-1">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" className="font-poppins font-medium">
                            Nom et prénom *
                          </Label>
                          <Input
                            id="name"
                            placeholder="Votre nom et prénom"
                            className="mt-1 font-helvetica"
                            value={customerInfo.name}
                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="font-poppins font-medium">
                            Email *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="votre@email.fr"
                            className="mt-1 font-helvetica"
                            value={customerInfo.email}
                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="phone" className="font-poppins font-medium">
                          Téléphone *
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="06 12 34 56 78"
                          className="mt-1 font-helvetica"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="address" className="font-poppins font-medium">
                          Adresse de livraison
                        </Label>
                        <Input
                          id="address"
                          placeholder="Votre adresse"
                          className="mt-1 font-helvetica"
                          value={customerInfo.address}
                          onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city" className="font-poppins font-medium">
                            Ville
                          </Label>
                          <Input
                            id="city"
                            placeholder="Votre ville"
                            className="mt-1 font-helvetica"
                            value={customerInfo.city}
                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, city: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="postalCode" className="font-poppins font-medium">
                            Code Postal
                          </Label>
                          <Input
                            id="postalCode"
                            placeholder="75001"
                            maxLength={5}
                            className="mt-1 font-helvetica"
                            value={customerInfo.postalCode}
                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, postalCode: e.target.value.replace(/\D/g, "") }))}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="message" className="font-poppins font-medium">
                          Message (optionnel)
                        </Label>
                        <Textarea
                          id="message"
                          placeholder="Précisions sur votre demande, questions..."
                          rows={3}
                          className="mt-1 font-helvetica"
                          value={customerInfo.message}
                          onChange={(e) => setCustomerInfo(prev => ({ ...prev, message: e.target.value }))}
                        />
                      </div>
                      <Button
                        className="w-full bg-primary text-black hover:bg-primary/90 font-bold border-2 border-black font-helvetica py-3 text-lg"
                        onClick={handlePurchaseRequest}
                        disabled={!customerInfo.name || !customerInfo.email || !customerInfo.phone}
                        type="button"
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Envoyer la demande
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            {/* Spécifications techniques */}
            <div className="mt-8">
              <div className="border border-gray-200 rounded-lg bg-white p-6">
                <div className="font-cocogoose font-bold text-black text-lg mb-4">Spécifications techniques</div>
                <div className="divide-y divide-gray-100">
                  {Object.entries(selectedProduct.specifications || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 text-sm">
                      <span className="text-gray-700">{key}</span>
                      <span className="text-gray-900 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <MultiStepLoader
          loadingStates={purchaseRequestLoadingStates}
          loading={isPurchaseRequestLoading}
          duration={2000}
          loop={false}
        />
      </div>
    </PageContainer>
  )
} 