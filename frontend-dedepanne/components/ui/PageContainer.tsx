import { ReactNode } from "react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

interface PageContainerProps {
  children: ReactNode
  showHeader?: boolean
  showFooter?: boolean
  headerProps?: {
    showNavigation?: boolean
    showAuthButtons?: boolean
    isPro?: boolean
  }
  className?: string
}

export default function PageContainer({
  children,
  showHeader = true,
  showFooter = true,
  headerProps = {},
  className = ""
}: PageContainerProps) {
  return (
    <div className={`min-h-screen bg-white ${className}`}>
      {showHeader && <Header {...headerProps} />}
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  )
} 