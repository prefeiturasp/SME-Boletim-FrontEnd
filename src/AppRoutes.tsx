import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Cabecalho from "./componentes/cabecalho/cabecalho";
import EscolherEscola from "./componentes/escolherEscola/escolherEscola";
import Conteudo from "./componentes/conteudo/conteudo";
import Rodape from "./componentes/rodape/rodape";
import Auth from "./pages/auth";
import SemAcesso from "./pages/semAcesso";
import UesPage from "./pages/ues";
import { RootState } from "./redux/store";

const AppLayout: React.FC = () => (
  <div className="app-container">
    <Cabecalho />
    <EscolherEscola />
    <Conteudo />
    <Rodape />
  </div>
);

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 100);
  }, []);

  if (isLoading) return <div>Carregando...</div>;

  return isAuthenticated ? <>{children}</> : <Navigate to="/sem-acesso" />;
};

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/validar" element={<Auth />} />
    <Route path="/sem-acesso" element={<SemAcesso />} />
    <Route
      path="/"
      element={
        <PrivateRoute>
          <AppLayout />
        </PrivateRoute>
      }
    />
    <Route
      path="/ues"
      element={
        <PrivateRoute>
          <UesPage />
        </PrivateRoute>
      }
    />
  </Routes>
);

export default AppRoutes;
