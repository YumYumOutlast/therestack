import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav style={{ backgroundColor: '#111118', borderBottom: '1px solid #1a1a24' }} className="sticky top-0 z-50 px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-white font-bold text-xl tracking-tight no-underline">
          The Restack
        </Link>
        <div className="flex items-center gap-6">
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
          <Link to="/profile" className="text-sm text-gray-400 hover:text-white transition-colors no-underline hidden sm:block">
            Profile
          </Link>
          <a
            href="https://getfluxe.gumroad.com/l/FlowState"
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: '#00D4AA', color: '#111118' }}
            className="text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity no-underline"
          >
            Start Free
          </a>
        </div>
      </div>
    </nav>
  )
}
