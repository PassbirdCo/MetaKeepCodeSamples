import React from "react";
import { Layout, Menu, ConfigProvider } from "antd";
import { PlusOutlined, SwapOutlined } from "@ant-design/icons";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  Navigate,
} from "react-router-dom";

import { HandleRegistration, TransferFIOTokens, MapHandle } from "./components";

const headerStyle = { height: 70, alignItems: "center" };

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
  fontWeight: 800,
};

// Fix for missing Buffer issue in fiojs.
window.Buffer = window.Buffer || require("buffer").Buffer;

const App = () => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: "#1c1e21",
        borderRadius: 2,
        colorBgContainer: "#ffffff",
      },
    }}
  >
    <div className="App">
      <Layout>
        <Router>
          <Menu mode="horizontal" theme="dark" style={headerStyle}>
            <h1 style={logoStyle}>MetaKeep FIO Tutorial</h1>
            <Menu.Item key="/register" icon={<PlusOutlined />}>
              <Link
                to="/register"
                style={linkStyle}
                activeStyle={activeLinkStyle}
              >
                Handle Registration
              </Link>
            </Menu.Item>
            <Menu.Item key="/transfer" icon={<SwapOutlined />}>
              <Link
                to="/transfer"
                style={linkStyle}
                activeStyle={activeLinkStyle}
              >
                Transfer FIO Tokens
              </Link>
            </Menu.Item>
            <Menu.Item key="/mapHandle" icon={<SwapOutlined />}>
              <Link
                to="/mapHandle"
                style={linkStyle}
                activeStyle={activeLinkStyle}
              >
                Map Handle
              </Link>
            </Menu.Item>
          </Menu>
          <Routes>
            <Route path="/" element={<Navigate to="/register" />} />
            <Route path="/register" element={<HandleRegistration />} />
            <Route path="/transfer" element={<TransferFIOTokens />} />
            <Route path="/mapHandle" element={<MapHandle />} />
          </Routes>
        </Router>
      </Layout>
    </div>
  </ConfigProvider>
);

export default App;
