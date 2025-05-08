"use server"

export async function fetchApiData(endpoint: string) {
  try {
    // Validate the URL
    new URL(endpoint)

    const response = await fetch(endpoint)

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("URL")) {
      throw new Error("Invalid URL. Please enter a valid endpoint.")
    }
    throw error
  }
}
