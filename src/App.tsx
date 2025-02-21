import React, { useEffect, useState } from "react";
import { Provider, useSelector } from "react-redux";
import { ConfigProvider } from "antd";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Cabecalho from "./componentes/cabecalho/cabecalho";
import EscolherEscola from "./componentes/escolherEscola/escolherEscola";
import Conteudo from "./componentes/conteudo/conteudo";
import { store } from "./redux/store";
import Auth from "./pages/auth";
import SemAcesso from "./pages/semAcesso";
import { RootState } from "./redux/store";
import "./main.css";
import Rodape from "./componentes/rodape/rodape";

const AppLayout: React.FC = () => {
  return (
    <div className="app-container">
      <Cabecalho />
      <EscolherEscola />
      <Conteudo />
      <Rodape />
    </div>
  );
};

const PrivateRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 100);
  }, []);

  if (isLoading) return <div>Carregando...</div>;

  return isAuthenticated ? <>{element}</> : <Navigate to="/sem-acesso" />;
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConfigProvider>
        <Router>
          <Routes>
            <Route path="/validar" element={<Auth />} />
            <Route path="/sem-acesso" element={<SemAcesso />} />
            <Route
              path="/"
              element={<PrivateRoute element={<AppLayout />} />}
            />
          </Routes>
        </Router>
      </ConfigProvider>
    </Provider>
  );
};

export default App;
