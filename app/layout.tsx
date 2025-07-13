import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Habitly - Simple habits, lasting change',
  description: 'Track your daily habits with a simple visual grid. See your progress over time and build lasting change with Habitly.',
  keywords: 'habits, habit tracker, daily habits, progress tracking, habit building',
  openGraph: {
    title: 'Habitly - Simple habits, lasting change',
    description: 'Track your daily habits with a simple visual grid.',
    url: 'https://gethabitly.com',
    siteName: 'Habitly',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}