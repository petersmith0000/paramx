import { useState } from "react";
import OrderBookTable from "./OrderBookTable";

const TradeOrderBook = () => {
  const orderBookHeading = ["Open Orders", "Positions", "Order History"];

  // Selected state for the table
  const [selectedTab, setSelectedTab] = useState("open orders");

  return (
    <div className="w-full mt-6 border rounded bg-themeBlue border-borderColor border-opacity-40">
      {/* Heading */}
      <div className="w-full px-3 pt-2.5 pb-4 flex items-center gap-10">
        {orderBookHeading?.map((item, idx) => (
          <p
            key={idx}
            className={`text-xs text-offWhiteColor cursor-pointer ${
              selectedTab === item.toLowerCase()
                ? "underline underline-offset-4"
                : ""
            }`}
            onClick={() => setSelectedTab(item.toLocaleLowerCase())}
          >
            {item}
          </p>
        ))}
      </div>

      {/* Table (We can pass data by props)*/}
      <OrderBookTable cellData={[]} />
    </div>
  );
};

export default TradeOrderBook;
