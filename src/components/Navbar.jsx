import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const close = () => setMenuOpen(false)

  return (
    <nav style={{ backgroundColor: '#111118', borderBottom: '1px solid #1a1a24' }} className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" onClick={close} className="text-white font-bold text-xl tracking-tight no-underline">
            The Restack
          </Link>
          <div className="flex items-center gap-6">
            {/* Desktop links — hidden below sm */}
            <Link to="/free" className="text-sm text-gray-400 hover:text-white transition-colors no-underline hidden sm:block">
              Free
            </Link>
            <Link to="/starter" className="text-sm text-gray-400 hover:text-white transition-colors no-underline hidden sm:block">
              Starter
            </Link>
            <Link to="/playbook" className="text-sm text-gray-400 hover:text-white transition-colors no-underline hidden sm:block">
              Playbook
            </Link>
            <Link to="/operator" className="text-sm text-gray-400 hover:text-white transition-colors no-underline hidden sm:block">
              Operator
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="text-sm text-gray-400 hover:text-white transition-colors no-underline hidden sm:block">
                  Profile
                </Link>
                <button
                  onClick={signOut}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                  className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors no-underline hidden sm:block">
                Sign in
              </Link>
            )}
            {user ? (
              <Link
                to="/profile"
                style={{ backgroundColor: '#00D4AA', color: '#111118' }}
                className="text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity no-underline hidden sm:block"
              >
                Dashboard
              </Link>
            ) : (
              <a
                href="https://getfluxe.gumroad.com/l/FlowState"
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: '#00D4AA', color: '#111118' }}
                className="text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity no-underline hidden sm:block"
              >
                Start Free
              </a>
            )}

            {/* Hamburger — visible below sm only */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="sm:hidden flex flex-col justify-center items-center gap-1.5 w-8 h-8"
              aria-label="Toggle menu"
            >
              <span className="block w-6 h-0.5 bg-gray-400" />
              <span className="block w-6 h-0.5 bg-gray-400" />
              <span className="block w-6 h-0.5 bg-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{ backgroundColor: '#111118', borderBottom: '1px solid #1a1a24' }} className="sm:hidden px-6 pb-5 flex flex-col gap-4">
          <Link to="/free" onClick={close} className="text-sm text-gray-400 hover:text-white transition-colors no-underline">
            Free
          </Link>
          <Link to="/starter" onClick={close} className="text-sm text-gray-400 hover:text-white transition-colors no-underline">
            Starter
          </Link>
          <Link to="/playbook" onClick={close} className="text-sm text-gray-400 hover:text-white transition-colors no-underline">
            Playbook
          </Link>
          <Link to="/operator" onClick={close} className="text-sm text-gray-400 hover:text-white transition-colors no-underline">
            Operator
          </Link>
          {user ? (
            <>
              <Link
                to="/profile"
                onClick={close}
                style={{ backgroundColor: '#00D4AA', color: '#111118' }}
                className="text-sm font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity no-underline text-center"
              >
                Dashboard
              </Link>
              <button
                onClick={() => { close(); signOut() }}
                style={{ background: 'none', border: '1px solid #3f3f46', borderRadius: '0.5rem', cursor: 'pointer', padding: '0.625rem 1rem' }}
                className="text-sm text-gray-400 hover:text-white transition-colors text-center"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={close}
                className="text-sm text-gray-400 hover:text-white transition-colors no-underline"
              >
                Sign in
              </Link>
              <a
                href="https://getfluxe.gumroad.com/l/FlowState"
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                style={{ backgroundColor: '#00D4AA', color: '#111118' }}
                className="text-sm font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity no-underline text-center"
              >
                Start Free
              </a>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
