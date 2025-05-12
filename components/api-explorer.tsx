"use client"

import type React from "react"

import { useState } from "react"
import { fetchApiData } from "@/app/actions"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { JsonViewer } from "@/components/json-viewer"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ApiExplorer() {
  const [baseUrl, setBaseUrl] = useState("http://localhost:8080")
  const [infoPath, setInfoPath] = useState("/info")
  const [healthcheckPath, setHealthcheckPath] = useState("/healthcheck")
  const [quotePath, setQuotePath] = useState("/quotes/rand")
  const [quotesPath, setQuotesPath] = useState("/quotes")
  const [unauthorizedPath, setUnauthorizedPath] = useState("/unauthorized")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null)
  const [status, setStatus] = useState<number | null>(null)
  const [headers, setHeaders] = useState<Record<string, string> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRequest = async (path: string, method: 'GET' | 'POST' = 'GET') => {
    setLoading(true)
    setError(null)
    setStatus(null)
    setHeaders(null)

    try {
      const fullUrl = new URL(path, baseUrl).toString()
      const result = await fetchApiData(fullUrl, method)
      setData(result.data)
      setStatus(result.status)
      setHeaders(result.headers)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data")
      setData(null)
      setStatus(null)
      setHeaders(null)
    } finally {
      setLoading(false)
    }
  }

  const handleInfoSubmit = async () => {
    await handleRequest(infoPath)
  }

  const handleHealthcheck = async () => {
    await handleRequest(healthcheckPath)
  }

  const handleUnauthorized = async () => {
    await handleRequest(unauthorizedPath)
  }

  const handleRandomQuote = async () => {
    await handleRequest(quotePath, 'POST')
  }

  const handleGetAllQuotes = async () => {
    await handleRequest(quotesPath)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 max-w-2xl">
        <div className="flex items-center gap-3">
          <label htmlFor="baseUrl" className="text-sm font-medium whitespace-nowrap w-36">
            Base URL:
          </label>
          <Input
            id="baseUrl"
            type="text"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="Enter base URL"
            className="w-1/2"
            required
          />
        </div>
        <div className="flex gap-3 items-center">
          <Button type="submit" onClick={handleInfoSubmit} disabled={loading} className="whitespace-nowrap w-36">
            {loading ? "Loading..." : "Info"}
          </Button>
          <Input
            type="text"
            value={infoPath}
            onChange={(e) => setInfoPath(e.target.value)}
            placeholder="Enter info endpoint path"
            className="w-1/2"
            required
          />
        </div>
        <div className="flex gap-3 items-center">
          <Button onClick={handleHealthcheck} disabled={loading} className="whitespace-nowrap w-36">
            {loading ? "Loading..." : "Healthcheck"}
          </Button>
          <Input
            type="text"
            value={healthcheckPath}
            onChange={(e) => setHealthcheckPath(e.target.value)}
            placeholder="Enter healthcheck endpoint path"
            className="w-1/2"
            required
          />
        </div>
        <div className="flex gap-3 items-center">
          <Button onClick={handleUnauthorized} disabled={loading} className="whitespace-nowrap w-36">
            {loading ? "Loading..." : "Unauthorized"}
          </Button>
          <Input
            type="text"
            value={unauthorizedPath}
            onChange={(e) => setUnauthorizedPath(e.target.value)}
            placeholder="Enter unauthorized endpoint path"
            className="w-1/2"
            required
          />
        </div>
        <div className="flex gap-3 items-center">
          <Button onClick={handleRandomQuote} disabled={loading} className="whitespace-nowrap w-36">
            {loading ? "Loading..." : "Add random quote"}
          </Button>
          <Input
            type="text"
            value={quotePath}
            onChange={(e) => setQuotePath(e.target.value)}
            placeholder="Enter quote endpoint path"
            className="w-1/2"
            required
          />
        </div>
        <div className="flex gap-3 items-center">
          <Button onClick={handleGetAllQuotes} disabled={loading} className="whitespace-nowrap w-36">
            {loading ? "Loading..." : "Get all quotes"}
          </Button>
          <Input
            type="text"
            value={quotesPath}
            onChange={(e) => setQuotesPath(e.target.value)}
            placeholder="Enter quotes endpoint path"
            className="w-1/2"
            required
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {status !== null && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          <span className={`text-sm ${status >= 200 && status < 300 ? 'text-green-600' : 'text-red-600'}`}>
            {status}
          </span>
        </div>
      )}

      {headers && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Response Headers:</h3>
          <div className="bg-muted/50 rounded-md p-4 text-sm">
            {Object.entries(headers).map(([key, value]) => (
              <div key={key} className="flex gap-2">
                <span className="font-medium text-muted-foreground">{key}:</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data && <JsonViewer data={data} />}
    </div>
  )
}
