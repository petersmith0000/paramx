import Footer from "./components/footer/Footer";
import HomeContainer from "./components/home/HomeContainer";
import Navbar from "./components/navbar/Navbar";
import { useWallet } from "@suiet/wallet-kit";
function App() {
  const wallet = useWallet();
  return (
    <>
      <Navbar />
      <HomeContainer />
      <Footer wallet={wallet}/>
    </>
  );
}

export default App;
