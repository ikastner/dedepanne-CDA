"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Wrench, 
  Users, 
  Calendar, 
  DollarSign, 
  Settings, 
  FileText, 
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react"
import PageContainer from "@/components/ui/PageContainer"
import { useAuth } from "@/lib/contexts/AuthContext"
import { useRepairs } from "@/lib/contexts/RepairsContext"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { CARD_STYLES } from "@/lib/constants"

interface DashboardStats {
  totalInterventions: number
  pendingInterventions: number
  completedInterventions: number
  totalRevenue: number
  averageRating: number
}

export default function ProDashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading, isAdmin, isTechnician } = useAuth()
  const { repairs } = useRepairs()
  const [stats, setStats] = useState<DashboardStats>({
    totalInterventions: 0,
    pendingInterventions: 0,
    completedInterventions: 0,
    totalRevenue: 0,
    averageRating: 0
  })
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  // Vérifier l'accès professionnel
  useEffect(() => {
    if (!loading && (!isAuthenticated || (!isAdmin && !isTechnician))) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, isAdmin, isTechnician, router])

  // Charger les vraies données du backend
  useEffect(() => {
    if (isAuthenticated && (isAdmin || isTechnician)) {
      const loadStats = async () => {
        try {
          setIsLoadingStats(true)
          // Calculer les statistiques à partir des réparations
          const totalInterventions = repairs.length
          const pendingInterventions = repairs.filter(r => r.status === 'pending' || r.status === 'scheduled').length
          const completedInterventions = repairs.filter(r => r.status === 'completed').length
          const totalRevenue = repairs.reduce((sum, repair) => sum + repair.total_cost, 0)

          setStats({
            totalInterventions,
            pendingInterventions,
            completedInterventions,
            totalRevenue,
            averageRating: 4.9 // À implémenter plus tard
          })
        } catch (error) {
          console.error('Erreur lors du chargement des statistiques:', error)
          // En cas d'erreur, on garde les valeurs par défaut
        } finally {
          setIsLoadingStats(false)
        }
      }

      loadStats()
    }
  }, [isAuthenticated, isAdmin, isTechnician, repairs])

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
  if (!isAuthenticated || (!isAdmin && !isTechnician)) {
    return null
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
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
                <Wrench className="h-6 w-6 text-black" />
              </div>
              <div>
                <h1 className="text-3xl font-cocogoose font-black text-black">
                  Espace Professionnel
                </h1>
                <p className="text-gray-600 font-poppins">
                  Bienvenue, {user?.first_name} {user?.last_name}
                  {isAdmin && <Badge className="ml-2 bg-yellow-100 text-yellow-800">Admin</Badge>}
                  {isTechnician && <Badge className="ml-2 bg-blue-100 text-blue-800">Technicien</Badge>}
                </p>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className={CARD_STYLES.elevated}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Interventions</CardTitle>
                  <Wrench className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingStats ? (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                ) : (
                  <div className="text-2xl font-bold text-black">{stats.totalInterventions}</div>
                )}
              </CardContent>
            </Card>

            <Card className={CARD_STYLES.elevated}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">En Attente</CardTitle>
                  <Clock className="h-4 w-4 text-orange-500" />
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingStats ? (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                ) : (
                  <div className="text-2xl font-bold text-black">{stats.pendingInterventions}</div>
                )}
              </CardContent>
            </Card>

            <Card className={CARD_STYLES.elevated}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Terminées</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingStats ? (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                ) : (
                  <div className="text-2xl font-bold text-black">{stats.completedInterventions}</div>
                )}
              </CardContent>
            </Card>

            <Card className={CARD_STYLES.elevated}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Chiffre d'Affaires</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingStats ? (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                ) : (
                  <div className="text-2xl font-bold text-black">{stats.totalRevenue.toLocaleString()}€</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions rapides */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card 
              className={`${CARD_STYLES.elevated} hover:shadow-lg transition-shadow cursor-pointer`}
              onClick={() => router.push('/pro/interventions')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Gérer les Interventions
                </CardTitle>
                <CardDescription>
                  Planifier et organiser vos interventions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className={`${CARD_STYLES.elevated} hover:shadow-lg transition-shadow cursor-pointer`}
              onClick={() => router.push('/pro/clients')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Gérer les Clients
                </CardTitle>
                <CardDescription>
                  Consulter et gérer vos clients
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className={`${CARD_STYLES.elevated} hover:shadow-lg transition-shadow cursor-pointer`}
              onClick={() => router.push('/pro/orders')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Gérer les Commandes
                </CardTitle>
                <CardDescription>
                  Suivre les commandes de produits
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className={`${CARD_STYLES.elevated} hover:shadow-lg transition-shadow cursor-pointer`}
              onClick={() => router.push('/pro/donations')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-primary" />
                  Gérer les Donations
                </CardTitle>
                <CardDescription>
                  Organiser les enlèvements d'appareils
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className={`${CARD_STYLES.elevated} hover:shadow-lg transition-shadow cursor-pointer`}
              onClick={() => router.push('/pro/reports')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Rapports & Statistiques
                </CardTitle>
                <CardDescription>
                  Analyser vos performances
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className={`${CARD_STYLES.elevated} hover:shadow-lg transition-shadow cursor-pointer`}
              onClick={() => router.push('/pro/billing')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Facturation
                </CardTitle>
                <CardDescription>
                  Gérer les factures et paiements
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Interventions récentes */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-black">Interventions Récentes</h2>
              <Button 
                onClick={() => router.push('/pro/interventions/new')}
                className="bg-primary text-black hover:bg-primary/90"
              >
                Nouvelle Intervention
              </Button>
            </div>
            <Card className={CARD_STYLES.elevated}>
              <CardContent className="p-6">
                <div className="text-center text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Vos interventions récentes apparaîtront ici</p>
                  <p className="text-sm">Cliquez sur "Nouvelle Intervention" pour commencer</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    </ProtectedRoute>
  )
}
