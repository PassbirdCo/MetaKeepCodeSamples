import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Navbar from './Components/Navbar/Navbar';
import {MetaKeep} from 'metakeep';
import {TransferNFT} from './Components/NFT/TransferNFT';
import './App.css';
import { useMemo , useState} from "react";

function App() {

  const [env, setEnv] = useState("dev");
  const [apiKey, setApiKey] = useState("");

  const sdk = useMemo(
    () => new MetaKeep({
      environment: env, 
      apiId: apiKey}),
    [env, apiKey]
  );
  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" />
          <Route path="/transferNFT" element={<TransferNFT sdk={sdk}/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;