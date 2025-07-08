"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  MapPin, 
  Plus,
  Trash2,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Edit,
  Eye,
  ToggleLeft,
  ToggleRight
} from "lucide-react"
import PageContainer from "@/components/ui/PageContainer"
import { useAuth } from "@/lib/contexts/AuthContext"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { CARD_STYLES } from "@/lib/constants"
import { useNotifications } from "@/lib/hooks/useNotifications"
import ConfirmModal from "@/components/ui/ConfirmModal"

interface PostalCode {
  id: number
  code: string
  city: string
  department: string
  isActive: boolean
  addedAt: string
}

export default function PostalCodesPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading, isAdmin, isTechnician } = useAuth()
  const { success, error, warning, info } = useNotifications()
  const [postalCodes, setPostalCodes] = useState<PostalCode[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [newPostalCode, setNewPostalCode] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  
  // États pour les modals
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showToggleModal, setShowToggleModal] = useState(false)
  const [selectedPostalCode, setSelectedPostalCode] = useState<PostalCode | null>(null)
  const [isActionLoading, setIsActionLoading] = useState(false)

  // Vérifier l'accès professionnel
  useEffect(() => {
    if (!loading && (!isAuthenticated || (!isAdmin && !isTechnician))) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, isAdmin, isTechnician, router])

  // Charger les codes postaux
  useEffect(() => {
    if (isAuthenticated && (isAdmin || isTechnician)) {
      const loadPostalCodes = async () => {
        try {
          setIsLoading(true)
          
          // Données d'exemple
          const mockPostalCodes: PostalCode[] = [
            {
              id: 1,
              code: "75001",
              city: "Paris 1er",
              department: "75",
              isActive: true,
              addedAt: "2024-01-15T10:00:00Z"
            },
            {
              id: 2,
              code: "75002",
              city: "Paris 2e",
              department: "75",
              isActive: true,
              addedAt: "2024-01-15T10:00:00Z"
            },
            {
              id: 3,
              code: "75008",
              city: "Paris 8e",
              department: "75",
              isActive: true,
              addedAt: "2024-01-15T10:00:00Z"
            },
            {
              id: 4,
              code: "92100",
              city: "Boulogne-Billancourt",
              department: "92",
              isActive: false,
              addedAt: "2024-01-10T14:30:00Z"
            },
            {
              id: 5,
              code: "92200",
              city: "Neuilly-sur-Seine",
              department: "92",
              isActive: true,
              addedAt: "2024-01-12T09:15:00Z"
            }
          ]

          setPostalCodes(mockPostalCodes)
          success("Codes postaux chargés", "Les codes postaux ont été chargés avec succès")
        } catch (err) {
          console.error('Erreur lors du chargement des codes postaux:', err)
          error("Erreur de chargement", "Impossible de charger les codes postaux")
        } finally {
          setIsLoading(false)
        }
      }

      loadPostalCodes()
    }
  }, [isAuthenticated, isAdmin, isTechnician])

  const handleAddPostalCode = async () => {
    if (!newPostalCode.trim() || newPostalCode.length !== 5) {
      warning("Code postal invalide", "Le code postal doit contenir exactement 5 chiffres")
      return
    }

    // Vérifier si le code postal existe déjà
    if (postalCodes.some(code => code.code === newPostalCode)) {
      error("Code postal existant", "Ce code postal est déjà dans la liste")
      return
    }

    setIsAdding(true)
    try {
      // Simulation d'ajout
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newCode: PostalCode = {
        id: Date.now(),
        code: newPostalCode,
        city: `Ville ${newPostalCode}`,
        department: newPostalCode.substring(0, 2),
        isActive: true,
        addedAt: new Date().toISOString()
      }

      setPostalCodes(prev => [newCode, ...prev])
      setNewPostalCode("")
      success("Code postal ajouté", `Le code postal ${newPostalCode} a été ajouté avec succès`)
    } catch (err) {
      console.error('Erreur lors de l\'ajout du code postal:', err)
      error("Erreur", "Impossible d'ajouter le code postal")
    } finally {
      setIsAdding(false)
    }
  }

  const handleToggleActive = (postalCode: PostalCode) => {
    setSelectedPostalCode(postalCode)
    setShowToggleModal(true)
  }

  const confirmToggleActive = async () => {
    if (!selectedPostalCode) return
    
    setIsActionLoading(true)
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setPostalCodes(prev => prev.map(code => 
        code.id === selectedPostalCode.id ? { ...code, isActive: !code.isActive } : code
      ))
      
      const action = selectedPostalCode.isActive ? "désactivé" : "activé"
      success("Code postal modifié", `Le code postal ${selectedPostalCode.code} a été ${action}`)
    } catch (err) {
      error("Erreur", "Impossible de modifier le code postal")
    } finally {
      setIsActionLoading(false)
      setShowToggleModal(false)
      setSelectedPostalCode(null)
    }
  }

  const handleDeletePostalCode = (postalCode: PostalCode) => {
    setSelectedPostalCode(postalCode)
    setShowDeleteModal(true)
  }

  const confirmDeletePostalCode = async () => {
    if (!selectedPostalCode) return
    
    setIsActionLoading(true)
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setPostalCodes(prev => prev.filter(code => code.id !== selectedPostalCode.id))
      success("Code postal supprimé", `Le code postal ${selectedPostalCode.code} a été supprimé`)
    } catch (err) {
      error("Erreur", "Impossible de supprimer le code postal")
    } finally {
      setIsActionLoading(false)
      setShowDeleteModal(false)
      setSelectedPostalCode(null)
    }
  }

  const handleViewPostalCode = (postalCode: PostalCode) => {
    info("Détails code postal", `Code: ${postalCode.code} - Ville: ${postalCode.city}`)
  }

  const filteredPostalCodes = postalCodes.filter(code =>
    code.code.includes(searchTerm) || 
    code.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const activeCodes = filteredPostalCodes.filter(code => code.isActive)
  const inactiveCodes = filteredPostalCodes.filter(code => !code.isActive)

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <PageContainer 
        showHeader={false}
        showFooter={false}
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
    <>
      <ProtectedRoute allowedRoles={['admin', 'technician']}>
        <PageContainer 
          showHeader={false}
          showFooter={false}
          className="bg-gradient-to-b from-blue-50 to-white"
        >
          <div className="container mx-auto px-4 py-8">
            {/* En-tête */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retour
                </Button>
                <div>
                  <h1 className="text-3xl font-cocogoose font-black text-black">
                    Codes Postaux
                  </h1>
                  <p className="text-gray-600 font-poppins">
                    Gérez les zones de service que vous acceptez
                  </p>
                </div>
              </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className={CARD_STYLES.elevated}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Codes</CardTitle>
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-black">{postalCodes.length}</div>
                </CardContent>
              </Card>

              <Card className={CARD_STYLES.elevated}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">Actifs</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-black">
                    {postalCodes.filter(c => c.isActive).length}
                  </div>
                </CardContent>
              </Card>

              <Card className={CARD_STYLES.elevated}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">Inactifs</CardTitle>
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-black">
                    {postalCodes.filter(c => !c.isActive).length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ajout d'un nouveau code postal */}
            <Card className={CARD_STYLES.elevated} className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Ajouter un Code Postal
                </CardTitle>
                <CardDescription>
                  Ajoutez une nouvelle zone de service
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="newPostalCode">Code Postal</Label>
                    <Input
                      id="newPostalCode"
                      placeholder="75001"
                      value={newPostalCode}
                      onChange={(e) => setNewPostalCode(e.target.value)}
                      maxLength={5}
                      className="mt-2"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={handleAddPostalCode}
                      disabled={!newPostalCode.trim() || newPostalCode.length !== 5 || isAdding}
                      className="bg-primary text-black hover:bg-primary/90"
                    >
                      {isAdding ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Ajout...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recherche */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher un code postal..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Codes postaux actifs */}
            <Card className={CARD_STYLES.elevated} className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Codes Postaux Actifs ({activeCodes.length})
                </CardTitle>
                <CardDescription>
                  Zones de service acceptées
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : activeCodes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucun code postal actif</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeCodes.map((code) => (
                      <div 
                        key={code.id}
                        className="flex items-center justify-between p-4 border rounded-lg bg-green-50"
                      >
                        <div>
                          <div className="font-medium">{code.code}</div>
                          <div className="text-sm text-gray-500">{code.city}</div>
                          <div className="text-xs text-gray-400">Département {code.department}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleActive(code)}
                          >
                            Désactiver
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeletePostalCode(code)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Codes postaux inactifs */}
            <Card className={CARD_STYLES.elevated}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  Codes Postaux Inactifs ({inactiveCodes.length})
                </CardTitle>
                <CardDescription>
                  Zones de service temporairement désactivées
                </CardDescription>
              </CardHeader>
              <CardContent>
                {inactiveCodes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucun code postal inactif</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {inactiveCodes.map((code) => (
                      <div 
                        key={code.id}
                        className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
                      >
                        <div>
                          <div className="font-medium">{code.code}</div>
                          <div className="text-sm text-gray-500">{code.city}</div>
                          <div className="text-xs text-gray-400">Département {code.department}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleActive(code)}
                          >
                            Activer
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeletePostalCode(code)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      {/* Modals */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedPostalCode(null)
        }}
        onConfirm={confirmDeletePostalCode}
        title="Supprimer le code postal"
        description={`Êtes-vous sûr de vouloir supprimer le code postal ${selectedPostalCode?.code} ? Cette action ne peut pas être annulée.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
        isLoading={isActionLoading}
      />

      <ConfirmModal
        isOpen={showToggleModal}
        onClose={() => {
          setShowToggleModal(false)
          setSelectedPostalCode(null)
        }}
        onConfirm={confirmToggleActive}
        title={selectedPostalCode?.isActive ? "Désactiver le code postal" : "Activer le code postal"}
        description={`Êtes-vous sûr de vouloir ${selectedPostalCode?.isActive ? 'désactiver' : 'activer'} le code postal ${selectedPostalCode?.code} ?`}
        confirmText={selectedPostalCode?.isActive ? "Désactiver" : "Activer"}
        cancelText="Annuler"
        isLoading={isActionLoading}
      />
    </>
  )
} 