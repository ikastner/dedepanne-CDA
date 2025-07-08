"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, AlertCircle } from "lucide-react"
import { useDonations } from "@/lib/api"
import { ELIGIBLE_POSTAL_CODES } from "@/lib/constants"

interface DonationFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export default function DonationForm({ onSuccess, onCancel }: DonationFormProps) {
  const { createDonation, loading, error } = useDonations()
  
  const [postalCodeStep, setPostalCodeStep] = useState(0)
  const [postalCode, setPostalCode] = useState("")
  const [isCheckingPostalCode, setIsCheckingPostalCode] = useState(false)
  const [donateStep, setDonateStep] = useState(1)
  
  const [formData, setFormData] = useState({
    appliance: "",
    brand: "",
    model: "",
    age: "",
    condition: "",
    description: "",
    reason: "",
    accessories: false,
    manual: false,
    pickup: false,
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  })

  const checkPostalCodeEligibility = async () => {
    if (!postalCode || postalCode.length !== 5) {
      return
    }

    setIsCheckingPostalCode(true)

    // Simulation d'une vérification API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (ELIGIBLE_POSTAL_CODES.includes(postalCode)) {
      setPostalCodeStep(1)
      setFormData((prev) => ({ ...prev, postalCode }))
    } else {
      setPostalCodeStep(-1)
    }

    setIsCheckingPostalCode(false)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!formData.appliance || !formData.name || !formData.phone) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    try {
      await createDonation({
        ...formData,
        status: "pending",
        createdAt: new Date().toISOString(),
      })
      
      alert("Don enregistré avec succès ! Vous recevrez un bon d'achat de 50€.")
      onSuccess?.()
    } catch (err) {
      console.error("Erreur lors de la création du don:", err)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="font-cocogoose text-black text-xl text-center">
          Don d'appareil
        </CardTitle>
        <CardDescription className="font-poppins text-gray-600 text-center">
          Donnez une seconde vie à vos appareils et recevez un bon d'achat
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Étape 1: Vérification du code postal */}
        {donateStep === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="donatePostalCode" className="font-poppins font-bold text-black">
                Code postal *
              </Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="donatePostalCode"
                  placeholder="75001"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  maxLength={5}
                  className="font-helvetica"
                />
                <Button
                  onClick={checkPostalCodeEligibility}
                  disabled={!postalCode || postalCode.length !== 5 || isCheckingPostalCode}
                  className="px-4"
                >
                  {isCheckingPostalCode ? "Vérification..." : "Vérifier"}
                </Button>
              </div>
              {postalCodeStep === 1 && (
                <div className="flex items-center gap-2 mt-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-helvetica">Zone éligible !</span>
                </div>
              )}
              {postalCodeStep === -1 && (
                <div className="flex items-center gap-2 mt-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-helvetica">Zone non éligible</span>
                </div>
              )}
            </div>
            {postalCodeStep === 1 && (
              <Button
                onClick={() => setDonateStep(2)}
                className="w-full"
              >
                Continuer
              </Button>
            )}
          </div>
        )}

        {/* Étape 2: Détails de l'appareil */}
        {donateStep === 2 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="donateAppliance" className="font-poppins font-bold text-black">
                Type d'appareil *
              </Label>
              <Select
                value={formData.appliance}
                onValueChange={(value) => handleInputChange("appliance", value)}
              >
                <SelectTrigger className="font-helvetica">
                  <SelectValue placeholder="Sélectionnez un appareil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lave-linge">Lave-linge</SelectItem>
                  <SelectItem value="lave-vaisselle">Lave-vaisselle</SelectItem>
                  <SelectItem value="refrigerateur">Réfrigérateur</SelectItem>
                  <SelectItem value="four">Four</SelectItem>
                  <SelectItem value="micro-ondes">Micro-ondes</SelectItem>
                  <SelectItem value="seche-linge">Sèche-linge</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="donateBrand" className="font-poppins font-bold text-black">
                  Marque
                </Label>
                <Input
                  id="donateBrand"
                  placeholder="ex: Bosch"
                  value={formData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                  className="font-helvetica"
                />
              </div>
              <div>
                <Label htmlFor="donateModel" className="font-poppins font-bold text-black">
                  Modèle
                </Label>
                <Input
                  id="donateModel"
                  placeholder="ex: WAT28440FF"
                  value={formData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  className="font-helvetica"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="donateAge" className="font-poppins font-bold text-black">
                  Âge (années)
                </Label>
                <Input
                  id="donateAge"
                  type="number"
                  placeholder="5"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className="font-helvetica"
                />
              </div>
              <div>
                <Label htmlFor="donateCondition" className="font-poppins font-bold text-black">
                  État général
                </Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) => handleInputChange("condition", value)}
                >
                  <SelectTrigger className="font-helvetica">
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="bon">Bon</SelectItem>
                    <SelectItem value="moyen">Moyen</SelectItem>
                    <SelectItem value="mauvais">Mauvais</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="donateDescription" className="font-poppins font-bold text-black">
                Description du problème
              </Label>
              <Textarea
                id="donateDescription"
                placeholder="Décrivez le problème ou l'état de l'appareil..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="font-helvetica"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setDonateStep(1)}
                className="flex-1"
              >
                Retour
              </Button>
              <Button
                onClick={() => setDonateStep(3)}
                className="flex-1"
              >
                Continuer
              </Button>
            </div>
          </div>
        )}

        {/* Étape 3: Coordonnées */}
        {donateStep === 3 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="donateName" className="font-poppins font-bold text-black">
                Nom complet *
              </Label>
              <Input
                id="donateName"
                placeholder="Votre nom complet"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="font-helvetica"
              />
            </div>

            <div>
              <Label htmlFor="donatePhone" className="font-poppins font-bold text-black">
                Téléphone *
              </Label>
              <Input
                id="donatePhone"
                placeholder="06 12 34 56 78"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="font-helvetica"
              />
            </div>

            <div>
              <Label htmlFor="donateEmail" className="font-poppins font-bold text-black">
                Email
              </Label>
              <Input
                id="donateEmail"
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="font-helvetica"
              />
            </div>

            <div>
              <Label htmlFor="donateAddress" className="font-poppins font-bold text-black">
                Adresse *
              </Label>
              <Input
                id="donateAddress"
                placeholder="123 rue de la Paix"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="font-helvetica"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="donateCity" className="font-poppins font-bold text-black">
                  Ville *
                </Label>
                <Input
                  id="donateCity"
                  placeholder="Paris"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="font-helvetica"
                />
              </div>
              <div>
                <Label htmlFor="donatePostalCode" className="font-poppins font-bold text-black">
                  Code postal *
                </Label>
                <Input
                  id="donatePostalCode"
                  placeholder="75001"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange("postalCode", e.target.value)}
                  className="font-helvetica"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setDonateStep(2)}
                className="flex-1"
              >
                Retour
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Enregistrement..." : "Enregistrer le don"}
              </Button>
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm">
            Erreur: {error}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 