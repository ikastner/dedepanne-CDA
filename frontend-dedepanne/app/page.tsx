"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wrench, ShoppingCart, Gift, Menu, X, MapPin, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import WordRotate from "@/components/magicui/word-rotate"
import Particles from "@/components/magicui/particles"
import { Checkbox } from "@/components/ui/checkbox"
import { MultiStepLoader } from "@/components/ui/multi-step-loader"
import PageContainer from "@/components/ui/PageContainer"
import { BUTTON_STYLES, CARD_STYLES, ELIGIBLE_POSTAL_CODES } from "@/lib/constants"
import { apiClient } from "@/lib/api/client"

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState<"repair" | "donate" | null>("repair")
  const [isProConnected, setIsProConnected] = useState(false)

  // États pour le Multi Step Loader
  const [isRepairLoading, setIsRepairLoading] = useState(false)
  const [isDonateLoading, setIsDonateLoading] = useState(false)
  const [isPurchaseLoading, setIsPurchaseLoading] = useState(false)

  const rotatingWords = ["électroménagers", "lave-linge", "réfrigérateurs", "lave-vaisselle", "fours"]

  // États pour la vérification du code postal
  const [postalCodeStep, setPostalCodeStep] = useState(0) // 0: pas vérifié, 1: vérifié et éligible, -1: non éligible
  const [postalCode, setPostalCode] = useState("")
  const [isCheckingPostalCode, setIsCheckingPostalCode] = useState(false)

  const [repairStep, setRepairStep] = useState(1)
  const [donateStep, setDonateStep] = useState(1)
  const [repairFormData, setRepairFormData] = useState({
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
  const [donateFormData, setDonateFormData] = useState({
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

  // États de chargement pour le Multi Step Loader
  const repairLoadingStates = [
    { text: "Vérification de votre demande..." },
    { text: "Analyse de l'appareil et du problème..." },
    { text: "Recherche d'un technicien disponible..." },
    { text: "Planification de l'intervention..." },
    { text: "Envoi de la confirmation..." },
    { text: "Demande traitée avec succès !" }
  ]

  const donateLoadingStates = [
    { text: "Enregistrement de votre don..." },
    { text: "Évaluation de l'état de l'appareil..." },
    { text: "Planification de la récupération..." },
    { text: "Génération du bon d'achat..." },
    { text: "Envoi de la confirmation..." },
    { text: "Don enregistré avec succès !" }
  ]

  const purchaseLoadingStates = [
    { text: "Vérification de la disponibilité..." },
    { text: "Calcul du prix et des options..." },
    { text: "Vérification des garanties..." },
    { text: "Planification de la livraison..." },
    { text: "Traitement du paiement..." },
    { text: "Commande confirmée avec succès !" }
  ]

  useEffect(() => {
    setIsProConnected(typeof window !== 'undefined' && localStorage.getItem('isProConnected') === 'true')
  }, [])

  // Debug: surveiller les changements d'état des loaders
  useEffect(() => {
    console.log("État isRepairLoading changé:", isRepairLoading)
  }, [isRepairLoading])

  useEffect(() => {
    console.log("État isDonateLoading changé:", isDonateLoading)
  }, [isDonateLoading])

  const handleActionSelect = (action: "repair" | "donate") => {
    setSelectedAction(action)
    // Reset la vérification du code postal quand on change d'action
    setPostalCodeStep(0)
    setPostalCode("")
  }

  const resetSelection = () => {
    setSelectedAction(null)
    setPostalCodeStep(0)
    setPostalCode("")
  }

  const checkPostalCodeEligibility = async () => {
    if (!postalCode || postalCode.length !== 5) {
      return
    }

    setIsCheckingPostalCode(true)

    // Simulation d'une vérification API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (ELIGIBLE_POSTAL_CODES.includes(postalCode)) {
      setPostalCodeStep(1) // Éligible
      // Pré-remplir le code postal dans les formulaires
      setRepairFormData((prev) => ({ ...prev, postalCode }))
      setDonateFormData((prev) => ({ ...prev, postalCode }))
    } else {
      setPostalCodeStep(-1) // Non éligible
    }

    setIsCheckingPostalCode(false)
  }

  const handleRepairInputChange = (field: string, value: string | boolean | Date | null) => {
    setRepairFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDonateInputChange = (field: string, value: string | boolean) => {
    setDonateFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleRepairSubmit = async () => {
    // Validation basique
    if (!repairFormData.appliance || !repairFormData.issue || !repairFormData.phone) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    setIsRepairLoading(true)

    try {
      // Préparer les données pour l'API
      const repairData = {
        appliance_type_id: getApplianceTypeId(repairFormData.appliance),
        brand_id: repairFormData.brand ? getBrandId(repairFormData.brand) : null,
        model: repairFormData.model || null,
        issue_description: repairFormData.issue,
        scheduled_date: repairFormData.preferredDate ? repairFormData.preferredDate.toISOString().split('T')[0] : null,
        scheduled_time_slot: repairFormData.timeSlot || null,
        user_contact: {
          name: `${repairFormData.prenom} ${repairFormData.nom}`,
          email: repairFormData.email,
          phone: repairFormData.phone,
          address: repairFormData.address,
          city: repairFormData.city,
          postal_code: repairFormData.postalCode
        }
      }

      await apiClient.createRepair(repairData)
      
      setIsRepairLoading(false)
      alert("Demande de réparation envoyée avec succès !")
      resetSelection()
    } catch (error) {
      console.error('Erreur lors de la création de la demande de réparation:', error)
      setIsRepairLoading(false)
      alert("Erreur lors de l'envoi de la demande. Veuillez réessayer.")
    }
  }

  const handleDonateSubmit = async () => {
    // Validation basique
    if (!donateFormData.appliance || !donateFormData.name || !donateFormData.phone) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    setIsDonateLoading(true)

    try {
      // Préparer les données pour l'API
      const donationData = {
        appliance_type_id: getApplianceTypeId(donateFormData.appliance),
        brand_id: donateFormData.brand ? getBrandId(donateFormData.brand) : null,
        model: donateFormData.model || null,
        age: donateFormData.age ? parseInt(donateFormData.age) : null,
        condition: donateFormData.condition || null,
        description: donateFormData.description || null,
        address: `${donateFormData.address}, ${donateFormData.city} ${donateFormData.postalCode}`,
        user_contact: {
          name: donateFormData.name,
          email: donateFormData.email,
          phone: donateFormData.phone
        }
      }

      await apiClient.createDonation(donationData)
      
      setIsDonateLoading(false)
      alert("Don enregistré avec succès ! Vous recevrez un bon d'achat de 50€.")
      resetSelection()
    } catch (error) {
      console.error('Erreur lors de la création du don:', error)
      setIsDonateLoading(false)
      alert("Erreur lors de l'enregistrement du don. Veuillez réessayer.")
    }
  }

  const handlePurchaseSubmit = async () => {
    setIsPurchaseLoading(true)

    // Simulation d'un appel API
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsPurchaseLoading(false)
    alert("Commande confirmée ! Vous recevrez un email de confirmation.")
  }

  // Mettre à jour le code postal dans les formulaires quand il change
  useEffect(() => {
    if (postalCodeStep === 1) {
      setRepairFormData((prev) => ({ ...prev, postalCode }))
      setDonateFormData((prev) => ({ ...prev, postalCode }))
    }
  }, [postalCode, postalCodeStep])

  // Fonctions utilitaires pour convertir les valeurs
  const getApplianceTypeId = (appliance: string): number => {
    const applianceMap: { [key: string]: number } = {
      'lave-linge': 1,
      'lave-vaisselle': 2,
      'refrigerateur': 3,
      'four': 4,
      'micro-ondes': 5,
      'seche-linge': 6
    }
    return applianceMap[appliance] || 1
  }

  const getBrandId = (brand: string): number => {
    const brandMap: { [key: string]: number } = {
      'bosch': 1,
      'siemens': 2,
      'whirlpool': 3,
      'lg': 4,
      'samsung': 5,
      'electrolux': 6,
      'candy': 7,
      'hotpoint': 8,
      'indesit': 9,
      'zanussi': 10
    }
    return brandMap[brand.toLowerCase()] || 1
  }

  return (
    <PageContainer 
      headerProps={{
        showNavigation: true,
        showAuthButtons: true
      }}
      className="bg-white"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen w-full flex items-center justify-center">
        {/* SVG décoratif en fond */}
        <img
          src="/backgroudKey.svg"
          alt="Décor clé outils"
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none select-none z-0"
          aria-hidden="true"
        />
        {/* Particles Background */}
        <Particles className="absolute inset-0" quantity={50} color="#ffc200" vx={0.1} vy={0.1} />
        <div className="relative z-10 w-full px-2 sm:px-0">
          <div className="container mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-16 items-center">
              {/* Left Content */}
              <div className="space-y-6 lg:space-y-10 text-center lg:text-left">
                {/* Main Title avec taille réduite et largeur limitée */}
                <div className="space-y-6">
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-cocogoose font-black text-black leading-tight uppercase break-words max-w-xl lg:max-w-2xl">
                    <span>Réparez vos </span>
                    <WordRotate words={rotatingWords} className="text-primary inline-block" duration={3000} />
                    <span> facilement chez vous</span>
                  </div>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 font-helvetica leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    Notre service de dépannage à domicile vous permet de réserver une intervention en quelques clics.
                    Profitez d'une expérience simple et rapide pour remettre vos appareils en état de marche.
                  </p>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className={`${BUTTON_STYLES.outline} rounded-full px-6 py-3 text-sm md:text-lg font-helvetica w-full sm:w-auto`}
                  >
                    <Link href="/services">En savoir plus</Link>
                  </Button>
                </div>
              </div>

              {/* Right Content - Form or Illustration */}
              <div className="relative flex flex-col h-full justify-center items-center mt-8 lg:mt-0 w-full">
                <div className="flex flex-row gap-2 mb-4 items-center">
                  <Button
                    onClick={() => handleActionSelect("repair")}
                    className={`font-bold border-2 border-black rounded-full px-6 py-3 text-sm md:text-base font-helvetica transition-all duration-300 hover:scale-105 ${
                      selectedAction === "repair"
                        ? "bg-primary text-black hover:bg-primary/90 scale-105 shadow-lg"
                        : "bg-white text-black hover:bg-gray-100"
                    }`}
                  >
                    <Wrench className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                    Réparer
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className={`${BUTTON_STYLES.outline} rounded-full px-6 py-3 text-sm md:text-base font-helvetica transition-all duration-300 hover:scale-105`}
                  >
                    <Link href="/reconditioned" className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
                      Acheter
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleActionSelect("donate")}
                    className={`font-bold border-2 border-black rounded-full px-6 py-3 text-sm md:text-base font-helvetica transition-all duration-300 hover:scale-105 ${
                      selectedAction === "donate"
                        ? "bg-primary text-black hover:bg-primary/90 scale-105 shadow-lg"
                        : "bg-white text-black hover:bg-gray-100"
                    }`}
                  >
                    <Gift className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                    Donner
                  </Button>
                </div>

                {/* Formulaire de réparation */}
                {selectedAction === "repair" && (
                  <Card className={`${CARD_STYLES.elevated} w-full max-w-md`}>
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
                                className={`${BUTTON_STYLES.primary} px-4`}
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
                              className={`${BUTTON_STYLES.primary} w-full`}
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
                              value={repairFormData.appliance}
                              onValueChange={(value) => handleRepairInputChange("appliance", value)}
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
                                value={repairFormData.brand}
                                onChange={(e) => handleRepairInputChange("brand", e.target.value)}
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
                                value={repairFormData.model}
                                onChange={(e) => handleRepairInputChange("model", e.target.value)}
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
                              value={repairFormData.issue}
                              onChange={(e) => handleRepairInputChange("issue", e.target.value)}
                              className="font-helvetica"
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setRepairStep(1)}
                              className={`${BUTTON_STYLES.outline} flex-1`}
                            >
                              Retour
                            </Button>
                            <Button
                              onClick={() => setRepairStep(3)}
                              className={`${BUTTON_STYLES.primary} flex-1`}
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
                                value={repairFormData.prenom}
                                onChange={(e) => handleRepairInputChange("prenom", e.target.value)}
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
                                value={repairFormData.nom}
                                onChange={(e) => handleRepairInputChange("nom", e.target.value)}
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
                              value={repairFormData.phone}
                              onChange={(e) => handleRepairInputChange("phone", e.target.value)}
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
                              value={repairFormData.email}
                              onChange={(e) => handleRepairInputChange("email", e.target.value)}
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
                              value={repairFormData.address}
                              onChange={(e) => handleRepairInputChange("address", e.target.value)}
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
                                value={repairFormData.city}
                                onChange={(e) => handleRepairInputChange("city", e.target.value)}
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
                                value={repairFormData.postalCode}
                                onChange={(e) => handleRepairInputChange("postalCode", e.target.value)}
                                className="font-helvetica"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setRepairStep(2)}
                              className={`${BUTTON_STYLES.outline} flex-1`}
                            >
                              Retour
                            </Button>
                            <Button
                              onClick={handleRepairSubmit}
                              className={`${BUTTON_STYLES.primary} flex-1`}
                            >
                              Envoyer la demande
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Formulaire de don */}
                {selectedAction === "donate" && (
                  <Card className={`${CARD_STYLES.elevated} w-full max-w-md`}>
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
                                className={`${BUTTON_STYLES.primary} px-4`}
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
                              className={`${BUTTON_STYLES.primary} w-full`}
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
                              value={donateFormData.appliance}
                              onValueChange={(value) => handleDonateInputChange("appliance", value)}
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
                                value={donateFormData.brand}
                                onChange={(e) => handleDonateInputChange("brand", e.target.value)}
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
                                value={donateFormData.model}
                                onChange={(e) => handleDonateInputChange("model", e.target.value)}
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
                                value={donateFormData.age}
                                onChange={(e) => handleDonateInputChange("age", e.target.value)}
                                className="font-helvetica"
                              />
                            </div>
                            <div>
                              <Label htmlFor="donateCondition" className="font-poppins font-bold text-black">
                                État général
                              </Label>
                              <Select
                                value={donateFormData.condition}
                                onValueChange={(value) => handleDonateInputChange("condition", value)}
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
                              value={donateFormData.description}
                              onChange={(e) => handleDonateInputChange("description", e.target.value)}
                              className="font-helvetica"
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setDonateStep(1)}
                              className={`${BUTTON_STYLES.outline} flex-1`}
                            >
                              Retour
                            </Button>
                            <Button
                              onClick={() => setDonateStep(3)}
                              className={`${BUTTON_STYLES.primary} flex-1`}
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
                              value={donateFormData.name}
                              onChange={(e) => handleDonateInputChange("name", e.target.value)}
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
                              value={donateFormData.phone}
                              onChange={(e) => handleDonateInputChange("phone", e.target.value)}
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
                              value={donateFormData.email}
                              onChange={(e) => handleDonateInputChange("email", e.target.value)}
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
                              value={donateFormData.address}
                              onChange={(e) => handleDonateInputChange("address", e.target.value)}
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
                                value={donateFormData.city}
                                onChange={(e) => handleDonateInputChange("city", e.target.value)}
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
                                value={donateFormData.postalCode}
                                onChange={(e) => handleDonateInputChange("postalCode", e.target.value)}
                                className="font-helvetica"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setDonateStep(2)}
                              className={`${BUTTON_STYLES.outline} flex-1`}
                            >
                              Retour
                            </Button>
                            <Button
                              onClick={handleDonateSubmit}
                              className={`${BUTTON_STYLES.primary} flex-1`}
                            >
                              Enregistrer le don
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages Section */}
      <section className="py-16 md:py-20 lg:py-24 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-cocogoose font-black text-black mb-6">
              Pourquoi choisir <span className="text-primary">dédépanne</span> ?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 font-helvetica max-w-3xl mx-auto">
              Une expertise de 35 ans au service de vos appareils électroménagers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Avantage 1 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                <Wrench className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl md:text-2xl font-poppins font-bold text-black">Intervention sous 24h</h3>
              <p className="text-gray-600 font-helvetica">
                Artisan agréé Whirlpool et Rosieres avec 35 ans d'expérience. Disponible 5j/7 avec intervention à 95€.
              </p>
              <div className="text-sm text-primary font-bold">
                ✓ Artisan agréé ✓ 35 ans d'expérience ✓ Intervention 95€
              </div>
            </div>

            {/* Avantage 2 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                <ShoppingCart className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl md:text-2xl font-poppins font-bold text-black">Jusqu'à 60% d'économies</h3>
              <p className="text-gray-600 font-helvetica">
                Appareils reconditionnés par nos experts avec garantie 12 à 18 mois. Tests complets, nettoyage
                professionnel et remplacement des pièces usées.
              </p>
              <div className="text-sm text-primary font-bold">
                ✓ Garantie 6 mois ✓ Livraison gratuite ✓ Installation incluse
              </div>
            </div>

            {/* Avantage 3 */}
            <div className="text-center space-y-4 md:col-span-2 lg:col-span-1">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                <Gift className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl md:text-2xl font-poppins font-bold text-black">Impact écologique positif</h3>
              <p className="text-gray-600 font-helvetica">
                Récupération gratuite à domicile. Vos appareils sont reconditionnés ou recyclés selon les normes
                environnementales. Recevez un bon d'achat de 50€.
              </p>
              <div className="text-sm text-primary font-bold">
                ✓ Récupération gratuite ✓ Garantie 6 mois ✓ Bon d'achat offert
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-cocogoose font-black text-primary mb-2">7000+</div>
              <div className="text-gray-600 font-helvetica">Clients satisfaits</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-cocogoose font-black text-primary mb-2">35</div>
              <div className="text-gray-600 font-helvetica">Années d'expérience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-cocogoose font-black text-primary mb-2">6</div>
              <div className="text-gray-600 font-helvetica">Années d'artisanat</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-cocogoose font-black text-primary mb-2">5j/7</div>
              <div className="text-gray-600 font-helvetica">Disponibilité</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 lg:py-24 px-4 bg-black text-white relative overflow-hidden">
        <Particles className="absolute inset-0" quantity={30} color="#ffc200" vx={-0.1} vy={-0.1} />
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-cocogoose font-black mb-6">
            Prêt à réparer vos appareils ?
          </h2>
          <p className="text-lg md:text-xl mb-10 opacity-90 font-helvetica max-w-2xl mx-auto">
            Prenez rendez-vous dès maintenant, c'est simple, rapide et sans engagement !
          </p>
          <Button
            size="lg"
            asChild
            className={`${BUTTON_STYLES.primary} text-lg md:text-xl px-10 py-6 rounded-full`}
          >
            <Link href="/services">Découvrir nos services</Link>
          </Button>
        </div>
      </section>

      {/* Multi Step Loaders */}
      <MultiStepLoader
        loadingStates={repairLoadingStates}
        loading={isRepairLoading}
        duration={2000}
        loop={false}
      />
      
      <MultiStepLoader
        loadingStates={donateLoadingStates}
        loading={isDonateLoading}
        duration={2000}
        loop={false}
      />

      <MultiStepLoader
        loadingStates={purchaseLoadingStates}
        loading={isPurchaseLoading}
        duration={2000}
        loop={false}
      />
    </PageContainer>
  )
}
