"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Users, 
  Settings, 
  Shield, 
  UserPlus,
  UserCheck,
  UserX,
  Loader2,
  AlertCircle,
  Package
} from "lucide-react"
import PageContainer from "@/components/ui/PageContainer"
import { useAuth } from "@/lib/contexts/AuthContext"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { CARD_STYLES } from "@/lib/constants"

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  phone: string
  role: 'client' | 'technician' | 'admin'
  is_active: boolean
  created_at: string
  updated_at: string
}

interface AdminStats {
  totalUsers: number
  activeUsers: number
  admins: number
  technicians: number
  clients: number
}

export default function AdminPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading, isAdmin } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    admins: 0,
    technicians: 0,
    clients: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  // Vérifier l'accès admin
  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, isAdmin, router])

  // Simuler le chargement des données
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      const timer = setTimeout(() => {
        const mockUsers: User[] = [
          {
            id: 1,
            email: 'didier.kastner@dedepanne.fr',
            first_name: 'Didier',
            last_name: 'Kastner',
            phone: '06 12 34 56 78',
            role: 'admin',
            is_active: true,
            created_at: '2024-01-01T10:00:00Z',
            updated_at: '2024-01-15T14:30:00Z'
          },
          {
            id: 2,
            email: 'marc.technicien@dedepanne.fr',
            first_name: 'Marc',
            last_name: 'Technicien',
            phone: '06 98 76 54 32',
            role: 'technician',
            is_active: true,
            created_at: '2024-01-02T09:00:00Z',
            updated_at: '2024-01-10T16:45:00Z'
          },
          {
            id: 3,
            email: 'jean.dupont@email.com',
            first_name: 'Jean',
            last_name: 'Dupont',
            phone: '06 11 22 33 44',
            role: 'client',
            is_active: true,
            created_at: '2024-01-05T11:30:00Z',
            updated_at: '2024-01-12T10:15:00Z'
          }
        ]

        setUsers(mockUsers)
        
        const mockStats: AdminStats = {
          totalUsers: mockUsers.length,
          activeUsers: mockUsers.filter(u => u.is_active).length,
          admins: mockUsers.filter(u => u.role === 'admin').length,
          technicians: mockUsers.filter(u => u.role === 'technician').length,
          clients: mockUsers.filter(u => u.role === 'client').length
        }
        
        setStats(mockStats)
        setIsLoading(false)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, isAdmin])

  const handlePromoteUser = async (userId: number) => {
    // Simulation de la promotion
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, role: 'admin' as const, updated_at: new Date().toISOString() }
        : user
    ))
    
    // Mettre à jour les stats
    setStats(prev => ({
      ...prev,
      admins: prev.admins + 1,
      technicians: prev.technicians - 1
    }))
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-yellow-100 text-yellow-800">Admin</Badge>
      case 'technician':
        return <Badge className="bg-blue-100 text-blue-800">Technicien</Badge>
      case 'client':
        return <Badge className="bg-green-100 text-green-800">Client</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive 
      ? <Badge className="bg-green-100 text-green-800">Actif</Badge>
      : <Badge className="bg-red-100 text-red-800">Inactif</Badge>
  }

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
  if (!isAuthenticated || !isAdmin) {
    return null
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
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
              <div className="h-12 w-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-cocogoose font-black text-black">
                  Administration
                </h1>
                <p className="text-gray-600 font-poppins">
                  Gestion des utilisateurs et de la plateforme
                  <Badge className="ml-2 bg-yellow-100 text-yellow-800">Admin</Badge>
                </p>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card className={CARD_STYLES.elevated}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Utilisateurs</CardTitle>
                  <Users className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                ) : (
                  <div className="text-2xl font-bold text-black">{stats.totalUsers}</div>
                )}
              </CardContent>
            </Card>

            <Card className={CARD_STYLES.elevated}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Utilisateurs Actifs</CardTitle>
                  <UserCheck className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                ) : (
                  <div className="text-2xl font-bold text-black">{stats.activeUsers}</div>
                )}
              </CardContent>
            </Card>

            <Card className={CARD_STYLES.elevated}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Administrateurs</CardTitle>
                  <Shield className="h-4 w-4 text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                ) : (
                  <div className="text-2xl font-bold text-black">{stats.admins}</div>
                )}
              </CardContent>
            </Card>

            <Card className={CARD_STYLES.elevated}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Techniciens</CardTitle>
                  <UserPlus className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                ) : (
                  <div className="text-2xl font-bold text-black">{stats.technicians}</div>
                )}
              </CardContent>
            </Card>

            <Card className={CARD_STYLES.elevated}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Clients</CardTitle>
                  <Users className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                ) : (
                  <div className="text-2xl font-bold text-black">{stats.clients}</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Gestion des utilisateurs */}
          <Card className={CARD_STYLES.elevated}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Gestion des Utilisateurs
              </CardTitle>
              <CardDescription>
                Gérez les comptes utilisateurs et leurs rôles
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Chargement des utilisateurs...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date d'inscription</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {user.first_name} {user.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {user.id}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>{getStatusBadge(user.is_active)}</TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {user.role === 'technician' && (
                              <Button
                                size="sm"
                                onClick={() => handlePromoteUser(user.id)}
                                className="bg-yellow-600 hover:bg-yellow-700 text-white"
                              >
                                <Shield className="h-3 w-3 mr-1" />
                                Promouvoir Admin
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              <Settings className="h-3 w-3 mr-1" />
                              Modifier
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Actions d'administration */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <Card 
              className={`${CARD_STYLES.elevated} hover:shadow-lg transition-shadow cursor-pointer`}
              onClick={() => router.push('/pro/admin/products')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Gestion des Produits
                </CardTitle>
                <CardDescription>
                  Gérer les produits reconditionnés
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className={`${CARD_STYLES.elevated} hover:shadow-lg transition-shadow cursor-pointer`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-primary" />
                  Créer un utilisateur
                </CardTitle>
                <CardDescription>
                  Ajouter un nouvel utilisateur à la plateforme
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className={`${CARD_STYLES.elevated} hover:shadow-lg transition-shadow cursor-pointer`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Paramètres système
                </CardTitle>
                <CardDescription>
                  Configurer les paramètres de la plateforme
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </PageContainer>
    </ProtectedRoute>
  )
} 