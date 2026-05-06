import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getThreeDAIJobResult, getThreeDAIJobStatus, hasThreeDAIService } from '@/lib/threedai-client'

export const dynamic = 'force-dynamic'

async function probeRoom(externalJobId: string | null) {
  if (!externalJobId || !hasThreeDAIService()) return null
  try {
    const [status, result] = await Promise.all([
      getThreeDAIJobStatus(externalJobId),
      getThreeDAIJobResult(externalJobId),
    ])
    return { status, result }
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) }
  }
}

export default async function RoomDebugPage() {
  const rooms = await prisma.room.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: { scan: true },
  })

  const probes = await Promise.all(
    rooms.map((r) =>
      r.generationProvider?.startsWith('3d-ai-studio') ? probeRoom(r.externalJobId) : Promise.resolve(null),
    ),
  )

  return (
    <div className="min-h-screen bg-[#faf6f0] px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-charcoal text-3xl font-semibold">Room Generation Debug</h1>
          <Link href="/buyer/room/result" className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-charcoal">
            ← Result
          </Link>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-4 text-sm">
          <p className="font-semibold text-charcoal">3D AI Studio</p>
          <p className={`mt-1 ${hasThreeDAIService() ? 'text-green-700' : 'text-red-600'}`}>
            API key: {hasThreeDAIService() ? '✓ configured' : '✗ missing'}
          </p>
        </div>

        {rooms.map((room, i) => {
          const probe = probes[i]
          const is3DAI = room.generationProvider?.startsWith('3d-ai-studio')

          return (
            <div key={room.id} className="overflow-hidden rounded-[20px] border border-stone-200 bg-white shadow-sm">
              <div className={`flex items-center justify-between px-5 py-3 ${
                room.worldAssetUrl ? 'bg-green-50' : is3DAI ? 'bg-amber-50' : 'bg-stone-50'
              }`}>
                <div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                    room.generationStatus === 'COMPLETED'
                      ? room.worldAssetUrl ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      : room.generationStatus === 'FAILED'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {room.generationStatus}
                  </span>
                  <span className="ml-2 text-[11px] text-stone-500">{room.id.slice(0, 28)}…</span>
                </div>
                <Link
                  href={`/buyer/room/world/${room.id}`}
                  className="rounded-lg bg-charcoal px-3 py-1.5 text-[11px] font-semibold text-white"
                >
                  Open world →
                </Link>
              </div>

              <div className="space-y-2 px-5 py-4 text-xs">
                <Row label="Provider" value={room.generationProvider ?? '—'} />
                <Row label="External job ID" value={room.externalJobId ?? '—'} />
                <Row label="Provider status" value={room.providerStatus ?? '—'} />
                <Row
                  label="worldAssetUrl"
                  value={room.worldAssetUrl ?? 'null'}
                  highlight={!room.worldAssetUrl && is3DAI ? 'missing' : undefined}
                />
                {room.providerError ? (
                  <Row label="Provider error" value={room.providerError} highlight="error" />
                ) : null}

                {probe && 'error' in probe ? (
                  <Row label="Live probe error" value={probe.error ?? 'unknown'} highlight="error" />
                ) : null}

                {probe && 'status' in probe && probe.status ? (
                  <>
                    <div className="mt-2 border-t border-stone-100 pt-2 font-semibold text-charcoal">Live API status</div>
                    <Row label="status" value={probe.status.status} />
                    {probe.status.progress != null ? (
                      <Row label="progress" value={`${probe.status.progress}%`} />
                    ) : null}
                  </>
                ) : null}

                {probe && 'result' in probe && probe.result ? (
                  <>
                    <div className="mt-2 border-t border-stone-100 pt-2 font-semibold text-charcoal">Live API result</div>
                    <Row
                      label="worldAssetUrl"
                      value={probe.result.worldAssetUrl ?? 'null'}
                      highlight={probe.result.worldAssetUrl ? 'ok' : 'missing'}
                    />
                    <Row label="previewImageUrl" value={probe.result.previewImageUrl ?? 'null'} />
                  </>
                ) : null}

                {room.providerPayload ? (
                  <>
                    <div className="mt-2 border-t border-stone-100 pt-2 font-semibold text-charcoal">Stored provider payload</div>
                    <pre className="mt-1 overflow-x-auto rounded-lg bg-stone-50 p-3 text-[10px] leading-relaxed text-stone-600">
                      {JSON.stringify(room.providerPayload, null, 2)}
                    </pre>
                  </>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: 'ok' | 'missing' | 'error'
}) {
  const color =
    highlight === 'ok'
      ? 'text-green-700'
      : highlight === 'missing'
      ? 'text-amber-700 font-semibold'
      : highlight === 'error'
      ? 'text-red-600'
      : 'text-stone-600'

  return (
    <div className="flex gap-3">
      <span className="w-36 shrink-0 font-medium text-stone-400">{label}</span>
      <span className={`break-all ${color}`}>{value}</span>
    </div>
  )
}
