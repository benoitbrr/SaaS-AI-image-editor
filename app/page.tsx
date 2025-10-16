'use client'

import Link from 'next/link'
import AmbientBackdrop from '@/components/AmbientBackdrop'
import { useAuth } from '@/contexts/AuthContext'

export default function Home() {
  const { user } = useAuth()

  return (
    <main className="relative isolate min-h-screen overflow-hidden">
      <AmbientBackdrop />

      <div className="relative z-10 container mx-auto px-4 py-24">
        {/* Hero Section */}
        <div className="mx-auto mb-24 max-w-4xl text-center">
          <div className="mx-auto mb-10 flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-6 py-2 backdrop-blur-xl">
            <div className="h-2 w-2 animate-pulse rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 shadow-[0_0_18px_rgba(16,185,129,0.8)]" />
            <span className="text-sm font-medium tracking-wide text-slate-200">
              Propulsé par Google Nano-Banana AI
            </span>
          </div>

          <h1 className="mb-8 text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
            Donnez une âme nouvelle à chaque image
            <span className="mt-3 block bg-gradient-to-r from-indigo-300 via-purple-300 to-sky-300 bg-clip-text text-transparent">
              grâce à l&apos;intelligence créative
            </span>
          </h1>

          <p className="mx-auto mb-12 max-w-3xl text-lg text-slate-200/80 md:text-xl">
            Sublimez vos visuels, explorez de nouveaux styles et produisez des rendus spectaculaires
            en quelques secondes seulement. Notre studio vous accompagne du premier prompt à l&apos;image finale.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-3 rounded-full border border-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-8 py-4 text-lg font-semibold text-white shadow-[0_18px_42px_rgba(129,140,248,0.35)] transition-transform duration-300 hover:scale-[1.03] hover:shadow-[0_24px_50px_rgba(129,140,248,0.45)]"
              >
                Accéder au studio
                <span className="text-xl leading-none">→</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-3 rounded-full border border-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-8 py-4 text-lg font-semibold text-white shadow-[0_18px_42px_rgba(129,140,248,0.35)] transition-transform duration-300 hover:scale-[1.03] hover:shadow-[0_24px_50px_rgba(129,140,248,0.45)]"
                >
                  Démarrer gratuitement
                  <span className="text-xl leading-none">→</span>
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-8 py-4 text-lg font-semibold text-slate-100 transition-all hover:border-white/30 hover:bg-white/[0.08]"
                >
                  Se connecter
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mx-auto mb-24 grid max-w-6xl gap-8 md:grid-cols-3">
          {[
            {
              title: 'Styles immersifs',
              description:
                'Composez des rendus uniques et cohérents à partir de prompts clairs, quelle que soit votre inspiration.',
              icon: '🎨',
            },
            {
              title: 'Rendu instantané',
              description:
                'Obtenez des déclinaisons en quelques secondes grâce à notre moteur calibré pour la production.',
              icon: '⚡',
            },
            {
              title: 'Finesse maîtrisée',
              description:
                'Conservez le sens du détail avec des images haute définition optimisées pour chaque support.',
              icon: '💎',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-3xl transition-all duration-300 hover:border-white/30 hover:bg-white/[0.07]"
            >
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-white/20 to-white/0 blur-2xl transition-opacity group-hover:opacity-80" />
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/40 via-purple-500/40 to-pink-500/40 text-3xl">
                {feature.icon}
              </div>
              <h3 className="mb-3 text-2xl font-bold text-white">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-slate-200/75">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Use Cases */}
        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-12 backdrop-blur-3xl">
          <h2 className="mb-12 text-center text-3xl font-black text-white md:text-4xl">
            Des scénarios pensés pour les créateurs exigeants
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: 'Photographie professionnelle',
                description: 'Redynamisez vos prises de vue avec des atmosphères premium et des éclairages sur mesure.',
              },
              {
                title: 'Art et inspiration',
                description: 'Expérimentez des univers visuels audacieux pour nourrir vos projets créatifs.',
              },
              {
                title: 'Marketing & publicité',
                description: 'Déclinez des visuels impactants qui mettent en avant votre message sans compromis.',
              },
              {
                title: 'Social media',
                description: 'Boostez vos contenus avec des visuels mémorables et prêts pour la viralité.',
              },
            ].map((useCase) => (
              <div key={useCase.title} className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition hover:border-white/20 hover:bg-white/[0.05]">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 text-sm font-semibold text-white/90">
                  ✓
                </div>
                <div>
                  <h4 className="mb-1 text-lg font-semibold text-white">{useCase.title}</h4>
                  <p className="text-sm text-slate-200/70">{useCase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        {!user && (
          <div className="mt-24 text-center">
            <h2 className="mb-6 text-3xl font-black text-white md:text-4xl">
              Lancez votre premier projet en quelques minutes
            </h2>
            <Link
              href="/signup"
              className="inline-flex items-center gap-3 rounded-full border border-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-8 py-4 text-lg font-semibold text-white shadow-[0_18px_42px_rgba(129,140,248,0.35)] transition-transform duration-300 hover:scale-[1.03] hover:shadow-[0_24px_50px_rgba(129,140,248,0.45)]"
            >
              Créer mon compte gratuit
              <span className="text-xl leading-none">→</span>
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-24 border-t border-white/10">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-sm text-slate-300/70">
            © 2025 Magic Image Refiner • Propulsé par Google Nano-Banana AI
          </p>
        </div>
      </footer>
    </main>
  )
}
