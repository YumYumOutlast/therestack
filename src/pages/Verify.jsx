import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { RANK_META } from '../lib/rankMeta'

export default function Verify() {
  const { credential_id } = useParams()
  const [cert, setCert] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('certifications')
      .select('*')
      .eq('credential_id', credential_id)
      .maybeSingle()
      .then(({ data }) => {
        setCert(data)
        setLoading(false)
      })
  }, [credential_id])

  const meta = cert ? (RANK_META[cert.rank] ?? null) : null

  return (
    <div style={{ backgroundColor: '#111118', minHeight: '100vh' }} className="flex flex-col items-center justify-center px-4 py-16">
      <Link to="/" className="text-teal-400 font-bold text-xl tracking-tight no-underline mb-12">
        The Restack
      </Link>

      {loading ? (
        <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      ) : !cert ? (
        <div className="text-center max-w-sm">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-white font-bold text-lg mb-2">Credential not found</p>
          <p className="text-zinc-400 text-sm">
            The credential ID <span className="text-white font-mono">{credential_id}</span> does not match any issued certificate.
          </p>
        </div>
      ) : (
        <div
          style={{ border: '1px solid #1a1a24', backgroundColor: '#0e0e14', maxWidth: 480 }}
          className="w-full rounded-2xl p-8"
        >
          {/* Verified badge */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-teal-400 text-xl">✓</span>
            <span className="text-teal-400 font-bold text-sm tracking-wide">Verified Credential</span>
          </div>

          {/* Rank */}
          {meta && (
            <div className="flex items-center gap-3 mb-5">
              <span
                className={`text-2xl font-bold ${meta.color}`}
              >
                {meta.icon}
              </span>
              <div>
                <p className={`font-bold text-lg ${meta.color}`}>{meta.label}</p>
                <p className="text-zinc-500 text-xs">The Restack Certified</p>
              </div>
            </div>
          )}

          {/* Member details */}
          <div className="space-y-3 mb-6">
            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-widest mb-0.5">Name</p>
              <p className="text-white font-bold text-lg">{cert.full_name}</p>
            </div>
            {cert.job_title && (
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-widest mb-0.5">Title</p>
                <p className="text-zinc-300 text-sm">{cert.job_title}{cert.company ? ` · ${cert.company}` : ''}</p>
              </div>
            )}
            {cert.state && (
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-widest mb-0.5">Location</p>
                <p className="text-zinc-300 text-sm">{cert.state}</p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-800 my-5" />

          {/* Credential details */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-zinc-500 text-xs">Credential ID</p>
              <p className="text-zinc-300 text-xs font-mono">{cert.credential_id}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-zinc-500 text-xs">Issued</p>
              <p className="text-zinc-300 text-xs">
                {new Date(cert.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          {cert.certificate_url && (
            <a
              href={cert.certificate_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-2 border border-teal-500/40 text-teal-400 font-bold text-sm px-4 py-2.5 rounded-lg hover:bg-teal-500/10 transition-colors no-underline"
            >
              ⬇ Download Certificate
            </a>
          )}
        </div>
      )}

      <p className="text-zinc-600 text-xs mt-8">
        Issued by{' '}
        <Link to="/" className="text-zinc-500 hover:text-zinc-400 no-underline">
          The Restack
        </Link>
      </p>
    </div>
  )
}
