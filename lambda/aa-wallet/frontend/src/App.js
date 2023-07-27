import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import { MetaKeep } from "metakeep";
import { StakingAndVoting } from "./Components/StakingAndVoting/StakingAndVoting";
import { AddProposal } from "./Components/AddProposal/AddProposal";
import "./App.css";

function App() {
  const sdk = new MetaKeep({
    environment: "dev",
    appId: process.env.REACT_APP_APP_ID,
  });
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/addProposal" element={<AddProposal />} />
          <Route path="/stakeAndVote" element={<StakingAndVoting sdk={sdk} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
