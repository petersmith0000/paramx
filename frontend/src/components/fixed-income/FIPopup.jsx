import SuiIcon from "../../assets/sui.svg";
import vSUIIcon from "../../assets/VSui.svg";
import AvailableToTrade from "../reusable/AvailableToTrade";
import DateDropdown from "../reusable/DateDropdown";
import { AvgApyMap, TotalMintedMap } from "../../constants";
import constants from "../../constants.json"
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { useState, useEffect } from 'react';
import { Transaction } from "@mysten/sui/transactions";

const FIPopup = ({ wallet, openState, selectedMaturity, setSelectedMaturity }) => {
  const rpcUrl = getFullnodeUrl('localnet');
  const client = new SuiClient({ url: rpcUrl });
  const [VSuiBalance, setVSuiBalance] = useState("0.00");
  const [VSuiAmount, setVSuiAmount] = useState("1");
  const [coins, setCoins] = useState({});

  useEffect(() => {
      // console.log(wallet.address)
      const updateVSuiBalance = async (address) => {
        if (address == undefined){
          return;
        }
        console.log(address)
        const amounts = await client.getCoins({
          owner: address,
          coinType: constants["VoloLiquidStakingPackageAddress"]+"::cert::CERT"
        })
        setCoins(amounts['data']);
        let total = 0;
        for(const amount of amounts['data']) {
          total += Number(amount["balance"])/1_000_000_000;
        }
        setVSuiBalance(total.toFixed(2));
      }
  
      updateVSuiBalance(wallet.address);
      
    }, [wallet]);
    
    const executeMint = async () => {
      if(wallet.connected && VSuiAmount != "" && Number(VSuiAmount) < Number(VSuiBalance)){
        
        const vSuiAmount = VSuiAmount*1_000_000_000;
        console.log(vSuiAmount)
        // console.log(coins);
        const coinId = coins[0]["coinObjectId"]
        try {
          const tx = new Transaction();
          // tx.getCoins()
          const [coin] = tx.splitCoins(tx.object(coinId), [tx.pure.u64(vSuiAmount)]);
          tx.moveCall({
            package: constants["ParamXPackageAddress"],
            module: "yield_trading_protocol",
            function: "mint_PT_YT", 
               arguments: [coin, tx.object(constants["VoloNativePoolObjectId"]), tx.object(constants["VoloMetaDataObjectId"]), tx.pure.u64(selectedMaturity)]
          })
          tx.setGasBudget(100000000)
          
          const resData = await wallet.signAndExecuteTransaction({transaction: tx});
          console.log(resData);
  
        } catch (e) {
          console.error('failed', e);
        }  
    
      }
    }
    

  // Data
  const cardsDetailsData = [
    {
      id: 1,
      label: "Input",
      hasUnderline: false,
      value: VSuiAmount+" VSui",
    },
    {
      id: 2,
      label: "Output PT",
      hasUnderline: false,
      value: VSuiAmount+" PT VSui",
    },
    {
      id: 3,
      label: "Output YT",
      hasUnderline: false,
      value: VSuiAmount + " YT VSui",
    },
    {
      id: 4,
      label: "Expiration",
      hasUnderline: true,
      value: "31 March 2025 (55 Days)",
    },
    // {
    //   id: 5,
    //   label: "Fees",
    //   hasUnderline: true,
    //   value: "0.0350% / 0.0100%",
    // },
    // {
    //   id: 6,
    //   label: "Amount Claimable in 55 Days",
    //   hasUnderline: false,
    //   value: "2739.278 SSUI",
    // },
  ];

  const handleVSuiInputChange = (e) => {
    let value = e.target.value.replace(/[^0-9.]/g, ""); // Remove non-numeric & non-dot chars
    value = value.replace(/^(\d*\.?\d*).*$/, "$1"); // Allow only one decimal point
    if (value) {
      setVSuiAmount(value);
    } else {
      setVSuiAmount("");
    }
  };

  return (
    <div
      className={`w-full max-w-[400px] bg-themeBlue shadow-cardShadow rounded border border-borderColor border-opacity-40 px-2.5 py-5 fixed left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 ${
        openState === true
          ? "opacity-100 visible top-1/2"
          : "opacity-0 invisible top-[65%]"
      } transition-all duration-200`}
    >
      {/* Heading */}
      <div className="flex items-center justify-between w-full pb-2.5 border-b border-b-white">
        {/* left */}
        <div className="flex items-center gap-2">
          <img src={vSUIIcon} alt="sui__icon" />
          <p className="text-xs text-white">Volo Staked SUI</p>
        </div>

        {/* Right */}
        <DateDropdown selectedMaturity={selectedMaturity} setSelectedMaturity={setSelectedMaturity} />
      </div>

      {/* Confirm Fixed APY */}
      <div className="px-5 py-4 border-b border-b-white">
        {/* Heading */}
        <div className="flex items-center justify-around gap-4">
          <p className="text-xs text-white">3 Month Avg APY</p>
          <p className="text-xs text-white">{AvgApyMap[selectedMaturity]}%</p>
        </div>

        <div className="flex items-center justify-around gap-4 py-4">
          <p className="text-xs text-white">Total Minted</p>
          <p className="text-xs text-white">{TotalMintedMap[selectedMaturity]} Volo Sui</p>
        </div>

        {/* Available To Trade */}
        <div className="w-full">
          <div className="flex items-center justify-between w-full gap-4 pt-4 pr-4">
          {/* left */}
          <p className="text-white text-tenPixel">Available To Trade</p>

          {/* Right */}
          <div className="space-y-1.5">
            {/* <p className="text-white text-tenPixel text-end">0.00 USDC</p> */}
            <p className="text-white text-tenPixel text-end">{VSuiBalance} VSui</p>
          </div>
        </div>

        <div className="w-full h-[30px] px-2 flex items-center justify-between gap-4 border rounded shadow-cardShadow border-borderColor border-opacity-40 mt-2">
          {/* Left side: Label */}
          <input
            type="text"
            value={VSuiAmount}
            onChange={handleVSuiInputChange}
            placeholder="Size"  // Default text when input is empty
            className="text-xs text-white bg-transparent border-none outline-none w-full"
          />

          {/* Right side: Currency */}
          <p className="text-xs text-white">VSui</p>
        </div>

          {/* Confirm Btn */}
          <button 
          className="mt-6 themeBtn"
          onClick={executeMint}
          >Mint PT & YT</button>
        </div>
      </div>

      {/* Data about the orders */}
      <div className="pt-2.5 px-6 space-y-2">
        {/* Single Item */}
        {cardsDetailsData?.map(({ id, label, value, hasUnderline }) => (
          <div key={id} className="flex items-center justify-between gap-2">
            {/* left */}
            <p
              className={`text-xs text-offWhiteColor ${
                hasUnderline === true ? "underline underline-offset-2" : ""
              }`}
            >
              {label}
            </p>

            {/* Right */}
            <p className="text-xs text-offWhiteColor text-end">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FIPopup;
