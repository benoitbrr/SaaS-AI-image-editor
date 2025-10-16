'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const pathname = usePathname()
  const { user, signOut, loading } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Sign out failed', error)
      alert("Impossible de vous déconnecter pour le moment. Veuillez réessayer.")
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-[rgba(4,5,18,0.85)] backdrop-blur-2xl shadow-[0_12px_32px_rgba(8,15,40,0.45)] border-b border-white/5">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-800/40 transition-transform duration-300 group-hover:scale-[1.05]">
              <div className="absolute inset-0 bg-white/15 blur-[18px]" />
              <span className="relative text-xs font-bold uppercase tracking-[0.25em] text-white">
                mir
              </span>
            </div>
            <div className="flex flex-col leading-tight text-slate-200">
              <span className="text-base font-semibold uppercase tracking-[0.28em] text-slate-300 group-hover:text-white transition-colors hidden sm:block">
                Magic Image
              </span>
              <span className="text-lg font-bold text-white hidden sm:block">
                Refiner Studio
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className={`hidden sm:inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                        pathname === '/dashboard'
                          ? 'border-purple-400/60 bg-purple-500/10 text-white shadow-[0_8px_20px_rgba(99,102,241,0.25)]'
                          : 'border-white/10 text-slate-300 hover:border-purple-400/40 hover:bg-purple-500/10 hover:text-white'
                      }`}
                    >
                      <span className="inline-block h-2 w-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 shadow-[0_0_10px_rgba(99,102,241,0.7)]" />
                      Dashboard
                    </Link>

                    <div className="hidden md:flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 shadow-inner shadow-white/5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white uppercase">
                        {user.email?.[0].toUpperCase()}
                      </div>
                      <span className="max-w-[160px] truncate text-sm text-slate-200">
                        {user.email}
                      </span>
                    </div>

                    <button
                      onClick={handleSignOut}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-sm font-semibold text-slate-200 transition-all hover:border-red-400/50 hover:bg-red-500/10 hover:text-white"
                    >
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-sm font-semibold text-slate-200 transition-all hover:border-slate-300/60 hover:bg-white/10 hover:text-white"
                    >
                      Connexion
                    </Link>
                    <Link
                      href="/signup"
                      className="inline-flex items-center gap-2 rounded-full border border-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(124,58,237,0.35)] transition-transform duration-300 hover:scale-[1.03] hover:shadow-[0_16px_40px_rgba(124,58,237,0.45)]"
                    >
                      Commencer
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
