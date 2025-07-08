"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Package, 
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle
} from "lucide-react"
import PageContainer from "@/components/ui/PageContainer"
import { useAuth } from "@/lib/contexts/AuthContext"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { CARD_STYLES } from "@/lib/constants"

interface ProductFormData {
  name: string
  appliance_type_id: number
  brand_id: number
  model: string
  price: number
  original_price: number
  condition_rating: 'excellent' | 'very_good' | 'good' | 'fair'
  warranty_months: number
  features: string[]
  description: string
  image_url: string
  stock_quantity: number
  is_available: boolean
}

export default function NewProductPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading, isAdmin } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    appliance_type_id: 1,
    brand_id: 1,
    model: '',
    price: 0,
    original_price: 0,
    condition_rating: 'good',
    warranty_months: 12,
    features: [],
    description: '',
    image_url: '',
    stock_quantity: 1,
    is_available: true
  })

  const [newFeature, setNewFeature] = useState('')

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // TODO: Implémenter l'appel API pour créer le produit
      console.log('Création du produit:', formData)
      
      // Simulation d'un délai
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirection vers la liste des produits
      router.push('/pro/admin/products')
    } catch (err) {
      setError('Erreur lors de la création du produit')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <PageContainer 
        headerProps={{
          showNavigation: true,
          showAuthButtons: true,
          isPro: true
        }}
        className="bg-gradient-to-b from-blue-50 to-white"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-gray-600">Vérification de l'accès...</p>
          </div>
        </div>
      </PageContainer>
    )
  }

  // Redirection si pas autorisé
  if (!isAuthenticated || !isAdmin) {
    return null
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <PageContainer 
        headerProps={{
          showNavigation: true,
          showAuthButtons: true,
          isPro: true
        }}
        className="bg-gradient-to-b from-blue-50 to-white"
      >
        <div className="container mx-auto px-4 py-8">
          {/* En-tête */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>
              <div>
                <h1 className="text-3xl font-cocogoose font-black text-black">
                  Nouveau Produit
                </h1>
                <p className="text-gray-600 font-poppins">
                  Ajouter un produit reconditionné
                </p>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Informations principales */}
              <Card className={CARD_STYLES.elevated}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Informations Principales
                  </CardTitle>
                  <CardDescription>
                    Renseignez les informations de base du produit
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom du produit</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Ex: Lave-linge Samsung WW80T4540TE"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="appliance_type">Type d'appareil</Label>
                      <Select
                        value={formData.appliance_type_id.toString()}
                        onValueChange={(value) => handleInputChange('appliance_type_id', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Lave-linge</SelectItem>
                          <SelectItem value="2">Lave-vaisselle</SelectItem>
                          <SelectItem value="3">Réfrigérateur</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="brand">Marque</Label>
                      <Select
                        value={formData.brand_id.toString()}
                        onValueChange={(value) => handleInputChange('brand_id', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une marque" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Samsung</SelectItem>
                          <SelectItem value="2">Bosch</SelectItem>
                          <SelectItem value="3">Whirlpool</SelectItem>
                          <SelectItem value="4">LG</SelectItem>
                          <SelectItem value="5">Miele</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="model">Modèle</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      placeholder="Ex: WW80T4540TE"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Description détaillée du produit..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Prix et condition */}
              <Card className={CARD_STYLES.elevated}>
                <CardHeader>
                  <CardTitle>Prix et Condition</CardTitle>
                  <CardDescription>
                    Définissez les prix et l'état du produit
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="original_price">Prix d'origine (€)</Label>
                      <Input
                        id="original_price"
                        type="number"
                        value={formData.original_price}
                        onChange={(e) => handleInputChange('original_price', parseFloat(e.target.value))}
                        placeholder="0"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="price">Prix de vente (€)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="condition">État du produit</Label>
                      <Select
                        value={formData.condition_rating}
                        onValueChange={(value) => handleInputChange('condition_rating', value as any)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner l'état" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent</SelectItem>
                          <SelectItem value="very_good">Très bon</SelectItem>
                          <SelectItem value="good">Bon</SelectItem>
                          <SelectItem value="fair">Correct</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="warranty">Garantie (mois)</Label>
                      <Input
                        id="warranty"
                        type="number"
                        value={formData.warranty_months}
                        onChange={(e) => handleInputChange('warranty_months', parseInt(e.target.value))}
                        placeholder="12"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="stock">Quantité en stock</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock_quantity}
                        onChange={(e) => handleInputChange('stock_quantity', parseInt(e.target.value))}
                        placeholder="1"
                        required
                      />
                    </div>

                    <div className="flex items-end">
                      <div className="flex items-center space-x-2">
                        <input
                          id="is_available"
                          type="checkbox"
                          checked={formData.is_available}
                          onChange={(e) => handleInputChange('is_available', e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="is_available">Disponible</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Caractéristiques */}
              <Card className={CARD_STYLES.elevated}>
                <CardHeader>
                  <CardTitle>Caractéristiques</CardTitle>
                  <CardDescription>
                    Ajoutez les caractéristiques techniques du produit
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="new_feature">Nouvelle caractéristique</Label>
                    <div className="flex gap-2">
                      <Input
                        id="new_feature"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="Ex: 8kg, 1400 tr/min, A+++"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                      />
                      <Button
                        type="button"
                        onClick={handleAddFeature}
                        disabled={!newFeature.trim()}
                      >
                        Ajouter
                      </Button>
                    </div>
                  </div>

                  {formData.features.length > 0 && (
                    <div>
                      <Label>Caractéristiques ajoutées</Label>
                      <div className="space-y-2">
                        {formData.features.map((feature, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span>{feature}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveFeature(index)}
                              className="text-red-600"
                            >
                              Supprimer
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Image */}
              <Card className={CARD_STYLES.elevated}>
                <CardHeader>
                  <CardTitle>Image</CardTitle>
                  <CardDescription>
                    URL de l'image du produit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="image_url">URL de l'image</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => handleInputChange('image_url', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-black hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Créer le produit
                  </>
                )}
              </Button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              </div>
            )}
          </form>
        </div>
      </PageContainer>
    </ProtectedRoute>
  )
} 