import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Éditeur d\'Images avec IA',
  description: 'Transformez vos images avec l\'intelligence artificielle',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
