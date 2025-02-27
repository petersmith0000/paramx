import { useState, useEffect } from "react";
import LimitAvailableTrade from "../reusable/LimitAvailableTrade";
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import constants from "../../constants.json";


const LimitBuySellTab = ({ type, wallet, selectedMaturity }) => {
  const selectionBtns = ["Buy", "Sell"];
  const [activeSelection, setActiveSelection] = useState("buy");

  const data = [
    {
      label: "Order Value",
      hasUnderline: false,
      value: "1932.23",
    },
    {
      label: "Slippage",
      hasUnderline: true,
      value: "Est: 0.0282%/ Max: 102",
    },
    {
      label: "Fees",
      hasUnderline: true,
      value: "0.0350% / 0.0100%",
    },
  ];

  const [tradeAPY, setTradeAPY] = useState("");
  const [tradeSui, setTradeSui] = useState("");
  const [suiBalance, setSuiBalance] = useState("0.00");
  const rpcUrl = getFullnodeUrl('localnet');
  const client = new SuiClient({ url: rpcUrl });
  
  const executeTrade = async () => {
    if(wallet.connected && tradeAPY != "" && tradeSui != "" && Number(tradeSui) < Number(suiBalance)){
      
      const suiAmount = tradeSui*1_000_000_000;
      
      try {
        // execute the programmable transaction
        // const val = tx.splitCoins("0x2022addec9d9f0ab53e8cb8738bb33e129210f818e64591c914a38c6fa9f7942", [1000000000]);
        const trueApy = (Number(tradeAPY)/100)/(12/3);
        const t_amount = type == 1 ? Math.round(suiAmount/trueApy) : Math.round(suiAmount*(trueApy + 1.0)) ;
        
        const tx = new Transaction();
        console.log([suiAmount, type, t_amount, selectedMaturity]);
        const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(suiAmount)]);
        tx.moveCall({
          package: constants["ParamXPackageAddress"],
          module: "market",
          function: "limit_bid", 
          arguments: [coin, tx.pure.u8(type), tx.pure.u64(t_amount), tx.pure.u64(selectedMaturity)],
          typeArguments: []
        })
        tx.setGasBudget(suiAmount+100000000)
        // tx.transferObjects([coin], tx.pure.address('0x0ce5a9df55b48f211a5acc10dd01e23ef05e7d1324239922ad86b20c7836b836'));
        const resData = await wallet.signAndExecuteTransaction({transaction: tx});
        console.log(resData);

      } catch (e) {
        console.error('failed', e);
      }  
  
    }
  }

  const updateSuiBalance = async (address) => {
    if (address == undefined){
      return;
    }
    const amounts = await client.getCoins({
      owner: address,
    });
    let total = 0;
    for(const amount of amounts['data']) {
      total += Number(amount["balance"])/1_000_000_000;
    }
    setSuiBalance(total.toFixed(2));
  }

  const updatePxBalance = async (address, itype) => {
    if (address == undefined){
      return;
    }
    const objs = await client.getOwnedObjects({
      owner: address
    });
    const obj_d = await client.multiGetObjects({
      ids: objs['data'].map((d)=>{return d['data']['objectId']}),
      options: {
        showContent: true,
        showType: true
    }});
    console.log(obj_d)
    const total = obj_d.filter(
      (o)=>{
      const od = o['data'];
      if(od.type != `${constants['ParamXPackageAddress']}::yield_trading_protocol::PxToken`){
        return false;
      }
      const odcf = od['content']['fields'];
      if(odcf['maturity_ms'] != selectedMaturity || odcf['token_type'] != itype){
        return false;
      }
      return true;
    }).map((o)=>{
      return Number(o['data']['content']['fields']['amount']);
    }).reduce((acc, num) => acc + num, 0)/1_000_000_000;

    setSuiBalance(total.toFixed(2));
  }

  // console.log(rpcUrl)
  useEffect(() => {

    if (activeSelection == "buy"){
      updateSuiBalance(wallet.address);
    } else {
      updatePxBalance(wallet.address, type);
    }
    
  }, [wallet, activeSelection, type, selectedMaturity]);
  

  const handleInputChange = (e) => {
    let value = e.target.value.replace(/[^0-9.]/g, ""); // Remove non-numeric & non-dot chars
    value = value.replace(/^(\d*\.?\d*).*$/, "$1"); // Allow only one decimal point
    if (value) {
      setTradeAPY(value);
    } else {
      setTradeAPY("");
    }
  };

  const handleSuiInputChange = (e) => {
    let value = e.target.value.replace(/[^0-9.]/g, ""); // Remove non-numeric & non-dot chars
    value = value.replace(/^(\d*\.?\d*).*$/, "$1"); // Allow only one decimal point
    if (value) {
      setTradeSui(value);
    } else {
      setTradeSui("");
    }
  };

  return (
    <>
      {/* Buy Sell Zone */}
      <div className="border-y border-y-borderColor border-opacity-80 pt-5 pb-3.5">
        {/* Btns */}
        <div className="w-[140px] mx-auto bg-themeBlue shadow-cardShadow h-[30px] flex items-center border border-borderColor border-opacity-40 rounded">
          {/* Btn */}
          {selectionBtns?.map((item, idx) => (
            <button
              key={idx}
              className={`w-full h-full text-center rounded text-tenPixel ${
                activeSelection === item.toLowerCase()
                  ? "text-black bg-activeBtnBg shadow-cardShadow"
                  : "bg-transparent text-white"
              }`}
              onClick={() => setActiveSelection(item.toLowerCase())}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Available to trade */}
        <div className="w-full px-8">
          <LimitAvailableTrade suiBalance={suiBalance} 
          tradeAPY={tradeAPY} handleInputChange={handleInputChange} 
          tradeSui={tradeSui} handleSuiInputChange={handleSuiInputChange}
          activeSelection={activeSelection} type={type}/>
          {/* Trade APY */}
          <div className="mt-2 text-end">
            <p className="text-xs text-offWhiteColor">GTC</p>
          </div>
        </div>

        {/* Btn */}
        <button className="mt-4 themeBtn" onClick={executeTrade}>Confirm Trade</button>
      </div>

      {/* Details */}
      <div className="pt-2.5 space-y-1 px-4">
        {data?.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-2">
            <p
              className={`text-tenPixel text-offWhiteColor ${
                item?.hasUnderline === true
                  ? "underline underline-offset-2"
                  : ""
              }`}
            >
              {item.label}
            </p>
            <p className="text-tenPixel text-offWhiteColor">{item.value}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default LimitBuySellTab;
