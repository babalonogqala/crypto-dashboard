import { useState } from 'react'
import { Bell, Plus, Trash2, ToggleLeft, ToggleRight, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'
import { COINS, fmtPrice } from '../data/cryptoData'

const ALERT_TYPES = [
  { id: 'above', label: 'Price goes above', icon: TrendingUp },
  { id: 'below', label: 'Price drops below', icon: TrendingDown },
  { id: 'change', label: '24h change exceeds', icon: AlertTriangle },
]

function useAlerts() {
  const [alerts, setAlerts] = useState(() => JSON.parse(localStorage.getItem('nexus_alerts') || '[]'))
  const save = (next) => { setAlerts(next); localStorage.setItem('nexus_alerts', JSON.stringify(next)) }
  const add = (alert) => save([...alerts, { ...alert, id: Date.now().toString(), enabled: true, triggered: false, createdAt: new Date().toISOString() }])
  const remove = (id) => save(alerts.filter(a => a.id !== id))
  const toggle = (id) => save(alerts.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a))
  return { alerts, add, remove, toggle }
}

export default function Alerts({ prices }) {
  const { alerts, add, remove, toggle } = useAlerts()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ coinId: 'bitcoin', type: 'above', value: '' })
  const [err, setErr] = useState('')

  const handleAdd = () => {
    if (!form.value || isNaN(form.value)) return setErr('Enter a valid number.')
    add({ coinId: form.coinId, type: form.type, value: parseFloat(form.value) })
    setShowForm(false)
    setForm({ coinId: 'bitcoin', type: 'above', value: '' })
    setErr('')
  }

  const isTriggered = (alert) => {
    const price = prices[alert.coinId]
    if (!price) return false
    if (alert.type === 'above')  return price >= alert.value
    if (alert.type === 'below')  return price <= alert.value
    return false
  }

  const activeCount = alerts.filter(a => a.enabled).length

  return (
    <div className="page-content">
      <div className="page-heading-row">
        <div className="page-heading">
          <h1>Price Alerts</h1>
          <p>{activeCount} active alert{activeCount !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(s => !s)}>
          <Plus size={15} /> New Alert
        </button>
      </div>

      {showForm && (
        <div className="alert-form-card">
          <h3>Create Alert</h3>
          <div className="alert-form-grid">
            <div className="auth-field">
              <label>Coin</label>
              <select value={form.coinId} onChange={e => setForm(f => ({ ...f, coinId: e.target.value }))}>
                {COINS.map(c => <option key={c.id} value={c.id}>{c.name} ({c.symbol})</option>)}
              </select>
            </div>
            <div className="auth-field">
              <label>Condition</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {ALERT_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
            <div className="auth-field">
              <label>
                {form.type === 'change' ? 'Percentage (%)' : 'Price in ZAR (R)'}
              </label>
              <input
                type="number"
                placeholder={form.type === 'change' ? 'e.g. 5' : 'e.g. 1200000'}
                value={form.value}
                onChange={e => { setForm(f => ({ ...f, value: e.target.value })); setErr('') }}
              />
            </div>
          </div>
          {err && <div className="auth-error" style={{ marginTop: 4 }}><AlertTriangle size={13} />{err}</div>}
          <div className="alert-form-actions">
            <button className="btn-ghost" onClick={() => { setShowForm(false); setErr('') }}>Cancel</button>
            <button className="btn-primary" onClick={handleAdd}>Add Alert</button>
          </div>
        </div>
      )}

      {alerts.length === 0 ? (
        <div className="empty-state">
          <Bell size={40} strokeWidth={1} />
          <p>No alerts yet.</p>
          <span>Create one above to get notified when prices hit your targets.</span>
        </div>
      ) : (
        <div className="alerts-list">
          {alerts.map(alert => {
            const coin = COINS.find(c => c.id === alert.coinId)
            const hit = isTriggered(alert)
            const TypeIcon = ALERT_TYPES.find(t => t.id === alert.type)?.icon || Bell
            const currentPrice = prices[alert.coinId]
            return (
              <div key={alert.id} className={'alert-row' + (!alert.enabled ? ' disabled' : '') + (hit ? ' triggered' : '')}>
                <div className="alert-icon-wrap" style={{ background: coin.color + '22', color: coin.color }}>
                  <TypeIcon size={16} />
                </div>
                <div className="alert-info">
                  <div className="alert-title">
                    <span className="alert-coin" style={{ color: coin.color }}>{coin.symbol}</span>
                    <span className="alert-condition">
                      {ALERT_TYPES.find(t => t.id === alert.type)?.label}
                      <strong> {alert.type === 'change' ? alert.value + '%' : fmtPrice(alert.value)}</strong>
                    </span>
                  </div>
                  <div className="alert-meta">
                    Current: <span className="alert-current">{currentPrice ? fmtPrice(currentPrice) : '—'}</span>
                    {hit && alert.enabled && <span className="alert-hit-badge">● TRIGGERED</span>}
                  </div>
                </div>
                <div className="alert-actions">
                  <button className="toggle-btn" onClick={() => toggle(alert.id)} title={alert.enabled ? 'Disable' : 'Enable'}>
                    {alert.enabled ? <ToggleRight size={22} color="#3b82f6" /> : <ToggleLeft size={22} color="#4a5568" />}
                  </button>
                  <button className="icon-danger-btn" onClick={() => remove(alert.id)}><Trash2 size={15} /></button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
