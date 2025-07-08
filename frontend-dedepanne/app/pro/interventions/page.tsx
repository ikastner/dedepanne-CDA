"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Plus, 
  Filter,
  Search,
  Loader2
} from "lucide-react"
import PageContainer from "@/components/ui/PageContainer"
import { useAuth } from "@/lib/contexts/AuthContext"
import { useRepairs } from "@/lib/contexts/RepairsContext"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { CARD_STYLES } from "@/lib/constants"

// Types pour les interventions
interface Intervention {
  id: number;
  repair_request_id: number;
  technician_id: number;
  date: string;
  start_time?: string;
  end_time?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  commentaire?: string;
  created_at: string;
  updated_at: string;
}

interface RepairRequest {
  id: number;
  reference_code: string;
  user_id: number;
  appliance_type_id: number;
  brand_id?: number;
  model?: string;
  issue_description: string;
  status: 'pending' | 'confirmed' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  base_price: number;
  additional_cost: number;
  total_cost: number;
  scheduled_date?: string;
  scheduled_time_slot?: string;
  technician_notes?: string;
  created_at: string;
  updated_at: string;
}

export default function InterventionsPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading, isAdmin, isTechnician } = useAuth()
  const { repairs } = useRepairs()
  const [interventions, setInterventions] = useState<Intervention[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Charger les données
  useEffect(() => {
    if (isAuthenticated && (isAdmin || isTechnician)) {
      const loadData = async () => {
        try {
          setIsLoading(true)
          // Les réparations sont maintenant gérées par le context
          // Pour les interventions, on peut les simuler ou les récupérer via l'API
          setInterventions([]) // À implémenter quand l'API sera disponible
        } catch (error) {
          console.error('Erreur lors du chargement des interventions:', error)
        } finally {
          setIsLoading(false)
        }
      }

      loadData()
    }
  }, [isAuthenticated, isAdmin, isTechnician])

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
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageContainer>
    )
  }

  if (!isAuthenticated || (!isAdmin && !isTechnician)) {
    return null
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { label: 'Planifiée', className: 'bg-blue-100 text-blue-800' },
      in_progress: { label: 'En cours', className: 'bg-orange-100 text-orange-800' },
      completed: { label: 'Terminée', className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Annulée', className: 'bg-red-100 text-red-800' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled
    return <Badge className={config.className}>{config.label}</Badge>
  }

  return (
    <ProtectedRoute allowedRoles={['admin', 'technician']}>
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
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-cocogoose font-black text-black">
                  Gestion des Interventions
                </h1>
                <p className="text-gray-600 font-poppins">
                  Planifiez et organisez vos interventions
                </p>
              </div>
              <Button 
                onClick={() => router.push('/pro/interventions/new')}
                className="bg-primary text-black hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Intervention
              </Button>
            </div>
          </div>

          {/* Filtres et recherche */}
          <div className="mb-6">
            <Card className={CARD_STYLES.elevated}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Rechercher une intervention..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filtres
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Vue Agenda
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Liste des interventions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Interventions planifiées */}
            <Card className={CARD_STYLES.elevated}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Interventions Planifiées
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : interventions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucune intervention planifiée</p>
                    <p className="text-sm">Créez votre première intervention</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {interventions.slice(0, 5).map((intervention) => (
                      <div 
                        key={intervention.id}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => router.push(`/pro/interventions/${intervention.id}`)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">Intervention #{intervention.id}</h3>
                          {getStatusBadge(intervention.status)}
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Date: {new Date(intervention.date).toLocaleDateString()}</p>
                          {intervention.start_time && (
                            <p>Heure: {intervention.start_time}</p>
                          )}
                          {intervention.commentaire && (
                            <p className="mt-2 text-gray-500">{intervention.commentaire}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Demandes de réparation */}
            <Card className={CARD_STYLES.elevated}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  Demandes de Réparation
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : repairs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucune demande de réparation</p>
                    <p className="text-sm">Les nouvelles demandes apparaîtront ici</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {repairs.slice(0, 5).map((request) => (
                      <div 
                        key={request.id}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => router.push(`/pro/repairs/${request.id}`)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">#{request.reference_code}</h3>
                          {getStatusBadge(request.status)}
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Prix: {request.total_cost}€</p>
                          <p>Date: {new Date(request.created_at).toLocaleDateString()}</p>
                          <p className="mt-2 text-gray-500 truncate">
                            {request.issue_description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    </ProtectedRoute>
  )
} 