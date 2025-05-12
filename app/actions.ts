"use server"

export async function fetchApiData(endpoint: string, method: 'GET' | 'POST' = 'GET') {
  try {
    // Validate the URL
    new URL(endpoint)

    console.log(`\n[Request] ${method} ${endpoint}`)
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

    console.log(`[Response] Status: ${response.status}`)
    console.log('[Response] Headers:', headers)
    console.log('[Response] Body:', data)
    console.log('---')

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
