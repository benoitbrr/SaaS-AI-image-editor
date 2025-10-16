'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface AuthFormProps {
  mode: 'signin' | 'signup'
}

export default function AuthForm({ mode: initialMode }: AuthFormProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    // Validation
    if (!email || !password) {
      setError('Veuillez remplir tous les champs')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      setLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Email invalide')
      setLoading(false)
      return
    }

    try {
      if (mode === 'signup') {
        const { error } = await signUp(email, password)
        if (error) {
          setError(error.message || 'Erreur lors de l\'inscription')
        } else {
          setSuccess('Inscription réussie ! Vérifiez votre email pour confirmer votre compte.')
        }
      } else {
        const { error } = await signIn(email, password)
        if (error) {
          setError(error.message || 'Email ou mot de passe incorrect')
        } else {
          router.push('/dashboard')
        }
      }
    } catch (err) {
      setError('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Onglets */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode('signin')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
            mode === 'signin'
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          Connexion
        </button>
        <button
          onClick={() => setMode('signup')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
            mode === 'signup'
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          Inscription
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-white font-semibold mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            disabled={loading}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-white font-semibold mb-2">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
          />
          {mode === 'signup' && (
            <p className="text-white/60 text-sm mt-1">Minimum 6 caractères</p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-xl">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {success}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Chargement...</span>
            </span>
          ) : (
            <span>{mode === 'signin' ? 'Se connecter' : 'S\'inscrire'}</span>
          )}
        </button>
      </form>

      {/* Toggle Mode */}
      <p className="text-center text-white/60 mt-6">
        {mode === 'signin' ? (
          <>
            Pas encore de compte ?{' '}
            <button
              onClick={() => setMode('signup')}
              className="text-purple-400 hover:text-purple-300 font-semibold"
            >
              S&apos;inscrire
            </button>
          </>
        ) : (
          <>
            Déjà un compte ?{' '}
            <button
              onClick={() => setMode('signin')}
              className="text-purple-400 hover:text-purple-300 font-semibold"
            >
              Se connecter
            </button>
          </>
        )}
      </p>
    </div>
  )
}
