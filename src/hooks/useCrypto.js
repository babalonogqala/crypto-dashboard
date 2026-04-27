import { useState, useEffect } from 'react'
import { COINS, generatePriceHistory, generateLivePrice } from '../data/cryptoData'

export function useCrypto() {
  const [prices, setPrices] = useState(() => {
    const p = {}
    COINS.forEach(c => { p[c.id] = c.basePrice })
    return p
  })
  const [prevPrices, setPrevPrices] = useState(() => {
    const p = {}
    COINS.forEach(c => { p[c.id] = c.basePrice })
    return p
  })
  const [histories] = useState(() => {
    const h = {}
    COINS.forEach(c => { h[c.id] = generatePriceHistory(c.basePrice, 30) })
    return h
  })
  const [changes] = useState(() => {
    const ch = {}
    COINS.forEach(c => { ch[c.id] = (Math.random() - 0.42) * 12 })
    return ch
  })
  const [portfolio] = useState(() => [
    { id: 'bitcoin',  amount: 0.42 },
    { id: 'ethereum', amount: 3.8  },
    { id: 'solana',   amount: 45   },
    { id: 'bnb',      amount: 2.1  },
  ])
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevPrices(p => ({ ...p }))
      setPrices(prev => {
        const next = {}
        COINS.forEach(c => { next[c.id] = generateLivePrice(prev[c.id]) })
        return next
      })
      setLastUpdate(new Date())
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const getChange24h  = (id) => changes[id] || 0
  const getPortfolioValue = () => portfolio.reduce((sum, p) => {
    const coin = COINS.find(c => c.id === p.id)
    return sum + (prices[p.id] || coin.basePrice) * p.amount
  }, 0)

  return { prices, prevPrices, histories, changes, portfolio, lastUpdate, getChange24h, getPortfolioValue, coins: COINS }
}
