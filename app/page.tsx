'use client'

import { useState } from 'react'
import Image from 'next/image'

const stats = [
  { value: '12k+', label: 'Images sublimées' },
  { value: '4x', label: 'Gain de temps moyen' },
  { value: '98%', label: 'Clients ravis' },
]

const featureHighlights = [
  {
    icon: '🧠',
    title: 'Refinage adaptatif',
    description:
      "Notre IA comprend l'équilibre entre contraste, textures et tonalités pour magnifier chaque détail sans le dénaturer.",
  },
  {
    icon: '🌌',
    title: 'Ambiances cinématiques',
    description:
      'Guides de lumière, palettes colorimétriques et grains analogiques pour créer des univers immersifs en un prompt.',
  },
  {
    icon: '⚡',
    title: 'Flux ultra rapide',
    description:
      'Prévisualisez plusieurs variantes en quelques secondes et téléchargez vos favoris en haute définition instantanément.',
  },
]

const workflowSteps = [
  {
    icon: '⬆️',
    title: 'Téléversez votre base',
    description: 'Ajoutez une photo brute, un concept art ou un simple croquis à revisiter.',
  },
  {
    icon: '💡',
    title: 'Affinez le prompt',
    description: "Décrivez l'ambiance, le style et les textures que vous souhaitez explorer.",
  },
  {
    icon: '🚀',
    title: 'Lancez la magie',
    description: 'Laissez l’IA itérer et récupérez vos images raffinées prêtes à être partagées.',
  },
]

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [prompt, setPrompt] = useState<string>('')
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const currentYear = new Date().getFullYear()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
      setGeneratedImageUrl('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedImage || !prompt) {
      setError('Veuillez sélectionner une image et entrer un prompt')
      return
    }

    setIsLoading(true)
    setError('')
    setGeneratedImageUrl('')

    try {
      const formData = new FormData()
      formData.append('image', selectedImage)
      formData.append('prompt', prompt)

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la génération')
      }

      setGeneratedImageUrl(data.outputImageUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const suggestedPrompts = [
    'UHD 4k professional photography, cinematic lighting',
    'oil painting style, impressionist art',
    'cyberpunk style with neon lights',
    'vintage photo, sepia tone, 1920s aesthetic',
  ]

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.22),_transparent_65%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(14,165,233,0.18),_transparent_60%)]"></div>
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-purple-500/30 blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-0 h-[26rem] w-[26rem] rounded-full bg-sky-500/25 blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-1/4 h-[32rem] w-[32rem] rounded-full bg-pink-500/25 blur-[150px] opacity-80 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <header className="mb-12 flex flex-wrap items-center justify-between gap-4 md:mb-16">
          <div className="flex items-center gap-3">
            <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-500 to-sky-500 shadow-lg shadow-purple-500/30">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                <path
                  d="M12 3.5l1.9 4.6 4.9.4-3.7 3.2 1.1 4.8L12 14.9l-4.2 1.6 1.1-4.8-3.7-3.2 4.9-.4L12 3.5z"
                  stroke="currentColor"
                  strokeWidth={1.2}
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/50">Magic Image</p>
              <p className="text-lg font-semibold text-white">Refiner Studio</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
            <span className="hidden md:inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></span>
              Serveurs disponibles
            </span>
            <button
              type="button"
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-medium text-white/80 transition hover:border-purple-400/60 hover:bg-purple-500/20 hover:text-white"
            >
              <span>Voir la démo</span>
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </header>

        <section className="mb-12 space-y-10 md:space-y-12">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></span>
              Raffinez votre univers visuel grâce à l&apos;IA
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Sublimez vos idées en images iconiques
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-sky-400 bg-clip-text text-transparent">
                en quelques secondes
              </span>
            </h1>
            <p className="max-w-2xl text-lg text-white/70 md:text-xl">
              Conçu pour les studios créatifs, photographes et directeurs artistiques qui exigent un contrôle total
              sur l&apos;ambiance, la lumière et le grain. Magic Image Refiner transforme vos intentions en visuels
              prêts à être publiés.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.07] p-4 shadow-lg shadow-purple-500/5 backdrop-blur transition hover:-translate-y-1 hover:border-purple-400/50 hover:bg-white/[0.1]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-sky-500/20 opacity-60"></div>
                <div className="relative">
                  <p className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-sky-300 bg-clip-text md:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-10 lg:grid-cols-[1.05fr,0.95fr]">
          <div className="space-y-8">
            <div className="relative rounded-[32px] p-[1px] bg-gradient-to-br from-purple-500/40 via-pink-500/30 to-sky-500/40 shadow-xl shadow-purple-500/10">
              <form
                onSubmit={handleSubmit}
                className="relative rounded-[30px] border border-white/10 bg-slate-950/80 p-6 md:p-8 backdrop-blur-2xl"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">Atelier</p>
                    <h2 className="text-xl font-semibold text-white md:text-2xl">Téléversement & prompt</h2>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></span>
                    Mode studio
                  </span>
                </div>

                <div className="mt-6 space-y-7">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">📸 Image source</p>
                    <div className="relative mt-3 group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                        disabled={isLoading}
                      />
                      <label
                        htmlFor="image-upload"
                        className={`flex h-64 w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed transition-all duration-300 md:h-80 ${
                          previewUrl
                            ? 'border-purple-400/60 bg-black/30 hover:border-purple-300 hover:bg-black/40'
                            : 'border-white/30 bg-black/20 hover:border-purple-400/60 hover:bg-white/10'
                        }`}
                      >
                        {previewUrl ? (
                          <div className="relative h-full w-full">
                            <Image src={previewUrl} alt="Preview" fill className="object-contain p-3" />
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                              <span className="text-sm font-semibold text-white">Changer l&apos;image</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-3xl">
                              📤
                            </div>
                            <p className="text-base font-semibold text-white">Glissez-déposez ou cliquez</p>
                            <p className="mt-2 text-sm text-white/60">PNG, JPG, GIF jusqu&apos;à 10MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="prompt"
                      className="block text-xs font-semibold uppercase tracking-[0.3em] text-white/60"
                    >
                      ✨ Transformation
                    </label>
                    <textarea
                      id="prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Décrivez la transformation souhaitée... ex: UHD 4k professional photography, cinematic lighting"
                      rows={4}
                      className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-transparent focus:ring-2 focus:ring-purple-500/80 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    />

                    <div className="mt-4 flex flex-wrap gap-2">
                      {suggestedPrompts.map((suggested, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setPrompt(suggested)}
                          className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs text-white/80 transition hover:border-purple-400/60 hover:bg-purple-500/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                          disabled={isLoading}
                        >
                          {suggested}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-white/5 px-4 py-4 text-sm text-white/70">
                    <span className="font-semibold text-white">Astuce pro :</span> combinez un style visuel avec une
                    ambiance sensorielle (lumière, texture, émotion) pour obtenir un rendu nuancé.
                  </div>

                  {error && (
                    <div className="rounded-2xl border border-rose-500/40 bg-rose-500/15 px-4 py-3 text-sm text-rose-100 shadow-lg shadow-rose-500/10">
                      <div className="flex items-start gap-3">
                        <svg className="mt-0.5 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.707-5.707a1 1 0 011.414 0L10 12.586l.293-.293a1 1 0 011.414 1.414L11.414 14l.293.293a1 1 0 01-1.414 1.414L10 15.414l-.293.293a1 1 0 01-1.414-1.414L8.586 14l-.293-.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{error}</span>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || !selectedImage || !prompt}
                    className="flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-sky-500 px-6 py-4 text-lg font-semibold shadow-lg shadow-purple-500/30 transition-transform hover:-translate-y-0.5 hover:shadow-purple-500/40 focus:outline-none focus:ring-4 focus:ring-purple-500/40 disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none"
                  >
                    {isLoading ? (
                      <>
                        <svg className="h-6 w-6 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Génération magique en cours...</span>
                      </>
                    ) : (
                      <>
                        <span>🪄</span>
                        <span>Lancer la génération</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="space-y-8">
            <div className="relative rounded-[32px] p-[1px] bg-gradient-to-br from-sky-500/40 via-purple-500/30 to-pink-500/30 shadow-xl shadow-sky-500/10">
              <div className="relative flex min-h-[460px] flex-col rounded-[30px] border border-white/10 bg-slate-950/80 p-6 md:p-8 backdrop-blur-2xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">Galerie</p>
                    <h2 className="text-xl font-semibold text-white md:text-2xl">
                      {generatedImageUrl ? 'Résultat final' : 'Aperçu en direct'}
                    </h2>
                  </div>
                  {generatedImageUrl && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-100">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300"></span>
                      Terminé
                    </span>
                  )}
                </div>

                <div className="mt-6 flex flex-1 flex-col gap-5">
                  {generatedImageUrl ? (
                    <>
                      <div className="relative flex-1 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                        <Image src={generatedImageUrl} alt="Generated" fill className="object-contain" />
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <a
                          href={generatedImageUrl}
                          download
                          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:shadow-emerald-500/40"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Télécharger
                        </a>
                        <button
                          onClick={() => setGeneratedImageUrl('')}
                          className="rounded-full border border-white/20 bg-white/5 px-5 py-3 font-semibold text-white/80 transition hover:border-purple-400/60 hover:bg-purple-500/20 hover:text-white"
                        >
                          Nouvelle itération
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-white/20 bg-black/20 px-6 text-center">
                      <div className="space-y-4 text-white/60">
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-sky-500/20 text-4xl">
                          🎯
                        </div>
                        <p className="text-lg font-semibold text-white/80">Prêt à créer ?</p>
                        <p className="text-sm">
                          Importez une image et laissez votre prompt guider le raffinement. Vos résultats apparaîtront ici.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-purple-100">
                  Guide
                </span>
                <p className="text-sm text-white/70">Optimisez votre prompt pour une cohérence parfaite</p>
              </div>
              <div className="mt-6 space-y-4">
                {workflowSteps.map((step) => (
                  <div
                    key={step.title}
                    className="flex items-start gap-4 rounded-2xl border border-white/5 bg-slate-950/50 p-4 transition hover:border-purple-400/40 hover:bg-slate-900/60"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/40 to-sky-500/40 text-lg">
                      {step.icon}
                    </span>
                    <div className="space-y-1">
                      <p className="font-semibold text-white">{step.title}</p>
                      <p className="text-sm text-white/60">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="mt-16 md:mt-20">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-2xl font-semibold text-white md:text-3xl">
              Pourquoi les créateurs adorent Magic Image Refiner
            </h3>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-purple-400"></span>
              Boost créatif garanti
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featureHighlights.map((feature) => (
              <div
                key={feature.title}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.07] p-6 shadow-xl shadow-purple-500/10 transition hover:-translate-y-1 hover:border-purple-400/50 hover:bg-white/[0.1]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-sky-500/20 opacity-60"></div>
                <div className="relative space-y-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                    {feature.icon}
                  </span>
                  <h4 className="text-lg font-semibold text-white">{feature.title}</h4>
                  <p className="text-sm leading-relaxed text-white/60">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-16 border-t border-white/10 pt-8 text-center text-sm text-white/40">
          <p>
            © {currentYear} Magic Image Refiner — Conçu par Fermat Research. Explorez, expérimentez, émerveillez.
          </p>
        </footer>
      </div>
    </main>
  )
}
