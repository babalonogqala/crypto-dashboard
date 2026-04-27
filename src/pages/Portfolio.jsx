import PortfolioPanel from '../components/PortfolioPanel'
import { fmtLarge, fmtPrice, COINS } from '../data/cryptoData'

export default function Portfolio({ portfolio, prices, changes }) {
  const items = portfolio.map(p => {
    const coin = COINS.find(c => c.id === p.id)
    const price = prices[p.id] || coin.basePrice
    return { ...coin, amount: p.amount, price, value: price * p.amount, change: changes[p.id] || 0 }
  })
  const total = items.reduce((s, i) => s + i.value, 0)

  return (
    <div className="page-content">
      <div className="page-heading">
        <h1>Portfolio</h1>
        <p>Total value: {fmtLarge(total)}</p>
      </div>
      <div className="portfolio-page-grid">
        <PortfolioPanel portfolio={portfolio} prices={prices} changes={changes} />
        <div className="portfolio-holdings-card">
          <h3>Holdings Detail</h3>
          <table className="holdings-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Amount</th>
                <th>Price</th>
                <th>Value</th>
                <th>24h</th>
                <th>Allocation</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const pct = ((item.value / total) * 100).toFixed(1)
                const up = item.change >= 0
                return (
                  <tr key={item.id}>
                    <td>
                      <div className="coin-cell">
                        <div className="coin-dot" style={{ background: item.color }} />
                        <div>
                          <div className="coin-symbol">{item.symbol}</div>
                          <div className="coin-name-small">{item.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="muted">{item.amount} {item.symbol}</td>
                    <td>{fmtPrice(item.price)}</td>
                    <td><strong>{fmtLarge(item.value)}</strong></td>
                    <td>
                      <span className={'change-badge ' + (up ? 'up' : 'down')}>
                        {up ? '+' : ''}{item.change.toFixed(2)}%
                      </span>
                    </td>
                    <td>
                      <div className="alloc-cell">
                        <span>{pct}%</span>
                        <div className="alloc-bar-wrap">
                          <div className="alloc-bar" style={{ width: pct + '%', background: item.color }} />
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
