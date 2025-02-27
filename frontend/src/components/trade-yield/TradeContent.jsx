import OrderbooksAndTrades from "./OrderbooksAndTrades";
import TradeBuySellBox from "./TradeBuySellBox";
import TradeMonitor from "./TradeMonitor";
import TradeOrderBook from "./TradeOrderBook";
import { useState } from "react";
import { MATURITIES } from "../../constants";


const TradeContent = ({type, wallet}) => {
  
  const [selectedMaturity, setSelectedMaturity] = useState(MATURITIES[0]); 
  // console.log(wallet)

  return (
    <div className="w-full bg-black screen-height">
      {/* Wrapper Start */}
      <div className="w-full max-w-[1200px] mx-auto py-10">
        {/* Layout */}
        <div className="grid grid-cols-[1fr_400px] gap-11">
          {/* left */}
          <div className="w-full">
            {/* Monitor */}
            <TradeMonitor selectedMaturity={selectedMaturity} setSelectedMaturity={setSelectedMaturity}/>

            {/* Order Book */}
            <OrderbooksAndTrades type={type} selectedMaturity={selectedMaturity} />
          </div>

          {/* Right */}
          <div className="w-full">
            {/* Buy Sell Box */}
            <TradeBuySellBox type={type} wallet={wallet} selectedMaturity={selectedMaturity} />

            {/* Orderbook and trades */}
            <TradeOrderBook type={type} wallet={wallet} />
          </div>
        </div>
      </div>
      {/* Wrapper End */}
    </div>
  );
};

export default TradeContent;
