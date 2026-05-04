import { useState, useRef, useEffect } from 'react'

interface User {
  name: string
  email: string
  avatar: string
}

// Mock user — in a real app this would come from auth context
const MOCK_USER: User = {
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'JD',
}

const TopBar = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteSent, setInviteSent] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const userMenuRef = useRef<HTMLDivElement>(null)
  const inviteRef = useRef<HTMLDivElement>(null)

  // Close menus on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
      if (inviteRef.current && !inviteRef.current.contains(e.target as Node)) {
        setInviteOpen(false)
        setInviteSent(false)
        setInviteEmail('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleInvite = () => {
    if (!inviteEmail.trim()) return
    // Store invited emails in localStorage
    const key = 'authoring-invited-members'
    const existing = JSON.parse(localStorage.getItem(key) ?? '[]')
    if (!existing.includes(inviteEmail.trim())) {
      localStorage.setItem(key, JSON.stringify([...existing, inviteEmail.trim()]))
    }
    setInviteSent(true)
    setInviteEmail('')
  }

  const handleThemeToggle = () => {
    setTheme(p => p === 'light' ? 'dark' : 'light')
    // In a real app — apply theme to document root
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 h-12 flex-shrink-0">

      {/* Left — App name / breadcrumb */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <span className="text-sm font-semibold text-gray-800">Authoring</span>
        <span className="text-gray-300 text-sm">/</span>
        <span className="text-sm text-gray-500">My Course</span>
      </div>

      {/* Right — Invite + User menu */}
      <div className="flex items-center gap-2">

        {/* Invite button */}
        <div className="relative" ref={inviteRef}>
          <button
            onClick={() => setInviteOpen(p => !p)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Invite
          </button>

          {/* Invite dropdown */}
          {inviteOpen && (
            <div className="absolute right-0 top-10 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-4 w-auto">
              <p className="text-sm font-semibold text-gray-800 mb-1">
                Invite collaborators
              </p>
              <p className="text-xs text-gray-400 mb-3">
                Invite team members to view and edit this course
              </p>

              {inviteSent ? (
                <div className="flex flex-col items-center py-4 gap-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-700">Invite sent!</p>
                  <button
                    onClick={() => setInviteSent(false)}
                    className="text-xs text-blue-500 hover:underline"
                  >
                    Invite another
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <input
                      autoFocus
                      type="email"
                      value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleInvite()}
                      placeholder="colleague@example.com"
                      className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                    />
                    <button
                      onClick={handleInvite}
                      disabled={!inviteEmail.trim()}
                      className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Send
                    </button>
                  </div>

                  {/* Already invited list */}
                  <InvitedList />
                </>
              )}
            </div>
          )}
        </div>

        {/* User avatar + menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(p => !p)}
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {/* Avatar */}
            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold">
              {MOCK_USER.avatar}
            </div>
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* User dropdown */}
          {userMenuOpen && (
            <div className="absolute right-0 top-10 z-50 bg-white border border-gray-200 rounded-xl shadow-xl w-56 overflow-hidden">

              {/* User info */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                    {MOCK_USER.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{MOCK_USER.name}</p>
                    <p className="text-xs text-gray-400 truncate">{MOCK_USER.email}</p>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="p-1.5">
                <MenuButton
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                  label="Edit Profile"
                  onClick={() => setUserMenuOpen(false)}
                />

                <MenuButton
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  }
                  label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
                  onClick={() => { handleThemeToggle(); setUserMenuOpen(false) }}
                  rightEl={
                    <div className={`w-8 h-4 rounded-full transition-colors ${theme === 'dark' ? 'bg-blue-500' : 'bg-gray-200'}`}>
                      <div className={`w-3 h-3 rounded-full bg-white shadow mt-0.5 transition-transform ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </div>
                  }
                />

                <MenuButton
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  }
                  label="Settings"
                  onClick={() => setUserMenuOpen(false)}
                />

                <div className="h-px bg-gray-100 my-1" />

                <MenuButton
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  }
                  label="Logout"
                  onClick={() => setUserMenuOpen(false)}
                  danger
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Small helper components ──────────────────────────────────

interface MenuButtonProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  danger?: boolean
  rightEl?: React.ReactNode
}

const MenuButton = ({ icon, label, onClick, danger, rightEl }: MenuButtonProps) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left
      ${danger
        ? 'text-red-500 hover:bg-red-50'
        : 'text-gray-600 hover:bg-gray-50'}
    `}
  >
    {icon}
    <span className="flex-1">{label}</span>
    {rightEl}
  </button>
)

const InvitedList = () => {
  const members: string[] = JSON.parse(
    localStorage.getItem('authoring-invited-members') ?? '[]'
  )
  if (members.length === 0) return null

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <p className="text-xs text-gray-400 mb-2">Already invited</p>
      <div className="flex flex-col gap-1.5">
        {members.map(email => (
          <div key={email} className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-medium flex-shrink-0">
              {email[0].toUpperCase()}
            </div>
            <span className="text-xs text-gray-600 truncate">{email}</span>
            <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
              Pending
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopBar