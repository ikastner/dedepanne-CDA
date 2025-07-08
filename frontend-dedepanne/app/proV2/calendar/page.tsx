"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar,
  Clock,
  MapPin,
  Wrench,
  Heart,
  Package,
  Plus,
  ArrowLeft,
  ArrowRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  Play,
  Check,
  Trash2
} from "lucide-react"
import PageContainer from "@/components/ui/PageContainer"
import { useAuth } from "@/lib/contexts/AuthContext"
import { CARD_STYLES } from "@/lib/constants"
import { useNotifications } from "@/lib/hooks/useNotifications"
import ConfirmModal from "@/components/ui/ConfirmModal"

interface CalendarEvent {
  id: number
  date: string
  time: string
  clientName: string
  address: string
  postalCode: string
  type: 'repair' | 'donation' | 'delivery'
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  estimatedDuration: string
  estimatedCost: number
}

interface DaySchedule {
  date: string
  dayName: string
  dayNumber: number
  events: CalendarEvent[]
  totalRevenue: number
  totalDistance: number
}

export default function CalendarPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading, isAdmin, isTechnician } = useAuth()
  const { success, error, warning, info } = useNotifications()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [schedule, setSchedule] = useState<DaySchedule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // États pour les modals
  const [showEventModal, setShowEventModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isActionLoading, setIsActionLoading] = useState(false)

  // Vérifier l'accès professionnel
  useEffect(() => {
    if (!loading && (!isAuthenticated || (!isAdmin && !isTechnician))) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, isAdmin, isTechnician, router])

  // Charger les données du calendrier
  useEffect(() => {
    if (isAuthenticated && (isAdmin || isTechnician)) {
      const loadCalendarData = async () => {
        try {
          setIsLoading(true)
          
          // Générer des données d'exemple pour le mois
          const mockEvents: CalendarEvent[] = [
            {
              id: 1,
              date: "2024-01-15",
              time: "09:00",
              clientName: "Marie Dupont",
              address: "123 Rue de la Paix",
              postalCode: "75001",
              type: "repair",
              status: "pending",
              priority: "high",
              estimatedDuration: "2h",
              estimatedCost: 120
            },
            {
              id: 2,
              date: "2024-01-15",
              time: "14:00",
              clientName: "Jean Martin",
              address: "456 Avenue des Champs",
              postalCode: "75008",
              type: "donation",
              status: "pending",
              priority: "medium",
              estimatedDuration: "1h",
              estimatedCost: 0
            },
            {
              id: 3,
              date: "2024-01-16",
              time: "10:30",
              clientName: "Sophie Bernard",
              address: "789 Boulevard Saint-Germain",
              postalCode: "75006",
              type: "repair",
              status: "pending",
              priority: "low",
              estimatedDuration: "1h30",
              estimatedCost: 95
            },
            {
              id: 4,
              date: "2024-01-17",
              time: "11:00",
              clientName: "Pierre Durand",
              address: "321 Rue du Commerce",
              postalCode: "75015",
              type: "delivery",
              status: "pending",
              priority: "medium",
              estimatedDuration: "45min",
              estimatedCost: 50
            }
          ]

          // Générer le planning pour le mois
          const monthSchedule: DaySchedule[] = []
          const year = currentMonth.getFullYear()
          const month = currentMonth.getMonth()
          const daysInMonth = new Date(year, month + 1, 0).getDate()

          for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day)
            const dateString = date.toISOString().split('T')[0]
            const dayEvents = mockEvents.filter(event => event.date === dateString)
            
            monthSchedule.push({
              date: dateString,
              dayName: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
              dayNumber: day,
              events: dayEvents,
              totalRevenue: dayEvents.reduce((sum, event) => sum + event.estimatedCost, 0),
              totalDistance: dayEvents.length * 5 // Simulation de distance
            })
          }

          setSchedule(monthSchedule)
          success("Calendrier chargé", "Le calendrier a été chargé avec succès")
        } catch (err) {
          console.error('Erreur lors du chargement du calendrier:', err)
          error("Erreur de chargement", "Impossible de charger le calendrier")
        } finally {
          setIsLoading(false)
        }
      }

      loadCalendarData()
    }
  }, [isAuthenticated, isAdmin, isTechnician, currentMonth])

  const getPriorityBadge = (priority: string) => {
    const config = {
      high: { label: 'Urgent', className: 'bg-red-100 text-red-800' },
      medium: { label: 'Normal', className: 'bg-yellow-100 text-yellow-800' },
      low: { label: 'Faible', className: 'bg-green-100 text-green-800' }
    }
    const configItem = config[priority as keyof typeof config] || config.medium
    return <Badge className={configItem.className}>{configItem.label}</Badge>
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'repair': return <Wrench className="h-4 w-4" />
      case 'donation': return <Heart className="h-4 w-4" />
      case 'delivery': return <Package className="h-4 w-4" />
      default: return <Wrench className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'repair': return 'Réparation'
      case 'donation': return 'Donation'
      case 'delivery': return 'Livraison'
      default: return 'Intervention'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in_progress': return <Clock className="h-4 w-4 text-orange-500" />
      case 'pending': return <AlertCircle className="h-4 w-4 text-blue-500" />
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  // Actions sur les événements
  const handleViewEvent = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setShowEventModal(true)
  }

  const handleStartEvent = async (event: CalendarEvent) => {
    setIsActionLoading(true)
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSchedule(prev => prev.map(day => ({
        ...day,
        events: day.events.map(e => 
          e.id === event.id ? { ...e, status: 'in_progress' as const } : e
        )
      })))
      
      success("Intervention démarrée", `L'intervention pour ${event.clientName} a été démarrée`)
    } catch (err) {
      error("Erreur", "Impossible de démarrer l'intervention")
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleCompleteEvent = async (event: CalendarEvent) => {
    setIsActionLoading(true)
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSchedule(prev => prev.map(day => ({
        ...day,
        events: day.events.map(e => 
          e.id === event.id ? { ...e, status: 'completed' as const } : e
        )
      })))
      
      success("Intervention terminée", `L'intervention pour ${event.clientName} a été terminée`)
    } catch (err) {
      error("Erreur", "Impossible de terminer l'intervention")
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleDeleteEvent = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setShowDeleteModal(true)
  }

  const confirmDeleteEvent = async () => {
    if (!selectedEvent) return
    
    setIsActionLoading(true)
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSchedule(prev => prev.map(day => ({
        ...day,
        events: day.events.filter(e => e.id !== selectedEvent.id)
      })))
      
      success("Événement supprimé", `L'intervention pour ${selectedEvent.clientName} a été supprimée`)
    } catch (err) {
      error("Erreur", "Impossible de supprimer l'intervention")
    } finally {
      setIsActionLoading(false)
      setShowDeleteModal(false)
      setSelectedEvent(null)
    }
  }

  const handleNewEvent = () => {
    info("Nouvelle intervention", "Redirection vers le formulaire de création...")
    setTimeout(() => {
      router.push('/proV2/interventions/new')
    }, 1000)
  }

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
    info("Mois précédent", "Chargement du mois précédent...")
  }

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
    info("Mois suivant", "Chargement du mois suivant...")
  }

  const handleDateClick = (date: string) => {
    setSelectedDate(new Date(date))
    info("Date sélectionnée", `Vous avez sélectionné le ${new Date(date).toLocaleDateString('fr-FR')}`)
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
                  Calendrier
                </h1>
                <p className="text-gray-600 font-poppins">
                  Planifiez et gérez vos interventions
                </p>
              </div>
              <Button
                onClick={handleNewEvent}
                className="bg-primary text-black hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Intervention
              </Button>
            </div>
          </div>

          {/* Navigation du mois */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={handlePreviousMonth}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Précédent
            </Button>
            <h2 className="text-xl font-semibold">
              {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </h2>
            <Button
              variant="outline"
              onClick={handleNextMonth}
              className="flex items-center gap-2"
            >
              Suivant
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Grille du calendrier */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-4">
              {/* En-têtes des jours */}
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                <div key={day} className="text-center font-medium text-gray-600 py-2">
                  {day}
                </div>
              ))}

              {/* Jours du mois */}
              {schedule.map((day) => (
                <Card 
                  key={day.date} 
                  className={`${CARD_STYLES.elevated} cursor-pointer hover:shadow-lg transition-shadow ${
                    day.events.length > 0 ? 'border-primary/20' : ''
                  }`}
                  onClick={() => handleDateClick(day.date)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{day.dayName}</div>
                      <div className="text-lg font-bold">{day.dayNumber}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {day.events.length > 0 ? (
                      <div className="space-y-2">
                        {day.events.slice(0, 3).map((event) => (
                          <div 
                            key={event.id}
                            className="p-2 bg-gray-50 rounded text-xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewEvent(event)
                            }}
                          >
                            <div className="flex items-center gap-1 mb-1">
                              {getTypeIcon(event.type)}
                              <span className="font-medium">{event.time}</span>
                            </div>
                            <div className="text-gray-600 truncate">{event.clientName}</div>
                            <div className="flex items-center gap-1 mt-1">
                              {getStatusIcon(event.status)}
                              {getPriorityBadge(event.priority)}
                            </div>
                          </div>
                        ))}
                        {day.events.length > 3 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{day.events.length - 3} autres
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-400 text-center text-sm py-4">
                        Aucune intervention
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Statistiques du mois */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className={CARD_STYLES.elevated}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Interventions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">
                  {schedule.reduce((sum, day) => sum + day.events.length, 0)}
                </div>
              </CardContent>
            </Card>

            <Card className={CARD_STYLES.elevated}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Revenus Estimés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">
                  {schedule.reduce((sum, day) => sum + day.totalRevenue, 0)}€
                </div>
              </CardContent>
            </Card>

            <Card className={CARD_STYLES.elevated}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Distance Totale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">
                  {schedule.reduce((sum, day) => sum + day.totalDistance, 0)}km
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>

      {/* Modal de détails d'événement */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Détails de l'intervention</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEventModal(false)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="font-medium">{selectedEvent.clientName}</div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {selectedEvent.address}, {selectedEvent.postalCode}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {getTypeIcon(selectedEvent.type)}
                <span>{getTypeLabel(selectedEvent.type)}</span>
                {getPriorityBadge(selectedEvent.priority)}
              </div>
              
              <div className="text-sm">
                <div>Date: {new Date(selectedEvent.date).toLocaleDateString('fr-FR')}</div>
                <div>Heure: {selectedEvent.time}</div>
                <div>Durée: {selectedEvent.estimatedDuration}</div>
                <div>Coût: {selectedEvent.estimatedCost}€</div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowEventModal(false)
                    router.push(`/proV2/interventions/${selectedEvent.id}`)
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Voir détails
                </Button>
                
                {selectedEvent.status === 'pending' && (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => {
                      setShowEventModal(false)
                      handleStartEvent(selectedEvent)
                    }}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Démarrer
                  </Button>
                )}
                
                {selectedEvent.status === 'in_progress' && (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => {
                      setShowEventModal(false)
                      handleCompleteEvent(selectedEvent)
                    }}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Terminer
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    setShowEventModal(false)
                    handleDeleteEvent(selectedEvent)
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedEvent(null)
        }}
        onConfirm={confirmDeleteEvent}
        title="Supprimer l'intervention"
        description={`Êtes-vous sûr de vouloir supprimer l'intervention pour ${selectedEvent?.clientName} ? Cette action ne peut pas être annulée.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
        isLoading={isActionLoading}
      />
    </>
  )
} 