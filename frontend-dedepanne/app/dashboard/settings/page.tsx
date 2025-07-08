"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera,
  Save,
  ArrowLeft,
  Shield,
  Bell,
  CreditCard,
  Trash2,
  Plus
} from "lucide-react"
import Link from "next/link"
import PageContainer from "@/components/ui/PageContainer"
import { Badge } from "@/components/ui/badge"

// Données mockées
const mockUser = {
  id: 1,
  firstName: "Jean",
  lastName: "Dupont",
  email: "jean.dupont@email.com",
  phone: "06 12 34 56 78",
  avatar: "/avatars/user.jpg",
  addresses: [
    {
      id: 1,
      address_line1: "123 Rue de la Paix",
      city: "Paris",
      postal_code: "75001",
      department: "75",
      is_primary: true
    },
    {
      id: 2,
      address_line1: "456 Avenue des Champs",
      city: "Lyon",
      postal_code: "69001",
      department: "69",
      is_primary: false
    }
  ]
}

export default function SettingsPage() {
  const [user, setUser] = useState(mockUser)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // Simulation de sauvegarde
    setUser(prev => ({
      ...prev,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone
    }))
    setIsEditing(false)
    alert("Informations mises à jour avec succès !")
  }

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    })
    setIsEditing(false)
  }

  return (
    <PageContainer 
      headerProps={{
        showNavigation: true,
        showAuthButtons: true
      }}
      className="bg-gradient-to-b from-blue-50 to-white"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-start gap-6">
          {/* Bouton retour */}
          <Link href="/dashboard" className="shrink-0">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au dashboard
            </Button>
          </Link>
          {/* Bloc principal */}
          <div className="flex-1">
            {/* Titre et description */}
            <div className="mb-10">
              <h1 className="text-3xl font-cocogoose font-black text-black mb-1">
                Paramètres du compte
              </h1>
              <p className="text-gray-600 font-poppins">
                Gérez vos informations personnelles et préférences
              </p>
            </div>
            <div className="space-y-8">
              {/* Photo de profil */}
              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="font-cocogoose flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Photo de profil
                  </CardTitle>
                  <CardDescription>
                    Ajoutez une photo pour personnaliser votre profil
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                      <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                      <AvatarFallback className="bg-primary text-white text-2xl font-bold">
                        {user.firstName[0]}{user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Changer la photo
                      </Button>
                      <p className="text-sm text-gray-600">
                        JPG, PNG ou GIF. Max 2MB.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Informations personnelles */}
              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="font-cocogoose flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Informations personnelles
                      </CardTitle>
                      <CardDescription>
                        Modifiez vos informations de base
                      </CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)}>
                        Modifier
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button onClick={handleSave}>
                          <Save className="h-4 w-4 mr-2" />
                          Enregistrer
                        </Button>
                        <Button variant="outline" onClick={handleCancel}>
                          Annuler
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="font-poppins font-medium">Prénom</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        disabled={!isEditing}
                        className="mt-1 font-helvetica"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="font-poppins font-medium">Nom</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        disabled={!isEditing}
                        className="mt-1 font-helvetica"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="font-poppins font-medium">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        disabled={!isEditing}
                        className="mt-1 font-helvetica"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="font-poppins font-medium">Téléphone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        disabled={!isEditing}
                        className="mt-1 font-helvetica"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Adresses */}
              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="font-cocogoose flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Mes adresses
                      </CardTitle>
                      <CardDescription>
                        Gérez vos adresses de livraison et d'intervention
                      </CardDescription>
                    </div>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une adresse
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.addresses.map((address) => (
                      <div key={address.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium">{address.address_line1}</p>
                            <p className="text-sm text-gray-600">
                              {address.postal_code} {address.city}
                            </p>
                            {address.is_primary && (
                              <Badge variant="secondary" className="text-xs mt-1">
                                Adresse principale
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Modifier
                          </Button>
                          {!address.is_primary && (
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {/* Sécurité */}
              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="font-cocogoose flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Sécurité
                  </CardTitle>
                  <CardDescription>
                    Modifiez votre mot de passe pour sécuriser votre compte
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword" className="font-poppins font-medium">Mot de passe actuel</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                        className="mt-1 font-helvetica"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword" className="font-poppins font-medium">Nouveau mot de passe</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={(e) => handleInputChange("newPassword", e.target.value)}
                        className="mt-1 font-helvetica"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword" className="font-poppins font-medium">Confirmer le nouveau mot de passe</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="mt-1 font-helvetica"
                      />
                    </div>
                    <Button>
                      <Shield className="h-4 w-4 mr-2" />
                      Changer le mot de passe
                    </Button>
                  </div>
                </CardContent>
              </Card>
              {/* Suppression du compte */}
              <Card className="border-2 border-red-200">
                <CardHeader>
                  <CardTitle className="font-cocogoose text-red-600 flex items-center gap-2">
                    <Trash2 className="h-5 w-5" />
                    Zone dangereuse
                  </CardTitle>
                  <CardDescription>
                    Supprimez définitivement votre compte et toutes vos données
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Cette action est irréversible. Toutes vos données, réparations, commandes et donations seront supprimées définitivement.
                  </p>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer mon compte
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
} 