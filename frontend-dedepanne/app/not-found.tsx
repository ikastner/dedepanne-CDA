"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Wrench } from "lucide-react"
import PageContainer from "@/components/ui/PageContainer"
import { BUTTON_STYLES } from "@/lib/constants"

export default function NotFound() {
  return (
    <PageContainer 
      headerProps={{
        showNavigation: true,
        showAuthButtons: true
      }}
      className="bg-gray-50"
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Wrench className="h-6 w-6 text-black" />
            </div>
            <span className="text-2xl font-cocogoose font-black text-black">
              dédé<span className="text-primary">panne</span>
            </span>
          </div>
          <h1 className="text-4xl font-cocogoose font-black mb-4">Oups, cette page n'existe pas !</h1>
          <p className="text-gray-600 font-helvetica mb-8">La page que vous recherchez n'a pas été trouvée.</p>
          <Button asChild className={`${BUTTON_STYLES.primary} rounded-full px-6 py-3`}>
            <Link href="/">Retour à l'accueil</Link>
          </Button>
        </div>
      </div>
    </PageContainer>
  )
} 