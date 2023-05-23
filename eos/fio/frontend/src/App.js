import React from "react";
import { Layout, Menu } from "antd";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  Navigate,
} from "react-router-dom";
import { PlusOutlined, SwapOutlined } from "@ant-design/icons";
import AddressRegistration from "./components/AddressRegistration";
import TransferFIO from "./components/TransferFIO";

const menuStyle = {
  background: "black",
};

const logoStyle = {
  color: "white",
  margin: "0 20px",
  fontSize: "20px",
  fontWeight: "bold",
};

const linkStyle = {
  color: "white",
};

const activeLinkStyle = {
  color: "white",
  fontWeight: "bold",
};

function App() {
  return (
    <div className="App">
      <Layout>
        <Router>
          <Menu
            mode="horizontal"
            theme="dark"
            style={menuStyle}
            selectedKeys={[]}
          >
            <h1 style={logoStyle}>MetaKeep FIO Tutorial</h1>
            <Menu.Item key="addressRegistration" icon={<PlusOutlined />}>
              <Link
                to="/addressRegistration"
                style={linkStyle}
                activestyle={activeLinkStyle}
              >
                Address Registration
              </Link>
            </Menu.Item>
            <Menu.Item key="transfer" icon={<SwapOutlined />}>
              <Link
                to="/transfer"
                style={linkStyle}
                activestyle={activeLinkStyle}
              >
                Transfer FIO Tokens
              </Link>
            </Menu.Item>
          </Menu>
          <Routes>
            <Route path="/" element={<Navigate to="/addressRegistration" />} />
            <Route
              path="/addressRegistration"
              element={<AddressRegistration />}
            />
            <Route path="/transfer" element={<TransferFIO />} />
          </Routes>
        </Router>
      </Layout>
    </div>
  );
}

export default App;
