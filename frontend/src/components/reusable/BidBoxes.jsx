const BidBoxes = ({ title, headingsData, contentData, isTradeBox = false }) => {
  
  const formatAmount = (amount) => {
    const num1 = Number(amount);
    return (num1/1000000000).toFixed(2);
  }
  
  return (
    <div className="w-full">
      {/* Heading */}
      <div className="py-2.5">
        <p className="text-xs text-center text-offWhiteColor">{title}</p>
      </div>

      {/* Container */}
      <div
        className={`w-full ${
          isTradeBox === true ? "h-[436px]" : "h-[200px]"
        } overflow-auto bg-black rounded border-y border-y-borderColor border-opacity-40 shadow-cardShadow p-2 space-y-2`}
      >
        {/* Heading */}
        <div className="grid grid-cols-3 gap-1">
          {/* APY */}
          {headingsData?.map((item, idx) => (
            <div key={idx} className="text-center">
              <p className="text-tenPixel text-offWhiteColor">{item}</p>
            </div>
          ))}
        </div>

        {/* Content */}
        {contentData?.map((item, idx) => (
          <div key={idx} className="grid grid-cols-3 gap-1">
            {/* APY */}
            <div className="text-center">
              <p className="text-tenPixel text-offWhiteColor">{formatAmount(item?.sui_amount)}</p>
            </div>

            {/* Size */}
            <div className="text-center">
              <p className="text-tenPixel text-offWhiteColor">{formatAmount(item?.token_amount)}</p>
            </div>

            {/* Total */}
            <div className="text-center">
              <p className="text-tenPixel text-offWhiteColor">{item?.rate} %</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BidBoxes;
