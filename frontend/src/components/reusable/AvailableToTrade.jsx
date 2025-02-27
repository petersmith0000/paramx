
const AvailableToTrade = () => {

  return (
    <>
      <div className="flex items-center justify-between w-full gap-4 pt-4 pr-4">
        {/* left */}
        <p className="text-white text-tenPixel">Available To Trade</p>

        {/* Right */}
        <div className="space-y-1.5">
          {/* <p className="text-white text-tenPixel text-end">0.00 USDC</p> */}
          <p className="text-white text-tenPixel text-end">{"0.00"} VSui</p>
        </div>
      </div>

      <div className="w-full h-[30px] px-2 flex items-center justify-between gap-4 border rounded shadow-cardShadow border-borderColor border-opacity-40 mt-2">
        {/* Left side: Label */}
        <input
          type="text"
          placeholder="Size"  // Default text when input is empty
          className="text-xs text-white bg-transparent border-none outline-none w-full"
        />

        {/* Right side: Currency */}
        <p className="text-xs text-white">VSui</p>
      </div>

    </>
  );
};

export default AvailableToTrade;
