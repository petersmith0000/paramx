const OrderBookTable = ({ cellData = [] }) => {
  return (
    <div className="w-full py-2 px-2 h-[200px] overflow-auto bg-black border border-borderColor border-opacity-40 rounded">
      {/* Heading */}
      <div className="grid grid-cols-[100px_120px_180px_1fr] gap-2">
        {/* Pool */}
        <div className="text-center">
          <p className="text-tenPixel text-offWhiteColor">Pool</p>
        </div>

        {/* Balance */}
        <div className="text-center">
          <p className="text-tenPixel text-offWhiteColor">Balance</p>
        </div>

        {/* USDC Value */}
        <div className="text-center">
          <p className="text-tenPixel text-offWhiteColor">USDC Value</p>
        </div>

        {/* PNL (ROE %) */}
        <div className="text-center">
          <p className="text-tenPixel text-offWhiteColor">PNL (ROE %)</p>
        </div>
      </div>

      {/* We have to apply the same layout style for the date table */}
      <div className="w-full">
        {/* Return The Table Cells here */}
        {/* Cell */}
        {cellData?.map((item, idx) => (
          <div
            key={idx}
            className="grid grid-cols-[100px_120px_180px_1fr] gap-2"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderBookTable;
