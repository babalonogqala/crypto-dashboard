import { Search, Bell, Menu } from 'lucide-react'

export default function Topbar({ lastUpdate, setMobileOpen, user, onProfileClick }) {
  const timeStr = lastUpdate.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2) || 'U'

  return (
    <header className="topbar">
      <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>
        <Menu size={20} />
      </button>

      <div className="topbar-search">
        <Search size={15} />
        <input placeholder="Search coins, pairs..." />
      </div>

      <div className="topbar-right">
        <div className="live-indicator">
          <span className="live-dot" />
          <span className="live-label">LIVE</span>
          <span className="live-time">{timeStr}</span>
        </div>
        <button className="topbar-icon-btn">
          <Bell size={17} />
          <span className="notif-dot" />
        </button>
        <button className="topbar-avatar-btn" onClick={onProfileClick} title="My Profile">
          <div className="topbar-avatar">{initials}</div>
        </button>
      </div>
    </header>
  )
}
