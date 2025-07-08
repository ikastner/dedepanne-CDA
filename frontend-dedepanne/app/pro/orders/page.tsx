"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Search,
  Filter,
  Loader2
} from "lucide-react"
import PageContainer from "@/components/ui/PageContainer"
import { useAuth } from "@/lib/contexts/AuthContext"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { CARD_STYLES } from "@/lib/constants"

// Types pour les commandes
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

export default function OrdersPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading, isAdmin, isTechnician } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Charger les données
  useEffect(() => {
    if (isAuthenticated && (isAdmin || isTechnician)) {
      const loadOrders = async () => {
        try {
          setIsLoading(true)
          // Pour l'instant, on utilise des données simulées
          // À remplacer par un context OrdersContext quand il sera créé
          setOrders([])
        } catch (error) {
          console.error('Erreur lors du chargement des commandes:', error)
        } finally {
          setIsLoading(false)
        }
      }

      loadOrders()
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
      pending: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Confirmée', className: 'bg-blue-100 text-blue-800' },
      shipped: { label: 'Expédiée', className: 'bg-orange-100 text-orange-800' },
      delivered: { label: 'Livrée', className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Annulée', className: 'bg-red-100 text-red-800' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
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
                  Gestion des Commandes
                </h1>
                <p className="text-gray-600 font-poppins">
                  Suivez et gérez les commandes de produits
                </p>
              </div>
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
                        placeholder="Rechercher une commande..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filtres
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Liste des commandes */}
          <Card className={CARD_STYLES.elevated}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Toutes les Commandes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucune commande trouvée</p>
                  <p className="text-sm">Les nouvelles commandes apparaîtront ici</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div 
                      key={order.id}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => router.push(`/pro/orders/${order.id}`)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-4">
                          <h3 className="font-medium">#{order.reference_code}</h3>
                          <span className="text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Montant total: {order.total_amount.toLocaleString()}€</p>
                        {order.delivery_date && (
                          <p>Date de livraison: {new Date(order.delivery_date).toLocaleDateString()}</p>
                        )}
                        {order.items && order.items.length > 0 && (
                          <p className="mt-2 text-gray-500">
                            {order.items.length} article(s)
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </ProtectedRoute>
  )
} 