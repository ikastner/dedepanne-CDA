"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, AlertCircle } from "lucide-react"
import { useRepairs } from "@/lib/api"
import { ELIGIBLE_POSTAL_CODES } from "@/lib/constants"

interface RepairFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export default function RepairForm({ onSuccess, onCancel }: RepairFormProps) {
  const { createRepair, loading, error } = useRepairs()
  
  const [postalCodeStep, setPostalCodeStep] = useState(0)
  const [postalCode, setPostalCode] = useState("")
  const [isCheckingPostalCode, setIsCheckingPostalCode] = useState(false)
  const [repairStep, setRepairStep] = useState(1)
  
  const [formData, setFormData] = useState({
    appliance: "",
    brand: "",
    model: "",
    issue: "",
    urgency: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    email: "",
    timeSlot: "",
    preferredDate: null as Date | null,
    nom: "",     
    prenom: "",   
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

  const handleInputChange = (field: string, value: string | boolean | Date | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!formData.appliance || !formData.issue || !formData.phone) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    try {
      await createRepair({
        ...formData,
        status: "pending",
        createdAt: new Date().toISOString(),
      })
      
      alert("Demande de réparation envoyée avec succès !")
      onSuccess?.()
    } catch (err) {
      console.error("Erreur lors de la création de la réparation:", err)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="font-cocogoose text-black text-xl text-center">
          Demande de réparation
        </CardTitle>
        <CardDescription className="font-poppins text-gray-600 text-center">
          Remplissez ce formulaire pour programmer une intervention
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Étape 1: Vérification du code postal */}
        {repairStep === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="postalCode" className="font-poppins font-bold text-black">
                Code postal *
              </Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="postalCode"
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
                onClick={() => setRepairStep(2)}
                className="w-full"
              >
                Continuer
              </Button>
            )}
          </div>
        )}

        {/* Étape 2: Détails de l'appareil */}
        {repairStep === 2 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="appliance" className="font-poppins font-bold text-black">
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
                <Label htmlFor="brand" className="font-poppins font-bold text-black">
                  Marque
                </Label>
                <Input
                  id="brand"
                  placeholder="ex: Bosch"
                  value={formData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                  className="font-helvetica"
                />
              </div>
              <div>
                <Label htmlFor="model" className="font-poppins font-bold text-black">
                  Modèle
                </Label>
                <Input
                  id="model"
                  placeholder="ex: WAT28440FF"
                  value={formData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  className="font-helvetica"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="issue" className="font-poppins font-bold text-black">
                Problème rencontré *
              </Label>
              <Textarea
                id="issue"
                placeholder="Décrivez le problème..."
                value={formData.issue}
                onChange={(e) => handleInputChange("issue", e.target.value)}
                className="font-helvetica"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setRepairStep(1)}
                className="flex-1"
              >
                Retour
              </Button>
              <Button
                onClick={() => setRepairStep(3)}
                className="flex-1"
              >
                Continuer
              </Button>
            </div>
          </div>
        )}

        {/* Étape 3: Coordonnées */}
        {repairStep === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prenom" className="font-poppins font-bold text-black">
                  Prénom *
                </Label>
                <Input
                  id="prenom"
                  placeholder="Votre prénom"
                  value={formData.prenom}
                  onChange={(e) => handleInputChange("prenom", e.target.value)}
                  className="font-helvetica"
                />
              </div>
              <div>
                <Label htmlFor="nom" className="font-poppins font-bold text-black">
                  Nom *
                </Label>
                <Input
                  id="nom"
                  placeholder="Votre nom"
                  value={formData.nom}
                  onChange={(e) => handleInputChange("nom", e.target.value)}
                  className="font-helvetica"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="font-poppins font-bold text-black">
                Téléphone *
              </Label>
              <Input
                id="phone"
                placeholder="06 12 34 56 78"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="font-helvetica"
              />
            </div>

            <div>
              <Label htmlFor="email" className="font-poppins font-bold text-black">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="font-helvetica"
              />
            </div>

            <div>
              <Label htmlFor="address" className="font-poppins font-bold text-black">
                Adresse *
              </Label>
              <Input
                id="address"
                placeholder="123 rue de la Paix"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="font-helvetica"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city" className="font-poppins font-bold text-black">
                  Ville *
                </Label>
                <Input
                  id="city"
                  placeholder="Paris"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="font-helvetica"
                />
              </div>
              <div>
                <Label htmlFor="postalCode" className="font-poppins font-bold text-black">
                  Code postal *
                </Label>
                <Input
                  id="postalCode"
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
                onClick={() => setRepairStep(2)}
                className="flex-1"
              >
                Retour
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Envoi..." : "Envoyer la demande"}
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