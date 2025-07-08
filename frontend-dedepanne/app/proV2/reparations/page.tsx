"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Wrench, 
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
  Calendar,
  Plus,
  Search,
  Loader2,
  Edit,
  Trash2,
  Eye,
  Play,
  Pause,
  Check,
  Tool,
  Settings
} from "lucide-react"
import { useAuth } from "@/lib/contexts/AuthContext"
import { CARD_STYLES } from "@/lib/constants"
import PageContainer from "@/components/ui/PageContainer"
import { useNotifications } from "@/lib/hooks/useNotifications"
import ConfirmModal from "@/components/ui/ConfirmModal"

interface Repair {
  id: number
  clientName: string
  address: string
  postalCode: string
  date: string
  time: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  estimatedDuration: string
  estimatedCost: number
  description: string
  applianceType: string
  applianceBrand: string
  problemDescription: string
  operations: string[]
  notes: string
}

export default function ReparationsPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const { success, error, warning, info } = useNotifications()
  const [repairs, setRepairs] = useState<Repair[]>([])
  const [activeTab, setActiveTab] = useState("pending")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  
  // États pour les modals
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedRepair, setSelectedRepair] = useState<Repair | null>(null)
  const [isActionLoading, setIsActionLoading] = useState(false)

  // Vérifier l'accès professionnel
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  // Charger les réparations
  useEffect(() => {
    if (isAuthenticated) {
      const loadRepairs = async () => {
        try {
          setIsLoading(true)
          
          // Données d'exemple
          const mockRepairs: Repair[] = [
            {
              id: 1,
              clientName: "Marie Dupont",
              address: "123 Rue de la Paix",
              postalCode: "75001",
              date: "2024-01-15",
              time: "09:00",
              status: "pending",
              priority: "high",
              estimatedDuration: "2h",
              estimatedCost: 120,
              description: "Lave-linge qui ne tourne plus",
              applianceType: "Lave-linge",
              applianceBrand: "Bosch",
              problemDescription: "Le tambour ne tourne plus, la machine fait un bruit anormal",
              operations: ["Diagnostic électrique", "Remplacement courroie"],
              notes: "Client disponible toute la matinée"
            },
            {
              id: 2,
              clientName: "Jean Martin",
              address: "456 Avenue des Champs",
              postalCode: "75008",
              date: "2024-01-15",
              time: "14:00",
              status: "in_progress",
              priority: "medium",
              estimatedDuration: "1h30",
              estimatedCost: 95,
              description: "Four qui ne chauffe plus",
              applianceType: "Four",
              applianceBrand: "Siemens",
              problemDescription: "Le four ne chauffe plus, l'affichage fonctionne",
              operations: ["Vérification résistance", "Test thermostat"],
              notes: "Intervention en cours"
            },
            {
              id: 3,
              clientName: "Sophie Bernard",
              address: "789 Boulevard Saint-Germain",
              postalCode: "75006",
              date: "2024-01-16",
              time: "10:30",
              status: "completed",
              priority: "low",
              estimatedDuration: "45min",
              estimatedCost: 65,
              description: "Micro-ondes en panne",
              applianceType: "Micro-ondes",
              applianceBrand: "Samsung",
              problemDescription: "Le micro-ondes ne démarre plus",
              operations: ["Remplacement fusible", "Test sécurité"],
              notes: "Réparation terminée avec succès"
            },
            {
              id: 4,
              clientName: "Pierre Durand",
              address: "321 Rue du Commerce",
              postalCode: "75015",
              date: "2024-01-17",
              time: "11:00",
              status: "cancelled",
              priority: "high",
              estimatedDuration: "1h",
              estimatedCost: 80,
              description: "Réfrigérateur qui ne refroidit plus",
              applianceType: "Réfrigérateur",
              applianceBrand: "LG",
              problemDescription: "Le réfrigérateur ne refroidit plus",
              operations: ["Diagnostic compresseur"],
              notes: "Client a annulé"
            }
          ]

          setRepairs(mockRepairs)
          success("Réparations chargées", "Les réparations ont été chargées avec succès")
        } catch (err) {
          console.error('Erreur lors du chargement des réparations:', err)
          error("Erreur de chargement", "Impossible de charger les réparations")
        } finally {
          setIsLoading(false)
        }
      }

      loadRepairs()
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
      completed: { label: 'Terminée', className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Annulée', className: 'bg-gray-100 text-gray-800' }
    }
    const configItem = config[status as keyof typeof config] || config.pending
    return <Badge className={configItem.className}>{configItem.label}</Badge>
  }

  // Actions sur les réparations
  const handleStartRepair = async (repair: Repair) => {
    setSelectedRepair(repair)
    setShowStatusModal(true)
  }

  const handleCompleteRepair = async (repair: Repair) => {
    setIsActionLoading(true)
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setRepairs(prev => prev.map(r => 
        r.id === repair.id ? { ...r, status: 'completed' as const } : r
      ))
      
      success("Réparation terminée", `La réparation pour ${repair.clientName} a été marquée comme terminée`)
    } catch (err) {
      error("Erreur", "Impossible de terminer la réparation")
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleCancelRepair = async (repair: Repair) => {
    setSelectedRepair(repair)
    setShowDeleteModal(true)
  }

  const confirmDeleteRepair = async () => {
    if (!selectedRepair) return
    
    setIsActionLoading(true)
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setRepairs(prev => prev.map(r => 
        r.id === selectedRepair.id ? { ...r, status: 'cancelled' as const } : r
      ))
      
      success("Réparation annulée", `La réparation pour ${selectedRepair.clientName} a été annulée`)
    } catch (err) {
      error("Erreur", "Impossible d'annuler la réparation")
    } finally {
      setIsActionLoading(false)
      setShowDeleteModal(false)
      setSelectedRepair(null)
    }
  }

  const confirmStatusChange = async () => {
    if (!selectedRepair) return
    
    setIsActionLoading(true)
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setRepairs(prev => prev.map(r => 
        r.id === selectedRepair.id ? { ...r, status: 'in_progress' as const } : r
      ))
      
      success("Réparation démarrée", `La réparation pour ${selectedRepair.clientName} a été démarrée`)
    } catch (err) {
      error("Erreur", "Impossible de démarrer la réparation")
    } finally {
      setIsActionLoading(false)
      setShowStatusModal(false)
      setSelectedRepair(null)
    }
  }

  const handleNewRepair = () => {
    info("Nouvelle réparation", "Redirection vers le formulaire de création...")
    setTimeout(() => {
      router.push('/proV2/reparations/new')
    }, 1000)
  }

  const filteredRepairs = repairs.filter(repair => {
    const matchesSearch = repair.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         repair.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         repair.applianceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         repair.applianceBrand.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = activeTab === "all" || repair.status === activeTab
    
    return matchesSearch && matchesStatus
  })

  const getStatusCount = (status: string) => {
    return repairs.filter(r => r.status === status).length
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
  if (!isAuthenticated) {
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
                  Réparations
                </h1>
                <p className="text-gray-600 font-poppins">
                  Gérez vos interventions de réparation
                </p>
              </div>
              <Button
                onClick={handleNewRepair}
                className="bg-primary text-black hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Réparation
              </Button>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className={CARD_STYLES.elevated}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">En Attente</CardTitle>
                  <Clock className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">{getStatusCount('pending')}</div>
              </CardContent>
            </Card>

            <Card className={CARD_STYLES.elevated}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">En Cours</CardTitle>
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">{getStatusCount('in_progress')}</div>
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
                <div className="text-2xl font-bold text-black">{getStatusCount('completed')}</div>
              </CardContent>
            </Card>

            <Card className={CARD_STYLES.elevated}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
                  <Wrench className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">{repairs.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Recherche */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une réparation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Onglets */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                En Attente ({getStatusCount('pending')})
              </TabsTrigger>
              <TabsTrigger value="in_progress" className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                En Cours ({getStatusCount('in_progress')})
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Terminées ({getStatusCount('completed')})
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Annulées ({getStatusCount('cancelled')})
              </TabsTrigger>
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Toutes ({repairs.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-6">
              <Card className={CARD_STYLES.elevated}>
                <CardContent className="p-6">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : filteredRepairs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Wrench className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucune réparation trouvée</p>
                      <p className="text-sm">Les nouvelles demandes apparaîtront ici</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredRepairs.map((repair) => (
                        <div 
                          key={repair.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Wrench className="h-4 w-4 text-primary" />
                              <div>
                                <div className="font-medium">{repair.clientName}</div>
                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {repair.address}, {repair.postalCode}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {repair.applianceType} {repair.applianceBrand}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm text-gray-600">
                                {new Date(repair.date).toLocaleDateString('fr-FR')} à {repair.time}
                              </div>
                              <div className="text-sm font-medium">{repair.description}</div>
                            </div>

                            <div className="flex items-center gap-2">
                              {getPriorityBadge(repair.priority)}
                              {getStatusBadge(repair.status)}
                            </div>

                            <div className="text-right">
                              <div className="text-sm text-gray-600">{repair.estimatedDuration}</div>
                              <div className="font-medium">{repair.estimatedCost}€</div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => router.push(`/proV2/reparations/${repair.id}`)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Voir
                              </Button>
                              
                              {repair.status === 'pending' && (
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleStartRepair(repair)}
                                >
                                  <Play className="h-4 w-4 mr-1" />
                                  Démarrer
                                </Button>
                              )}
                              
                              {repair.status === 'in_progress' && (
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleCompleteRepair(repair)}
                                  disabled={isActionLoading}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Terminer
                                </Button>
                              )}
                              
                              {repair.status === 'pending' && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleCancelRepair(repair)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Annuler
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
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>

      {/* Modals */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedRepair(null)
        }}
        onConfirm={confirmDeleteRepair}
        title="Annuler la réparation"
        description={`Êtes-vous sûr de vouloir annuler la réparation pour ${selectedRepair?.clientName} ? Cette action ne peut pas être annulée.`}
        confirmText="Annuler la réparation"
        cancelText="Garder"
        variant="destructive"
        isLoading={isActionLoading}
      />

      <ConfirmModal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false)
          setSelectedRepair(null)
        }}
        onConfirm={confirmStatusChange}
        title="Démarrer la réparation"
        description={`Êtes-vous sûr de vouloir démarrer la réparation pour ${selectedRepair?.clientName} ?`}
        confirmText="Démarrer"
        cancelText="Annuler"
        isLoading={isActionLoading}
      />
    </>
  )
} 