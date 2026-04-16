import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { RANK_META, RANK_ORDER } from '../lib/rankMeta'

// Soft-gate: this password is in the client bundle — acceptable since the registry
// shows professional info only (no payment data). Do not display anything truly sensitive.
const REGISTRY_PASSWORD = import.meta.env.VITE_REGISTRY_PASSWORD ?? ''

function exportCSV(rows) {
  const headers = ['Credential ID', 'Name', 'Rank', 'Email', 'Job Title', 'Department', 'Company', 'State', 'Issued']
  const data = rows.map((c) => [
    c.credential_id,
    c.full_name,
    RANK_META[c.rank]?.label ?? c.rank,
    c.email ?? '',
    c.job_title ?? '',
    c.department ?? '',
    c.company ?? '',
    c.state ?? '',
    new Date(c.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  ])
  const csv = [headers, ...data]
    .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `restack-registry-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function Registry() {
  const [authed, setAuthed] = useState(REGISTRY_PASSWORD === '')
  const [input, setInput] = useState('')
  const [authError, setAuthError] = useState(false)

  const [certs, setCerts] = useState([])
  const [loading, setLoading] = useState(false)

  const [rankFilter, setRankFilter] = useState('')
  const [stateFilter, setStateFilter] = useState('')

  function handleAuth(e) {
    e.preventDefault()
    if (input === REGISTRY_PASSWORD) {
      setAuthed(true)
      setAuthError(false)
    } else {
      setAuthError(true)
    }
  }

  useEffect(() => {
    if (!authed) return
    setLoading(true)
    supabase
      .from('certifications')
      .select('*')
      .order('issued_at', { ascending: false })
      .then(({ data }) => {
        setCerts(data ?? [])
        setLoading(false)
      })
  }, [authed])

  const filtered = certs.filter((c) => {
    if (rankFilter && c.rank !== rankFilter) return false
    if (stateFilter && !(c.state ?? '').toLowerCase().includes(stateFilter.toLowerCase())) return false
    return true
  })

  if (!authed) {
    return (
      <div style={{ backgroundColor: '#111118', minHeight: '100vh' }} className="flex items-center justify-center px-4">
        <div style={{ border: '1px solid #1a1a24', backgroundColor: '#0e0e14' }} className="w-full max-w-sm rounded-2xl p-8">
          <Link to="/" className="text-teal-400 font-bold text-lg no-underline block mb-1">The Restack</Link>
          <h1 className="text-white text-2xl font-bold mb-2">Registry</h1>
          <p className="text-zinc-400 text-sm mb-8">Enter the registry password to continue.</p>
          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Password"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-teal-500 transition-colors text-sm"
            />
            {authError && <p className="text-red-400 text-xs">Incorrect password.</p>}
            <button
              type="submit"
              style={{ backgroundColor: '#00D4AA', color: '#111118' }}
              className="w-full font-bold py-3 rounded-lg hover:opacity-90 transition-opacity text-sm"
            >
              Enter →
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#111118', minHeight: '100vh' }} className="text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div>
            <Link to="/" className="text-teal-400 font-bold text-lg no-underline block mb-1">The Restack</Link>
            <h1 className="text-3xl font-bold text-white mb-1">Operator Registry</h1>
            <p className="text-zinc-400 text-sm">
              {loading ? '—' : `${filtered.length} certified member${filtered.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <button
            onClick={() => exportCSV(filtered)}
            disabled={filtered.length === 0}
            className="text-teal-400 text-sm font-bold border border-teal-500/40 px-4 py-2 rounded-lg hover:bg-teal-500/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ⬇ Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <select
            value={rankFilter}
            onChange={(e) => setRankFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors"
          >
            <option value="">All ranks</option>
            {RANK_ORDER.filter((r) => r !== 'recruit').map((r) => (
              <option key={r} value={r}>{RANK_META[r]?.label ?? r}</option>
            ))}
          </select>
          <input
            type="text"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            placeholder="Filter by state…"
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-teal-500 transition-colors"
          />
          {(rankFilter || stateFilter) && (
            <button
              onClick={() => { setRankFilter(''); setStateFilter('') }}
              className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors px-2"
            >
              Clear
            </button>
          )}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">No certified members yet{rankFilter || stateFilter ? ' matching these filters' : ''}.</div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid #27272a' }} className="bg-zinc-900">
                  {['Credential ID', 'Name', 'Rank', 'Email', 'Job Title', 'Dept', 'Company', 'State', 'Issued'].map((h) => (
                    <th key={h} className="text-left text-zinc-500 text-xs font-semibold uppercase tracking-wide px-4 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => {
                  const meta = RANK_META[c.rank]
                  return (
                    <tr
                      key={c.id}
                      style={{ borderBottom: i < filtered.length - 1 ? '1px solid #18181b' : 'none' }}
                      className="hover:bg-zinc-900/60 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-zinc-300 whitespace-nowrap">
                        <Link to={`/verify/${c.credential_id}`} className="text-teal-400 hover:text-teal-300 no-underline">
                          {c.credential_id}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-white font-semibold whitespace-nowrap">{c.full_name}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {meta ? (
                          <span className={`text-xs font-semibold ${meta.color}`}>
                            {meta.icon} {meta.label}
                          </span>
                        ) : c.rank}
                      </td>
                      <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{c.email ?? '—'}</td>
                      <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{c.job_title ?? '—'}</td>
                      <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{c.department ?? '—'}</td>
                      <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{c.company ?? '—'}</td>
                      <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{c.state ?? '—'}</td>
                      <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">
                        {new Date(c.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
