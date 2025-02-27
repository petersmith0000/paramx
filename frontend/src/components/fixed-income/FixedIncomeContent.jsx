import FICard from "./FICard";
import FIPopup from "./FIPopup"
import { MATURITIES } from "../../constants";
import { useState } from "react";

const FixedIncomeContent = ({wallet}) => {
  const [selectedMaturity, setSelectedMaturity] = useState(MATURITIES[0]);

  return (
    <div className="w-full py-10 bg-black screen-height">
      {/* Wrapper Start */}
      <div className="w-full max-w-[1200px] mx-auto relative">
        {/* <FICard /> */}
        {/* Popup */}
        <FIPopup openState={true} wallet={wallet} selectedMaturity={selectedMaturity} setSelectedMaturity={setSelectedMaturity} />
      </div>
      {/* Wrapper End */}
    </div>
  );
};

export default FixedIncomeContent;

