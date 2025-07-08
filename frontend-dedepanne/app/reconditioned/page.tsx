"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ShoppingCart, Wrench, ArrowLeft, Star, Truck, Shield, Heart, Search, Filter, Loader2 } from "lucide-react"
import Link from "next/link"
import { MultiStepLoader } from "@/components/ui/multi-step-loader"
import PageContainer from "@/components/ui/PageContainer"
import ProductCategory from "@/components/ui/ProductCategory"
import { useProducts } from "@/lib/contexts/ProductsContext"
import { apiClient } from "@/lib/api/client"

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
}

export default function ReconditionedPage() {
  const {
    products,
    loading,
    error,
    searchTerm,
    selectedCategory,
    selectedBrand,
    setSearchTerm,
    setSelectedCategory,
    setSelectedBrand,
    clearError
  } = useProducts()

  const [favorites, setFavorites] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ReconditionedProduct | null>(null)
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)
  const [isPurchaseLoading, setIsPurchaseLoading] = useState(false)
  const [purchaseFormData, setPurchaseFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    deliveryDate: "",
    deliveryTime: "",
    paymentMethod: "card"
  })

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const handlePurchaseInputChange = (field: string, value: string) => {
    setPurchaseFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePurchaseSubmit = async () => {
    if (!selectedProduct) return

    // Validation basique
    if (!purchaseFormData.name || !purchaseFormData.email || !purchaseFormData.phone) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    setIsPurchaseLoading(true)

    try {
      // Préparer les données pour l'API
      const orderData = {
        product_id: selectedProduct.id,
        quantity: 1,
        total_amount: selectedProduct.price,
        delivery_address: `${purchaseFormData.address}, ${purchaseFormData.city} ${purchaseFormData.postalCode}`,
        delivery_date: purchaseFormData.deliveryDate,
        delivery_time: purchaseFormData.deliveryTime,
        payment_method: purchaseFormData.paymentMethod,
        customer_info: {
          name: purchaseFormData.name,
          email: purchaseFormData.email,
          phone: purchaseFormData.phone
        }
      }

      await apiClient.createOrder(orderData)
      
      setIsPurchaseLoading(false)
      alert("Commande confirmée ! Vous recevrez un email de confirmation.")
      setIsPurchaseModalOpen(false)
      setSelectedProduct(null)
      setPurchaseFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        deliveryDate: "",
        deliveryTime: "",
        paymentMethod: "card"
      })
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error)
      setIsPurchaseLoading(false)
      alert("Erreur lors de la confirmation de la commande. Veuillez réessayer.")
    }
  }

  const openPurchaseModal = (product: ReconditionedProduct) => {
    setSelectedProduct(product)
    setIsPurchaseModalOpen(true)
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesBrand = selectedBrand === "all" || product.brand === selectedBrand

    return matchesSearch && matchesCategory && matchesBrand
  })

  if (loading) {
    return (
      <PageContainer className="bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-gray-600">Chargement des produits...</p>
            </div>
          </div>
        </div>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer className="bg-gray-50">
        <div className="container mx-auto px-4 py-8">
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

  return (
    <PageContainer 
      headerProps={{}}
      className="bg-gray-50"
    >
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-cocogoose font-black text-black mb-4">
              Appareils Reconditionnés
            </h1>
            <p className="text-gray-600 font-helvetica text-lg max-w-2xl mx-auto">
              Des appareils de qualité reconditionnés par nos experts avec garantie. 
              Économisez jusqu'à 60% par rapport au neuf !
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un appareil..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    <SelectItem value="Lave-linge">Lave-linge</SelectItem>
                    <SelectItem value="Lave-vaisselle">Lave-vaisselle</SelectItem>
                    <SelectItem value="Réfrigérateur">Réfrigérateur</SelectItem>
                    <SelectItem value="Four">Four</SelectItem>
                    <SelectItem value="Micro-ondes">Micro-ondes</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Marque" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les marques</SelectItem>
                    <SelectItem value="Samsung">Samsung</SelectItem>
                    <SelectItem value="Bosch">Bosch</SelectItem>
                    <SelectItem value="Whirlpool">Whirlpool</SelectItem>
                    <SelectItem value="Electrolux">Electrolux</SelectItem>
                    <SelectItem value="Panasonic">Panasonic</SelectItem>
                    <SelectItem value="LG">LG</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="border-2 border-black rounded-2xl shadow-xl p-4 flex flex-col items-center bg-white hover:shadow-2xl transition-shadow duration-300">
                <Link href={`/reconditioned/${product.id}`} className="w-full">
                  <div className="w-full flex justify-center mb-3 cursor-pointer">
                    <div className=" w-fullbg-gray-50 rounded-2xl p-2 flex items-center justify-center w-28 h-28 shadow">
                      <img src={product.image_url} alt={product.name} className="object-contain h-20 " />
                    </div>
                  </div>
                  <ProductCategory category={product.category} className="text-center" />
                  <div className="font-cocogoose font-black text-lg text-black text-center mb-2 leading-tight hover:text-primary transition-colors">
                    {product.brand} {product.name.replace(product.brand, '').trim()}
                    
                  </div>
                  <div className="flex justify-center items-baseline gap-2 mb-1">
                    <span className="text-xs text-gray-400 line-through">{product.original_price}€</span>
                    <span className="text-xl font-black text-primary">{product.price}€</span>
                  </div>
                  <div className="flex justify-center gap-2 text-xs text-gray-600 mb-2 font-helvetica">
                    <span>Garantie : <span className="font-bold text-black">{product.warranty_months} mois</span></span>
                    <span>•</span>
                    <span>État : <span className="font-bold text-black">{product.condition}</span></span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-1 mb-3">
                    {product.features.slice(0, 3).map((feature, i) => (
                      <span key={i} className="bg-gray-100 border border-gray-200 rounded-full px-2 py-0.5 text-xs text-gray-700">{feature}</span>
                    ))}
                  </div>
                </Link>
                <div className="flex gap-2 w-full mt-2">
                  <Link href={`/reconditioned/${product.id}`} className="flex-1">
                    <Button 
                      variant="outline"
                      className="w-full border-2 border-black rounded-full font-bold text-black hover:bg-primary/90 bg-primary"
                    >
                      Voir détails
                    </Button>
                  </Link>
                 
                </div>
              </Card>
            ))}
          </div>

          {/* No results */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-poppins font-bold text-black mb-2">
                Aucun produit trouvé
              </h3>
              <p className="text-gray-600 font-helvetica">
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal d'achat */}
      <Dialog open={isPurchaseModalOpen} onOpenChange={setIsPurchaseModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-cocogoose text-black">
              Commander {selectedProduct?.name}
            </DialogTitle>
            <DialogDescription className="font-helvetica">
              Remplissez vos informations pour finaliser votre commande
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Informations du produit */}
            {selectedProduct && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold">{selectedProduct.name}</span>
                  <span className="text-primary font-bold">{selectedProduct.price}€</span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Garantie: {selectedProduct.warranty_months} mois</p>
                  <p>État: {selectedProduct.condition}</p>
                </div>
              </div>
            )}

            {/* Formulaire */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="font-poppins font-bold text-black">
                    Nom complet *
                  </Label>
                  <Input
                    id="name"
                    value={purchaseFormData.name}
                    onChange={(e) => handlePurchaseInputChange("name", e.target.value)}
                    className="font-helvetica"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="font-poppins font-bold text-black">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={purchaseFormData.email}
                    onChange={(e) => handlePurchaseInputChange("email", e.target.value)}
                    className="font-helvetica"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone" className="font-poppins font-bold text-black">
                  Téléphone *
                </Label>
                <Input
                  id="phone"
                  value={purchaseFormData.phone}
                  onChange={(e) => handlePurchaseInputChange("phone", e.target.value)}
                  className="font-helvetica"
                />
              </div>

              <div>
                <Label htmlFor="address" className="font-poppins font-bold text-black">
                  Adresse de livraison *
                </Label>
                <Input
                  id="address"
                  value={purchaseFormData.address}
                  onChange={(e) => handlePurchaseInputChange("address", e.target.value)}
                  className="font-helvetica"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city" className="font-poppins font-bold text-black">
                    Ville *
                  </Label>
                  <Input
                    id="city"
                    value={purchaseFormData.city}
                    onChange={(e) => handlePurchaseInputChange("city", e.target.value)}
                    className="font-helvetica"
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode" className="font-poppins font-bold text-black">
                    Code postal *
                  </Label>
                  <Input
                    id="postalCode"
                    value={purchaseFormData.postalCode}
                    onChange={(e) => handlePurchaseInputChange("postalCode", e.target.value)}
                    className="font-helvetica"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deliveryDate" className="font-poppins font-bold text-black">
                    Date de livraison *
                  </Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={purchaseFormData.deliveryDate}
                    onChange={(e) => handlePurchaseInputChange("deliveryDate", e.target.value)}
                    className="font-helvetica"
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryTime" className="font-poppins font-bold text-black">
                    Créneau *
                  </Label>
                  <Select
                    value={purchaseFormData.deliveryTime}
                    onValueChange={(value) => handlePurchaseInputChange("deliveryTime", value)}
                  >
                    <SelectTrigger className="font-helvetica">
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Matin (9h-12h)</SelectItem>
                      <SelectItem value="afternoon">Après-midi (14h-17h)</SelectItem>
                      <SelectItem value="evening">Soirée (18h-20h)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="paymentMethod" className="font-poppins font-bold text-black">
                  Mode de paiement *
                </Label>
                <Select
                  value={purchaseFormData.paymentMethod}
                  onValueChange={(value) => handlePurchaseInputChange("paymentMethod", value)}
                >
                  <SelectTrigger className="font-helvetica">
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Carte bancaire</SelectItem>
                    <SelectItem value="transfer">Virement bancaire</SelectItem>
                    <SelectItem value="check">Chèque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsPurchaseModalOpen(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={handlePurchaseSubmit}
                disabled={isPurchaseLoading}
                className="flex-1 bg-primary text-black hover:bg-primary/90"
              >
                {isPurchaseLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Confirmer l'achat
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}
