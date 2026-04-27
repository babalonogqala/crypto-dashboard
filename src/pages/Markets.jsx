import MarketTable from '../components/MarketTable'
import PriceChart from '../components/PriceChart'
import { useState } from 'react'

export default function Markets({ coins, prices, prevPrices, histories, changes }) {
  const [selectedCoin, setSelectedCoin] = useState('bitcoin')
  return (
    <div className="page-content">
      <div className="page-heading">
        <h1>Markets</h1>
        <p>Live prices across all tracked assets</p>
      </div>
      <PriceChart selectedCoin={selectedCoin} prices={prices} />
      <MarketTable
        coins={coins}
        prices={prices}
        prevPrices={prevPrices}
        changes={changes}
        histories={histories}
        onSelectCoin={setSelectedCoin}
        selectedCoin={selectedCoin}
      />
    </div>
  )
}
