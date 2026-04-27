import { useState } from 'react'
import { TrendingUp, TrendingDown, Star } from 'lucide-react'
import { fmtPrice, fmtLarge, fmtSupply } from '../data/cryptoData'

function MiniSparkline({ history, color, up }) {
  if (!history?.length) return null
  const prices = history.slice(-14).map(h => h.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = max - min || 1
  const w = 80, h = 32
  const pts = prices.map((p, i) => {
    const x = (i / (prices.length - 1)) * w
    const y = h - ((p - min) / range) * h
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
    </svg>
  )
}

export default function MarketTable({ coins, prices, prevPrices, changes, histories, onSelectCoin, selectedCoin }) {
  const [watchlist, setWatchlist] = useState(new Set(['bitcoin', 'ethereum']))
  const [sortBy, setSortBy] = useState('marketCap')
  const [sortDir, setSortDir] = useState(-1)

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir(d => -d)
    else { setSortBy(col); setSortDir(-1) }
  }

  const sorted = [...coins].sort((a, b) => {
    let va, vb
    if (sortBy === 'price') { va = prices[a.id] || a.basePrice; vb = prices[b.id] || b.basePrice }
    else if (sortBy === 'change') { va = changes[a.id] || 0; vb = changes[b.id] || 0 }
    else if (sortBy === 'volume') { va = a.volume; vb = b.volume }
    else { va = a.marketCap; vb = b.marketCap }
    return (va - vb) * sortDir
  })

  const SortBtn = ({ col, children }) => (
    <button className={'th-btn' + (sortBy === col ? ' active' : '')} onClick={() => toggleSort(col)}>
      {children} {sortBy === col ? (sortDir === -1 ? '↓' : '↑') : ''}
    </button>
  )

  return (
    <div className="market-table-card">
      <div className="table-header">
        <h3>Market Overview</h3>
        <div className="table-tabs">
          <button className="table-tab active">All</button>
          <button className="table-tab">Watchlist</button>
          <button className="table-tab">DeFi</button>
        </div>
      </div>
      <div className="table-scroll">
        <table className="market-table">
          <thead>
            <tr>
              <th style={{ width: 32 }}></th>
              <th>Asset</th>
              <th><SortBtn col="price">Price</SortBtn></th>
              <th><SortBtn col="change">24h</SortBtn></th>
              <th className="hide-sm"><SortBtn col="marketCap">Mkt Cap</SortBtn></th>
              <th className="hide-sm"><SortBtn col="volume">Volume</SortBtn></th>
              <th className="hide-md">7D Chart</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((coin, i) => {
              const price = prices[coin.id] || coin.basePrice
              const prev = prevPrices[coin.id] || coin.basePrice
              const flash = price > prev ? 'flash-up' : price < prev ? 'flash-down' : ''
              const change = changes[coin.id] || 0
              const up = change >= 0

              return (
                <tr
                  key={coin.id}
                  className={'market-row' + (selectedCoin === coin.id ? ' selected' : '') + ' ' + flash}
                  onClick={() => onSelectCoin(coin.id)}
                >
                  <td>
                    <button
                      className={'star-btn' + (watchlist.has(coin.id) ? ' starred' : '')}
                      onClick={e => {
                        e.stopPropagation()
                        setWatchlist(prev => {
                          const next = new Set(prev)
                          next.has(coin.id) ? next.delete(coin.id) : next.add(coin.id)
                          return next
                        })
                      }}
                    >
                      <Star size={13} />
                    </button>
                  </td>
                  <td>
                    <div className="coin-cell">
                      <div className="coin-dot" style={{ background: coin.color }} />
                      <div>
                        <div className="coin-symbol">{coin.symbol}</div>
                        <div className="coin-name-small">{coin.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className={'price-cell ' + flash}>{fmtPrice(price)}</td>
                  <td>
                    <span className={'change-badge ' + (up ? 'up' : 'down')}>
                      {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                      {Math.abs(change).toFixed(2)}%
                    </span>
                  </td>
                  <td className="hide-sm muted">{fmtLarge(coin.marketCap)}</td>
                  <td className="hide-sm muted">{fmtLarge(coin.volume)}</td>
                  <td className="hide-md">
                    <MiniSparkline history={histories[coin.id]} color={coin.color} up={up} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
