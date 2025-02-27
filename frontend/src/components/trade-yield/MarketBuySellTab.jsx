import { useState } from "react";
import AvailableToTrade from "../reusable/AvailableToTrade";

const MarketBuySellTab = () => {
  const selectionBtns = ["Buy", "Sell"];
  const [activeSelection, setActiveSelection] = useState("buy");

  const data = [
    {
      label: "Order Value",
      value: "1932.23",
    },
    {
      label: "Slippage",
      value: "Est: 0.0282%/ Max: 102",
    },
    {
      label: "Fees",
      value: "0.0350% / 0.0100%",
    },
  ];

  return (
    <>
      {/* Buy Sell Zone */}
      <div className="border-y border-y-borderColor border-opacity-80 pt-5 pb-3.5">
        {/* Btns */}
        <div className="w-[140px] mx-auto bg-themeBlue shadow-cardShadow h-[30px] flex items-center border border-borderColor border-opacity-40 rounded">
          {/* Btn */}
          {selectionBtns?.map((item, idx) => (
            <button
              key={idx}
              className={`w-full h-full text-center rounded text-tenPixel ${
                activeSelection === item.toLowerCase()
                  ? "text-black bg-activeBtnBg shadow-cardShadow"
                  : "bg-transparent text-white"
              }`}
              onClick={() => setActiveSelection(item.toLowerCase())}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Available to trade */}
        <div className="w-full px-8">
          <AvailableToTrade />
          {/* Trade APY */}
          <div className="flex items-center justify-between w-full mt-3">
            <p className="text-xs text-offWhiteColor">Trade APY</p>
            <p className="text-xs text-offWhiteColor">2.3923%</p>
          </div>
        </div>

        {/* Btn */}
        <button className="themeBtn mt-[58px]">Confirm Trade</button>
      </div>

      {/* Details */}
      <div className="pt-2.5 space-y-1 px-4">
        {data?.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-2">
            <p className="text-tenPixel text-offWhiteColor">{item.label}</p>
            <p className="text-tenPixel text-offWhiteColor">{item.value}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default MarketBuySellTab;
