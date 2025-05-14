import { handleCallback } from '@/app/actions'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  if (!code || !state) {
    return new Response('Missing code or state parameter', { status: 400 })
  }

  try {
    await handleCallback(code, state)
    return new Response(null, { status: 302, headers: { Location: '/' } })
  } catch (error) {
    console.error('Auth callback error:', error)
    return new Response('Authentication failed', { status: 500 })
  }
} 