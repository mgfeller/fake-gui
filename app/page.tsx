import { ApiExplorer } from "@/components/api-explorer"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">REST API Explorer</h1>
      <ApiExplorer />
    </main>
  )
}
