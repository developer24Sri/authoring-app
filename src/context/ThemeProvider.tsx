import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { ThemeContext } from './ThemeContext'

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('authoring-theme')
        if (saved === 'dark') return true
        if (saved === 'light') return false
        // First visit — match system
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    })

    useEffect(() => {
        const root = document.documentElement
        if (isDark) {
            root.classList.add('dark')
            localStorage.setItem('authoring-theme', 'dark')
        } else {
            root.classList.remove('dark')
            localStorage.setItem('authoring-theme', 'light')
        }
    }, [isDark])

    const toggleTheme = () => setIsDark(p => !p)

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}
