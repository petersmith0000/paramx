import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import TradeContent from "../components/trade-yield/TradeContent";
import { useWallet } from "@suiet/wallet-kit";
const TradeYields = () => {
  const wallet = useWallet();
  return (
    <>
      <Navbar />
      <TradeContent type={1} wallet={wallet} />
      <Footer wallet={wallet}/>
    </>
  );
};

export default TradeYields;
