"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Wrench, 
  Search,
  Filter,
  Loader2
} from "lucide-react"
import PageContainer from "@/components/ui/PageContainer"
import { useAuth } from "@/lib/contexts/AuthContext"
import { useDonations } from "@/lib/contexts/DonationsContext"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { CARD_STYLES } from "@/lib/constants"

// Types pour les dons
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

export default function DonationsPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading, isAdmin, isTechnician } = useAuth()
  const { donations, loading: donationsLoading } = useDonations()

  // Charger les données
  useEffect(() => {
    if (isAuthenticated && (isAdmin || isTechnician)) {
      // Les donations sont maintenant gérées par le context
      // Pas besoin de charger manuellement
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
      picked_up: { label: 'Enlevée', className: 'bg-orange-100 text-orange-800' },
      processed: { label: 'Traitée', className: 'bg-purple-100 text-purple-800' },
      completed: { label: 'Terminée', className: 'bg-green-100 text-green-800' },
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
                  Gestion des Donations
                </h1>
                <p className="text-gray-600 font-poppins">
                  Organisez les enlèvements d'appareils
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
                        placeholder="Rechercher une donation..."
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

          {/* Liste des donations */}
          <Card className={CARD_STYLES.elevated}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-primary" />
                Toutes les Donations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {donationsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : donations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Wrench className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucune donation trouvée</p>
                  <p className="text-sm">Les nouvelles donations apparaîtront ici</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {donations.map((donation) => (
                    <div 
                      key={donation.id}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => router.push(`/pro/donations/${donation.id}`)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-4">
                          <h3 className="font-medium">#{donation.reference_code}</h3>
                          <span className="text-sm text-gray-500">
                            {new Date(donation.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {getStatusBadge(donation.status)}
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Type d'appareil: {donation.appliance_type_id}</p>
                        {donation.pickup_date && (
                          <p>Date d'enlèvement: {new Date(donation.pickup_date).toLocaleDateString()}</p>
                        )}
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
      </PageContainer>
    </ProtectedRoute>
  )
} 