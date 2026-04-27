import { useState } from 'react'
import { User, Mail, Shield, Edit2, Save, LogOut, Trash2, CheckCircle, Camera } from 'lucide-react'

export default function Profile({ user, onLogout }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: user.name, email: user.email, role: user.role || 'Pro Trader' })
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [saved, setSaved] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')
  const [showDelete, setShowDelete] = useState(false)

  const initials = form.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  const handleSave = () => {
    const users = JSON.parse(localStorage.getItem('nexus_users') || '[]')
    const updated = users.map(u => u.email === user.email ? { ...u, name: form.name, role: form.role } : u)
    localStorage.setItem('nexus_users', JSON.stringify(updated))
    const session = JSON.parse(localStorage.getItem('nexus_session') || '{}')
    localStorage.setItem('nexus_session', JSON.stringify({ ...session, name: form.name, role: form.role }))
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 2500)
  }

  const handlePassword = () => {
    setPwError(''); setPwSuccess('')
    if (!pwForm.current) return setPwError('Enter your current password.')
    const users = JSON.parse(localStorage.getItem('nexus_users') || '[]')
    const me = users.find(u => u.email === user.email)
    if (!me || me.password !== pwForm.current) return setPwError('Current password is incorrect.')
    if (pwForm.next.length < 6) return setPwError('New password must be at least 6 characters.')
    if (pwForm.next !== pwForm.confirm) return setPwError('Passwords do not match.')
    const updated = users.map(u => u.email === user.email ? { ...u, password: pwForm.next } : u)
    localStorage.setItem('nexus_users', JSON.stringify(updated))
    setPwSuccess('Password updated successfully.')
    setPwForm({ current: '', next: '', confirm: '' })
  }

  const handleDelete = () => {
    const users = JSON.parse(localStorage.getItem('nexus_users') || '[]')
    localStorage.setItem('nexus_users', JSON.stringify(users.filter(u => u.email !== user.email)))
    localStorage.removeItem('nexus_session')
    onLogout()
  }

  const joinedDate = user.joined ? new Date(user.joined).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'

  return (
    <div className="page-content">
      <div className="page-heading-row">
        <div className="page-heading">
          <h1>Profile</h1>
          <p>Manage your account information</p>
        </div>
        <button className="btn-ghost" onClick={onLogout}>
          <LogOut size={15} /> Sign Out
        </button>
      </div>

      {/* Avatar + name card */}
      <div className="profile-hero-card">
        <div className="profile-avatar-wrap">
          <div className="profile-avatar">{initials}</div>
          <button className="avatar-edit-btn"><Camera size={13} /></button>
        </div>
        <div className="profile-hero-info">
          <div className="profile-hero-name">{form.name}</div>
          <div className="profile-hero-role">{form.role}</div>
          <div className="profile-hero-meta">
            <span><Mail size={12} /> {user.email}</span>
            <span><Shield size={12} /> Member since {joinedDate}</span>
          </div>
        </div>
        {saved && (
          <div className="profile-saved-badge"><CheckCircle size={14} /> Profile saved</div>
        )}
      </div>

      {/* Edit details */}
      <div className="settings-section">
        <div className="settings-section-header">
          <User size={16} /><span>Account Details</span>
          <button className="btn-ghost-sm" onClick={() => setEditing(e => !e)} style={{ marginLeft: 'auto' }}>
            <Edit2 size={13} /> {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>
        <div className="settings-section-body">
          <div className="profile-fields">
            <div className="auth-field">
              <label>Full Name</label>
              <input value={form.name} disabled={!editing} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="auth-field">
              <label>Email Address</label>
              <input value={form.email} disabled className="input-disabled" />
              <span className="field-note">Email cannot be changed.</span>
            </div>
            <div className="auth-field">
              <label>Role / Title</label>
              <input value={form.role} disabled={!editing} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="e.g. Crypto Investor" />
            </div>
          </div>
          {editing && (
            <button className="btn-primary" onClick={handleSave} style={{ marginTop: 16 }}>
              <Save size={14} /> Save Changes
            </button>
          )}
        </div>
      </div>

      {/* Change password */}
      <div className="settings-section">
        <div className="settings-section-header">
          <Shield size={16} /><span>Change Password</span>
        </div>
        <div className="settings-section-body">
          <div className="profile-fields">
            <div className="auth-field">
              <label>Current Password</label>
              <input type="password" value={pwForm.current} onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))} placeholder="••••••••" />
            </div>
            <div className="auth-field">
              <label>New Password</label>
              <input type="password" value={pwForm.next} onChange={e => setPwForm(f => ({ ...f, next: e.target.value }))} placeholder="••••••••" />
            </div>
            <div className="auth-field">
              <label>Confirm New Password</label>
              <input type="password" value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} placeholder="••••••••" />
            </div>
          </div>
          {pwError && <div className="auth-error" style={{ marginTop: 8 }}><Shield size={13} />{pwError}</div>}
          {pwSuccess && <div className="auth-success" style={{ marginTop: 8 }}><CheckCircle size={13} />{pwSuccess}</div>}
          <button className="btn-primary" onClick={handlePassword} style={{ marginTop: 14 }}>Update Password</button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="settings-section danger-zone">
        <div className="settings-section-header"><Trash2 size={16} /><span>Danger Zone</span></div>
        <div className="settings-section-body">
          {!showDelete ? (
            <button className="btn-danger" onClick={() => setShowDelete(true)}>Delete My Account</button>
          ) : (
            <div className="delete-confirm">
              <p>This will permanently delete your account and all data. This cannot be undone.</p>
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button className="btn-ghost" onClick={() => setShowDelete(false)}>Cancel</button>
                <button className="btn-danger" onClick={handleDelete}>Yes, Delete Account</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
