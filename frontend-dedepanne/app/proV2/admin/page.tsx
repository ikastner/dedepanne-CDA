"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  Settings, 
  Shield, 
  UserPlus,
  UserCheck,
  UserX,
  Loader2,
  AlertCircle,
  Package,
  MapPin,
  Wrench,
  Heart,
  TrendingUp,
  Calendar,
  Edit,
  Trash2,
  Eye,
  Plus,
  Search
} from "lucide-react"
import { useAuth } from "@/lib/contexts/AuthContext"
import { CARD_STYLES } from "@/lib/constants"
import PageContainer from "@/components/ui/PageContainer"
import { useNotifications } from "@/lib/hooks/useNotifications"
import ConfirmModal from "@/components/ui/ConfirmModal"

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
  postal_codes: string[]
}

interface AdminStats {
  totalUsers: number
  activeUsers: number
  admins: number
  technicians: number
  clients: number
  totalInterventions: number
  totalRevenue: number
  averageRating: number
}

export default function AdminPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading, isAdmin } = useAuth()
  const { success, error, warning, info } = useNotifications()
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    admins: 0,
    technicians: 0,
    clients: 0,
    totalInterventions: 0,
    totalRevenue: 0,
    averageRating: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  
  // États pour les modals
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showPromoteModal, setShowPromoteModal] = useState(false)
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isActionLoading, setIsActionLoading] = useState(false)

  // Vérifier l'accès admin
  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, isAdmin, router])

  // Charger les données
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      const loadData = async () => {
        try {
          setIsLoading(true)
          
          // Données d'exemple
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
              updated_at: '2024-01-15T14:30:00Z',
              postal_codes: ['75001', '75002', '75008']
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
              updated_at: '2024-01-10T16:45:00Z',
              postal_codes: ['75006', '75007', '75015']
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
              updated_at: '2024-01-12T10:15:00Z',
              postal_codes: ['75001']
            },
            {
              id: 4,
              email: 'marie.client@email.com',
              first_name: 'Marie',
              last_name: 'Client',
              phone: '06 55 66 77 88',
              role: 'client',
              is_active: false,
              created_at: '2024-01-08T15:20:00Z',
              updated_at: '2024-01-14T09:30:00Z',
              postal_codes: ['75008']
            }
          ]

          const mockStats: AdminStats = {
            totalUsers: mockUsers.length,
            activeUsers: mockUsers.filter(u => u.is_active).length,
            admins: mockUsers.filter(u => u.role === 'admin').length,
            technicians: mockUsers.filter(u => u.role === 'technician').length,
            clients: mockUsers.filter(u => u.role === 'client').length,
            totalInterventions: 45,
            totalRevenue: 4250,
            averageRating: 4.8
          }

          setUsers(mockUsers)
          setStats(mockStats)
          success("Données chargées", "Les données d'administration ont été chargées avec succès")
        } catch (err) {
          console.error('Erreur lors du chargement des données:', err)
          error("Erreur de chargement", "Impossible de charger les données d'administration")
        } finally {
          setIsLoading(false)
        }
      }

      loadData()
    }
  }, [isAuthenticated, isAdmin])

  // Actions sur les utilisateurs
  const handlePromoteUser = (user: User) => {
    setSelectedUser(user)
    setShowPromoteModal(true)
  }

  const confirmPromoteUser = async () => {
    if (!selectedUser) return
    
    setIsActionLoading(true)
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id 
          ? { ...user, role: 'admin' as const, updated_at: new Date().toISOString() }
          : user
      ))
      
      setStats(prev => ({
        ...prev,
        admins: prev.admins + 1,
        technicians: prev.technicians - 1
      }))
      
      success("Utilisateur promu", `${selectedUser.first_name} ${selectedUser.last_name} a été promu administrateur`)
    } catch (err) {
      error("Erreur", "Impossible de promouvoir l'utilisateur")
    } finally {
      setIsActionLoading(false)
      setShowPromoteModal(false)
      setSelectedUser(null)
    }
  }

  const handleDeactivateUser = (user: User) => {
    setSelectedUser(user)
    setShowDeactivateModal(true)
  }

  const confirmDeactivateUser = async () => {
    if (!selectedUser) return
    
    setIsActionLoading(true)
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id 
          ? { ...user, is_active: false, updated_at: new Date().toISOString() }
          : user
      ))
      
      setStats(prev => ({
        ...prev,
        activeUsers: prev.activeUsers - 1
      }))
      
      success("Utilisateur désactivé", `${selectedUser.first_name} ${selectedUser.last_name} a été désactivé`)
    } catch (err) {
      error("Erreur", "Impossible de désactiver l'utilisateur")
    } finally {
      setIsActionLoading(false)
      setShowDeactivateModal(false)
      setSelectedUser(null)
    }
  }

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
  }

  const confirmDeleteUser = async () => {
    if (!selectedUser) return
    
    setIsActionLoading(true)
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setUsers(prev => prev.filter(user => user.id !== selectedUser.id))
      
      setStats(prev => ({
        ...prev,
        totalUsers: prev.totalUsers - 1,
        activeUsers: selectedUser.is_active ? prev.activeUsers - 1 : prev.activeUsers,
        [selectedUser.role + 's']: prev[selectedUser.role + 's' as keyof AdminStats] - 1
      }))
      
      success("Utilisateur supprimé", `${selectedUser.first_name} ${selectedUser.last_name} a été supprimé`)
    } catch (err) {
      error("Erreur", "Impossible de supprimer l'utilisateur")
    } finally {
      setIsActionLoading(false)
      setShowDeleteModal(false)
      setSelectedUser(null)
    }
  }

  const handleNewUser = () => {
    info("Nouvel utilisateur", "Redirection vers le formulaire de création...")
    setTimeout(() => {
      router.push('/proV2/admin/users/new')
    }, 1000)
  }

  const handleViewUser = (user: User) => {
    info("Détails utilisateur", `Affichage des détails de ${user.first_name} ${user.last_name}`)
    // Ici on pourrait ouvrir un modal avec les détails complets
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = activeTab === "all" || user.role === activeTab
    
    return matchesSearch && matchesRole
  })

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Vérification de l'accès...</p>
        </div>
      </div>
    )
  }

  // Redirection si pas autorisé
  if (!isAuthenticated || !isAdmin) {
    return null
  }

  return (
    <>
      <PageContainer 
        showHeader={false}
        showFooter={false}
        className="bg-gradient-to-b from-blue-50 to-white"
      >
        <div className="container mx-auto px-4 py-8">
          {/* En-tête */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-cocogoose font-black text-black">
                  Administration
                </h1>
                <p className="text-gray-600 font-poppins">
                  Gérez les utilisateurs et les paramètres
                </p>
              </div>
              <Button
                onClick={handleNewUser}
                className="bg-primary text-black hover:bg-primary/90"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Nouvel Utilisateur
              </Button>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className={CARD_STYLES.elevated}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Utilisateurs</CardTitle>
                  <Users className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">{stats.totalUsers}</div>
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
                <div className="text-2xl font-bold text-black">{stats.activeUsers}</div>
              </CardContent>
            </Card>

            <Card className={CARD_STYLES.elevated}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Techniciens</CardTitle>
                  <Wrench className="h-4 w-4 text-orange-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">{stats.technicians}</div>
              </CardContent>
            </Card>

            <Card className={CARD_STYLES.elevated}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Interventions</CardTitle>
                  <Package className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">{stats.totalInterventions}</div>
              </CardContent>
            </Card>
          </div>

          {/* Recherche */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Onglets */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="admin">Admins</TabsTrigger>
              <TabsTrigger value="technician">Techniciens</TabsTrigger>
              <TabsTrigger value="client">Clients</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-6">
              <Card className={CARD_STYLES.elevated}>
                <CardContent className="p-6">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucun utilisateur trouvé</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredUsers.map((user) => (
                        <div 
                          key={user.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div>
                              <div className="font-medium">{user.first_name} {user.last_name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              <div className="text-sm text-gray-500">{user.phone}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              {getRoleBadge(user.role)}
                              {getStatusBadge(user.is_active)}
                            </div>

                            <div className="text-sm text-gray-600">
                              Créé le {new Date(user.created_at).toLocaleDateString('fr-FR')}
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewUser(user)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Voir
                              </Button>
                              
                              {user.role === 'technician' && (
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handlePromoteUser(user)}
                                >
                                  <UserPlus className="h-4 w-4 mr-1" />
                                  Promouvoir
                                </Button>
                              )}
                              
                              {user.is_active && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeactivateUser(user)}
                                >
                                  <UserX className="h-4 w-4 mr-1" />
                                  Désactiver
                                </Button>
                              )}
                              
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteUser(user)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Supprimer
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>

      {/* Modals */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedUser(null)
        }}
        onConfirm={confirmDeleteUser}
        title="Supprimer l'utilisateur"
        description={`Êtes-vous sûr de vouloir supprimer ${selectedUser?.first_name} ${selectedUser?.last_name} ? Cette action ne peut pas être annulée.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
        isLoading={isActionLoading}
      />

      <ConfirmModal
        isOpen={showPromoteModal}
        onClose={() => {
          setShowPromoteModal(false)
          setSelectedUser(null)
        }}
        onConfirm={confirmPromoteUser}
        title="Promouvoir l'utilisateur"
        description={`Êtes-vous sûr de vouloir promouvoir ${selectedUser?.first_name} ${selectedUser?.last_name} au rang d'administrateur ?`}
        confirmText="Promouvoir"
        cancelText="Annuler"
        isLoading={isActionLoading}
      />

      <ConfirmModal
        isOpen={showDeactivateModal}
        onClose={() => {
          setShowDeactivateModal(false)
          setSelectedUser(null)
        }}
        onConfirm={confirmDeactivateUser}
        title="Désactiver l'utilisateur"
        description={`Êtes-vous sûr de vouloir désactiver ${selectedUser?.first_name} ${selectedUser?.last_name} ?`}
        confirmText="Désactiver"
        cancelText="Annuler"
        isLoading={isActionLoading}
      />
    </>
  )
} 