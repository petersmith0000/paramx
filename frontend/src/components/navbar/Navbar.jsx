import { FaAngleDown } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import {ConnectButton} from '@suiet/wallet-kit';

const Navbar = () => {
  // Links
  const navLinks = [
    {
      id: 0,
      target: "/mint",
      text: "Mint Positions",
    },
    {
      id: 1,
      target: "/trade-yield",
      text: "Trade Yield",
    },
    {
      id: 2,
      target: "/fixed-income",
      text: "Fixed-income",
    },
  ];

  return (
    <div className="w-full h-[50px] flex items-center bg-themeBlue navbar">
      <div className="grid grid-cols-3 gap-2 custom-container">
        {/* Empty Cell */}
        <div>&nbsp;</div>

        {/* Links */}
        <div className="flex items-center justify-center gap-8">
          {navLinks?.map(({ id, target, text }) => (
            <NavLink key={id} to={target} className="text-xs text-white">
              {text}
            </NavLink>
          ))}
        </div>

        {/* Wallet Address */}
        <div className="flex items-center justify-end">
          {/* Btn */}
          {/* <button className="flex items-center gap-2 text-xs text-white cursor-pointer">
            0xaa...bb
            <FaAngleDown />
          </button> */}
          <ConnectButton label={"Wallet"}
              onConnectSuccess={ (walletName) => {
                console.log(walletName);
              }}
              ></ConnectButton>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
