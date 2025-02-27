import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import TradeContent from "../components/trade-yield/TradeContent";
import { useWallet } from "@suiet/wallet-kit";
const TradeFixed = () => {
  const wallet = useWallet();
  return (
    <>
      <Navbar />
      <TradeContent type={0} wallet={wallet}/>
      <Footer wallet={wallet} />
    </>
  );
};

export default TradeFixed;
