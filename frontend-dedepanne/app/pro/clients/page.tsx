"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Plus
} from "lucide-react"
import PageContainer from "@/components/ui/PageContainer"
import { useAuth } from "@/lib/contexts/AuthContext"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { CARD_STYLES } from "@/lib/constants"

export default function ClientsPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading, isAdmin, isTechnician } = useAuth()

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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      </PageContainer>
    )
  }

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
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-cocogoose font-black text-black">
                  Gestion des Clients
                </h1>
                <p className="text-gray-600 font-poppins">
                  Consulter et gérer vos clients
                </p>
              </div>
              <Button 
                onClick={() => router.push('/pro/clients/new')}
                className="bg-primary text-black hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Client
              </Button>
            </div>
          </div>

          {/* Contenu principal */}
          <Card className={CARD_STYLES.elevated}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Liste des Clients
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Gestion des clients en cours de développement</p>
                <p className="text-sm">Cette fonctionnalité sera bientôt disponible</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </ProtectedRoute>
  )
} 