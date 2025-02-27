import FixedIncomeContent from "../components/fixed-income/FixedIncomeContent";
import Footer from "../components/footer/Footer";
import Navbar from "../components/navbar/Navbar";
import { useWallet } from "@suiet/wallet-kit";

const Positions = () => {
  const wallet = useWallet();
  return (
    <>
      <Navbar />
      <FixedIncomeContent wallet={wallet}/>
      <Footer wallet={wallet}/>
    </>
  );
};

export default Positions;
