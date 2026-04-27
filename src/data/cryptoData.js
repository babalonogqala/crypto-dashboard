// USD to ZAR rate (approximate)
export const USD_TO_ZAR = 18.65

export const COINS = [
  { id: 'bitcoin',   symbol: 'BTC',  name: 'Bitcoin',   color: '#F7931A', basePrice: 67420   * USD_TO_ZAR, marketCap: 1324000000000 * USD_TO_ZAR, volume: 28400000000 * USD_TO_ZAR, supply: 19700000 },
  { id: 'ethereum',  symbol: 'ETH',  name: 'Ethereum',  color: '#627EEA', basePrice: 3521    * USD_TO_ZAR, marketCap: 423000000000  * USD_TO_ZAR, volume: 14200000000 * USD_TO_ZAR, supply: 120000000 },
  { id: 'solana',    symbol: 'SOL',  name: 'Solana',    color: '#9945FF', basePrice: 178.4   * USD_TO_ZAR, marketCap: 82000000000   * USD_TO_ZAR, volume: 3800000000  * USD_TO_ZAR, supply: 460000000 },
  { id: 'bnb',       symbol: 'BNB',  name: 'BNB',       color: '#F3BA2F', basePrice: 594.2   * USD_TO_ZAR, marketCap: 89000000000   * USD_TO_ZAR, volume: 1900000000  * USD_TO_ZAR, supply: 149000000 },
  { id: 'xrp',       symbol: 'XRP',  name: 'XRP',       color: '#00AAE4', basePrice: 0.592   * USD_TO_ZAR, marketCap: 33000000000   * USD_TO_ZAR, volume: 1200000000  * USD_TO_ZAR, supply: 55000000000 },
  { id: 'cardano',   symbol: 'ADA',  name: 'Cardano',   color: '#0033AD', basePrice: 0.455   * USD_TO_ZAR, marketCap: 16000000000   * USD_TO_ZAR, volume: 480000000   * USD_TO_ZAR, supply: 35000000000 },
  { id: 'avalanche', symbol: 'AVAX', name: 'Avalanche', color: '#E84142', basePrice: 37.8    * USD_TO_ZAR, marketCap: 15600000000  * USD_TO_ZAR, volume: 620000000   * USD_TO_ZAR, supply: 413000000 },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', color: '#2A5ADA', basePrice: 14.72   * USD_TO_ZAR, marketCap: 8700000000   * USD_TO_ZAR, volume: 380000000   * USD_TO_ZAR, supply: 587000000 },
]

export function generatePriceHistory(basePrice, days = 30) {
  const history = []
  let price = basePrice * (0.78 + Math.random() * 0.08)
  const now = Date.now()
  for (let i = days; i >= 0; i--) {
    price = price * (1 + (Math.random() - 0.48) * 0.04)
    history.push({
      time: new Date(now - i * 24 * 60 * 60 * 1000).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' }),
      price: Math.max(price, basePrice * 0.3),
      volume: Math.random() * 1e10 + 5e9,
    })
  }
  history[history.length - 1].price = basePrice
  return history
}

export function generateLivePrice(base) {
  return base * (1 + (Math.random() - 0.5) * 0.002)
}

export function fmtPrice(price) {
  if (price >= 10000) return 'R' + Math.round(price).toLocaleString('en-ZA')
  if (price >= 1)     return 'R' + price.toFixed(2)
  return 'R' + price.toFixed(4)
}

export function fmtLarge(n) {
  if (n >= 1e15) return 'R' + (n / 1e15).toFixed(2) + 'Q'
  if (n >= 1e12) return 'R' + (n / 1e12).toFixed(2) + 'T'
  if (n >= 1e9)  return 'R' + (n / 1e9).toFixed(1)  + 'B'
  if (n >= 1e6)  return 'R' + (n / 1e6).toFixed(1)  + 'M'
  return 'R' + Math.round(n).toLocaleString('en-ZA')
}

export function fmtSupply(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  return n.toLocaleString()
}
