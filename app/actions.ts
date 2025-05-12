"use server"

export async function fetchApiData(endpoint: string, method: 'GET' | 'POST' = 'GET') {
  try {
    // Validate the URL
    new URL(endpoint)

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
    }, null, 2))

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
