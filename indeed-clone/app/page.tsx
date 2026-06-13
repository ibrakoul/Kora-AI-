'use client'

import { useState, useCallback, useRef } from 'react'
import {
  Search, MapPin, Briefcase, Clock, X, Sparkles,
  Bookmark, Users, Globe, ChevronDown, ChevronUp,
  TrendingUp, Zap, Filter, ArrowUpRight, CheckCircle2,
  Star, Coffee, Award, Send, Shield
} from 'lucide-react'
import { JOBS, type Job, type ContractType, type WorkMode, type ExpLevel } from './data/jobs'

function fmt(n: number) {
  return `${(n / 1000).toFixed(0)}k€`
}

function markdownToJsx(text: string) {
  const lines = text.split('\n')
  return lines.map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**') && line.indexOf('**', 2) === line.length - 2) {
      return <div key={i} className="font-semibold text-white mt-3 first:mt-0">{line.slice(2, -2)}</div>
    }
    if (line.startsWith('**') && line.includes('**')) {
      const parts = line.split(/\*\*(.*?)\*\*/g)
      return (
        <div key={i} className="mt-3 first:mt-0">
          {parts.map((p, j) => j % 2 === 1 ? <span key={j} className="font-semibold text-white">{p}</span> : <span key={j}>{p}</span>)}
        </div>
      )
    }
    if (line.startsWith('• ') || line.startsWith('- ')) {
      return <div key={i} className="ml-3 text-slate-300">{line}</div>
    }
    if (line === '') return <div key={i} className="h-1" />
    return <div key={i} className="text-slate-300">{line}</div>
  })
}

function JobCard({
  job, onClick, saved, onSave
}: {
  job: Job
  onClick: () => void
  saved: boolean
  onSave: (e: React.MouseEvent) => void
}) {
  return (
    <div className="job-card p-5 group" onClick={onClick}>
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${job.color}, transparent)` }}
      />

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: `${job.color}1A`, border: `1px solid ${job.color}33` }}
          >
            {job.logo}
          </div>
          <div>
            <div className="font-semibold text-[15px] leading-tight" style={{ color: '#E2E8F0' }}>{job.title}</div>
            <div className="text-sm mt-0.5" style={{ color: '#64748B' }}>{job.company}</div>
          </div>
        </div>
        <button
          onClick={onSave}
          className="p-2 rounded-lg transition-colors flex-shrink-0"
          style={{
            color: saved ? '#818CF8' : '#475569',
            background: saved ? 'rgba(99,102,241,0.1)' : 'transparent'
          }}
        >
          <Bookmark className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-3">
        <span className="flex items-center gap-1 text-xs" style={{ color: '#64748B' }}>
          <MapPin className="w-3 h-3" /> {job.location}
        </span>
        <span className="flex items-center gap-1 text-xs" style={{ color: '#64748B' }}>
          <Briefcase className="w-3 h-3" /> {job.type}
        </span>
        {job.mode === 'Remote'
          ? <span className="badge-remote flex items-center gap-1"><Globe className="w-3 h-3" />{job.mode}</span>
          : <span className="flex items-center gap-1 text-xs" style={{ color: '#64748B' }}><Globe className="w-3 h-3" />{job.mode}</span>
        }
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {job.tags.slice(0, 4).map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
        {job.tags.length > 4 && (
          <span className="tag" style={{ color: '#475569' }}>+{job.tags.length - 4}</span>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="salary">{fmt(job.salary.min)} – {fmt(job.salary.max)}</div>
          <div className="text-xs mt-0.5" style={{ color: '#475569' }}>par an · {job.experience}</div>
        </div>
        <div className="flex items-center gap-2">
          {job.isHot && <span className="badge-hot">🔥 Hot</span>}
          {job.isNew && <span className="badge-new">Nouveau</span>}
          <span className="flex items-center gap-1 text-xs" style={{ color: '#475569' }}>
            <Clock className="w-3 h-3" />
            {job.posted}
          </span>
        </div>
      </div>
    </div>
  )
}

function JobModal({
  job, onClose, saved, onSave
}: {
  job: Job; onClose: () => void; saved: boolean; onSave: () => void
}) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div
          className="h-1 w-full rounded-t-[20px]"
          style={{ background: `linear-gradient(90deg, ${job.color}, ${job.color}80)` }}
        />

        <div className="p-6 border-b" style={{ borderColor: '#1A2540' }}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: `${job.color}1A`, border: `1px solid ${job.color}33` }}
              >
                {job.logo}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-bold text-xl" style={{ color: '#E2E8F0' }}>{job.title}</h2>
                  {job.isHot && <span className="badge-hot">🔥 Hot</span>}
                  {job.isNew && <span className="badge-new">Nouveau</span>}
                </div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="font-semibold" style={{ color: job.color }}>{job.company}</span>
                  <span className="text-sm" style={{ color: '#475569' }}>·</span>
                  <span className="flex items-center gap-1 text-sm" style={{ color: '#64748B' }}>
                    <MapPin className="w-3.5 h-3.5" />{job.location}
                  </span>
                  <span className="text-sm" style={{ color: '#475569' }}>·</span>
                  {job.mode === 'Remote'
                    ? <span className="badge-remote">{job.mode}</span>
                    : <span className="text-sm" style={{ color: '#64748B' }}>{job.mode}</span>
                  }
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors flex-shrink-0"
              style={{ color: '#475569', background: '#111B30' }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4 mt-4 flex-wrap">
            <div>
              <div className="salary text-lg">{fmt(job.salary.min)} – {fmt(job.salary.max)}</div>
              <div className="text-xs" style={{ color: '#475569' }}>par an brut</div>
            </div>
            <div className="h-8 w-px" style={{ background: '#1A2540' }} />
            <div>
              <div className="text-sm font-medium" style={{ color: '#E2E8F0' }}>{job.type}</div>
              <div className="text-xs" style={{ color: '#475569' }}>Contrat</div>
            </div>
            <div className="h-8 w-px" style={{ background: '#1A2540' }} />
            <div>
              <div className="text-sm font-medium" style={{ color: '#E2E8F0' }}>{job.experience}</div>
              <div className="text-xs" style={{ color: '#475569' }}>Expérience</div>
            </div>
            <div className="h-8 w-px" style={{ background: '#1A2540' }} />
            <div className="flex items-center gap-1 text-sm" style={{ color: '#64748B' }}>
              <Users className="w-3.5 h-3.5" />
              <span>{job.applicants} candidats</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>{job.description}</p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: '#E2E8F0' }}>
              <Zap className="w-4 h-4" style={{ color: '#6366F1' }} />
              Missions
            </h3>
            <ul className="space-y-2">
              {job.missions.map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#94A3B8' }}>
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#6366F1' }} />
                  {m}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: '#E2E8F0' }}>
              <Star className="w-4 h-4" style={{ color: '#F59E0B' }} />
              Profil recherché
            </h3>
            <ul className="space-y-2">
              {job.profile.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#94A3B8' }}>
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#F59E0B' }} />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: '#E2E8F0' }}>
              <Award className="w-4 h-4" style={{ color: '#10B981' }} />
              Avantages
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.benefits.map((b, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 text-xs rounded-lg border"
                  style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)', color: '#34D399' }}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3" style={{ color: '#E2E8F0' }}>Stack technique</h3>
            <div className="flex flex-wrap gap-1.5">
              {job.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 pt-0 flex items-center gap-3">
          <button
            className="btn-primary flex-1 flex items-center justify-center gap-2 py-3"
            style={{ borderRadius: 12 }}
          >
            <Send className="w-4 h-4" />
            Postuler maintenant
          </button>
          <button
            onClick={onSave}
            className="btn-ghost flex items-center gap-2 px-4 py-3"
          >
            <Bookmark className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
            {saved ? 'Sauvegardé' : 'Sauvegarder'}
          </button>
          <button
            className="btn-ghost p-3"
            style={{ borderRadius: 12 }}
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function AIPanel({ loading, text }: { loading: boolean; text: string }) {
  if (!loading && !text) return null
  return (
    <div className="ai-panel p-4">
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}
        >
          <Sparkles className="w-3.5 h-3.5" style={{ color: '#818CF8' }} />
        </div>
        <span className="text-xs font-semibold" style={{ color: '#818CF8' }}>Analyse IA du marché</span>
        {loading && (
          <div className="flex items-center gap-1 ml-auto">
            <div className="w-1 h-1 rounded-full animate-bounce" style={{ background: '#818CF8', animationDelay: '0ms' }} />
            <div className="w-1 h-1 rounded-full animate-bounce" style={{ background: '#818CF8', animationDelay: '150ms' }} />
            <div className="w-1 h-1 rounded-full animate-bounce" style={{ background: '#818CF8', animationDelay: '300ms' }} />
          </div>
        )}
      </div>
      <div className="text-xs leading-relaxed space-y-0.5" style={{ color: '#94A3B8' }}>
        {text ? markdownToJsx(text) : null}
        {loading && !text && (
          <div className="h-4 w-48 rounded animate-pulse" style={{ background: '#1A2540' }} />
        )}
      </div>
    </div>
  )
}

const QUICK_TAGS = ['React', 'DevOps', 'Python', 'Cybersécurité', 'Remote 100%', 'Staff Eng', 'ML / AI', 'Fintech']
const CONTRACT_TYPES: ContractType[] = ['CDI', 'CDD', 'Stage', 'Freelance']
const WORK_MODES: WorkMode[] = ['Remote', 'Hybride', 'Présentiel']
const EXP_LEVELS: ExpLevel[] = ['Junior', 'Confirmé', 'Senior', 'Expert']

export default function Page() {
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set())
  const [aiText, setAiText] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [contracts, setContracts] = useState<Set<ContractType>>(new Set())
  const [modes, setModes] = useState<Set<WorkMode>>(new Set())
  const [salaryMin, setSalaryMin] = useState(0)
  const [expLevel, setExpLevel] = useState<ExpLevel | null>(null)
  const [showSidebar, setShowSidebar] = useState(true)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const effectiveQuery = activeTag ?? query

  const filtered = JOBS.filter(job => {
    const q = effectiveQuery.toLowerCase()
    const match = !q || `${job.title} ${job.company} ${job.tags.join(' ')} ${job.location}`.toLowerCase().includes(q)
    const contractOk = contracts.size === 0 || contracts.has(job.type)
    const modeOk = modes.size === 0 || modes.has(job.mode)
    const salaryOk = job.salary.min >= salaryMin
    const expOk = !expLevel || job.expLevel === expLevel
    return match && contractOk && modeOk && salaryOk && expOk
  })

  const triggerAI = useCallback(async (q: string) => {
    if (q.length < 2) { setAiText(''); return }
    setAiLoading(true)
    setAiText('')
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      })
      if (!res.body) throw new Error('No body')
      const reader = res.body.getReader()
      const dec = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        setAiText(prev => prev + dec.decode(value, { stream: true }))
      }
    } catch {
      setAiText('Analyse IA indisponible.')
    } finally {
      setAiLoading(false)
    }
  }, [])

  const handleInput = (v: string) => {
    setQuery(v)
    setActiveTag(null)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => triggerAI(v), 700)
  }

  const handleQuickTag = (tag: string) => {
    if (activeTag === tag) {
      setActiveTag(null)
      setAiText('')
    } else {
      setActiveTag(tag)
      setQuery('')
      clearTimeout(debounceRef.current)
      triggerAI(tag)
    }
  }

  const toggleContract = (c: ContractType) => {
    setContracts(prev => {
      const n = new Set(prev)
      n.has(c) ? n.delete(c) : n.add(c)
      return n
    })
  }

  const toggleMode = (m: WorkMode) => {
    setModes(prev => {
      const n = new Set(prev)
      n.has(m) ? n.delete(m) : n.add(m)
      return n
    })
  }

  const toggleSave = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setSavedJobs(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  const clearFilters = () => {
    setContracts(new Set())
    setModes(new Set())
    setSalaryMin(0)
    setExpLevel(null)
  }

  const hasActiveFilters = contracts.size > 0 || modes.size > 0 || salaryMin > 0 || expLevel !== null

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6"
        style={{
          height: 60,
          background: 'rgba(5, 10, 20, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
            style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}
          >
            💼
          </div>
          <span className="nav-logo">TechJobs SV</span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: 'rgba(99,102,241,0.12)', color: '#818CF8', border: '1px solid rgba(99,102,241,0.2)' }}
          >
            Beta
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {['Offres', 'Salaires', 'Entreprises', 'Blog'].map(item => (
            <button key={item} className="text-sm transition-colors" style={{ color: '#475569' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#94A3B8')}
              onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button className="btn-ghost text-sm px-4 py-2">Connexion</button>
          <button className="btn-primary text-sm px-4 py-2">Poster une offre</button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden grid-ambient pt-[60px]">
        <div
          className="orb animate-pulse-slow"
          style={{
            width: 600, height: 600,
            background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
            top: -200, left: '20%',
          }}
        />
        <div
          className="orb"
          style={{
            width: 400, height: 400,
            background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
            top: 0, right: '10%',
            animation: 'pulse-slow 8s ease-in-out infinite 2s',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.2)',
              color: '#818CF8'
            }}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Analyse IA du marché en temps réel · Propulsé par Claude</span>
          </div>

          <h1
            className="font-extrabold text-4xl md:text-5xl leading-tight mb-4"
            style={{
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #E2E8F0 0%, #A5B4FC 50%, #C4B5FD 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Trouve ton prochain rôle<br />dans la French Tech
          </h1>
          <p className="text-base mb-8 max-w-xl mx-auto" style={{ color: '#64748B' }}>
            Salaires transparents · Offres vérifiées · Insights IA du marché en temps réel
          </p>

          <div className="search-wrap flex items-center gap-3 px-4 py-3 max-w-2xl mx-auto mb-6">
            <Search className="w-5 h-5 flex-shrink-0" style={{ color: '#475569' }} />
            <input
              type="text"
              value={query}
              onChange={e => handleInput(e.target.value)}
              placeholder="React, DevOps, Product Manager, Cybersécurité…"
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: '#E2E8F0', fontFamily: 'var(--sans)' }}
            />
            {query && (
              <button onClick={() => handleInput('')} style={{ color: '#475569' }}>
                <X className="w-4 h-4" />
              </button>
            )}
            <button className="btn-primary px-5 py-2.5 text-sm flex-shrink-0">
              Rechercher
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {QUICK_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => handleQuickTag(tag)}
                className={`quick-tag ${activeTag === tag ? 'active' : ''}`}
              >
                {tag}
              </button>
            ))}
          </div>

          {(aiLoading || aiText) && (
            <div className="mt-6 max-w-2xl mx-auto">
              <AIPanel loading={aiLoading} text={aiText} />
            </div>
          )}
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 pb-16">

        {/* Stats bar */}
        <div
          className="flex items-center justify-between py-4 mb-6"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold" style={{ color: '#E2E8F0' }}>{filtered.length}</span>
            <span className="text-sm" style={{ color: '#64748B' }}>offres{filtered.length !== JOBS.length ? ` sur ${JOBS.length}` : ' disponibles'}</span>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors"
                style={{
                  background: 'rgba(244,63,94,0.1)',
                  border: '1px solid rgba(244,63,94,0.2)',
                  color: '#FDA4AF'
                }}
              >
                <X className="w-3 h-3" />
                Effacer les filtres
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSidebar(v => !v)}
              className="btn-ghost text-xs flex items-center gap-2 px-3 py-2"
            >
              <Filter className="w-3.5 h-3.5" />
              Filtres
              {showSidebar ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {hasActiveFilters && (
                <span
                  className="w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                  style={{ background: '#6366F1', color: '#fff' }}
                >
                  {contracts.size + modes.size + (salaryMin > 0 ? 1 : 0) + (expLevel ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-6">

          {/* Sidebar */}
          {showSidebar && (
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div
                className="sticky top-[76px] rounded-2xl p-5 space-y-6"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#475569' }}>
                    Type de contrat
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {CONTRACT_TYPES.map(c => (
                      <button
                        key={c}
                        onClick={() => toggleContract(c)}
                        className={`filter-chip ${contracts.has(c) ? 'active' : ''}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px" style={{ background: 'var(--border)' }} />

                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#475569' }}>
                    Mode de travail
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {WORK_MODES.map(m => (
                      <button
                        key={m}
                        onClick={() => toggleMode(m)}
                        className={`filter-chip ${modes.has(m) ? 'active' : ''}`}
                      >
                        {m === 'Remote' ? '🌍 ' : m === 'Hybride' ? '🏠 ' : '🏢 '}{m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px" style={{ background: 'var(--border)' }} />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#475569' }}>
                      Salaire min.
                    </div>
                    <span className="salary text-xs">{salaryMin === 0 ? 'Tous' : `${fmt(salaryMin)}`}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={120000}
                    step={5000}
                    value={salaryMin}
                    onChange={e => setSalaryMin(Number(e.target.value))}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs" style={{ color: '#475569' }}>0</span>
                    <span className="text-xs" style={{ color: '#475569' }}>120k€</span>
                  </div>
                </div>

                <div className="h-px" style={{ background: 'var(--border)' }} />

                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#475569' }}>
                    Niveau d&apos;expérience
                  </div>
                  <div className="space-y-1.5">
                    {EXP_LEVELS.map(l => (
                      <button
                        key={l}
                        onClick={() => setExpLevel(expLevel === l ? null : l)}
                        className={`filter-chip w-full text-left ${expLevel === l ? 'active' : ''}`}
                        style={{ display: 'block' }}
                      >
                        {l === 'Junior' ? '🌱 ' : l === 'Confirmé' ? '⚡ ' : l === 'Senior' ? '🎯 ' : '🏆 '}{l}
                      </button>
                    ))}
                  </div>
                </div>

                {hasActiveFilters && (
                  <>
                    <div className="h-px" style={{ background: 'var(--border)' }} />
                    <button
                      onClick={clearFilters}
                      className="w-full text-xs py-2.5 rounded-lg transition-colors font-medium"
                      style={{
                        background: 'rgba(244,63,94,0.08)',
                        border: '1px solid rgba(244,63,94,0.2)',
                        color: '#FDA4AF'
                      }}
                    >
                      Effacer tous les filtres
                    </button>
                  </>
                )}
              </div>
            </aside>
          )}

          {/* Job grid */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-4xl mb-4">🔍</div>
                <div className="font-semibold mb-2" style={{ color: '#94A3B8' }}>Aucune offre trouvée</div>
                <div className="text-sm" style={{ color: '#475569' }}>Essayez d&apos;autres termes ou réinitialisez les filtres</div>
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
                {filtered.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onClick={() => setSelectedJob(job)}
                    saved={savedJobs.has(job.id)}
                    onSave={e => toggleSave(job.id, e)}
                  />
                ))}
              </div>
            )}

            {/* Insight cards at the bottom */}
            {filtered.length > 0 && (
              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    icon: <TrendingUp className="w-5 h-5" />,
                    color: '#6366F1',
                    title: 'Salaire médian Senior',
                    value: '95k€ / an',
                    sub: '+12% vs 2023 en French Tech'
                  },
                  {
                    icon: <Zap className="w-5 h-5" />,
                    color: '#10B981',
                    title: 'Offres Remote / Hybride',
                    value: '87%',
                    sub: 'des offres tech acceptent le remote'
                  },
                  {
                    icon: <Shield className="w-5 h-5" />,
                    color: '#F59E0B',
                    title: 'Temps moyen de recrutement',
                    value: '3 semaines',
                    sub: 'pour les profils senior tech'
                  }
                ].map((card, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl"
                    style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: `${card.color}18`, color: card.color }}
                    >
                      {card.icon}
                    </div>
                    <div className="text-xs mb-1" style={{ color: '#475569' }}>{card.title}</div>
                    <div className="font-bold text-xl mb-1" style={{ color: '#E2E8F0', fontFamily: 'var(--mono)' }}>{card.value}</div>
                    <div className="text-xs" style={{ color: '#64748B' }}>{card.sub}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="text-center py-8"
        style={{ borderTop: '1px solid var(--border)', color: '#475569' }}
      >
        <div className="flex items-center justify-center gap-1.5 text-sm">
          <Coffee className="w-3.5 h-3.5" />
          <span>TechJobs SV — Built with</span>
          <span style={{ color: '#818CF8' }}>Claude AI</span>
          <span>· Données 2025</span>
        </div>
      </footer>

      {/* Modal */}
      {selectedJob && (
        <JobModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          saved={savedJobs.has(selectedJob.id)}
          onSave={() => toggleSave(selectedJob.id)}
        />
      )}
    </div>
  )
}
