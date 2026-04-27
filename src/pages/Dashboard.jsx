import { useState } from 'react'
import Ticker from '../components/Ticker'
import StatsRow from '../components/StatsRow'
import PriceChart from '../components/PriceChart'
import MarketTable from '../components/MarketTable'
import PortfolioPanel from '../components/PortfolioPanel'

export default function Dashboard({ coins, prices, prevPrices, histories, changes, portfolio, getPortfolioValue }) {
  const [selectedCoin, setSelectedCoin] = useState('bitcoin')

  return (
    <div className="dashboard">
      <Ticker coins={coins} prices={prices} changes={changes} />
      <StatsRow
        coins={coins}
        prices={prices}
        changes={changes}
        portfolioValue={getPortfolioValue()}
      />
      <div className="dashboard-grid">
        <div className="dashboard-main">
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
        <div className="dashboard-side">
          <PortfolioPanel portfolio={portfolio} prices={prices} changes={changes} />
        </div>
      </div>
    </div>
  )
}
