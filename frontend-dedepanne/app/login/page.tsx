"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Wrench, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import PageContainer from "@/components/ui/PageContainer"
import { BUTTON_STYLES, CARD_STYLES } from "@/lib/constants"
import { useAuth } from "@/lib/contexts/AuthContext"

export default function LoginPage() {
  const router = useRouter()
  const { user, loading, login, register, error, isAuthenticated, getDashboardRoute } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    acceptTerms: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirection automatique si l'utilisateur est connecté
  useEffect(() => {
    console.log('LoginPage - État de l\'authentification:', { isAuthenticated, loading, user })
    
    if (isAuthenticated && !loading && user) {
      console.log("Utilisateur connecté, redirection vers le dashboard approprié...")
      const dashboardRoute = getDashboardRoute()
      console.log("Route de redirection:", dashboardRoute)
      
      // Utiliser setTimeout pour s'assurer que la redirection se fait après le rendu
      setTimeout(() => {
        router.push(dashboardRoute)
      }, 100)
    }
  }, [isAuthenticated, loading, user, router, getDashboardRoute])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      if (isLogin) {
        // Connexion via le contexte d'authentification
        console.log("Tentative de connexion...")
        await login({
          email: formData.email,
          password: formData.password
        })
        console.log("Connexion réussie, redirection automatique...")
        
        // La redirection se fera automatiquement via le useEffect
      } else {
        // Inscription
        if (formData.password !== formData.confirmPassword) {
          alert("Les mots de passe ne correspondent pas")
          return
        }
        
        await register({
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone
        })
        
        alert("Compte créé avec succès ! Vous pouvez maintenant vous connecter.")
        setIsLogin(true)
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          firstName: "",
          lastName: "",
          phone: "",
          acceptTerms: false,
        })
      }
    } catch (error) {
      console.error("Erreur d'authentification:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <PageContainer 
        headerProps={{
          showNavigation: false,
          showAuthButtons: false
        }}
        className="bg-gradient-to-b from-blue-50 to-white"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-gray-600">Vérification de l'authentification...</p>
          </div>
        </div>
      </PageContainer>
    )
  }

  // Si l'utilisateur est déjà connecté, afficher un loader pendant la redirection
  if (isAuthenticated && user) {
    const dashboardRoute = getDashboardRoute()
    const routeName = dashboardRoute === '/pro' ? 'l\'espace professionnel' : 'le tableau de bord'
    
    return (
      <PageContainer 
        headerProps={{
          showNavigation: false,
          showAuthButtons: false
        }}
        className="bg-gradient-to-b from-blue-50 to-white"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-gray-600">Redirection vers {routeName}...</p>
            <p className="text-sm text-gray-500 mt-2">Rôle détecté: {user.role}</p>
          </div>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer 
      headerProps={{
        showNavigation: false,
        showAuthButtons: false
      }}
      className="bg-gradient-to-b from-blue-50 to-white"
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <Card className={`${CARD_STYLES.elevated} w-full max-w-md`}>
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Wrench className="h-6 w-6 text-black" />
                </div>
                <span className="text-2xl font-cocogoose font-black text-black">
                  dédé<span className="text-primary">panne</span>
                </span>
              </div>
              <CardTitle className="font-cocogoose text-black text-2xl">
                {isLogin ? "Connexion" : "Créer un compte"}
              </CardTitle>
              <CardDescription className="font-poppins text-gray-600">
                {isLogin
                  ? "Accédez à votre espace client pour suivre vos interventions"
                  : "Rejoignez dédépanne et profitez de nos avantages exclusifs"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Affichage des erreurs */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                {!isLogin && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="font-poppins font-medium">Prénom</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        placeholder="Jean"
                        className="mt-1 font-helvetica"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="font-poppins font-medium">Nom</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        placeholder="Dupont"
                        className="mt-1 font-helvetica"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="email" className="font-poppins font-medium">Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="votre@email.com"
                      className="pl-10 font-helvetica"
                      required
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <Label htmlFor="phone" className="font-poppins font-medium">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="06 12 34 56 78"
                      className="mt-1 font-helvetica"
                      required
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="password" className="font-poppins font-medium">Mot de passe</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 pr-10 font-helvetica"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <Label htmlFor="confirmPassword" className="font-poppins font-medium">Confirmer le mot de passe</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        placeholder="••••••••"
                        className="pl-10 font-helvetica"
                        required
                      />
                    </div>
                  </div>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <Label htmlFor="remember" className="text-sm font-helvetica">
                        Se souvenir de moi
                      </Label>
                    </div>
                    <Link href="#" className="text-sm text-blue-600 hover:underline font-helvetica">
                      Mot de passe oublié ?
                    </Link>
                  </div>
                )}

                {!isLogin && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) => handleInputChange("acceptTerms", checked as boolean)}
                      required
                    />
                    <Label htmlFor="acceptTerms" className="text-sm font-helvetica">
                      J'accepte les{" "}
                      <Link href="#" className="text-blue-600 hover:underline">
                        conditions d'utilisation
                      </Link>{" "}
                      et la{" "}
                      <Link href="#" className="text-blue-600 hover:underline">
                        politique de confidentialité
                      </Link>
                    </Label>
                  </div>
                )}

                <Button
                  type="submit"
                  className={`w-full ${BUTTON_STYLES.primary} font-helvetica`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Chargement...
                    </>
                  ) : (
                    isLogin ? "Se connecter" : "Créer mon compte"
                  )}
                </Button>

                <Separator />

                <div className="text-center">
                  <p className="text-sm text-gray-600 font-helvetica">
                    {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
                    <Button
                      variant="link"
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-primary hover:text-primary/80 font-bold p-0 ml-1"
                    >
                      {isLogin ? "Créer un compte" : "Se connecter"}
                    </Button>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
