import React from "react";
import ReactDOM from "react-dom/client";
import "@suiet/wallet-kit/style.css";
import App from "./App.jsx";
import "./index.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import TradeYields from "./pages/TradeYields.jsx";
import TradeFixed from "./pages/TradeFixed.jsx";
import Positions from "./pages/Positions.jsx";
import {WalletProvider,SuiMainnetChain} from "@suiet/wallet-kit";

const customChain = {
  id: "sui:localnet",
  name: "Unknown Network",
  rpcUrl: "http://127.0.0.1:9000/",
};

const SupportedChains = [customChain]

ReactDOM.createRoot(document.getElementById("root")).render(
  <WalletProvider chains={SupportedChains}>
    <React.StrictMode>
      <HashRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/mint" element={<Positions />} />
          <Route path="/trade-yield" element={<TradeYields />} />
          <Route path="/fixed-income" element={<TradeFixed />} />
        </Routes>
      </HashRouter>
    </React.StrictMode>
  </WalletProvider>
);
