'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function Home() {
  const { user } = useAuth()

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-6 py-2 mb-8">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white/90 text-sm font-medium">Propulsé par Google Nano-Banana AI</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight">
            Transformez vos images
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              avec l&apos;IA
            </span>
          </h1>

          <p className="text-white/70 text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
            Sublimez, transformez et créez des images époustouflantes en quelques secondes grâce à l&apos;intelligence artificielle
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user ? (
              <Link
                href="/dashboard"
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold py-4 px-8 rounded-2xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-[1.05] text-lg"
              >
                Accéder au Dashboard →
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold py-4 px-8 rounded-2xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-[1.05] text-lg"
                >
                  Commencer gratuitement →
                </Link>
                <Link
                  href="/login"
                  className="bg-white/10 backdrop-blur-lg border border-white/20 text-white font-bold py-4 px-8 rounded-2xl hover:bg-white/20 transition-all duration-300 text-lg"
                >
                  Se connecter
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6">
              <span className="text-3xl">🎨</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Transformations magiques
            </h3>
            <p className="text-white/70">
              Transformez vos photos en œuvres d&apos;art avec des prompts simples et intuitifs
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-6">
              <span className="text-3xl">⚡</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Résultats instantanés
            </h3>
            <p className="text-white/70">
              Obtenez des résultats professionnels en quelques secondes grâce à notre IA ultra-rapide
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center mb-6">
              <span className="text-3xl">💎</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Qualité supérieure
            </h3>
            <p className="text-white/70">
              Technologie Google Nano-Banana pour des images haute définition avec des détails incroyables
            </p>
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-12">
            Des possibilités infinies
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-purple-400">✓</span>
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Photographie professionnelle</h4>
                <p className="text-white/60 text-sm">Transformez vos photos en clichés dignes d&apos;un studio</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-purple-400">✓</span>
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Art et créativité</h4>
                <p className="text-white/60 text-sm">Créez des œuvres artistiques uniques en quelques clics</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-purple-400">✓</span>
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Marketing et publicité</h4>
                <p className="text-white/60 text-sm">Des visuels impactants pour vos campagnes</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-purple-400">✓</span>
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Réseaux sociaux</h4>
                <p className="text-white/60 text-sm">Du contenu viral qui capte l&apos;attention</p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        {!user && (
          <div className="text-center mt-20">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
              Prêt à créer votre magie ?
            </h2>
            <Link
              href="/signup"
              className="inline-block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold py-4 px-8 rounded-2xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-[1.05] text-lg"
            >
              Créer mon compte gratuitement →
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20">
        <div className="container mx-auto px-4 py-8">
          <p className="text-white/40 text-center text-sm">
            © 2025 Magic Image Refiner • Propulsé par Google Nano-Banana AI
          </p>
        </div>
      </footer>
    </main>
  )
}
