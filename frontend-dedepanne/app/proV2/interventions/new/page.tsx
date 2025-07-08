"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { 
  ArrowLeft,
  Save,
  Loader2,
  Wrench,
  Heart,
  Package,
  Calendar,
  Clock,
  MapPin,
  User
} from "lucide-react"
import { useAuth } from "@/lib/contexts/AuthContext"
import { CARD_STYLES } from "@/lib/constants"
import PageContainer from "@/components/ui/PageContainer"
import { useNotifications } from "@/lib/hooks/useNotifications"

interface InterventionForm {
  clientName: string
  clientEmail: string
  clientPhone: string
  address: string
  postalCode: string
  city: string
  date: string
  time: string
  type: 'repair' | 'donation' | 'delivery'
  priority: 'low' | 'medium' | 'high'
  applianceType: string
  description: string
  estimatedDuration: string
  estimatedCost: number
}

export default function NewInterventionPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading, isAdmin, isTechnician } = useAuth()
  const { success, error, warning } = useNotifications()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<InterventionForm>({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    address: "",
    postalCode: "",
    city: "",
    date: new Date().toISOString().split('T')[0],
    time: "09:00",
    type: "repair",
    priority: "medium",
    applianceType: "",
    description: "",
    estimatedDuration: "1h",
    estimatedCost: 0
  })

  const handleInputChange = (field: keyof InterventionForm, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      success("Intervention créée", "La nouvelle intervention a été créée avec succès")
      
      // Redirection après 1 seconde
      setTimeout(() => {
        router.push('/proV2/interventions')
      }, 1000)
    } catch (err) {
      error("Erreur", "Impossible de créer l'intervention")
    } finally {
      setIsLoading(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'repair': return <Wrench className="h-4 w-4" />
      case 'donation': return <Heart className="h-4 w-4" />
      case 'delivery': return <Package className="h-4 w-4" />
      default: return <Wrench className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'repair': return 'Réparation'
      case 'donation': return 'Donation'
      case 'delivery': return 'Livraison'
      default: return 'Intervention'
    }
  }

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Vérification de l'accès...</p>
        </div>
      </div>
    )
  }

  // Redirection si pas autorisé
  if (!isAuthenticated || (!isAdmin && !isTechnician)) {
    return null
  }

  return (
    <>
      <PageContainer 
        showHeader={false}
        showFooter={false}
        className="bg-gradient-to-b from-blue-50 to-white"
      >
        <div className="container mx-auto px-4 py-8">
          {/* En-tête */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="outline"
                onClick={() => router.push('/proV2/interventions')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>
              <div>
                <h1 className="text-3xl font-cocogoose font-black text-black">
                  Nouvelle Intervention
                </h1>
                <p className="text-gray-600 font-poppins">
                  Créez une nouvelle intervention
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Informations client */}
              <Card className={CARD_STYLES.elevated}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informations client
                  </CardTitle>
                  <CardDescription>
                    Renseignez les informations du client
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clientName">Nom complet *</Label>
                      <Input
                        id="clientName"
                        value={formData.clientName}
                        onChange={(e) => handleInputChange('clientName', e.target.value)}
                        placeholder="Nom et prénom"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientEmail">Email</Label>
                      <Input
                        id="clientEmail"
                        type="email"
                        value={formData.clientEmail}
                        onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                        placeholder="email@exemple.com"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="clientPhone">Téléphone *</Label>
                    <Input
                      id="clientPhone"
                      type="tel"
                      value={formData.clientPhone}
                      onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                      placeholder="06 12 34 56 78"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Adresse */}
              <Card className={CARD_STYLES.elevated}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Adresse d'intervention
                  </CardTitle>
                  <CardDescription>
                    Adresse où se déroulera l'intervention
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Adresse *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="123 Rue de la Paix"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="postalCode">Code postal *</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        placeholder="75001"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">Ville *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Paris"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Détails de l'intervention */}
              <Card className={CARD_STYLES.elevated}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Détails de l'intervention
                  </CardTitle>
                  <CardDescription>
                    Type et caractéristiques de l'intervention
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Type d'intervention *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => handleInputChange('type', value as any)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="repair">
                            <div className="flex items-center gap-2">
                              <Wrench className="h-4 w-4" />
                              Réparation
                            </div>
                          </SelectItem>
                          <SelectItem value="donation">
                            <div className="flex items-center gap-2">
                              <Heart className="h-4 w-4" />
                              Donation
                            </div>
                          </SelectItem>
                          <SelectItem value="delivery">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4" />
                              Livraison
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Priorité *</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) => handleInputChange('priority', value as any)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Faible</SelectItem>
                          <SelectItem value="medium">Normale</SelectItem>
                          <SelectItem value="high">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="applianceType">Type d'appareil *</Label>
                    <Input
                      id="applianceType"
                      value={formData.applianceType}
                      onChange={(e) => handleInputChange('applianceType', e.target.value)}
                      placeholder="Lave-linge, Réfrigérateur, etc."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description du problème *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Décrivez le problème rencontré..."
                      rows={3}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Planning et coûts */}
              <Card className={CARD_STYLES.elevated}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Planning et estimation
                  </CardTitle>
                  <CardDescription>
                    Date, heure et estimation des coûts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Heure *</Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => handleInputChange('time', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="estimatedDuration">Durée estimée</Label>
                      <Select
                        value={formData.estimatedDuration}
                        onValueChange={(value) => handleInputChange('estimatedDuration', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30min">30 minutes</SelectItem>
                          <SelectItem value="45min">45 minutes</SelectItem>
                          <SelectItem value="1h">1 heure</SelectItem>
                          <SelectItem value="1h30">1h30</SelectItem>
                          <SelectItem value="2h">2 heures</SelectItem>
                          <SelectItem value="3h">3 heures</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="estimatedCost">Coût estimé (€)</Label>
                      <Input
                        id="estimatedCost"
                        type="number"
                        value={formData.estimatedCost}
                        onChange={(e) => handleInputChange('estimatedCost', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/proV2/interventions')}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary text-black hover:bg-primary/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Créer l'intervention
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </PageContainer>
    </>
  )
} 