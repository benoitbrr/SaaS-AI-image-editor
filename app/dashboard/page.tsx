'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { getSupabaseClient } from '@/lib/supabase'

interface Project {
  id: string
  created_at: string
  input_image_url: string
  output_image_url: string
  prompt: string
  status: string
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
  const [error, setError] = useState<string>('')

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
    
    console.log('🚀 handleSubmit appelé')
    console.log('selectedImage:', selectedImage)
    console.log('prompt:', prompt)
    
    if (!selectedImage || !prompt) {
      setError('Veuillez sélectionner une image et entrer un prompt')
      return
    }

    setIsGenerating(true)
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

      console.log('📤 Envoi de la requête à /api/generate...')
      const response = await fetch('/api/generate', {
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
        throw new Error(data.error || 'Erreur lors de la génération')
      }

      console.log('✅ Génération réussie !')
      
      // Recharger les projets
      await loadProjects()
      
      // Reset form
      setSelectedImage(null)
      setPreviewUrl('')
      setPrompt('')
    } catch (err) {
      console.error('❌ Erreur dans handleSubmit:', err)
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    )
  }

  const suggestedPrompts = [
    "UHD 4k professional photography, cinematic lighting",
    "oil painting style, impressionist art",
    "cyberpunk style with neon lights",
    "vintage photo, sepia tone, 1920s aesthetic",
  ]

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

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
            Dashboard
          </h1>
          <p className="text-white/70 text-lg">
            Créez et gérez vos transformations d&apos;images
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {/* Formulaire de génération */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">
              Nouvelle transformation
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-white font-semibold mb-3 text-sm uppercase tracking-wide">
                  📸 Votre Image
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
                    className={`flex items-center justify-center w-full h-64 md:h-80 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden ${
                      previewUrl 
                        ? 'border-purple-400 bg-black/20' 
                        : 'border-white/30 bg-white/5 hover:bg-white/10 hover:border-purple-400'
                    }`}
                  >
                    {previewUrl ? (
                      <div className="relative w-full h-full group">
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          fill
                          className="object-contain p-2"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white font-semibold">Changer l&apos;image</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-6">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-white font-semibold mb-2">
                          Cliquez pour sélectionner
                        </p>
                        <p className="text-white/60 text-sm">PNG, JPG, GIF jusqu&apos;à 10MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Prompt */}
              <div>
                <label htmlFor="prompt" className="block text-white font-semibold mb-3 text-sm uppercase tracking-wide">
                  ✨ Transformation
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Décrivez la transformation souhaitée..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none backdrop-blur-sm"
                  disabled={isGenerating}
                />
                
                {/* Suggested Prompts */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {suggestedPrompts.map((suggested, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setPrompt(suggested)}
                      className="text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 rounded-full transition-all"
                      disabled={isGenerating}
                    >
                      {suggested}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isGenerating || !selectedImage || !prompt}
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold py-4 px-6 rounded-2xl hover:shadow-2xl hover:shadow-purple-500/50 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-lg"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg
                      className="animate-spin h-6 w-6 text-white"
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
                    <span>Génération magique en cours...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>🪄</span>
                    <span>Générer la magie</span>
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Placeholder pour équilibrer la grid */}
          <div className="hidden lg:block"></div>
        </div>

        {/* Mes Projets */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">
            Mes projets
          </h2>

          {loading ? (
            <div className="text-white/70 text-center py-12">
              Chargement de vos projets...
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <svg className="w-12 h-12 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-white/70 text-lg">Aucun projet pour le moment</p>
              <p className="text-white/50 text-sm mt-2">Créez votre première transformation ci-dessus</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white/10 border border-white/20 rounded-2xl overflow-hidden group hover:shadow-xl transition-all"
                >
                  <div className="relative aspect-video bg-black/20">
                    <Image
                      src={project.output_image_url}
                      alt="Generated"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-white/90 text-sm mb-2 line-clamp-2">
                      {project.prompt}
                    </p>
                    <p className="text-white/50 text-xs mb-3">
                      {new Date(project.created_at).toLocaleDateString('fr-FR')}
                    </p>
                    <div className="flex gap-2">
                      <a
                        href={project.output_image_url}
                        download
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold py-2 px-3 rounded-lg hover:shadow-lg transition-all text-center"
                      >
                        Télécharger
                      </a>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2 px-3 rounded-lg transition-all"
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
