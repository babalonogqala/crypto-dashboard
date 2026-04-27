import { LayoutDashboard, TrendingUp, Wallet, BarChart3, Bell, Settings, Zap, X, User } from 'lucide-react'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'markets',   label: 'Markets',   icon: TrendingUp },
  { id: 'portfolio', label: 'Portfolio', icon: Wallet },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
]

export default function Sidebar({ active, setActive, mobileOpen, setMobileOpen, user, alertCount }) {
  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2) || 'U'

  return (
    <>
      {mobileOpen && <div className="sidebar-backdrop" onClick={() => setMobileOpen(false)} />}
      <aside className={'sidebar' + (mobileOpen ? ' open' : '')}>
        <div className="sidebar-logo">
          <div className="logo-mark"><Zap size={16} strokeWidth={2.5} /></div>
          <span className="logo-text">NEXUS</span>
          <button className="sidebar-close" onClick={() => setMobileOpen(false)}><X size={18} /></button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Main</div>
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={'nav-item' + (active === id ? ' active' : '')}
              onClick={() => { setActive(id); setMobileOpen(false) }}
            >
              <Icon size={17} />
              <span>{label}</span>
              {active === id && <div className="nav-pip" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="nav-section-label">System</div>
          <button
            className={'nav-item' + (active === 'alerts' ? ' active' : '')}
            onClick={() => { setActive('alerts'); setMobileOpen(false) }}
          >
            <Bell size={17} />
            <span>Alerts</span>
            {alertCount > 0 && <span className="nav-badge">{alertCount}</span>}
            {active === 'alerts' && <div className="nav-pip" />}
          </button>
          <button
            className={'nav-item' + (active === 'settings' ? ' active' : '')}
            onClick={() => { setActive('settings'); setMobileOpen(false) }}
          >
            <Settings size={17} />
            <span>Settings</span>
            {active === 'settings' && <div className="nav-pip" />}
          </button>
        </div>

        <button
          className={'sidebar-user' + (active === 'profile' ? ' active-user' : '')}
          onClick={() => { setActive('profile'); setMobileOpen(false) }}
        >
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name">{user?.name || 'User'}</div>
            <div className="user-role">{user?.role || 'Trader'}</div>
          </div>
          <div className="user-status" />
        </button>
      </aside>
    </>
  )
}
