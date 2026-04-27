import { fmtPrice } from '../data/cryptoData'

export default function Ticker({ coins, prices, changes }) {
  const items = [...coins, ...coins]
  return (
    <div className="ticker-wrap">
      <div className="ticker-track">
        {items.map((coin, i) => {
          const change = changes[coin.id] || 0
          const up = change >= 0
          return (
            <div key={i} className="ticker-item">
              <span className="ticker-symbol" style={{ color: coin.color }}>{coin.symbol}</span>
              <span className="ticker-price">{fmtPrice(prices[coin.id] || coin.basePrice)}</span>
              <span className={'ticker-change ' + (up ? 'up' : 'down')}>
                {up ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
