import { useState } from 'react'
import { Zap, Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError('') }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (mode === 'register') {
      if (!form.name.trim())              return setLoading(false), setError('Full name is required.')
      if (!form.email.includes('@'))      return setLoading(false), setError('Enter a valid email address.')
      if (form.password.length < 6)       return setLoading(false), setError('Password must be at least 6 characters.')
      if (form.password !== form.confirm) return setLoading(false), setError('Passwords do not match.')

      const users = JSON.parse(localStorage.getItem('nexus_users') || '[]')
      if (users.find(u => u.email === form.email)) {
        setLoading(false)
        return setError('An account with this email already exists.')
      }
      const newUser = { name: form.name.trim(), email: form.email.trim(), password: form.password, role: 'Pro Trader', joined: new Date().toISOString() }
      users.push(newUser)
      localStorage.setItem('nexus_users', JSON.stringify(users))
      localStorage.setItem('nexus_session', JSON.stringify(newUser))
      setTimeout(() => onLogin(newUser), 400)
    } else {
      if (!form.email || !form.password) {
        setLoading(false)
        return setError('Please fill in all fields.')
      }
      const users = JSON.parse(localStorage.getItem('nexus_users') || '[]')
      const user = users.find(u => u.email === form.email && u.password === form.password)
      if (!user) {
        setLoading(false)
        return setError('Invalid email or password.')
      }
      localStorage.setItem('nexus_session', JSON.stringify(user))
      setTimeout(() => onLogin(user), 400)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-bg" />
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-mark"><Zap size={18} strokeWidth={2.5} /></div>
          <span className="logo-text">NEXUS</span>
        </div>
        <div className="auth-title">{mode === 'login' ? 'Welcome back' : 'Create account'}</div>
        <div className="auth-sub">{mode === 'login' ? 'Sign in to your trading dashboard' : 'Start tracking crypto in ZAR'}</div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="auth-field">
              <label>Full Name</label>
              <input type="text" placeholder="e.g. Babalo Nogqala" value={form.name} onChange={e => set('name', e.target.value)} autoFocus />
            </div>
          )}
          <div className="auth-field">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} autoFocus={mode === 'login'} />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <div className="pw-wrap">
              <input type={showPw ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} />
              <button type="button" className="pw-toggle" onClick={() => setShowPw(s => !s)}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          {mode === 'register' && (
            <div className="auth-field">
              <label>Confirm Password</label>
              <input type={showPw ? 'text' : 'password'} placeholder="••••••••" value={form.confirm} onChange={e => set('confirm', e.target.value)} />
            </div>
          )}

          {error && (
            <div className="auth-error">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className={'auth-submit' + (loading ? ' loading' : '')}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="auth-switch">
          {mode === 'login' ? (
            <>No account? <button onClick={() => { setMode('register'); setError('') }}>Register here</button></>
          ) : (
            <>Already have an account? <button onClick={() => { setMode('login'); setError('') }}>Sign in</button></>
          )}
        </div>

        {mode === 'login' && (
          <div className="auth-demo">
            <span>Demo account:</span>
            <button onClick={() => { setForm({ name: '', email: 'demo@nexus.co.za', password: 'demo123', confirm: '' }) }}>
              Fill demo credentials
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
