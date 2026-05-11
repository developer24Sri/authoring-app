import { useState, useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'
import { ThemeContext } from './ThemeContext'
import type { Theme } from './ThemeContext'

const THEME_KEY = 'authoring-theme'

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(THEME_KEY)
    // Only trust explicit user choice — default is light
    return saved === 'dark' ? 'dark' : 'light'
  })

  useEffect(() => {
    // Using data-theme attribute on <html>
    // This matches [data-theme="dark"] in our CSS variables
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const toggleTheme = () =>
    setTheme(p => p === 'light' ? 'dark' : 'light')

  const value = useMemo(() => ({ theme, toggleTheme }), [theme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}