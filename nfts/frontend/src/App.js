import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import { MetaKeep } from "metakeep";
import { TransferNFT } from "./Components/NFT/TransferNFT";
import { ListNFT } from "./Components/ListNFT/ListNFT";
import "./App.css";

function App() {
  const sdk = new MetaKeep({
    environment: "dev",
  });
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<TransferNFT sdk={sdk} />} />
          <Route path="/nftList" element={<ListNFT sdk={sdk} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
