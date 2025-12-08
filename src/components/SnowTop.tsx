// src/components/SnowTop.tsx
'use client'

import { useEffect, useState } from 'react'

type SnowPhase = 'on' | 'off'
type SnowBucket = 'short' | 'medium' | 'long'

interface SnowState {
  onPattern: SnowBucket[] // 10 buckets para nieve
  offPattern: SnowBucket[] // 10 buckets para pausas
  onIndex: number // 0..9
  offIndex: number // 0..9
  phase: SnowPhase // 'on' (nevando) o 'off' (pausa)
  lastChange: number // timestamp ms
  durationMs: number // duración fase actual
}

function isChristmasSeason() {
  const now = new Date()
  const month = now.getMonth() // 0 = enero, 11 = diciembre
  const day = now.getDate()
  return month === 11 || (month === 0 && day <= 6)
}

// min/max en minutos -> ms
function randomMsRange(minMinutes: number, maxMinutes: number) {
  const min = minMinutes * 60 * 1000
  const max = maxMinutes * 60 * 1000
  return min + Math.random() * (max - min)
}

// Crear patrón de 10 buckets con proporción:
// short: 5, medium: 3, long: 2
function createPattern(): SnowBucket[] {
  const arr: SnowBucket[] = []
  for (let i = 0; i < 5; i++) arr.push('short')
  for (let i = 0; i < 3; i++) arr.push('medium')
  for (let i = 0; i < 2; i++) arr.push('long')

  // Fisher–Yates shuffle
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// Duración de fase CON nieve según bucket
function bucketOnDuration(bucket: SnowBucket): number {
  switch (bucket) {
    case 'short':
      // 5–10 minutos
      return randomMsRange(5, 10)
    case 'medium':
      // 30 min – 3 horas
      return randomMsRange(30, 180)
    case 'long':
      // 5–12 horas
      return randomMsRange(300, 720)
  }
}

// Duración de fase SIN nieve según bucket
// (short/medium/long también, pero más moderado)
function bucketOffDuration(bucket: SnowBucket): number {
  switch (bucket) {
    case 'short':
      // 5–15 minutos
      return randomMsRange(5, 15)
    case 'medium':
      // 20 min – 1 hora
      return randomMsRange(20, 60)
    case 'long':
      // 1–3 horas
      return randomMsRange(60, 180)
  }
}

function createInitialState(now: number): SnowState {
  const onPattern = createPattern()
  const offPattern = createPattern()
  const firstBucket = onPattern[0]

  return {
    onPattern,
    offPattern,
    onIndex: 0,
    offIndex: 0,
    phase: 'on',
    lastChange: now,
    durationMs: bucketOnDuration(firstBucket),
  }
}

function loadState(now: number): SnowState {
  try {
    const entry = document.cookie
      .split('; ')
      .find((row) => row.startsWith('snow_state='))

    if (!entry) return createInitialState(now)

    const raw = decodeURIComponent(entry.split('=')[1])
    const parsed = JSON.parse(raw) as SnowState

    if (
      !parsed ||
      !Array.isArray(parsed.onPattern) ||
      parsed.onPattern.length !== 10 ||
      !Array.isArray(parsed.offPattern) ||
      parsed.offPattern.length !== 10
    ) {
      return createInitialState(now)
    }

    return parsed
  } catch {
    return createInitialState(now)
  }
}

function saveState(state: SnowState) {
  const value = encodeURIComponent(JSON.stringify(state))
  document.cookie = `snow_state=${value}; path=/; max-age=31536000; SameSite=Lax`
}

// Avanza estado tantas fases como sea necesario dada la hora actual
function advanceState(state: SnowState, now: number): SnowState {
  let s: SnowState = { ...state }

  // Asegurar patrones válidos
  if (!s.onPattern || s.onPattern.length !== 10) {
    s.onPattern = createPattern()
    s.onIndex = 0
  }
  if (!s.offPattern || s.offPattern.length !== 10) {
    s.offPattern = createPattern()
    s.offIndex = 0
  }

  while (now - s.lastChange >= s.durationMs) {
    s.lastChange += s.durationMs

    if (s.phase === 'on') {
      // de nieve -> pausa, usando offPattern[offIndex]
      const bucket = s.offPattern[s.offIndex]
      s.phase = 'off'
      s.durationMs = bucketOffDuration(bucket)

      // siguiente índice OFF
      if (s.offIndex >= s.offPattern.length - 1) {
        s.offPattern = createPattern()
        s.offIndex = 0
      } else {
        s.offIndex += 1
      }
    } else {
      // de pausa -> nieve, usando onPattern[onIndex]
      if (s.onIndex >= s.onPattern.length - 1) {
        s.onPattern = createPattern()
        s.onIndex = 0
      } else {
        s.onIndex += 1
      }
      const bucket = s.onPattern[s.onIndex]
      s.phase = 'on'
      s.durationMs = bucketOnDuration(bucket)
    }
  }

  return s
}

export default function SnowTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!isChristmasSeason()) {
      setVisible(false)
      document.documentElement.classList.remove('snow-active')
      return
    }

    let timeoutId: number | undefined

    const now = Date.now()
    let state = advanceState(loadState(now), now)
    setVisible(state.phase === 'on')
    saveState(state)

    const scheduleNext = (currentState: SnowState) => {
      const now2 = Date.now()
      const remaining = currentState.lastChange + currentState.durationMs - now2

      const delay = Math.max(1000, remaining) // mínimo 1s

      timeoutId = window.setTimeout(() => {
        const now3 = Date.now()
        state = advanceState(currentState, now3)
        setVisible(state.phase === 'on')
        saveState(state)
        scheduleNext(state)
      }, delay)
    }

    scheduleNext(state)

    return () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  // Activar/desactivar clase global para el logo cuando NIEVA
  useEffect(() => {
    const root = document.documentElement
    if (visible) {
      root.classList.add('snow-active')
    } else {
      root.classList.remove('snow-active')
    }
  }, [visible])

  if (!visible) return null

  const flakes = Array.from({ length: 20 })

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-40 h-24 overflow-hidden">
      {flakes.map((_, i) => (
        <div
          key={i}
          className="snowflake"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${9 + Math.random() * 11}s`,
            fontSize: `${8 + Math.random() * 10}px`,
          }}
        >
          ❆
        </div>
      ))}
    </div>
  )
}
