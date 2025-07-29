import React from "react";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import { BrowserRouter as Router } from "react-router-dom";
import { store } from "./redux/store";
import AppRoutes from "./AppRoutes";
import "./main.css";

const App: React.FC = () => (
  <Provider store={store}>
    <ConfigProvider>
      <Router>
        <AppRoutes />
      </Router>
    </ConfigProvider>
  </Provider>
);

export default App;
