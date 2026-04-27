import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { fmtPrice, generatePriceHistory } from '../data/cryptoData'
import { COINS } from '../data/cryptoData'

const RANGES = [
  { label: '7D', days: 7 },
  { label: '14D', days: 14 },
  { label: '30D', days: 30 },
]

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <div className="ct-label">{label}</div>
      <div className="ct-price">{fmtPrice(payload[0].value)}</div>
    </div>
  )
}

export default function PriceChart({ selectedCoin, prices }) {
  const [range, setRange] = useState(30)
  const coin = COINS.find(c => c.id === selectedCoin) || COINS[0]
  const history = generatePriceHistory(prices[coin.id] || coin.basePrice, range)
  const first = history[0]?.price || 1
  const last = history[history.length - 1]?.price || 1
  const change = ((last - first) / first) * 100
  const up = change >= 0

  const ticks = history.filter((_, i) => i % Math.ceil(history.length / 6) === 0).map(h => h.time)

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div className="chart-title-area">
          <div className="chart-coin-dot" style={{ background: coin.color }} />
          <div>
            <div className="chart-coin-name">{coin.name}</div>
            <div className="chart-price-row">
              <span className="chart-current-price">{fmtPrice(prices[coin.id] || coin.basePrice)}</span>
              <span className={'chart-change ' + (up ? 'up' : 'down')}>
                {up ? '↑' : '↓'} {Math.abs(change).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        <div className="chart-range-tabs">
          {RANGES.map(r => (
            <button
              key={r.label}
              className={'range-tab' + (range === r.days ? ' active' : '')}
              onClick={() => setRange(r.days)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-area">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={history} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={'grad-' + coin.id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={coin.color} stopOpacity={0.25} />
                <stop offset="100%" stopColor={coin.color} stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              ticks={ticks}
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={['auto', 'auto']}
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => fmtPrice(v)}
              width={70}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke={coin.color}
              strokeWidth={2}
              fill={'url(#grad-' + coin.id + ')'}
              dot={false}
              activeDot={{ r: 4, fill: coin.color, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
