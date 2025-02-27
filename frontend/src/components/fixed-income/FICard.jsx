import { useState } from "react";

import vSUIIcon from "../../assets/VSui.svg";
import FIPopup from "./FIPopup";

const FICard = () => {
  // Data
  const cardsData = [
    {
      id: 1,
      date: "31 Mar 2025 (55 Days)",
      percent: "2.58%",
      status: "+2.58%",
      statusType: "increase",
    },
    {
      id: 2,
      date: "30 Jun 2025 (155 Days)",
      percent: "2.58%",
      status: "+2.58%",
      statusType: "decrease",
    },
    {
      id: 3,
      date: "30 Sep 2025 (255 Days)",
      percent: "2.58%",
      status: "+2.58%",
      statusType: "increase",
    },
    {
      id: 4,
      date: "31 Dec 2025 (355 Days)",
      percent: "2.58%",
      status: "+2.58%",
      statusType: "decrease",
    },
  ];

  // State for show the popup
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <div
        className="p-3 bg-themeBlue rounded border-[0.3px] border-borderColor border-opacity-40 w-full max-w-[350px] cursor-pointer active:scale-95 duration-200"
        onClick={() => setShowPopup((prev) => !prev)}
      >
        {/* Heading */}
        <div className="flex items-center gap-2">
          {/* Icon */}
          <img src={vSUIIcon} alt="sui__icon" />

          {/* Title */}
          <p className="text-xs text-white">Volo Staked SUI</p>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2.5">
          {/* Item */}
          {cardsData?.map(({ date, id, percent, status, statusType }) => (
            <div key={id} className="flex items-center justify-between">
              {/* Left */}
              <div>
                <p className="text-offWhiteColor text-tenPixel">{date}</p>
              </div>

              {/* Right */}
              <div className="flex items-center gap-5">
                {/* Percent */}
                <p className="text-offWhiteColor text-tenPixel">{percent}</p>

                {/* Status */}
                <p
                  className={`${
                    statusType === "increase"
                      ? "text-themeGreen"
                      : statusType === "decrease"
                      ? "text-themeRed"
                      : "text-offWhiteColor"
                  } text-tenPixel`}
                >
                  {status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popup */}
      <FIPopup openState={showPopup} />
    </>
  );
};

export default FICard;
