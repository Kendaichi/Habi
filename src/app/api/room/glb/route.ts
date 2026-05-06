import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')
  if (!url) {
    return new NextResponse('Missing url param', { status: 400 })
  }

  let upstream: Response
  try {
    upstream = await fetch(url, { cache: 'no-store' })
  } catch {
    return new NextResponse('Failed to fetch asset', { status: 502 })
  }

  if (!upstream.ok) {
    return new NextResponse('Upstream error', { status: upstream.status })
  }

  const body = await upstream.arrayBuffer()
  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'model/gltf-binary',
      'Access-Control-Allow-Origin': '*',
      // Cache aggressively — the signed URL is unique per job, so content never changes
      'Cache-Control': 'public, max-age=86400, immutable',
    },
  })
}
