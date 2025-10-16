import AuthForm from '@/components/AuthForm'
import AmbientBackdrop from '@/components/AmbientBackdrop'

export default function LoginPage() {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <AmbientBackdrop variant="auth" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/40">
            Reprendre un projet
          </p>
          <h1 className="mb-3 text-4xl font-black text-white md:text-5xl">
            Connexion
          </h1>
          <p className="text-base text-slate-200/75">
            Retrouver vos images générées et continuez vos explorations créatives.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-8 shadow-[0_22px_50px_rgba(15,23,42,0.35)] backdrop-blur-3xl">
          <AuthForm mode="signin" />
        </div>
      </div>
    </main>
  )
}
