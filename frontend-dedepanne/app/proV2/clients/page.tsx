"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  UserPlus,
  Search,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  Eye,
  Plus,
  Star,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { useAuth } from "@/lib/contexts/AuthContext"
import { CARD_STYLES } from "@/lib/constants"
import PageContainer from "@/components/ui/PageContainer"
import { useNotifications } from "@/lib/hooks/useNotifications"
import ConfirmModal from "@/components/ui/ConfirmModal"

interface Client {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  postalCode: string
  city: string
  registrationDate: string
  status: 'active' | 'inactive' | 'premium'
  totalInterventions: number
  totalSpent: number
  lastIntervention: string
  notes: string
}

export default function ClientsPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading, isAdmin, isTechnician } = useAuth()
  const { success, error, warning, info } = useNotifications()
  const [clients, setClients] = useState<Client[]>([])
  const [activeTab, setActiveTab] = useState("active")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  
  // États pour les modals
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isActionLoading, setIsActionLoading] = useState(false)

  // Vérifier l'accès professionnel
  useEffect(() => {
    if (!loading && (!isAuthenticated || (!isAdmin && !isTechnician))) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, isAdmin, isTechnician, router])

  // Charger les clients
  useEffect(() => {
    if (isAuthenticated && (isAdmin || isTechnician)) {
      const loadClients = async () => {
        try {
          setIsLoading(true)
          
          // Données d'exemple
          const mockClients: Client[] = [
            {
              id: 1,
              firstName: "Marie",
              lastName: "Dupont",
              email: "marie.dupont@email.com",
              phone: "06 12 34 56 78",
              address: "123 Rue de la Paix",
              postalCode: "75001",
              city: "Paris",
              registrationDate: "2023-01-15",
              status: "active",
              totalInterventions: 5,
              totalSpent: 450,
              lastIntervention: "2024-01-10",
              notes: "Client fidèle, préfère les interventions le matin"
            },
            {
              id: 2,
              firstName: "Jean",
              lastName: "Martin",
              email: "jean.martin@email.com",
              phone: "06 98 76 54 32",
              address: "456 Avenue des Champs",
              postalCode: "75008",
              city: "Paris",
              registrationDate: "2023-03-20",
              status: "premium",
              totalInterventions: 12,
              totalSpent: 1200,
              lastIntervention: "2024-01-12",
              notes: "Client premium, très satisfait des services"
            },
            {
              id: 3,
              firstName: "Sophie",
              lastName: "Bernard",
              email: "sophie.bernard@email.com",
              phone: "06 11 22 33 44",
              address: "789 Boulevard Saint-Germain",
              postalCode: "75006",
              city: "Paris",
              registrationDate: "2023-06-10",
              status: "active",
              totalInterventions: 3,
              totalSpent: 280,
              lastIntervention: "2024-01-08",
              notes: "Nouveau client, très ponctuel"
            },
            {
              id: 4,
              firstName: "Pierre",
              lastName: "Durand",
              email: "pierre.durand@email.com",
              phone: "06 55 66 77 88",
              address: "321 Rue du Commerce",
              postalCode: "75015",
              city: "Paris",
              registrationDate: "2022-11-05",
              status: "inactive",
              totalInterventions: 8,
              totalSpent: 650,
              lastIntervention: "2023-12-15",
              notes: "Client inactif depuis 3 mois"
            },
            {
              id: 5,
              firstName: "Anne",
              lastName: "Moreau",
              email: "anne.moreau@email.com",
              phone: "06 99 88 77 66",
              address: "654 Rue de Rivoli",
              postalCode: "75001",
              city: "Paris",
              registrationDate: "2023-09-12",
              status: "active",
              totalInterventions: 2,
              totalSpent: 180,
              lastIntervention: "2024-01-05",
              notes: "Client récent, très satisfait"
            }
          ]

          setClients(mockClients)
          success("Clients chargés", "La liste des clients a été chargée avec succès")
        } catch (err) {
          console.error('Erreur lors du chargement des clients:', err)
          error("Erreur de chargement", "Impossible de charger la liste des clients")
        } finally {
          setIsLoading(false)
        }
      }

      loadClients()
    }
  }, [isAuthenticated, isAdmin, isTechnician])

  const getStatusBadge = (status: string) => {
    const config = {
      active: { label: 'Actif', className: 'bg-green-100 text-green-800' },
      inactive: { label: 'Inactif', className: 'bg-gray-100 text-gray-800' },
      premium: { label: 'Premium', className: 'bg-purple-100 text-purple-800' }
    }
    const configItem = config[status as keyof typeof config] || config.active
    return <Badge className={configItem.className}>{configItem.label}</Badge>
  }

  const getClientValue = (client: Client) => {
    if (client.totalSpent >= 1000) return "Client VIP"
    if (client.totalSpent >= 500) return "Client Fidèle"
    if (client.totalInterventions >= 5) return "Client Régulier"
    return "Nouveau Client"
  }

  // Actions sur les clients
  const handleViewClient = (client: Client) => {
    router.push(`/proV2/clients/${client.id}`)
  }

  const handleEditClient = (client: Client) => {
    router.push(`/proV2/clients/${client.id}/edit`)
  }

  const handleDeleteClient = (client: Client) => {
    setSelectedClient(client)
    setShowDeleteModal(true)
  }

  const confirmDeleteClient = async () => {
    if (!selectedClient) return
    
    setIsActionLoading(true)
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setClients(prev => prev.filter(c => c.id !== selectedClient.id))
      
      success("Client supprimé", `Le client ${selectedClient.firstName} ${selectedClient.lastName} a été supprimé`)
    } catch (err) {
      error("Erreur", "Impossible de supprimer le client")
    } finally {
      setIsActionLoading(false)
      setShowDeleteModal(false)
      setSelectedClient(null)
    }
  }

  const handleNewClient = () => {
    info("Nouveau client", "Redirection vers le formulaire de création...")
    setTimeout(() => {
      router.push('/proV2/clients/new')
    }, 1000)
  }

  const filteredClients = clients.filter(client => {
    const fullName = `${client.firstName} ${client.lastName}`.toLowerCase()
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone.includes(searchTerm)
    
    const matchesStatus = activeTab === "all" || client.status === activeTab
    
    return matchesSearch && matchesStatus
  })

  const getStatusCount = (status: string) => {
    return clients.filter(c => c.status === status).length
  }

  const getTotalClients = () => clients.length
  const getActiveClients = () => clients.filter(c => c.status === 'active').length
  const getPremiumClients = () => clients.filter(c => c.status === 'premium').length
  const getTotalRevenue = () => clients.reduce((sum, c) => sum + c.totalSpent, 0)

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
  if (!isAuthenticated || (!isAdmin && !isTechnician)) {
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
                  Clients
                </h1>
                <p className="text-gray-600 font-poppins">
                  Gérez votre base de clients
                </p>
              </div>
              <Button
                onClick={handleNewClient}
                className="bg-primary text-black hover:bg-primary/90"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Nouveau Client
              </Button>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className={CARD_STYLES.elevated}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Clients</CardTitle>
                  <Users className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">{getTotalClients()}</div>
              </CardContent>
            </Card>

            <Card className={CARD_STYLES.elevated}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Clients Actifs</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">{getActiveClients()}</div>
              </CardContent>
            </Card>

            <Card className={CARD_STYLES.elevated}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Clients Premium</CardTitle>
                  <Star className="h-4 w-4 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">{getPremiumClients()}</div>
              </CardContent>
            </Card>

            <Card className={CARD_STYLES.elevated}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">CA Total</CardTitle>
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">{getTotalRevenue()}€</div>
              </CardContent>
            </Card>
          </div>

          {/* Recherche */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Onglets */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="active" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Actifs ({getStatusCount('active')})
              </TabsTrigger>
              <TabsTrigger value="premium" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Premium ({getStatusCount('premium')})
              </TabsTrigger>
              <TabsTrigger value="inactive" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Inactifs ({getStatusCount('inactive')})
              </TabsTrigger>
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Tous ({clients.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-6">
              <Card className={CARD_STYLES.elevated}>
                <CardContent className="p-6">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : filteredClients.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucun client trouvé</p>
                      <p className="text-sm">Les nouveaux clients apparaîtront ici</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredClients.map((client) => (
                        <div 
                          key={client.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-primary font-semibold">
                                  {client.firstName[0]}{client.lastName[0]}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium">{client.firstName} {client.lastName}</div>
                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {client.email}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm text-gray-600 flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {client.phone}
                              </div>
                              <div className="text-sm text-gray-600 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {client.city}
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-sm text-gray-600">{client.totalInterventions} interventions</div>
                              <div className="font-medium">{client.totalSpent}€</div>
                            </div>

                            <div className="flex items-center gap-2">
                              {getStatusBadge(client.status)}
                              <Badge variant="outline" className="text-xs">
                                {getClientValue(client)}
                              </Badge>
                            </div>

                            <div className="text-right">
                              <div className="text-sm text-gray-600">
                                Inscrit le {new Date(client.registrationDate).toLocaleDateString('fr-FR')}
                              </div>
                              <div className="text-sm text-gray-600">
                                Dernière: {new Date(client.lastIntervention).toLocaleDateString('fr-FR')}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewClient(client)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Voir
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditClient(client)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Modifier
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteClient(client)}
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
          setSelectedClient(null)
        }}
        onConfirm={confirmDeleteClient}
        title="Supprimer le client"
        description={`Êtes-vous sûr de vouloir supprimer le client ${selectedClient?.firstName} ${selectedClient?.lastName} ? Cette action ne peut pas être annulée.`}
        confirmText="Supprimer le client"
        cancelText="Annuler"
        variant="destructive"
        isLoading={isActionLoading}
      />
    </>
  )
} 