import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './pages/Dashboard'
import Markets from './pages/Markets'
import Portfolio from './pages/Portfolio'
import Analytics from './pages/Analytics'
import Alerts from './pages/Alerts'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Login from './pages/Login'
import { useCrypto } from './hooks/useCrypto'
import './App.css'

// Seed demo account on first load
function seedDemo() {
  const users = JSON.parse(localStorage.getItem('nexus_users') || '[]')
  if (!users.find(u => u.email === 'demo@nexus.co.za')) {
    users.push({ name: 'Demo User', email: 'demo@nexus.co.za', password: 'demo123', role: 'Pro Trader', joined: new Date().toISOString() })
    localStorage.setItem('nexus_users', JSON.stringify(users))
  }
}
seedDemo()

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nexus_session')) } catch { return null }
  })
  const [activePage, setActivePage] = useState('dashboard')
  const [mobileOpen, setMobileOpen] = useState(false)
  const { coins, prices, prevPrices, histories, changes, portfolio, lastUpdate, getPortfolioValue } = useCrypto()

  const alertCount = JSON.parse(localStorage.getItem('nexus_alerts') || '[]').filter(a => a.enabled).length

  const handleLogin = (u) => setUser(u)
  const handleLogout = () => {
    localStorage.removeItem('nexus_session')
    setUser(null)
    setActivePage('dashboard')
  }

  if (!user) return <Login onLogin={handleLogin} />

  const pageProps = { coins, prices, prevPrices, histories, changes, portfolio, getPortfolioValue }

  return (
    <div className="app-shell">
      <Sidebar
        active={activePage}
        setActive={setActivePage}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        user={user}
        alertCount={alertCount}
      />
      <div className="app-body">
        <Topbar lastUpdate={lastUpdate} setMobileOpen={setMobileOpen} user={user} onProfileClick={() => setActivePage('profile')} />
        <main className="app-main">
          {activePage === 'dashboard'  && <Dashboard  {...pageProps} />}
          {activePage === 'markets'    && <Markets    {...pageProps} />}
          {activePage === 'portfolio'  && <Portfolio  {...pageProps} />}
          {activePage === 'analytics'  && <Analytics  {...pageProps} />}
          {activePage === 'alerts'     && <Alerts     prices={prices} />}
          {activePage === 'settings'   && <Settings />}
          {activePage === 'profile'    && <Profile user={user} onLogout={handleLogout} />}
        </main>
      </div>
    </div>
  )
}
