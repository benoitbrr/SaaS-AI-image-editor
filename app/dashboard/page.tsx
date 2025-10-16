'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { getSupabaseClient } from '@/lib/supabase'
import AmbientBackdrop from '@/components/AmbientBackdrop'

interface Project {
  id: string
  created_at: string
  input_image_url: string
  output_image_url: string
  prompt: string
  status: string
  payment_status: string
  payment_amount: number
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const supabase = getSupabaseClient()

  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [prompt, setPrompt] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [isCreatingCheckout, setIsCreatingCheckout] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [pendingProject, setPendingProject] = useState<Project | null>(null)

  // Redirect si non authentifié
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // Charger les projets de l'utilisateur
  useEffect(() => {
    if (user) {
      loadProjects()
    }
  }, [user])

  // Vérifier s'il y a un projet en attente de paiement
  useEffect(() => {
    const checkPendingProjects = () => {
      const pending = projects.find(
        (p) => p.payment_status === 'paid' && p.status === 'pending'
      )
      setPendingProject(pending || null)
    }
    checkPendingProjects()
  }, [projects])

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (err) {
      console.error('Erreur chargement projets:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('🚀 handleSubmit appelé - Création de checkout session')
    console.log('selectedImage:', selectedImage)
    console.log('prompt:', prompt)
    
    if (!selectedImage || !prompt) {
      setError('Veuillez sélectionner une image et entrer un prompt')
      return
    }

    setIsCreatingCheckout(true)
    setError('')

    try {
      // Récupérer le token d'auth
      console.log('🔐 Récupération du token...')
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Session:', session ? '✅ OK' : '❌ Manquante')
      
      if (!session) {
        throw new Error('Session expirée')
      }

      const formData = new FormData()
      formData.append('image', selectedImage)
      formData.append('prompt', prompt)

      console.log('📤 Envoi de la requête à /api/create-checkout-session...')
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      })

      console.log('📥 Réponse reçue, status:', response.status)
      const data = await response.json()
      console.log('📊 Data:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création de la session de paiement')
      }

      console.log('✅ Redirection vers Stripe Checkout...')
      
      // Rediriger vers Stripe Checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      }
    } catch (err) {
      console.error('❌ Erreur dans handleSubmit:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setIsCreatingCheckout(false)
    }
  }

  const handleGenerate = async (projectId: string) => {
    setIsGenerating(true)
    setError('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Session expirée')
      }

      const formData = new FormData()
      formData.append('projectId', projectId)

      console.log('📤 Lancement de la génération pour le projet:', projectId)
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la génération')
      }

      console.log('✅ Génération réussie !')
      
      // Recharger les projets
      await loadProjects()
      
      // Retirer le projet en attente
      setPendingProject(null)
    } catch (err) {
      console.error('❌ Erreur dans handleGenerate:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDelete = async (projectId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return

    try {
      // Récupérer le token d'auth
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Session expirée')
      }

      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression')
      }

      // Retirer le projet de la liste
      setProjects(projects.filter(p => p.id !== projectId))
    } catch (err) {
      alert('Erreur lors de la suppression')
    }
  }

  if (authLoading || !user) {
    return (
      <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden">
        <AmbientBackdrop />
        <div className="relative z-10 text-lg font-semibold text-white/80">
          Chargement...
        </div>
      </div>
    )
  }

  const suggestedPrompts = [
    "UHD 4k professional photography, cinematic lighting",
    "oil painting style, impressionist art",
    "cyberpunk style with neon lights",
    "vintage photo, sepia tone, 1920s aesthetic",
  ]

  const creationTips = [
    {
      title: 'Décrivez la lumière',
      description: 'Précisez le type d\'éclairage (studio, naturel, néon) pour obtenir une ambiance cohérente.',
    },
    {
      title: 'Ajoutez des détails clés',
      description: 'Mentionnez le cadrage, le décor ou la texture pour guider le modèle visuel.',
    },
    {
      title: 'Fixez une ambiance',
      description: 'Indiquez une époque, un style artistique ou une émotion pour donner du caractère à l\'image.',
    },
  ]

  return (
    <main className="relative isolate min-h-screen overflow-hidden pb-16">
      <AmbientBackdrop />

      <div className="relative z-10 container mx-auto px-4 pt-12">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/40">
              Votre studio
            </p>
            <h1 className="text-4xl font-black text-white md:text-5xl">
              Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-base text-slate-200/75">
              Créez, affinez et archivez vos transformations visuelles au même endroit.
              Optimisez vos prompts en tirant parti des suggestions instantanées.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-slate-200/70 shadow-inner shadow-white/5">
            <p className="font-semibold text-white/80">Astuce rapide</p>
            <p>Combinez deux prompts enregistrés pour générer des variations inattendues.</p>
          </div>
        </div>

        <div className="mb-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Formulaire de génération */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_22px_50px_rgba(15,23,42,0.35)] backdrop-blur-3xl md:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Nouvelle transformation
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                  Image source
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                    disabled={isGenerating}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`relative flex h-64 w-full items-center justify-center overflow-hidden rounded-2xl border transition-all duration-300 md:h-80 ${
                      previewUrl
                        ? 'border-purple-400/60 bg-black/40'
                        : 'border-white/15 bg-white/[0.03] hover:border-purple-400/40 hover:bg-purple-500/10'
                    } ${isGenerating ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                  >
                    {previewUrl ? (
                      <div className="group relative h-full w-full">
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          fill
                          className="object-contain p-3"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                          <span className="rounded-full border border-white/20 bg-black/50 px-4 py-1.5 text-sm font-semibold text-white">
                            Changer l&apos;image
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-[0_18px_40px_rgba(129,140,248,0.35)]">
                          <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="mb-2 text-base font-semibold text-white">
                          Déposez ou sélectionnez une image
                        </p>
                        <p className="text-sm text-white/60">PNG, JPG ou GIF jusqu&apos;à 10&nbsp;MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Prompt */}
              <div>
                <label
                  htmlFor="prompt"
                  className="mb-3 block text-xs font-semibold uppercase tracking-[0.3em] text-white/60"
                >
                  Description de la transformation
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Décrivez la transformation souhaitée (style, ambiance, détails)"
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-white/15 bg-white/[0.05] px-4 py-3 text-white placeholder-white/50 outline-none transition-all focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/40 backdrop-blur-sm"
                  disabled={isGenerating}
                />
                
                {/* Suggested Prompts */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {suggestedPrompts.map((suggested, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setPrompt(suggested)}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/80 transition-all hover:border-purple-400/40 hover:bg-purple-500/10 hover:text-white"
                      disabled={isGenerating}
                    >
                      {suggested}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-2xl border border-red-500/40 bg-red-500/15 px-4 py-3 text-red-100 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              {/* Pending Project Alert */}
              {pendingProject && (
                <div className="rounded-2xl border border-green-500/40 bg-green-500/15 px-4 py-3 text-green-100 backdrop-blur-sm">
                  <p className="mb-2 font-semibold">✅ Paiement effectué !</p>
                  <p className="mb-3 text-sm">Votre paiement a été confirmé. Vous pouvez maintenant lancer la génération de votre image.</p>
                  <button
                    onClick={() => handleGenerate(pendingProject.id)}
                    disabled={isGenerating}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-transparent bg-gradient-to-r from-emerald-500 to-teal-500 px-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(16,185,129,0.35)] transition-transform duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isGenerating ? (
                      <>
                        <svg
                          className="h-4 w-4 animate-spin"
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
                        <span>Génération en cours...</span>
                      </>
                    ) : (
                      <>
                        <span>🚀</span>
                        <span>Lancer la génération</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isCreatingCheckout || isGenerating || !selectedImage || !prompt}
                className="group inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 text-base font-semibold text-white shadow-[0_20px_46px_rgba(129,140,248,0.35)] transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/40 disabled:cursor-not-allowed disabled:opacity-60 hover:scale-[1.03] hover:shadow-[0_28px_56px_rgba(129,140,248,0.45)]"
              >
                {isCreatingCheckout ? (
                  <span className="flex items-center gap-3">
                    <svg
                      className="h-5 w-5 animate-spin text-white"
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
                    <span>Redirection vers le paiement...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-3">
                    <span className="inline-block h-2 w-2 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.8)] transition-transform group-hover:scale-125" />
                    <span>Générer (2,00 €)</span>
                  </span>
                )}
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_22px_50px_rgba(15,23,42,0.3)] backdrop-blur-3xl lg:p-8">
            <h3 className="text-xl font-semibold text-white">Guides rapides</h3>
            <p className="mt-2 text-sm text-slate-200/70">
              Inspirez-vous de ces quelques conseils pour affiner vos prochains rendus.
            </p>

            <div className="mt-6 space-y-4">
              {creationTips.map((tip) => (
                <div
                  key={tip.title}
                  className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/60">
                    {tip.title}
                  </p>
                  <p className="mt-2 text-sm text-slate-200/70">{tip.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-white/70">Prompts suggérés</p>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((suggested, index) => (
                  <button
                    key={`side-${index}`}
                    type="button"
                    onClick={() => setPrompt(suggested)}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/80 transition hover:border-purple-400/40 hover:bg-purple-500/10 hover:text-white"
                    disabled={isGenerating}
                  >
                    {suggested}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mes Projets */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_22px_50px_rgba(15,23,42,0.35)] backdrop-blur-3xl md:p-8">
          <h2 className="mb-6 text-2xl font-bold text-white">
            Mes projets
          </h2>

          {loading ? (
            <div className="py-12 text-center text-white/70">
              Chargement de vos projets...
            </div>
          ) : projects.filter(p => p.output_image_url && p.status === 'completed').length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/25 to-purple-500/25 text-white/50">
                <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-lg text-white/70">Aucun projet pour le moment</p>
              <p className="mt-2 text-sm text-white/50">Lancez une transformation pour voir votre première création ici.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.filter(p => p.output_image_url && p.status === 'completed').map((project) => (
                <div
                  key={project.id}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all hover:border-white/30 hover:bg-white/[0.07]"
                >
                  <div className="relative aspect-video overflow-hidden bg-black/20">
                    <Image
                      src={project.output_image_url}
                      alt="Generated"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                  </div>
                  <div className="p-4">
                    <p className="mb-2 line-clamp-2 text-sm text-white/90">
                      {project.prompt}
                    </p>
                    <p className="mb-3 text-xs text-white/50">
                      {new Date(project.created_at).toLocaleDateString('fr-FR')}
                    </p>
                    <div className="flex gap-2">
                      <a
                        href={project.output_image_url}
                        download
                        className="flex-1 rounded-lg border border-transparent bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-2 text-center text-sm font-semibold text-white transition hover:shadow-[0_12px_30px_rgba(16,185,129,0.35)]"
                      >
                        Télécharger
                      </a>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="rounded-lg border border-red-500/40 bg-red-500/20 px-3 py-2 text-sm font-semibold text-red-100 transition hover:border-red-400/60 hover:bg-red-500/30"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
