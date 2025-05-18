"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { initiateLogin, logout } from "@/app/actions"
import { LogIn, LogOut } from "lucide-react"

export function LoginButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuthStatus = () => {
      const authStatus = document.querySelector('meta[name="auth-status"]')?.getAttribute('content')
      setIsAuthenticated(authStatus === 'authenticated')
    }

    checkAuthStatus()
    // Check auth status every 5 seconds
    const interval = setInterval(checkAuthStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      await initiateLogin()
    } catch (error) {
      console.error('Login failed:', error)
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={isAuthenticated ? handleLogout : handleLogin}
      disabled={isLoading}
      variant="outline"
      className="flex items-center gap-2"
    >
      {isAuthenticated ? (
        <>
          <LogOut className="h-4 w-4" />
          Logout
        </>
      ) : (
        <>
          <LogIn className="h-4 w-4" />
          Login
        </>
      )}
    </Button>
  )
} 