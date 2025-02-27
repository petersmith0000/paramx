import { useState } from "react";
import RightOrderbook from "./RightOrderbook";
import RightTrades from "./RightTrades";

const OrderbooksAndTrades = ({type, selectedMaturity}) => {
  const btnsData = ["Orderbook", "Trades"];
  const [activeTab, setActiveTab] = useState("orderbook");

  return (
    <div className="w-full mt-5 border rounded bg-themeBlue border-borderColor border-opacity-40 shadow-cardShadow">
      {/* Heading */}
      <div className="flex items-center justify-around w-full p-2 border-b border-b-borderColor">
        {btnsData?.map((item, idx) => (
          <button
            key={idx}
            className={`text-xs text-offWhiteColor ${
              activeTab === item.toLowerCase()
                ? "underline underline-offset-4"
                : ""
            }`}
            onClick={() => setActiveTab(item.toLowerCase())}
          >
            {item}
          </button>
        ))}
      </div>

      {/* OrderBook */}
      {activeTab === "orderbook" ? (
        <RightOrderbook type={type} selectedMaturity={selectedMaturity} />
      ) : activeTab === "trades" ? (
        <RightTrades type={type} selectedMaturity={selectedMaturity} />
      ) : null}
    </div>
  );
};

export default OrderbooksAndTrades;
