"use server"

export async function fetchApiData(endpoint: string) {
  try {
    // Validate the URL
    new URL(endpoint)

    const response = await fetch(endpoint)
    const data = await response.json()
    
    // Convert headers to a plain object
    const headers: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })

    return {
      data,
      status: response.status,
      headers
    }
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("URL")) {
      throw new Error("Invalid URL. Please enter a valid endpoint.")
    }
    throw error
  }
}
