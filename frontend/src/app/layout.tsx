import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { UserProvider } from '@/contexts/UserContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {//ICONE DA PÁGINA
  title: "CoinDigit",
  description: "Invista no seu Futuro!",
  icons: {
    icon: [
      {
        url: "/favicon.png",
        type: "image/png",
        sizes: "32x32",
      },
      {
        url: "/favicon.ico",
        type: "image/x-icon",
        sizes: "16x16",
      },
    ],
  },
};


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
