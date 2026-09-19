'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type ParticipantTheme = 'light' | 'dark'

type ThemeContextValue = {
  theme: ParticipantTheme
  setTheme: (theme: ParticipantTheme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ParticipantThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ParticipantTheme>('light')

  useEffect(() => {
    const saved = window.localStorage.getItem('tour-de-rotary-theme')
    if (saved === 'dark' || saved === 'light') setThemeState(saved)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.participantTheme = theme
    window.localStorage.setItem('tour-de-rotary-theme', theme)
  }, [theme])

  const setTheme = (next: ParticipantTheme) => setThemeState(next)
  const toggleTheme = () => setThemeState(current => current === 'light' ? 'dark' : 'light')

  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useParticipantTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useParticipantTheme must be used within a ParticipantThemeProvider')
  return context
}
