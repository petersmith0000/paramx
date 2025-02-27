import { useState, useEffect } from "react";
import BidBoxes from "../reusable/BidBoxes";

const generateFakeData = () => {
  // Random APY generation between 2% and 3% (trade range)
  const apy = (Math.random() * 1 + 2).toFixed(4);

  // Random Size between 10 and 100
  const size = (Math.random() * 90 + 10).toFixed(2);

  // Random Total calculation: Total = Size * APY
  const total = (parseFloat(size) * parseFloat(apy)).toFixed(2);

  return {
    apy,
    size,
    total,
  };
};

const RightTrades = (type, selectedMaturity) => {
  const initialBids = Array.from({ length: 18 }, () => generateFakeData());
  const [trades, setTrades] = useState(initialBids);

  useEffect(() => {

    // Simulate live updates every 3 seconds (faster updates)
    const intervalId = setInterval(() => {
      // Create copies of the current trades to simulate changes
      const updatedTrades = [...trades];

      // Insert a new fake trade at the top
      updatedTrades.unshift(generateFakeData());  // Insert a new fake trade at the top

      // Remove the last element to simulate filled trades (trade history size stays constant)
      updatedTrades.pop();  // Remove the last trade

      // Update state with the new data
      setTrades(updatedTrades);
    }, 300); // Update every 3 seconds for faster changes

    // Clean up the interval on unmount
    return () => clearInterval(intervalId);
  }, [trades]); // Ensure to recreate the interval only if trades change

  const headingsData = ["APY", "Size", "Total"];

  return (
    <div className="w-full">
      {/* Trades */}
      <BidBoxes
        title={"Trades"}
        headingsData={headingsData}
        contentData={trades}
        isTradeBox
      />
    </div>
  );
};

export default RightTrades;
