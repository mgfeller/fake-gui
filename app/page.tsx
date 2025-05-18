import { ApiExplorer } from "@/components/api-explorer"
import { LoginButton } from "@/components/login-button"
import { UserInfo } from "@/components/user-info"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Fake GUI - Platform Test App</h1>
        <LoginButton />
      </div>
      <div className="grid grid-cols-[1fr,500px] gap-6">
        <ApiExplorer />
        <div className="sticky top-6">
          <UserInfo />
        </div>
      </div>
    </main>
  )
}
