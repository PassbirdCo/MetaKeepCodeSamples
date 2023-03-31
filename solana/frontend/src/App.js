import { TransferForm } from "./components/transferForm";
import { Header } from "antd/es/layout/layout";

function App() {
  return (
    <div className="App">
      <div>
        <Header style={{ background: "black", color: "white" }}>
          <h1>MetaKeep Solana Token Transfer Form</h1>
        </Header>
        <TransferForm />
      </div>
    </div>
  );
}

export default App;
