import { BsCaretDown } from "react-icons/bs";
import vSUIIcon from "../../assets/VSui.svg";
import SuiIcon from "../../assets/sui.svg";
import DateDropdown from "../reusable/DateDropdown";

const TradeMonitorHeading = ({selectedMaturity, setSelectedMaturity}) => {

  // Data
  const monitorHeadingData = [
    { id: 1, label: "Fixed Rate", value: "2.58%" },
    { id: 2, label: "24h Volume", value: "$128,302" },
    { id: 3, label: "TVL", value: "$128,302,102" },
  ];

  return (
    <div className="flex items-center justify-between w-full gap-4 px-4 pb-6">
      {/* left */}
      <div className="flex items-center gap-9">
        {/* inner left */}
        <div className="flex items-center gap-2">
          <img src={vSUIIcon} alt="sui__icon" />
          <p className="text-sm text-white">Volo Staked SUI</p>
          {/* <BsCaretDown color="#fff" /> */}
        </div>

        {/* Right */}
        <DateDropdown selectedMaturity={selectedMaturity} setSelectedMaturity={setSelectedMaturity} />
      </div>

      {/* Right */}
      <div className="flex items-center gap-9">
        {/* Single Item */}
        {monitorHeadingData?.map(({ label, value, id }) => (
          <div key={id}>
            {/* Label */}
            <h5 className="text-offWhiteColor text-[8px] underline underline-offset-2 mb-1 text-end">
              {label}
            </h5>

            {/* Value */}
            <p className="text-xs text-white">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradeMonitorHeading;
