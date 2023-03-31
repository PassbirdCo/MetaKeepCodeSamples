import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import { MetaKeep } from "metakeep";
import { ListNFT } from "./Components/ListNFT/ListNFT";
import "./App.css";

function App() {
  const sdk = new MetaKeep({
    environment: "prod",
    appId: process.env.REACT_APP_APP_ID,
  });
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<ListNFT sdk={sdk} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
