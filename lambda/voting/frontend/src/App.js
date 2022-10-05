import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import { MetaKeep } from "metakeep";
import { Voting } from "./Components/Voting/Voting";
import { RegisterCandidate } from "./Components/RegisterCandidate/RegisterCandidate";
import "./App.css";

function App() {
  const sdk = new MetaKeep({
    environment: "prod",
  });
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/registerCandidate" element={<RegisterCandidate />} />
          <Route path="/voteCandidate" element={<Voting sdk={sdk} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
