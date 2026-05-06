import { NextRequest, NextResponse } from 'next/server'

export type Handler = (req: NextRequest) => Promise<NextResponse>

export type Route = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  handler: Handler
}
