import { Link } from "react-router-dom";
import { SystemState } from "../../constants";
import { Transaction } from "@mysten/sui/transactions";
import constants from "../../constants.json";

const Footer = ({ wallet }) => {
  // Define the special function for the faucet
  const handleFaucetClick = async () => {
      if(wallet.connected){
        const amount = 10*1_000_000_000;
        
        try {
          const tx = new Transaction();
          const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(amount)]);
          tx.moveCall({
            package: constants["VoloLiquidStakingPackageAddress"],
            module: "native_pool",
            function: "stake", 
            arguments: [tx.object(constants["VoloNativePoolObjectId"]), tx.object(constants["VoloMetaDataObjectId"]), tx.object(SystemState), coin]
          })
          tx.setGasBudget(amount+100000000)
          const resData = await wallet.signAndExecuteTransaction({transaction: tx});
          console.log(resData);
  
        } catch (e) {
          console.error('failed', e);
        }  
    
      }
  };

  // Footer Links
  const footerLinks = [
    {
      id: 0,
      title: "Faucet 10 VSui",
      target: "/", // Still needed as fallback
      onClick: handleFaucetClick, // Special function for faucet
    },
    {
      id: 1,
      title: "Docs",
      target: "https://your-docs-url.com", // Replace with actual URL
    },
    {
      id: 2,
      title: "Discord",
      target: "https://discord.gg/your-invite", // Replace with actual URL
    },
    {
      id: 3,
      title: "Terms",
      target: "/terms", // Internal route
    },
    {
      id: 4,
      title: "Policy",
      target: "/policy", // Internal route
    },
  ];

  return (
    <div className="w-full bg-themeBlue">
      <div className="custom-container">
        {/* Wrapper */}
        <div className="flex items-center justify-between w-full h-8">
          {/* left */}
          <div>
            <p className="text-xs text-white">$1,200,000.1928 TVL</p>
          </div>

          {/* Right */}
          <div className="flex items-center gap-8">
            {footerLinks.map(({ id, target, title, onClick }) => (
              // Check if there's a special onClick function
              onClick ? (
                <button
                  key={id}
                  onClick={onClick}
                  className="text-xs text-white cursor-pointer hover:underline"
                >
                  {title}
                </button>
              ) : (
                <Link
                  key={id}
                  to={target}
                  className="text-xs text-white hover:underline"
                >
                  {title}
                </Link>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;