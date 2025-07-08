"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  Wrench, 
  Calendar,
  MapPin,
  Users,
  Package,
  Heart,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Shield,
  ShoppingBag,
  Database
} from "lucide-react"
import { useAuth } from "@/lib/contexts/AuthContext"
import NotificationContainer from "@/components/ui/NotificationContainer"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  description: string
}

const navItems: NavItem[] = [
  {
    label: "Tableau de bord",
    href: "/proV2",
    icon: <Home className="h-5 w-5" />,
    description: "Vue d'ensemble de votre activité"
  },
  {
    label: "Réparations",
    href: "/proV2/reparations",
    icon: <Wrench className="h-5 w-5" />,
    description: "Gérez vos interventions"
  },
  {
    label: "Calendrier",
    href: "/proV2/calendar",
    icon: <Calendar className="h-5 w-5" />,
    description: "Planifiez vos interventions"
  },
  {
    label: "Clients",
    href: "/proV2/clients",
    icon: <Users className="h-5 w-5" />,
    description: "Consultez vos clients"
  },
  {
    label: "Donations",
    href: "/proV2/donations",
    icon: <Heart className="h-5 w-5" />,
    description: "Gérez les demandes de dons"
  },
  {
    label: "Commandes",
    href: "/proV2/commandes",
    icon: <Package className="h-5 w-5" />,
    description: "Gérez les demandes d'achat"
  },
  {
    label: "Produits",
    href: "/proV2/produits",
    icon: <ShoppingBag className="h-5 w-5" />,
    description: "Gérez votre catalogue"
  },
  {
    label: "Zones d'intervention",
    href: "/proV2/zones",
    icon: <MapPin className="h-5 w-5" />,
    description: "Gérez vos codes postaux"
  },
  {
    label: "Référentiels",
    href: "/proV2/referentiels",
    icon: <Database className="h-5 w-5" />,
    description: "Appareils et marques"
  },
  {
    label: "Paramètres",
    href: "/proV2/parametres",
    icon: <Settings className="h-5 w-5" />,
    description: "Configurez votre profil"
  }
]

export default function ProV2Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, loading, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Vérifier l'accès professionnel
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const isActiveRoute = (href: string) => {
    if (href === "/proV2") {
      return pathname === "/proV2"
    }
    return pathname.startsWith(href)
  }

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
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
      <NotificationContainer />
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar mobile overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
                  <Wrench className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h1 className="font-cocogoose font-black text-lg text-black">
                    Dépanneur
                  </h1>
                  <p className="text-xs text-gray-500">
                    Espace professionnel
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* User info */}
            <div className="p-6 border-b bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-black">
                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-sm">
                    {user?.first_name} {user?.last_name}
                  </div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant={isActiveRoute(item.href) ? "default" : "ghost"}
                  className={`
                    w-full justify-start gap-3 h-auto p-3
                    ${isActiveRoute(item.href) 
                      ? 'bg-primary text-black hover:bg-primary/90' 
                      : 'hover:bg-gray-100'
                    }
                  `}
                  onClick={() => {
                    router.push(item.href)
                    setSidebarOpen(false)
                  }}
                >
                  {item.icon}
                  <div className="text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs opacity-70">{item.description}</div>
                  </div>
                </Button>
              ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Déconnexion</div>
                  <div className="text-xs opacity-70">Quitter l'espace pro</div>
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Page content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </>
  )
} 