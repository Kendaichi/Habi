'use client'

import { RefreshCcw } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import type { RoomStatusResponse } from '@/types/room'

interface RoomProcessingClientProps {
  roomId: string
}

function useElapsed() {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [])
  return elapsed
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

function stageFromPercent(pct: number | null | undefined): string {
  if (pct == null) return 'Analyzing room photo…'
  if (pct < 20) return 'Analyzing room geometry and free space…'
  if (pct < 45) return 'Matching artisan pieces to the room…'
  if (pct < 70) return 'Composing a colored room world…'
  if (pct < 90) return 'Finalizing placements and materials…'
  return 'Uploading the generated world asset…'
}

export function RoomProcessingClient({ roomId }: RoomProcessingClientProps) {
  const router = useRouter()
  const [status, setStatus] = useState<RoomStatusResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const stopPollingRef = useRef(false)
  const elapsed = useElapsed()

  const isHelperProvider = status?.generationProvider?.startsWith('3d-ai-studio')
  const isComposedWorld = status?.generationProvider === 'app-composed-world-v1'
  const isGeneratedWorld = isHelperProvider || isComposedWorld
  const pct = status?.progressPercent ?? null
  // Show at least 2% immediately so the bar isn't invisible at start
  const displayPct = pct != null ? Math.max(2, pct) : isGeneratedWorld ? 2 : null

  useEffect(() => {
    let isMounted = true
    let timeoutId: number | null = null
    stopPollingRef.current = false

    async function poll() {
      if (stopPollingRef.current) return

      let response: Response
      try {
        response = await fetch(`/api/room/generate?id=${roomId}`, { cache: 'no-store' })
      } catch {
        if (!isMounted) return
        stopPollingRef.current = true
        setError('We lost connection while checking your room generation.')
        return
      }

      if (!response.ok) {
        if (!isMounted) return
        stopPollingRef.current = true
        setError('We could not find this room generation.')
        return
      }

      const data = (await response.json()) as RoomStatusResponse
      if (!isMounted) return
      setStatus(data)

      if (data.status === 'COMPLETED') {
        stopPollingRef.current = true
        const target = data.redirectTo ?? '/buyer/room/result'
        router.replace(target)
        window.location.replace(target)
        return
      }

      if (data.status === 'FAILED') {
        stopPollingRef.current = true
        setError(data.errorMessage ?? 'This room generation failed.')
        return
      }

      timeoutId = window.setTimeout(() => void poll(), 4000)
    }

    void poll()
    return () => {
      isMounted = false
      stopPollingRef.current = true
      if (timeoutId) window.clearTimeout(timeoutId)
    }
  }, [roomId, router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(27,94,63,0.12),_transparent_35%),linear-gradient(180deg,_#faf6f0_0%,_#fffaf7_100%)] px-6 py-10">
      <div className="mx-auto w-full max-w-sm space-y-5">

        {/* Main card */}
        <div className="rounded-[36px] border border-white/70 bg-white/85 p-8 shadow-[0_28px_60px_rgba(27,94,63,0.12)] backdrop-blur-md">

          {/* Spinning ring */}
          <div className="relative mx-auto h-20 w-20">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#e8ede9" strokeWidth="6" />
              {displayPct != null && (
                <circle
                  cx="40" cy="40" r="34"
                  fill="none"
                  stroke="#1b5e3f"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  strokeDashoffset={`${2 * Math.PI * 34 * (1 - displayPct / 100)}`}
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
              )}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              {displayPct != null ? (
                <span className="text-forest text-base font-bold">{Math.round(pct ?? 0)}%</span>
              ) : (
                <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-forest border-t-transparent" />
              )}
            </div>
          </div>

          <h1 className="font-heading text-charcoal mt-5 text-center text-3xl font-semibold">
            {isHelperProvider
              ? 'Generating 3D room world'
              : isComposedWorld
                ? 'Composing room world'
                : 'Building preview room'}
          </h1>

          <p className="text-stone mt-2 text-center text-sm leading-relaxed">
            {status ? stageFromPercent(pct) : 'Starting…'}
          </p>

          {/* Progress bar */}
          {displayPct != null && (
            <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-forest/10">
              <div
                className="h-full rounded-full bg-forest transition-all duration-700"
                style={{ width: `${displayPct}%` }}
              />
            </div>
          )}

          {/* Elapsed time */}
          <p className="text-stone mt-3 text-center text-xs">
            {formatTime(elapsed)} elapsed
            {isGeneratedWorld && pct != null && pct > 0 && pct < 100 ? (
              <span>
                {' · '}est.{' '}
                {formatTime(Math.round((elapsed / pct) * (100 - pct)))} remaining
              </span>
            ) : null}
          </p>

          {/* Notice for non-AI rooms */}
          {status && !isGeneratedWorld ? (
            <p className="text-mustard mt-4 rounded-2xl border border-mustard/20 bg-mustard/8 px-4 py-2 text-center text-xs font-semibold">
              Upload a room photo for full AI 3D generation.
            </p>
          ) : null}

          {/* Error */}
          {error ? (
            <div className="mt-6 rounded-3xl border border-terracotta/20 bg-terracotta/8 p-4">
              <p className="text-terracotta text-sm font-semibold">{error}</p>
              <div className="mt-4 flex gap-3">
                <Link
                  href="/buyer/room/upload"
                  className="bg-terracotta text-cream rounded-xl px-4 py-3 text-sm font-semibold"
                >
                  Change Room
                </Link>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="text-forest inline-flex items-center gap-2 rounded-xl border border-forest/20 px-4 py-3 text-sm font-semibold"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Retry
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Context note */}
        {isGeneratedWorld && !error ? (
          <p className="text-stone text-center text-xs leading-relaxed">
            {isHelperProvider
              ? '3D AI Studio is generating the room world directly from your room photo.'
              : 'We are analyzing your photo, organizing products, and composing a generated room world.'}
            <br />This usually completes in under a minute, depending on provider queue time.
          </p>
        ) : null}
      </div>
    </div>
  )
}
