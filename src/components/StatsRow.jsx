import { TrendingUp, TrendingDown, DollarSign, Activity, Layers } from 'lucide-react'
import { fmtLarge } from '../data/cryptoData'

export default function StatsRow({ coins, prices, changes, portfolioValue }) {
  const totalMarketCap = coins.reduce((s, c) => s + c.marketCap, 0)
  const totalVolume = coins.reduce((s, c) => s + c.volume, 0)
  const gainers = coins.filter(c => (changes[c.id] || 0) > 0).length
  const avgChange = coins.reduce((s, c) => s + (changes[c.id] || 0), 0) / coins.length

  const stats = [
    {
      label: 'Portfolio Value',
      value: fmtLarge(portfolioValue),
      sub: avgChange >= 0 ? '+' + avgChange.toFixed(1) + '% today' : avgChange.toFixed(1) + '% today',
      up: avgChange >= 0,
      icon: DollarSign,
      accent: '#6EE7B7',
    },
    {
      label: 'Market Cap',
      value: fmtLarge(totalMarketCap),
      sub: gainers + ' of ' + coins.length + ' gaining',
      up: gainers > coins.length / 2,
      icon: Layers,
      accent: '#93C5FD',
    },
    {
      label: '24h Volume',
      value: fmtLarge(totalVolume),
      sub: 'Across all tracked pairs',
      up: true,
      icon: Activity,
      accent: '#C4B5FD',
    },
    {
      label: 'Market Trend',
      value: avgChange >= 0 ? 'Bullish' : 'Bearish',
      sub: avgChange.toFixed(2) + '% avg change',
      up: avgChange >= 0,
      icon: avgChange >= 0 ? TrendingUp : TrendingDown,
      accent: avgChange >= 0 ? '#4ade80' : '#f87171',
    },
  ]

  return (
    <div className="stats-row">
      {stats.map((s, i) => (
        <div key={i} className="stat-card" style={{ '--accent': s.accent }}>
          <div className="stat-card-top">
            <span className="stat-label">{s.label}</span>
            <div className="stat-icon-wrap">
              <s.icon size={16} />
            </div>
          </div>
          <div className="stat-value">{s.value}</div>
          <div className={'stat-sub ' + (s.up ? 'up' : 'down')}>{s.sub}</div>
        </div>
      ))}
    </div>
  )
}
