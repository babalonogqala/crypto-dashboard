import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Cell } from 'recharts'
import { fmtLarge, generatePriceHistory, COINS } from '../data/cryptoData'

export default function Analytics({ coins, prices, changes }) {
  const volumeData = coins.map(c => ({
    name: c.symbol,
    volume: parseFloat((c.volume / 1e9).toFixed(2)),
    color: c.color,
  }))

  const totalMcap = coins.reduce((s, x) => s + x.marketCap, 0)
  const dominanceData = coins.slice(0, 6).map(c => ({
    name: c.symbol,
    share: parseFloat(((c.marketCap / totalMcap) * 100).toFixed(1)),
    color: c.color,
  }))

  const btcHistory = generatePriceHistory(prices['bitcoin'] || 67420, 30)
  const ethHistory = generatePriceHistory(prices['ethereum'] || 3521, 30)
  const correlData = btcHistory.map((d, i) => ({
    time: d.time,
    BTC: parseFloat((d.price / 67420 * 100).toFixed(1)),
    ETH: parseFloat(((ethHistory[i]?.price || 3521) / 3521 * 100).toFixed(1)),
  }))

  const tooltipStyle = {
    contentStyle: { background: '#0d1526', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 },
    labelStyle: { color: '#94a3b8' },
    itemStyle: { color: '#e2e8f0' }
  }

  return (
    <div className="page-content">
      <div className="page-heading">
        <h1>Analytics</h1>
        <p>Market intelligence and trend analysis</p>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>24h Trading Volume (Billions USD)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={volumeData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => '$' + v + 'B'} />
              <Tooltip {...tooltipStyle} formatter={(v) => ['$' + v + 'B', 'Volume']} />
              <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
                {volumeData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="analytics-card">
          <h3>Market Dominance</h3>
          <div className="dominance-list">
            {dominanceData.map(d => (
              <div key={d.name} className="dom-row">
                <span className="dom-name">{d.name}</span>
                <div className="dom-bar-wrap">
                  <div className="dom-bar" style={{ width: d.share + '%', background: d.color }} />
                </div>
                <span className="dom-pct">{d.share}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card wide">
          <h3>BTC vs ETH — 30-Day Indexed Performance (base = 100)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={correlData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} interval={6} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="BTC" stroke="#F7931A" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="ETH" stroke="#627EEA" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
