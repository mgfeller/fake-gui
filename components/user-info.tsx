"use client"

import { useEffect, useState } from "react"
import { JsonViewer } from "@/components/json-viewer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function UserInfo() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userInfo, setUserInfo] = useState<any>(null)

  useEffect(() => {
    const checkUserInfo = () => {
      const userInfoElement = document.querySelector('meta[name="user-info"]')
      const authStatusElement = document.querySelector('meta[name="auth-status"]')
      
      // Clear user info if not authenticated
      if (authStatusElement?.getAttribute('content') !== 'authenticated') {
        setUserInfo(null)
        return
      }

      if (userInfoElement) {
        try {
          const userInfoStr = userInfoElement.getAttribute('content')
          if (userInfoStr) {
            setUserInfo(JSON.parse(userInfoStr))
          }
        } catch (e) {
          console.error('Failed to parse user info:', e)
        }
      }
    }

    checkUserInfo()
    // Check user info every 5 seconds
    const interval = setInterval(checkUserInfo, 5000)
    return () => clearInterval(interval)
  }, [])

  if (!userInfo) {
    return null
  }

  return (
    <Card className="text-xs">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">User Info</CardTitle>
      </CardHeader>
      <CardContent>
        <JsonViewer data={userInfo} />
      </CardContent>
    </Card>
  )
} 