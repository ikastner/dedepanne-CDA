"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Wrench, 
  Clock,
  CheckCircle,
  AlertCircle,
  Heart,
  Package,
  Users,
  MapPin,
  Calendar,
  Plus,
  TrendingUp,
  TrendingDown,
  Eye,
  Play
} from "lucide-react"
import { useAuth } from "@/lib/contexts/AuthContext"
import { CARD_STYLES } from "@/lib/constants"
import PageContainer from "@/components/ui/PageContainer"
import { useNotifications } from "@/lib/hooks/useNotifications"

interface DashboardStats {
  totalInterventions: number
  pendingInterventions: number
  inProgressInterventions: number
  completedInterventions: number
  totalClients: number
  totalDonations: number
  totalOrders: number
  monthlyRevenue: number
  monthlyGrowth: number
}

interface RecentActivity {
  id: number
  type: 'repair' | 'donation' | 'order'
  clientName: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  date: string
  priority: 'low' | 'medium' | 'high'
}

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const { success, error } = useNotifications()
  const [stats, setStats] = useState<DashboardStats>({
    totalInterventions: 0,
    pendingInterventions: 0,
    inProgressInterventions: 0,
    completedInterventions: 0,
    totalClients: 0,
    totalDonations: 0,
    totalOrders: 0,
    monthlyRevenue: 0,
    monthlyGrowth: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Charger les données du tableau de bord
  useEffect(() => {
    if (isAuthenticated) {
      const loadDashboardData = async () => {
        try {
          setIsLoading(true)
          
          // Données d'exemple
          const mockStats: DashboardStats = {
            totalInterventions: 24,
            pendingInterventions: 8,
            inProgressInterventions: 3,
            completedInterventions: 13,
            totalClients: 18,
            totalDonations: 5,
            totalOrders: 7,
            monthlyRevenue: 2840,
            monthlyGrowth: 12.5
          }

          const mockRecentActivity: RecentActivity[] = [
            {
              id: 1,
              type: 'repair',
              clientName: "Marie Dupont",
              description: "Lave-linge qui ne tourne plus",
              status: 'pending',
              date: "2024-01-15T09:00:00",
              priority: 'high'
            },
            {
              id: 2,
              type: 'donation',
              clientName: "Jean Martin",
              description: "Don d'un réfrigérateur",
              status: 'pending',
              date: "2024-01-15T14:00:00",
              priority: 'medium'
            },
            {
              id: 3,
              type: 'repair',
              clientName: "Sophie Bernard",
              description: "Four qui ne chauffe plus",
              status: 'in_progress',
              date: "2024-01-16T10:30:00",
              priority: 'low'
            },
            {
              id: 4,
              type: 'order',
              clientName: "Pierre Durand",
              description: "Achat d'un lave-vaisselle",
              status: 'completed',
              date: "2024-01-17T11:00:00",
              priority: 'medium'
            }
          ]

          setStats(mockStats)
          setRecentActivity(mockRecentActivity)
          success("Tableau de bord chargé", "Les données ont été mises à jour")
        } catch (err) {
          console.error('Erreur lors du chargement du tableau de bord:', err)
          error("Erreur de chargement", "Impossible de charger les données")
        } finally {
          setIsLoading(false)
        }
      }

      loadDashboardData()
    }
  }, [isAuthenticated])

  const getPriorityBadge = (priority: string) => {
    const config = {
      high: { label: 'Urgent', className: 'bg-red-100 text-red-800' },
      medium: { label: 'Normal', className: 'bg-yellow-100 text-yellow-800' },
      low: { label: 'Faible', className: 'bg-green-100 text-green-800' }
    }
    const configItem = config[priority as keyof typeof config] || config.medium
    return <Badge className={configItem.className}>{configItem.label}</Badge>
  }

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { label: 'En attente', className: 'bg-blue-100 text-blue-800' },
      in_progress: { label: 'En cours', className: 'bg-orange-100 text-orange-800' },
      completed: { label: 'Terminée', className: 'bg-green-100 text-green-800' }
    }
    const configItem = config[status as keyof typeof config] || config.pending
    return <Badge className={configItem.className}>{configItem.label}</Badge>
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'repair': return <Wrench className="h-4 w-4" />
      case 'donation': return <Heart className="h-4 w-4" />
      case 'order': return <Package className="h-4 w-4" />
      default: return <Wrench className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'repair': return 'Réparation'
      case 'donation': return 'Donation'
      case 'order': return 'Commande'
      default: return 'Intervention'
    }
  }

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    )
  }

  // Redirection si pas autorisé
  if (!isAuthenticated) {
    return null
  }

  return (
    <PageContainer 
      showHeader={false}
      showFooter={false}
      className="bg-gradient-to-b from-blue-50 to-white"
    >
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-cocogoose font-black text-black mb-2">
            Tableau de bord
          </h1>
          <p className="text-gray-600 font-poppins">
            Bonjour {user?.first_name}, voici un aperçu de votre activité
          </p>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className={CARD_STYLES.elevated}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Interventions</CardTitle>
                <Wrench className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">{stats.totalInterventions}</div>
              <div className="text-xs text-gray-500 mt-1">
                {stats.pendingInterventions} en attente
              </div>
            </CardContent>
          </Card>

          <Card className={CARD_STYLES.elevated}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Clients</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">{stats.totalClients}</div>
              <div className="text-xs text-gray-500 mt-1">
                Clients actifs
              </div>
            </CardContent>
          </Card>

          <Card className={CARD_STYLES.elevated}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Revenus</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">{stats.monthlyRevenue}€</div>
              <div className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{stats.monthlyGrowth}% ce mois
              </div>
            </CardContent>
          </Card>

          <Card className={CARD_STYLES.elevated}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Demandes</CardTitle>
                <AlertCircle className="h-4 w-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">{stats.totalDonations + stats.totalOrders}</div>
              <div className="text-xs text-gray-500 mt-1">
                {stats.totalDonations} donations, {stats.totalOrders} commandes
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className={CARD_STYLES.elevated}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-primary" />
                Réparations
              </CardTitle>
              <CardDescription>
                Gérez vos interventions en cours
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">En attente</span>
                <Badge variant="secondary">{stats.pendingInterventions}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">En cours</span>
                <Badge variant="outline">{stats.inProgressInterventions}</Badge>
              </div>
              <Button className="w-full mt-4" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Voir toutes
              </Button>
            </CardContent>
          </Card>

          <Card className={CARD_STYLES.elevated}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Donations
              </CardTitle>
              <CardDescription>
                Gérez les demandes de dons
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Demandes</span>
                <Badge variant="secondary">{stats.totalDonations}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">À traiter</span>
                <Badge variant="outline">3</Badge>
              </div>
              <Button className="w-full mt-4" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Voir toutes
              </Button>
            </CardContent>
          </Card>

          <Card className={CARD_STYLES.elevated}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-500" />
                Commandes
              </CardTitle>
              <CardDescription>
                Gérez les demandes d'achat
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Commandes</span>
                <Badge variant="secondary">{stats.totalOrders}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">À traiter</span>
                <Badge variant="outline">2</Badge>
              </div>
              <Button className="w-full mt-4" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Voir toutes
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Activité récente */}
        <Card className={CARD_STYLES.elevated}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Activité récente</span>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Voir le calendrier
              </Button>
            </CardTitle>
            <CardDescription>
              Vos dernières interventions et demandes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Wrench className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucune activité récente</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div 
                    key={activity.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(activity.type)}
                        <div>
                          <div className="font-medium">{activity.clientName}</div>
                          <div className="text-sm text-gray-500">{activity.description}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          {new Date(activity.date).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="text-sm font-medium">{getTypeLabel(activity.type)}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        {getPriorityBadge(activity.priority)}
                        {getStatusBadge(activity.status)}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        
                        {activity.status === 'pending' && (
                          <Button size="sm" variant="default">
                            <Play className="h-4 w-4 mr-1" />
                            Démarrer
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
} 