import MarketBuySellTab from "./MarketBuySellTab";
import LimitBuySellTab from "./LimitBuySellTab";
import { useState } from "react";

const TradeBuySellBox = ({ type, wallet, selectedMaturity }) => {
  // Tab names and states
  const tabNames = [ "Limit"]; // "Market",
  const [selectedTab, setSelectedTab] = useState("limit");

  return (
    <div className="px-2 pt-5 pb-2 border rounded border-borderColor border-opacity-40 bg-themeBlue shadow-cardShadow">
      {/* Tab Selector */}
      <div className="flex items-center justify-center gap-10 pb-3.5">
        {tabNames?.map((item, idx) => (
          <button
            key={idx}
            className={`text-white text-tenPixel cursor-pointer ${
              selectedTab === item.toLowerCase()
                ? "underline underline-offset-4"
                : ""
            }`}
            onClick={() => setSelectedTab(item.toLowerCase())}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Conditional Rendering Tabs */}
      {selectedTab === "market" ? (
        <MarketBuySellTab type={type} wallet={wallet}/>
      ) : selectedTab === "limit" ? (
        <LimitBuySellTab type={type} wallet={wallet} selectedMaturity={selectedMaturity}/>
      ) : null}
    </div>
  );
};

export default TradeBuySellBox;
