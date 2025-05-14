import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { headers } from 'next/headers'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Fake GUI - Platform Test App',
  description: 'A test application for platform features',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = headers()
  const authStatus = headersList.get('x-auth-status') || 'unauthenticated'

  return (
    <html lang="en">
      <head>
        <meta name="auth-status" content={authStatus} />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
