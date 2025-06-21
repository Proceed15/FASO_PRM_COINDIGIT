import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { UserProvider } from '@/contexts/UserContext'
// Idioma: pt-br
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Coin Digital',
  description: 'by AMS-ADS 5 JRLSF FESR ADPM ISAA LGRF',
  icons: {
    icon: '/favicon.ico', // Isso é o que adiciona o ícone na aba
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  )
}
