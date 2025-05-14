import { ApiExplorer } from "@/components/api-explorer"
import { LoginButton } from "@/components/login-button"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Fake GUI - Platform Test App</h1>
        <LoginButton />
      </div>
      <ApiExplorer />
    </main>
  )
}
