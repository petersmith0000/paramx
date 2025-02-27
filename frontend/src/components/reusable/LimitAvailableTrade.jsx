

const LimitAvailableTrade = ({ suiBalance, tradeAPY, handleInputChange, tradeSui, handleSuiInputChange, activeSelection, type  }) => {

  return (
    <>
      <div className="flex items-center justify-between w-full gap-4 pt-4 pr-4">
        {/* Left */}
        <p className="text-white text-tenPixel">Available To Trade</p>

        {/* Right */}
        <p className="text-white text-tenPixel text-end">
          {activeSelection === "buy"
            ? `${suiBalance} SUI`
            : activeSelection === "sell" && type === 0
            ? `${suiBalance} PT SUI`
            : activeSelection === "sell" && type === 1
            ? `${suiBalance} YT SUI`
            : ""}
        </p>

      </div>

      {/* Yield APY Box */}
      <div className="w-full h-[30px] px-2 flex items-center justify-between border rounded shadow-cardShadow border-borderColor border-opacity-40 mt-2 relative">
        {/* Left: Label */}
        <p className="text-xs text-white w-full">APY</p>

        {/* Input Field */}
        
        <input
          type="text"
          value={tradeAPY}
          onChange={handleInputChange}
          placeholder="2.32"
          className="text-xs text-white text-right bg-transparent border-none outline-none w-full"
        />
        <p className="text-xs text-white">%</p>

        {/* Button to Set APY */}
        {/* <button
          onClick={generateRandomAPY}
          className="text-[10px] text-white pt-0.5 pl-1.5 pr-1.5 bg-themeBlue px-2 pl-0.5 pr-1 rounded hover:bg-gray-600 transition"
        >
          Mid
        </button> */}
      </div>

      {/* Size */}
      <div className="w-full h-[30px] px-2 flex items-center justify-between gap-4 border rounded shadow-cardShadow border-borderColor border-opacity-40 mt-2">
        {/* Left: Input */}
        <input
          type="text"
          placeholder="Size"
          className="text-xs text-white bg-transparent border-none outline-none"
          value={tradeSui}
          onChange={handleSuiInputChange}
        />

        {/* Right: Currency */}
        {/* SUI */}
        <p className="text-xs text-white">
          {activeSelection === "buy"
            ? `SUI`
            : activeSelection === "sell" && type === 0
            ? `PT SUI`
            : activeSelection === "sell" && type === 1
            ? `YT SUI`
            : ""}
        </p>
      </div>
    </>
  );
};

export default LimitAvailableTrade;
