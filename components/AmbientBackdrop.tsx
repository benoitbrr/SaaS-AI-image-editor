interface AmbientBackdropProps {
  variant?: 'default' | 'auth'
}

export default function AmbientBackdrop({ variant = 'default' }: AmbientBackdropProps) {
  const sharedLayers = (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.14),transparent_60%)]" />
    </>
  )

  if (variant === 'auth') {
    return (
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {sharedLayers}
        <div className="absolute -left-32 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-gradient-to-br from-indigo-500/25 via-purple-500/20 to-transparent blur-[120px]" />
        <div className="absolute -right-28 -top-24 h-[320px] w-[320px] rounded-full bg-gradient-to-br from-sky-400/20 via-blue-500/25 to-transparent blur-[110px]" />
        <div className="absolute bottom-0 left-1/4 h-40 w-[480px] -translate-x-1/2 rounded-full bg-white/10 blur-[90px]" />
      </div>
    )
  }

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {sharedLayers}
      <div className="absolute -left-40 top-24 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-transparent blur-[140px]" />
      <div className="absolute -right-20 top-36 h-[440px] w-[440px] rounded-full bg-gradient-to-br from-sky-500/20 via-cyan-400/20 to-transparent blur-[130px]" />
      <div className="absolute left-1/2 bottom-10 h-[420px] w-[380px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-pink-500/25 via-rose-500/20 to-transparent blur-[150px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute inset-y-0 left-1/2 w-[1px] -translate-x-1/2 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
    </div>
  )
}
