import type { Metadata } from 'next'
import './globals.css'
import { AppProvider } from '@/lib/contexts/AppProvider'
import ErrorBoundary from '@/components/ui/ErrorBoundary'

export const metadata: Metadata = {
  title: 'dédépanne - Votre partenaire de confiance pour tous vos dépannages d\'électroménager',
  description: 'Service de réparation d\'électroménager professionnel et fiable. Réparations, donations et appareils reconditionnés.',
  generator: 'Next.js',
  keywords: 'réparation électroménager, dépannage, lave-linge, réfrigérateur, lave-vaisselle, four',
  authors: [{ name: 'dédépanne' }],
  creator: 'dédépanne',
  publisher: 'dédépanne',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://dedepanne.fr'),
  openGraph: {
    title: 'dédépanne - Réparation d\'électroménager',
    description: 'Votre partenaire de confiance pour tous vos dépannages d\'électroménager',
    url: 'https://dedepanne.fr',
    siteName: 'dédépanne',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'dédépanne - Réparation d\'électroménager',
    description: 'Votre partenaire de confiance pour tous vos dépannages d\'électroménager',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body>
        <ErrorBoundary>
          <AppProvider>
            {children}
            {/* Mascotte assistant en bas à droite, style badge/chatbot */}
            <div className="fixed bottom-4 right-4 z-50">
              <img
                src="/mascotte.svg"
                alt="Mascotte dédépanne"
                className="h-16 w-16 rounded-full bg-white shadow-lg border-2 border-primary cursor-pointer p-1"
                style={{ pointerEvents: 'auto' }}
              />
            </div>
          </AppProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
