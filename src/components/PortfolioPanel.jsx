import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { fmtPrice, fmtLarge, COINS } from '../data/cryptoData'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="chart-tooltip">
      <div className="ct-label">{d.name}</div>
      <div className="ct-price">{fmtLarge(d.value)}</div>
    </div>
  )
}

export default function PortfolioPanel({ portfolio, prices, changes }) {
  const items = portfolio.map(p => {
    const coin = COINS.find(c => c.id === p.id)
    const price = prices[p.id] || coin.basePrice
    const value = price * p.amount
    const change = changes[p.id] || 0
    return { ...coin, amount: p.amount, price, value, change }
  })

  const total = items.reduce((s, i) => s + i.value, 0)

  const pieData = items.map(i => ({
    name: i.symbol,
    value: i.value,
    color: i.color,
  }))

  return (
    <div className="portfolio-card">
      <div className="portfolio-header">
        <h3>Portfolio</h3>
        <div className="portfolio-total">{fmtLarge(total)}</div>
      </div>

      <div className="portfolio-pie">
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value">
              {pieData.map((entry, i) => (
                <Cell key={i} fill={entry.color} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="portfolio-list">
        {items.map(item => {
          const pct = ((item.value / total) * 100).toFixed(1)
          const up = item.change >= 0
          return (
            <div key={item.id} className="portfolio-item">
              <div className="pi-left">
                <div className="pi-dot" style={{ background: item.color }} />
                <div>
                  <div className="pi-symbol">{item.symbol}</div>
                  <div className="pi-amount">{item.amount} {item.symbol}</div>
                </div>
              </div>
              <div className="pi-right">
                <div className="pi-value">{fmtLarge(item.value)}</div>
                <div className={'pi-change ' + (up ? 'up' : 'down')}>
                  {up ? '+' : ''}{item.change.toFixed(2)}%
                </div>
              </div>
              <div className="pi-bar-wrap">
                <div className="pi-bar" style={{ width: pct + '%', background: item.color }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
