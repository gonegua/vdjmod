'use client'

import { useEffect, type ReactNode } from 'react'

export default function SeasonProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const now = new Date()
    const month = now.getMonth()
    const day = now.getDate()

    const isChristmas = month === 11 || (month === 0 && day <= 6)

    const root = document.documentElement

    if (isChristmas) {
      root.classList.add('season')
    } else {
      root.classList.remove('season')
    }
  }, [])

  return <>{children}</>
}
