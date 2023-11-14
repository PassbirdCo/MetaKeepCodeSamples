import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import { MetaKeep } from "metakeep";
import { LogMemo } from "./Components/LogMemo/LogMemo";
import { TransferSol } from "./Components/TransferSol/TransferSol";
import "./App.css";

function App() {
  const sdk = new MetaKeep({
    environment: process.env.REACT_APP_ENVIRONMENT,
    appId: process.env.REACT_APP_APP_ID,
  });
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/LogMemo" element={<LogMemo sdk={sdk} />} />
          <Route path="/TransferSol" element={<TransferSol sdk={sdk} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
