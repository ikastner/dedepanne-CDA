"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, CheckCircle, Clock, MapPin, Phone, User, Package, Truck } from "lucide-react"
import Link from "next/link"

// Données fictives pour le suivi
const mockTrackingData = {
  "REP-2024-001": {
    type: "repair",
    status: "confirmed",
    client: {
      name: "Marie Dubois",
      phone: "06 12 34 56 78",
      email: "marie.dubois@email.com",
      address: "15 rue de la Paix, Paris",
    },
    appliance: {
      type: "Lave-linge",
      brand: "Samsung",
      model: "WW90T4540AE",
    },
    issue: "L'appareil ne vidange plus correctement",
    urgency: "normale",
    created_at: "2024-01-15T10:30:00Z",
    scheduled_date: "2024-01-20",
    technician: "Marc Technicien",
    timeline: [
      { date: "2024-01-15T10:30:00Z", status: "Demande reçue", completed: true },
      { date: "2024-01-15T14:00:00Z", status: "Demande confirmée", completed: true },
      { date: "2024-01-16T09:00:00Z", status: "Technicien assigné", completed: true },
      { date: "2024-01-20", status: "Intervention programmée", completed: false },
      { date: "", status: "Réparation terminée", completed: false },
    ],
  },
  "DON-2024-001": {
    type: "donation",
    status: "pickup_scheduled",
    client: {
      name: "Sophie Leroy",
      phone: "06 11 22 33 44",
      email: "sophie.leroy@hotmail.fr",
      address: "8 place de la République, Paris",
    },
    appliance: {
      type: "Lave-vaisselle",
      brand: "Whirlpool",
      model: "WFC 3C26",
      condition: "Bon état",
    },
    created_at: "2024-01-10T14:20:00Z",
    pickup_date: "2024-01-17",
    voucher_amount: 50,
    timeline: [
      { date: "2024-01-10T14:20:00Z", status: "Don proposé", completed: true },
      { date: "2024-01-11T09:00:00Z", status: "Évaluation acceptée", completed: true },
      { date: "2024-01-12T10:00:00Z", status: "Récupération programmée", completed: true },
      { date: "2024-01-17", status: "Récupération prévue", completed: false },
      { date: "", status: "Bon d'achat émis", completed: false },
    ],
  },
  "CMD-2024-001": {
    type: "purchase",
    status: "preparing",
    client: {
      name: "Julie Bernard",
      phone: "06 77 88 99 00",
      email: "julie.bernard@email.com",
      address: "12 rue de Rivoli, Paris",
    },
    product: {
      name: "Lave-linge Samsung 8kg - Reconditionné",
      price: 399,
      warranty: "18 mois",
    },
    order_total: 399,
    delivery_date: "2024-01-19",
    installation: true,
    created_at: "2024-01-10T10:00:00Z",
    timeline: [
      { date: "2024-01-10T10:00:00Z", status: "Commande passée", completed: true },
      { date: "2024-01-10T10:30:00Z", status: "Paiement confirmé", completed: true },
      { date: "2024-01-15T09:00:00Z", status: "Préparation en cours", completed: true },
      { date: "2024-01-19", status: "Livraison prévue", completed: false },
      { date: "", status: "Installation terminée", completed: false },
    ],
  },
}

export default function TrackPage() {
  const [referenceCode, setReferenceCode] = useState("")
  const [trackingData, setTrackingData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = () => {
    if (!referenceCode.trim()) {
      setError("Veuillez saisir un code de référence")
      return
    }

    setLoading(true)
    setError("")

    // Simulation d'une recherche
    setTimeout(() => {
      const data = mockTrackingData[referenceCode as keyof typeof mockTrackingData]
      if (data) {
        setTrackingData(data)
        setError("")
      } else {
        setTrackingData(null)
        setError("Code de référence introuvable")
      }
      setLoading(false)
    }, 1000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800"
      case "confirmed":
      case "pickup_scheduled":
      case "preparing":
        return "bg-blue-100 text-blue-800"
      case "completed":
      case "delivered":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string, type: string) => {
    const labels = {
      repair: {
        pending: "En attente",
        confirmed: "Confirmé",
        in_progress: "En cours",
        completed: "Terminé",
      },
      donation: {
        pending: "En attente",
        accepted: "Accepté",
        pickup_scheduled: "Récupération programmée",
        completed: "Terminé",
      },
      purchase: {
        pending: "En attente",
        confirmed: "Confirmé",
        preparing: "Préparation",
        shipped: "Expédié",
        delivered: "Livré",
      },
    }
    return labels[type as keyof typeof labels]?.[status as keyof typeof labels.repair] || status
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-3 border-primary">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center gap-3 md:gap-4">
            <Button variant="ghost" size="icon" asChild className="h-8 w-8 md:h-10 md:w-10">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-lg md:text-xl font-cocogoose font-black text-black">Suivi de commande</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Formulaire de recherche */}
        <Card className="border-2 border-black shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="font-cocogoose text-black text-xl">Suivez votre demande</CardTitle>
            <CardDescription>
              Entrez votre code de référence pour suivre l'état de votre réparation, don ou commande
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Ex: REP-2024-001, DON-2024-001, CMD-2024-001"
                    value={referenceCode}
                    onChange={(e) => setReferenceCode(e.target.value.toUpperCase())}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="bg-primary text-black hover:bg-primary/90 font-bold border-2 border-black"
              >
                {loading ? "Recherche..." : "Rechercher"}
              </Button>
            </div>
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </CardContent>
        </Card>

        {/* Exemples de codes */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Codes d'exemple à tester :</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => setReferenceCode("REP-2024-001")} className="text-xs">
                REP-2024-001 (Réparation)
              </Button>
              <Button variant="outline" size="sm" onClick={() => setReferenceCode("DON-2024-001")} className="text-xs">
                DON-2024-001 (Don)
              </Button>
              <Button variant="outline" size="sm" onClick={() => setReferenceCode("CMD-2024-001")} className="text-xs">
                CMD-2024-001 (Commande)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Résultats */}
        {trackingData && (
          <div className="space-y-6">
            {/* Informations générales */}
            <Card className="border-2 border-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-cocogoose text-black">
                      {trackingData.type === "repair" && "Demande de réparation"}
                      {trackingData.type === "donation" && "Don d'appareil"}
                      {trackingData.type === "purchase" && "Commande"}
                    </CardTitle>
                    <CardDescription>Référence: {referenceCode}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(trackingData.status)}>
                    {getStatusLabel(trackingData.status, trackingData.type)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Informations client */}
                  <div>
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Informations client
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Nom:</strong> {trackingData.client.name}
                      </div>
                      <div>
                        <strong>Téléphone:</strong> {trackingData.client.phone}
                      </div>
                      <div>
                        <strong>Email:</strong> {trackingData.client.email}
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                        <span>{trackingData.client.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Détails spécifiques */}
                  <div>
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      {trackingData.type === "repair" && <></>}
                      {trackingData.type === "donation" && <></>}
                      {trackingData.type === "purchase" && <Package className="h-4 w-4" />}
                      Détails
                    </h3>
                    <div className="space-y-2 text-sm">
                      {trackingData.type === "repair" && (
                        <>
                          <div>
                            <strong>Appareil:</strong> {trackingData.appliance.type}
                          </div>
                          <div>
                            <strong>Marque:</strong> {trackingData.appliance.brand}
                          </div>
                          <div>
                            <strong>Modèle:</strong> {trackingData.appliance.model}
                          </div>
                          <div>
                            <strong>Problème:</strong> {trackingData.issue}
                          </div>
                          {trackingData.scheduled_date && (
                            <div className="text-primary font-medium">
                              <strong>Intervention prévue:</strong>{" "}
                              {new Date(trackingData.scheduled_date).toLocaleDateString("fr-FR")}
                            </div>
                          )}
                          {trackingData.technician && (
                            <div>
                              <strong>Technicien:</strong> {trackingData.technician}
                            </div>
                          )}
                        </>
                      )}

                      {trackingData.type === "donation" && (
                        <>
                          <div>
                            <strong>Appareil:</strong> {trackingData.appliance.type}
                          </div>
                          <div>
                            <strong>Marque:</strong> {trackingData.appliance.brand}
                          </div>
                          <div>
                            <strong>État:</strong> {trackingData.appliance.condition}
                          </div>
                          {trackingData.pickup_date && (
                            <div className="text-primary font-medium">
                              <strong>Récupération prévue:</strong>{" "}
                              {new Date(trackingData.pickup_date).toLocaleDateString("fr-FR")}
                            </div>
                          )}
                          <div className="text-green-600 font-medium">
                            <strong>Bon d'achat:</strong> {trackingData.voucher_amount}€
                          </div>
                        </>
                      )}

                      {trackingData.type === "purchase" && (
                        <>
                          <div>
                            <strong>Produit:</strong> {trackingData.product.name}
                          </div>
                          <div>
                            <strong>Prix:</strong> {trackingData.product.price}€
                          </div>
                          <div>
                            <strong>Garantie:</strong> {trackingData.product.warranty}
                          </div>
                          {trackingData.delivery_date && (
                            <div className="text-primary font-medium">
                              <strong>Livraison prévue:</strong>{" "}
                              {new Date(trackingData.delivery_date).toLocaleDateString("fr-FR")}
                            </div>
                          )}
                          {trackingData.installation && (
                            <div className="text-green-600 flex items-center gap-1">
                              <Truck className="h-3 w-3" />
                              Installation incluse
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="font-cocogoose text-black">Suivi détaillé</CardTitle>
                <CardDescription>Historique et étapes de votre demande</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackingData.timeline.map((step: any, index: number) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step.completed ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {step.completed ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                        </div>
                        {index < trackingData.timeline.length - 1 && (
                          <div className={`w-0.5 h-8 mt-2 ${step.completed ? "bg-green-500" : "bg-gray-200"}`}></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <h4 className={`font-medium ${step.completed ? "text-green-700" : "text-gray-500"}`}>
                          {step.status}
                        </h4>
                        {step.date && (
                          <p className="text-sm text-gray-600">
                            {step.date.includes("T")
                              ? new Date(step.date).toLocaleDateString("fr-FR") +
                                " à " +
                                new Date(step.date).toLocaleTimeString("fr-FR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : new Date(step.date).toLocaleDateString("fr-FR")}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-gray-50">
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Besoin d'aide ?</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Nous contacter
                  </Button>
                  <Button variant="outline">Modifier ma demande</Button>
                  <Button variant="outline">Signaler un problème</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
