import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import { MetaKeep } from "metakeep";
import { TransferNFT } from "./Components/NFT/TransferNFT";
import "./App.css";
import { useMemo, useState } from "react";

function App() {
  const [env, _] = useState("prod");

  const sdk = useMemo(
    () =>
      new MetaKeep({
        environment: env,
      }),
    [env]
  );
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" />
          <Route path="/transferNFT" element={<TransferNFT sdk={sdk} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
