"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Wrench, Menu, X, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/contexts/AuthContext"

interface HeaderProps {
  showNavigation?: boolean
  showAuthButtons?: boolean
  isPro?: boolean
}

export default function Header({
  showNavigation = true,
  showAuthButtons = true,
  isPro = false
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isProConnected, setIsProConnected] = useState(false)
  const [avatarError, setAvatarError] = useState(false)
  const router = useRouter()
  const { user, isAuthenticated, logout, isAdmin, isTechnician, getDashboardRoute } = useAuth()

  useEffect(() => {
    // Mettre à jour l'état pro basé sur le rôle de l'utilisateur
    if (isAuthenticated && user) {
      const isProUser = isAdmin || isTechnician
      setIsProConnected(isProUser)
      localStorage.setItem('isProConnected', isProUser ? 'true' : 'false')
    } else {
      setIsProConnected(false)
      localStorage.removeItem('isProConnected')
    }
  }, [isAuthenticated, user, isAdmin, isTechnician])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleDashboardClick = () => {
    const dashboardRoute = getDashboardRoute()
    router.push(dashboardRoute)
  }

  return (
    <header className="bg-white sticky top-0 z-50 border-b-2 border-gray-100">
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex items-center justify-between">
          {/* Logo responsive */}
          <Link href="/" className="flex items-center gap-2 md:gap-3">
            <img
              src="/logo-smartphone.png"
              alt="Logo dédépanne"
              className="block sm:hidden h-14 w-auto"
            />
            <img
              src="/logo-tablet.png"
              alt="Logo dédépanne"
              className="hidden sm:block lg:hidden h-16 w-auto"
            />
            <img
              src="/logo.png"
              alt="Logo dédépanne"
              className="hidden lg:block h-16 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          {showNavigation && (
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 ml-auto mr-8">
              <Link
                href="/"
                className="text-black hover:text-primary transition-colors font-helvetica font-medium text-sm lg:text-base"
              >
                Accueil
              </Link>
              <Link
                href="/services"
                className="text-black hover:text-primary transition-colors font-helvetica font-medium text-sm lg:text-base"
              >
                Nos services
              </Link>
              <Link
                href="/reconditioned"
                className="text-black hover:text-primary transition-colors font-helvetica font-medium text-sm lg:text-base"
              >
                Appareils reconditionnés
              </Link>
              {isProConnected && (
                <Link
                  href="/pro"
                  className="text-black hover:text-primary transition-colors font-helvetica font-medium text-sm lg:text-base"
                >
                  Espace pro
                </Link>
              )}
            </nav>
          )}

          {/* Desktop Buttons */}
          {showAuthButtons && (
            <div className="hidden md:flex items-center gap-3 lg:gap-4">
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer">
                      {isAdmin || isTechnician ? (
                        <div className="h-9 w-9 rounded-full border-2 border-yellow-400 bg-primary flex items-center justify-center font-bold text-white text-lg">
                          {user.first_name?.[0] ?? ''}{user.last_name?.[0] ?? ''}
                        </div>
                      ) : (
                        <div className="h-9 w-9 rounded-full border-2 border-yellow-400 bg-primary flex items-center justify-center font-bold text-white text-lg">
                          {user.first_name?.[0] ?? ''}{user.last_name?.[0] ?? ''}
                        </div>
                      )}
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleDashboardClick}>
                      {isAdmin || isTechnician ? "Espace professionnel" : "Tableau de bord"}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings">Mon profil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-2 border-black text-black hover:bg-black hover:text-white font-bold text-sm lg:text-base font-helvetica px-4 lg:px-6"
                  >
                    <Link href="/login">Connexion</Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="bg-primary text-black hover:bg-primary/90 font-bold border-2 border-black text-sm lg:text-base font-helvetica px-4 lg:px-6"
                  >
                    <Link href="/register">S'inscrire</Link>
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && showNavigation && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-3 mt-4">
              <Link
                href="/"
                className="text-black hover:text-primary transition-colors font-helvetica font-medium py-2 text-base"
                onClick={() => setMobileMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link
                href="/services"
                className="text-black hover:text-primary transition-colors font-helvetica font-medium py-2 text-base"
                onClick={() => setMobileMenuOpen(false)}
              >
                Nos services
              </Link>
              <Link
                href="/reconditioned"
                className="text-black hover:text-primary transition-colors font-helvetica font-medium py-2 text-base"
                onClick={() => setMobileMenuOpen(false)}
              >
                Appareils reconditionnés
              </Link>
              {isProConnected && (
                <Link
                  href="/pro"
                  className="text-black hover:text-primary transition-colors font-helvetica font-medium py-2 text-base"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Espace pro
                </Link>
              )}
              {showAuthButtons && (
                <div className="flex gap-3 mt-4">
                  {isAuthenticated && user ? (
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center font-bold text-white text-sm">
                          {user.first_name?.[0] ?? ''}{user.last_name?.[0] ?? ''}
                        </div>
                        <span className="text-sm font-medium">
                          {user.first_name} {user.last_name}
                          {(isAdmin || isTechnician) && (
                            <span className="text-xs text-primary ml-1">(Pro)</span>
                          )}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleDashboardClick()
                          setMobileMenuOpen(false)
                        }}
                        className="flex-1 border-2 border-black text-black hover:bg-black hover:text-white font-bold font-helvetica"
                      >
                        {isAdmin || isTechnician ? "Espace professionnel" : "Tableau de bord"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleLogout()
                          setMobileMenuOpen(false)
                        }}
                        className="flex-1 border-2 border-red-200 text-red-600 hover:bg-red-50 font-bold font-helvetica"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Déconnexion
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="flex-1 border-2 border-black text-black hover:bg-black hover:text-white font-bold font-helvetica"
                      >
                        <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                          Connexion
                        </Link>
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        className="flex-1 bg-primary text-black hover:bg-primary/90 font-bold border-2 border-black font-helvetica"
                      >
                        <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                          S'inscrire
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
} 