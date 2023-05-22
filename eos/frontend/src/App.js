import React from "react";
import { Layout, Menu } from "antd";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
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
            <h1 style={logoStyle}>MetaKeep EOS Tutorial</h1>
            <Menu.Item key="create" icon={<PlusOutlined />}>
              <Link
                to="/create"
                style={linkStyle}
                activestyle={activeLinkStyle}
              >
                Create
              </Link>
            </Menu.Item>
            <Menu.Item key="transfer" icon={<SwapOutlined />}>
              <Link
                to="/transfer"
                style={linkStyle}
                activestyle={activeLinkStyle}
              >
                Transfer
              </Link>
            </Menu.Item>
          </Menu>
          <Routes>
            <Route path="/create" element={<AddressRegistration />} />
            <Route path="/transfer" element={<TransferFIO />} />
          </Routes>
        </Router>
      </Layout>
    </div>
  );
}

export default App;
