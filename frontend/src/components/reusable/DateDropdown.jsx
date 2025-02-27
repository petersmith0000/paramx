import { useState } from "react";
import { BsCaretDown } from "react-icons/bs";
import { MATURITIES } from "../../constants";

const DateDropdown = ({selectedMaturity, setSelectedMaturity}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (dateObj) => {
    setSelectedMaturity(dateObj);
    setIsOpen(false);
  };

  const epochMsToDate = (epochTimeMs) => {
    return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(epochTimeMs));
  }
  const daysLeft = (epochTimeMs) => {
    const today = new Date(); // Get today's date
    const targetDate = new Date(epochTimeMs); // Convert epoch to Date object

    // Calculate the difference in milliseconds and convert to days
    const diffInMs = targetDate - today;
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    return diffInDays;
  };

  return (
    <div className="relative">
      {/* Dropdown Button */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className="text-xs text-offWhiteColor">
          {epochMsToDate(selectedMaturity)} ({daysLeft(selectedMaturity)} Days)
        </p>
        <BsCaretDown color="#fff" />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-8 left-0 bg-themeBlue text-white rounded-lg shadow-lg py-2 w-48 z-10 border border-borderColor border-opacity-30">
          {MATURITIES.map((dateObj) => (
            <div
              key={dateObj}
              className="px-4 py-2 text-xs hover:bg-gray-700 cursor-pointer"
              onClick={() => handleSelect(dateObj)}
            >
              {epochMsToDate(dateObj)} ({daysLeft(dateObj)} Days)
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DateDropdown;
