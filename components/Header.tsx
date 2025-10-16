'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const pathname = usePathname()
  const { user, signOut, loading } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  return (
    <header className="bg-white/5 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-xl">🪄</span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:block">
              Magic Image Refiner
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            {!loading && (
              <>
                {user ? (
                  <>
                    {/* Dashboard Link */}
                    <Link
                      href="/dashboard"
                      className={`hidden sm:block px-4 py-2 rounded-lg font-semibold transition-all ${
                        pathname === '/dashboard'
                          ? 'bg-white/20 text-white'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      Dashboard
                    </Link>

                    {/* User Info */}
                    <div className="hidden md:flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.email?.[0].toUpperCase()}
                        </span>
                      </div>
                      <span className="text-white/90 text-sm max-w-[150px] truncate">
                        {user.email}
                      </span>
                    </div>

                    {/* Sign Out Button */}
                    <button
                      onClick={handleSignOut}
                      className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-4 py-2 rounded-lg transition-all"
                    >
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    {/* Login Button */}
                    <Link
                      href="/login"
                      className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-4 py-2 rounded-lg transition-all"
                    >
                      Connexion
                    </Link>

                    {/* Sign Up Button */}
                    <Link
                      href="/signup"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                    >
                      S&apos;inscrire
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
