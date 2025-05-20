'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import NowPlaying from './NowPlaying'
import { useIsMobile } from '../hooks/useIsMobile'

const navLinks = [
  { href: '/projects', label: 'Proyectos' },
  { href: '/about', label: 'Sobre mí' },
  { href: '/contact', label: 'Contacto' },
  { href: '/login', label: 'Acceso de administrador' },
]

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const currentPath = pathname.replace(/\/$/, '') || '/'
  const isMobile = useIsMobile()

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const viewer = localStorage.getItem('viewerAccess')

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUsername(payload.username)
      } catch {
        setUsername('Admin')
      }
      setIsLoggedIn(true)
    } else if (viewer) {
      setUsername('Viewer')
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
      setUsername(null)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('viewerAccess')
    setIsLoggedIn(false)
    setUsername(null)
    setMenuOpen(false)
    router.push('/')
  }

  return (
    <nav className={`w-full z-50 bg-white shadow-md overflow-x-hidden ${!isMobile ? 'fixed top-0 left-0' : ''}`}>
      <div className={`max-w-7xl mx-auto h-full px-4 ${isMobile ? 'flex flex-col items-start gap-2 py-3' : 'flex justify-between items-center'}`}>
        {/* TOP: HOME y VOLVER */}
        <div className="flex items-center gap-3">
          {currentPath !== '/' && (
            <button onClick={() => router.back()} className="text-sm text-black hover:text-[#C84153]">
              ← Volver
            </button>
          )}
          <a
            href="/"
            className={`font-black text-2xl tracking-tight ${
              currentPath === '/' ? 'text-[#C84153]' : 'hover:text-[#C84153]'
            }`}
          >
            HOME
          </a>
        </div>

        {/* MOBILE ONLY: Spotify */}
        {isMobile && (
          <div className="w-full mt-1">
            <NowPlaying />
          </div>
        )}

        {/* MOBILE ONLY: Hamburguesa y menú desplegable */}
        {isMobile && (
          <div className="relative w-full flex flex-col items-start mt-2">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center justify-center w-9 h-9 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute top-full left-0 mt-2 w-[90vw] max-w-xs bg-white border border-gray-200 shadow-xl z-[9999] p-4 space-y-3 animate-fade-in">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block text-sm text-gray-800 hover:text-[#C84153]"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                {isLoggedIn && (
                  <>
                    <hr className="my-2 border-gray-200" />
                    <p className="text-xs text-gray-500">Sesión: <strong>{username}</strong></p>
                    <button
                      onClick={handleLogout}
                      className="text-sm w-full text-red-600 border border-red-600 px-3 py-1 rounded-full hover:bg-red-600 hover:text-white transition"
                    >
                      Cerrar sesión
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* DESKTOP */}
        {!isMobile && (
          <>
            <div className="flex justify-center">
              <NowPlaying />
            </div>
            <div className="flex items-center gap-4">
              {isLoggedIn && (
                <span className="text-sm text-gray-600 italic">Bienvenido, <strong>{username}</strong></span>
              )}
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-sm ${
                    currentPath === link.href ? 'text-[#C84153] font-semibold' : 'hover:text-[#C84153]'
                  }`}
                >
                  {link.label}
                </a>
              ))}
              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 border border-red-600 px-3 py-1 rounded-full hover:bg-red-600 hover:text-white"
                >
                  Cerrar sesión
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </nav>
  )
}
