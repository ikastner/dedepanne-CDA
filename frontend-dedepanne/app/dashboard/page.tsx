"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Wrench, 
  Package,
  Gift,
  Calendar, 
  Clock,
  MapPin,
  Phone,
  User,
  CheckCircle,
  AlertTriangle,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Plus,
  ArrowUp,
  ArrowDown,
  X,
  Save,
  History,
  TrendingUp,
  Activity,
  Target,
  BarChart3,
  Loader2
} from "lucide-react"
import PageContainer from "@/components/ui/PageContainer"
import { useAuth } from "@/lib/contexts/AuthContext"
import { useRepairs } from "@/lib/contexts/RepairsContext"
import { useDonations } from "@/lib/contexts/DonationsContext"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { CARD_STYLES } from "@/lib/constants"

// Types pour les données
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

interface Order {
  id: number;
  user_id: number;
  reference_code: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  delivery_date?: string;
  created_at: string;
  updated_at: string;
}

interface Donation {
  id: number;
  user_id: number;
  reference_code: string;
  appliance_type_id: number;
  brand_id?: number;
  status: 'pending' | 'confirmed' | 'picked_up' | 'processed' | 'completed' | 'cancelled';
  pickup_date?: string;
  address: string;
  created_at: string;
  updated_at: string;
}

interface DashboardStats {
  totalRepairs: number
  pendingRepairs: number
  completedRepairs: number
  totalSpent: number
  averageRating: number
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading, isClient } = useAuth()
  const { repairs } = useRepairs()
  const { donations } = useDonations()
  
  const [stats, setStats] = useState<DashboardStats>({
    totalRepairs: 0,
    pendingRepairs: 0,
    completedRepairs: 0,
    totalSpent: 0,
    averageRating: 0
  })
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  // Vérifier l'accès client
  useEffect(() => {
    if (!loading && (!isAuthenticated || !isClient)) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, isClient, router])

  // Charger les vraies données du backend
  useEffect(() => {
    if (isAuthenticated && isClient) {
      const loadData = async () => {
        try {
          setIsLoadingStats(true)
          
          // Les réparations et dons sont maintenant gérés par les contexts
          // On calcule les statistiques à partir des données des contexts
          const totalRepairs = repairs.length
          const pendingRepairs = repairs.filter((r: RepairRequest) => r.status === 'pending' || r.status === 'scheduled').length
          const completedRepairs = repairs.filter((r: RepairRequest) => r.status === 'completed').length
          const totalSpent = repairs.reduce((sum: number, req: RepairRequest) => sum + req.total_cost, 0)

          setStats({
            totalRepairs,
            pendingRepairs,
            completedRepairs,
            totalSpent,
            averageRating: 4.9 // À implémenter plus tard
          })
        } catch (error) {
          console.error('Erreur lors du chargement des données:', error)
          // En cas d'erreur, on garde les valeurs par défaut
        } finally {
          setIsLoadingStats(false)
        }
      }

      loadData()
    }
  }, [isAuthenticated, isClient, repairs])

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <PageContainer 
        headerProps={{
          showNavigation: true,
          showAuthButtons: true
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
  if (!isAuthenticated || !isClient) {
    return null
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Confirmée', className: 'bg-blue-100 text-blue-800' },
      scheduled: { label: 'Planifiée', className: 'bg-orange-100 text-orange-800' },
      in_progress: { label: 'En cours', className: 'bg-purple-100 text-purple-800' },
      completed: { label: 'Terminée', className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Annulée', className: 'bg-red-100 text-red-800' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge className={config.className}>{config.label}</Badge>
  }

  return (
    <ProtectedRoute allowedRoles={['client']}>
      <PageContainer 
        headerProps={{
          showNavigation: true,
          showAuthButtons: true
        }}
        className="bg-gradient-to-b from-blue-50 to-white"
      >
        <div className="container mx-auto px-4 py-8">
          {/* En-tête */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
                <User className="h-6 w-6 text-black" />
              </div>
              <div>
                <h1 className="text-3xl font-cocogoose font-black text-black">
                  Tableau de Bord
                </h1>
                <p className="text-gray-600 font-poppins">
                  Bienvenue, {user?.first_name} {user?.last_name}
                  <Badge className="ml-2 bg-blue-100 text-blue-800">Client</Badge>
                </p>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className={CARD_STYLES.elevated}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Réparations</CardTitle>
                  <Wrench className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingStats ? (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                ) : (
                  <div className="text-2xl font-bold text-black">{stats.totalRepairs}</div>
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
                  <div className="text-2xl font-bold text-black">{stats.pendingRepairs}</div>
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
                  <div className="text-2xl font-bold text-black">{stats.completedRepairs}</div>
                )}
              </CardContent>
            </Card>

            <Card className={CARD_STYLES.elevated}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Dépensé</CardTitle>
                  <Target className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingStats ? (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                ) : (
                  <div className="text-2xl font-bold text-black">{stats.totalSpent.toLocaleString()}€</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Historique des réparations */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">Historique des Réparations</h2>
            <Card className={CARD_STYLES.elevated}>
              <CardContent className="p-6">
                {isLoadingStats ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : repairs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Wrench className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucune réparation trouvée</p>
                    <p className="text-sm">Vos réparations apparaîtront ici</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {repairs.slice(0, 5).map((repair) => (
                      <div key={repair.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">#{repair.reference_code}</h3>
                          {getStatusBadge(repair.status)}
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Prix: {repair.total_cost}€</p>
                          <p>Date: {new Date(repair.created_at).toLocaleDateString()}</p>
                          <p className="mt-2 text-gray-500 truncate">
                            {repair.issue_description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Historique des achats */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">Historique des Achats</h2>
            <Card className={CARD_STYLES.elevated}>
              <CardContent className="p-6">
                {isLoadingStats ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucun achat trouvé</p>
                    <p className="text-sm">Vos achats apparaîtront ici</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">#{order.reference_code}</h3>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Montant: {order.total_amount.toLocaleString()}€</p>
                          <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Historique des donations */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">Historique des Donations</h2>
            <Card className={CARD_STYLES.elevated}>
              <CardContent className="p-6">
                {isLoadingStats ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : donations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Gift className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucune donation trouvée</p>
                    <p className="text-sm">Vos donations apparaîtront ici</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {donations.slice(0, 5).map((donation) => (
                      <div key={donation.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">#{donation.reference_code}</h3>
                          {getStatusBadge(donation.status)}
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Type d'appareil: {donation.appliance_type_id}</p>
                          <p>Date: {new Date(donation.created_at).toLocaleDateString()}</p>
                          <p className="mt-2 text-gray-500 truncate">
                            Adresse: {donation.address}
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