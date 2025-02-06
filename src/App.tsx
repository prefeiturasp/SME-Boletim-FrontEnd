import React from "react";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import Cabecalho from "./componentes/cabecalho/cabecalho";
import EscolherEscola from "./componentes/escolherEscola/escolherEscola";
import Conteudo from "./componentes/conteudo/conteudo";
import { store } from "./redux/store";
import "./main.css";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConfigProvider>
        <div className="app-container">
          <Cabecalho />
          <EscolherEscola />
          <Conteudo />
        </div>
      </ConfigProvider>
    </Provider>
  );
};

export default App;
