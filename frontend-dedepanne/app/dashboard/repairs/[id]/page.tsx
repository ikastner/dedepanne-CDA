"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft,
  Wrench,
  Calendar,
  Clock,
  Euro,
  MapPin,
  Phone,
  Mail,
  FileText,
  Download,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock as ClockIcon
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import PageContainer from "@/components/ui/PageContainer"

// Données mockées
const mockRepair = {
  id: 1,
  reference_code: "REP-2024-001",
  appliance_type: "Lave-linge",
  brand: "Samsung",
  model: "WW90T534DAW",
  issue_description: "Le lave-linge ne vidange plus correctement. L'eau reste dans le tambour après le cycle de lavage.",
  urgency: "normal",
  status: "completed",
  base_price: 75.00,
  additional_cost: 14.00,
  total_cost: 89.00,
  scheduled_date: "2024-01-15",
  scheduled_time_slot: "14:00-16:00",
  technician_notes: "Réparation terminée avec succès. Pièce remplacée : pompe de vidange. L'appareil fonctionne maintenant parfaitement.",
  created_at: "2024-01-10T10:30:00Z",
  completed_at: "2024-01-15T15:45:00Z",
  user: {
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@email.com",
    phone: "06 12 34 56 78"
  },
  address: {
    address_line1: "123 Rue de la Paix",
    city: "Paris",
    postal_code: "75001"
  },
  technician: {
    name: "Pierre Martin",
    phone: "06 98 76 54 32",
    email: "pierre.martin@dedepanne.fr"
  },
  interventions: [
    {
      id: 1,
      date: "2024-01-15",
      start_time: "14:00",
      end_time: "15:45",
      status: "completed",
      diagnosis: "Pompe de vidange défaillante",
      work_performed: "Remplacement de la pompe de vidange et test de fonctionnement"
    }
  ],
  parts: [
    {
      id: 1,
      part_name: "Pompe de vidange",
      part_number: "DC97-14486A",
      quantity: 1,
      unit_price: 14.00,
      total_price: 14.00,
      warranty_months: 12
    }
  ]
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    pending: { label: "En attente", className: "bg-yellow-100 text-yellow-800" },
    confirmed: { label: "Confirmée", className: "bg-blue-100 text-blue-800" },
    scheduled: { label: "Programmée", className: "bg-purple-100 text-purple-800" },
    in_progress: { label: "En cours", className: "bg-orange-100 text-orange-800" },
    completed: { label: "Terminée", className: "bg-green-100 text-green-800" },
    cancelled: { label: "Annulée", className: "bg-red-100 text-red-800" }
  }
  
  return statusConfig[status as keyof typeof statusConfig] || 
         { label: status, className: "bg-gray-100 text-gray-800" }
}

const getUrgencyBadge = (urgency: string) => {
  const urgencyConfig = {
    low: { label: "Faible", className: "bg-green-100 text-green-800" },
    normal: { label: "Normale", className: "bg-blue-100 text-blue-800" },
    high: { label: "Élevée", className: "bg-orange-100 text-orange-800" },
    emergency: { label: "Urgence", className: "bg-red-100 text-red-800" }
  }
  
  return urgencyConfig[urgency as keyof typeof urgencyConfig] || 
         { label: urgency, className: "bg-gray-100 text-gray-800" }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "in_progress":
      return <ClockIcon className="h-4 w-4 text-blue-600" />
    case "scheduled":
      return <Calendar className="h-4 w-4 text-purple-600" />
    case "pending":
      return <AlertCircle className="h-4 w-4 text-yellow-600" />
    case "cancelled":
      return <XCircle className="h-4 w-4 text-red-600" />
    default:
      return <ClockIcon className="h-4 w-4 text-gray-600" />
  }
}

export default function RepairDetailPage() {
  const params = useParams()
  const [repair, setRepair] = useState(mockRepair)

  // Simulation de récupération des données selon l'ID
  useEffect(() => {
    // Ici vous feriez un appel API pour récupérer les détails de la réparation
    console.log("Récupération des détails pour la réparation:", params.id)
  }, [params.id])

  const handleDownloadInvoice = () => {
    alert("Téléchargement de la facture...")
  }

  const handleContactTechnician = () => {
    alert("Ouverture de la messagerie...")
  }

  return (
    <PageContainer 
      headerProps={{
        showBackButton: true,
        backUrl: "/dashboard",
        showNavigation: true,
        showAuthButtons: true
      }}
      className="bg-white"
    >
      <div className="container mx-auto px-4 py-6">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-cocogoose font-black text-black">
                Réparation {repair.reference_code}
              </h1>
              <p className="text-gray-600 font-poppins">
                Détails de votre intervention
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statut et informations principales */}
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(repair.status)}
                    <div>
                      <CardTitle className="font-cocogoose">
                        {repair.appliance_type} {repair.brand}
                      </CardTitle>
                      <CardDescription>
                        Modèle : {repair.model}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusBadge(repair.status).className}>
                      {getStatusBadge(repair.status).label}
                    </Badge>
                    <Badge className={getUrgencyBadge(repair.urgency).className}>
                      {getUrgencyBadge(repair.urgency).label}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-black mb-2">Problème signalé</h4>
                    <p className="text-gray-600 text-sm">{repair.issue_description}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-black mb-2">Coûts</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Prix de base :</span>
                        <span>{repair.base_price.toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pièces supplémentaires :</span>
                        <span>{repair.additional_cost.toFixed(2)}€</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>Total :</span>
                        <span className="text-primary">{repair.total_cost.toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interventions */}
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="font-cocogoose flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Interventions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {repair.interventions.map((intervention) => (
                    <div key={intervention.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(intervention.status)}
                          <div>
                            <h4 className="font-medium">Intervention du {new Date(intervention.date).toLocaleDateString("fr-FR")}</h4>
                            <p className="text-sm text-gray-600">
                              {intervention.start_time} - {intervention.end_time}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusBadge(intervention.status).className}>
                          {getStatusBadge(intervention.status).label}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-sm text-gray-700 mb-1">Diagnostic</h5>
                          <p className="text-sm text-gray-600">{intervention.diagnosis}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm text-gray-700 mb-1">Travaux effectués</h5>
                          <p className="text-sm text-gray-600">{intervention.work_performed}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="font-cocogoose">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" onClick={handleDownloadInvoice}>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger la facture
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleContactTechnician}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contacter le technicien
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Voir le devis
                </Button>
              </CardContent>
            </Card>

            {/* Informations de création */}
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="font-cocogoose">Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Créée le :</span>
                  <span>{new Date(repair.created_at).toLocaleDateString("fr-FR")}</span>
                </div>
                {repair.completed_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Terminée le :</span>
                    <span>{new Date(repair.completed_at).toLocaleDateString("fr-FR")}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Référence :</span>
                  <span className="font-mono">{repair.reference_code}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  )
} 