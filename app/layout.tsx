import type { Metadata } from 'next'
import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}
