"use server"

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function fetchApiData(endpoint: string, method: 'GET' | 'POST' = 'GET') {
  try {
    // Validate the URL
    new URL(endpoint)

    const wrapLog = process.env.WRAP_LOG === '1'
    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    // Convert headers to a plain object
    const headers: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })

    // Try to parse JSON, but handle cases where there is no body
    let data
    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      try {
        data = await response.json()
      } catch (e) {
        data = { error: e instanceof Error ? e.message : 'Failed to parse JSON response' }
      }
    } else {
      data = null
    }

    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      request: {
        url: endpoint,
        method: method,
        headers: {
          'Content-Type': 'application/json'
        }
      },
      response: {
        status: response.status,
        headers: headers,
        body: data
      }
    }, null, wrapLog ? 2 : 0))

    return {
      data,
      status: response.status,
      headers
    }
  } catch (error) {
    console.error('[Error]', error)
    if (error instanceof TypeError && error.message.includes("URL")) {
      throw new Error("Invalid URL. Please enter a valid endpoint.")
    }
    throw error
  }
}

export async function initiateLogin() {
  function generateRandomString(length = 64) {
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('').slice(0, length)
  }
  const state = generateRandomString()
  const codeVerifier = generateRandomString()
  
  const cookieStore = await cookies()
  cookieStore.set('oauth_state', state, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
  cookieStore.set('code_verifier', codeVerifier, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })

  const params = new URLSearchParams({
    client_id: process.env.OIDC_CLIENT_ID!,
    response_type: 'code',
    scope: process.env.OIDC_SCOPES!,
    redirect_uri: process.env.OIDC_REDIRECT_URI!,
    state: state,
    code_challenge: codeVerifier,
    code_challenge_method: 'plain'
  })

  const configResponse = await fetch(process.env.OIDC_CONFIG_URL!)
  const config = await configResponse.json()
  const authorizationEndpoint = config.authorization_endpoint
  const authUrl = `${authorizationEndpoint}?${params.toString()}`
  console.log('[Auth] Redirecting to:', authUrl)
  redirect(authUrl)
}

export async function handleCallback(code: string, state: string) {
  console.log('[Auth] Handling callback with code:', code)
  const cookieStore = await cookies()
  const storedState = cookieStore.get('oauth_state')?.value
  const codeVerifier = cookieStore.get('code_verifier')?.value

  if (!storedState || !codeVerifier || state !== storedState) {
    throw new Error('Invalid state parameter')
  }

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: process.env.OIDC_CLIENT_ID!,
    client_secret: process.env.OIDC_CLIENT_SECRET!,
    scope: process.env.OIDC_CLIENT_ID!,
    code: code,
    redirect_uri: process.env.OIDC_REDIRECT_URI!,
    code_verifier: codeVerifier
  })
  console.log('[Auth] Params:', params.toString())

  const configResponse = await fetch(process.env.OIDC_CONFIG_URL!)
  const config = await configResponse.json()
  const tokenEndpoint = config.token_endpoint

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  })

  if (!response.ok) {
    throw new Error('Failed to exchange code for tokens')
  }

  const tokens = await response.json()
  
  cookieStore.set('access_token', tokens.access_token, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    maxAge: tokens.expires_in
  })
  
  if (tokens.refresh_token) {
    cookieStore.set('refresh_token', tokens.refresh_token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production'
    })
  }

  // Clear OAuth state cookies
  cookieStore.delete('oauth_state')
  cookieStore.delete('code_verifier')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('access_token')
  cookieStore.delete('refresh_token')
  redirect('/')
}
