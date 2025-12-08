// src/app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import SupabaseProvider from '@/components/SupabaseProvider'
import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import { AuthProvider } from '@/contexts/authContext'
import { ThemeProvider } from '@/components/ThemeProvider'
import Footer from '@/components/Footer'
import CookieBanner from '@/components/CookieBanner'

// ⬇️ NUEVOS IMPORTS PARA MODO TEMPORADA
import SeasonProvider from '@/components/SeasonProvider'
import SnowTop from '@/components/SnowTop'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AA',
  description: 'Descarga y comparte videojuegos indie y clásicos',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          {/* 👇 Aquí envolvemos TODO con SeasonProvider */}
          <SeasonProvider>
            <SupabaseProvider initialSession={session}>
              <AuthProvider initialUser={session?.user ?? null}>
                <Navbar />

                {/* ❄️ Nieve sutil en la parte superior */}
                <SnowTop />

                <main className="mx-auto max-w-6xl p-4">{children}</main>

                {/* 🔽 Banner de cookies */}
                <CookieBanner />

                <Footer />
              </AuthProvider>
            </SupabaseProvider>
          </SeasonProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
