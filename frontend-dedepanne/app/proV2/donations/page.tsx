"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Heart, 
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
  Check,
  X,
  Package,
  User,
  Phone,
  Mail
} from "lucide-react"
import { useAuth } from "@/lib/contexts/AuthContext"
import { CARD_STYLES } from "@/lib/constants"
import PageContainer from "@/components/ui/PageContainer"
import { useNotifications } from "@/lib/hooks/useNotifications"
import ConfirmModal from "@/components/ui/ConfirmModal"

interface Donation {
  id: number
  clientName: string
  clientEmail: string
  clientPhone: string
  address: string
  postalCode: string
  date: string
  time: string
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
  priority: 'low' | 'medium' | 'high'
  applianceType: string
  applianceBrand: string
  applianceModel: string
  applianceAge: string
  applianceCondition: 'excellent' | 'good' | 'fair' | 'poor'
  description: string
  notes: string
  estimatedValue: number
}

export default function DonationsPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const { success, error, warning, info } = useNotifications()
  const [donations, setDonations] = useState<Donation[]>([])
  const [activeTab, setActiveTab] = useState("pending")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  
  // États pour les modals
  const [showAcceptModal, setShowAcceptModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null)
  const [isActionLoading, setIsActionLoading] = useState(false)

  // Vérifier l'accès professionnel
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  // Charger les donations
  useEffect(() => {
    if (isAuthenticated) {
      const loadDonations = async () => {
        try {
          setIsLoading(true)
          
          // Données d'exemple
          const mockDonations: Donation[] = [
            {
              id: 1,
              clientName: "Marie Dupont",
              clientEmail: "marie.dupont@email.com",
              clientPhone: "06 12 34 56 78",
              address: "123 Rue de la Paix",
              postalCode: "75001",
              date: "2024-01-15",
              time: "09:00",
              status: "pending",
              priority: "high",
              applianceType: "Réfrigérateur",
              applianceBrand: "Bosch",
              applianceModel: "KGN39VW30",
              applianceAge: "5 ans",
              applianceCondition: "good",
              description: "Réfrigérateur en bon état, fonctionne parfaitement",
              notes: "Client souhaite le remplacer par un plus grand",
              estimatedValue: 200
            },
            {
              id: 2,
              clientName: "Jean Martin",
              clientEmail: "jean.martin@email.com",
              clientPhone: "06 98 76 54 32",
              address: "456 Avenue des Champs",
              postalCode: "75008",
              date: "2024-01-15",
              time: "14:00",
              status: "accepted",
              priority: "medium",
              applianceType: "Lave-linge",
              applianceBrand: "Samsung",
              applianceModel: "WW90T554DAE",
              applianceAge: "3 ans",
              applianceCondition: "excellent",
              description: "Lave-linge très récent, excellent état",
              notes: "Accepté pour revente",
              estimatedValue: 350
            },
            {
              id: 3,
              clientName: "Sophie Bernard",
              clientEmail: "sophie.bernard@email.com",
              clientPhone: "06 11 22 33 44",
              address: "789 Boulevard Saint-Germain",
              postalCode: "75006",
              date: "2024-01-16",
              time: "10:30",
              status: "rejected",
              priority: "low",
              applianceType: "Micro-ondes",
              applianceBrand: "Panasonic",
              applianceModel: "NN-DS1100",
              applianceAge: "8 ans",
              applianceCondition: "fair",
              description: "Micro-ondes ancien, état moyen",
              notes: "Trop ancien pour revente",
              estimatedValue: 50
            },
            {
              id: 4,
              clientName: "Pierre Durand",
              clientEmail: "pierre.durand@email.com",
              clientPhone: "06 55 66 77 88",
              address: "321 Rue du Commerce",
              postalCode: "75015",
              date: "2024-01-17",
              time: "11:00",
              status: "completed",
              priority: "medium",
              applianceType: "Lave-vaisselle",
              applianceBrand: "Miele",
              applianceModel: "G 4260 SCVi",
              applianceAge: "4 ans",
              applianceCondition: "excellent",
              description: "Lave-vaisselle haut de gamme, parfait état",
              notes: "Enlevé et revendu",
              estimatedValue: 400
            }
          ]

          setDonations(mockDonations)
          success("Donations chargées", "Les demandes de donations ont été chargées avec succès")
        } catch (err) {
          console.error('Erreur lors du chargement des donations:', err)
          error("Erreur de chargement", "Impossible de charger les donations")
        } finally {
          setIsLoading(false)
        }
      }

      loadDonations()
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
      accepted: { label: 'Acceptée', className: 'bg-green-100 text-green-800' },
      rejected: { label: 'Refusée', className: 'bg-red-100 text-red-800' },
      completed: { label: 'Terminée', className: 'bg-purple-100 text-purple-800' }
    }
    const configItem = config[status as keyof typeof config] || config.pending
    return <Badge className={configItem.className}>{configItem.label}</Badge>
  }

  const getConditionBadge = (condition: string) => {
    const config = {
      excellent: { label: 'Excellent', className: 'bg-green-100 text-green-800' },
      good: { label: 'Bon', className: 'bg-blue-100 text-blue-800' },
      fair: { label: 'Moyen', className: 'bg-yellow-100 text-yellow-800' },
      poor: { label: 'Mauvais', className: 'bg-red-100 text-red-800' }
    }
    const configItem = config[condition as keyof typeof config] || config.good
    return <Badge className={configItem.className}>{configItem.label}</Badge>
  }

  // Actions sur les donations
  const handleAcceptDonation = async (donation: Donation) => {
    setSelectedDonation(donation)
    setShowAcceptModal(true)
  }

  const handleRejectDonation = async (donation: Donation) => {
    setSelectedDonation(donation)
    setShowRejectModal(true)
  }

  const confirmAcceptDonation = async () => {
    if (!selectedDonation) return
    
    setIsActionLoading(true)
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setDonations(prev => prev.map(d => 
        d.id === selectedDonation.id ? { ...d, status: 'accepted' as const } : d
      ))
      
      success("Donation acceptée", `La donation de ${selectedDonation.clientName} a été acceptée`)
    } catch (err) {
      error("Erreur", "Impossible d'accepter la donation")
    } finally {
      setIsActionLoading(false)
      setShowAcceptModal(false)
      setSelectedDonation(null)
    }
  }

  const confirmRejectDonation = async () => {
    if (!selectedDonation) return
    
    setIsActionLoading(true)
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setDonations(prev => prev.map(d => 
        d.id === selectedDonation.id ? { ...d, status: 'rejected' as const } : d
      ))
      
      success("Donation refusée", `La donation de ${selectedDonation.clientName} a été refusée`)
    } catch (err) {
      error("Erreur", "Impossible de refuser la donation")
    } finally {
      setIsActionLoading(false)
      setShowRejectModal(false)
      setSelectedDonation(null)
    }
  }

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.applianceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.applianceBrand.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = activeTab === "all" || donation.status === activeTab
    
    return matchesSearch && matchesStatus
  })

  const getStatusCount = (status: string) => {
    return donations.filter(d => d.status === status).length
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
                  Donations
                </h1>
                <p className="text-gray-600 font-poppins">
                  Gérez les demandes de dons d'appareils
                </p>
              </div>
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
                  <CardTitle className="text-sm font-medium text-gray-600">Acceptées</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">{getStatusCount('accepted')}</div>
              </CardContent>
            </Card>

            <Card className={CARD_STYLES.elevated}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Refusées</CardTitle>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">{getStatusCount('rejected')}</div>
              </CardContent>
            </Card>

            <Card className={CARD_STYLES.elevated}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
                  <Heart className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">{donations.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Recherche */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une donation..."
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
              <TabsTrigger value="accepted" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Acceptées ({getStatusCount('accepted')})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Refusées ({getStatusCount('rejected')})
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Terminées ({getStatusCount('completed')})
              </TabsTrigger>
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Toutes ({donations.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-6">
              <Card className={CARD_STYLES.elevated}>
                <CardContent className="p-6">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : filteredDonations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucune donation trouvée</p>
                      <p className="text-sm">Les nouvelles demandes apparaîtront ici</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredDonations.map((donation) => (
                        <div 
                          key={donation.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Heart className="h-4 w-4 text-red-500" />
                              <div>
                                <div className="font-medium">{donation.clientName}</div>
                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {donation.address}, {donation.postalCode}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {donation.applianceType} {donation.applianceBrand}
                                </div>
                                <div className="text-xs text-gray-500 flex items-center gap-2">
                                  <User className="h-3 w-3" />
                                  {donation.clientEmail}
                                  <Phone className="h-3 w-3" />
                                  {donation.clientPhone}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm text-gray-600">
                                {new Date(donation.date).toLocaleDateString('fr-FR')} à {donation.time}
                              </div>
                              <div className="text-sm font-medium">{donation.description}</div>
                              <div className="text-xs text-gray-500">
                                {donation.applianceAge}, {donation.applianceModel}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {getPriorityBadge(donation.priority)}
                              {getStatusBadge(donation.status)}
                              {getConditionBadge(donation.applianceCondition)}
                            </div>

                            <div className="text-right">
                              <div className="text-sm text-gray-600">Valeur estimée</div>
                              <div className="font-medium">{donation.estimatedValue}€</div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => router.push(`/proV2/donations/${donation.id}`)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Voir
                              </Button>
                              
                              {donation.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => handleAcceptDonation(donation)}
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Accepter
                                  </Button>
                                  
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleRejectDonation(donation)}
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Refuser
                                  </Button>
                                </>
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
        isOpen={showAcceptModal}
        onClose={() => {
          setShowAcceptModal(false)
          setSelectedDonation(null)
        }}
        onConfirm={confirmAcceptDonation}
        title="Accepter la donation"
        description={`Êtes-vous sûr de vouloir accepter la donation de ${selectedDonation?.clientName} ?`}
        confirmText="Accepter"
        cancelText="Annuler"
        isLoading={isActionLoading}
      />

      <ConfirmModal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false)
          setSelectedDonation(null)
        }}
        onConfirm={confirmRejectDonation}
        title="Refuser la donation"
        description={`Êtes-vous sûr de vouloir refuser la donation de ${selectedDonation?.clientName} ?`}
        confirmText="Refuser"
        cancelText="Annuler"
        variant="destructive"
        isLoading={isActionLoading}
      />
    </>
  )
} 