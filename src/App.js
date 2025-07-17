import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Provider, useSelector } from "react-redux";
import { ConfigProvider } from "antd";
import { BrowserRouter as Router, Route, Routes, Navigate, } from "react-router-dom";
import Cabecalho from "./componentes/cabecalho/cabecalho";
import EscolherEscola from "./componentes/escolherEscola/escolherEscola";
import Conteudo from "./componentes/conteudo/conteudo";
import { store } from "./redux/store";
import Auth from "./pages/auth";
import SemAcesso from "./pages/semAcesso";
import "./main.css";
import Rodape from "./componentes/rodape/rodape";
import UesPage from "./pages/ues";
const AppLayout = () => {
    return (_jsxs("div", { className: "app-container", children: [_jsx(Cabecalho, {}), _jsx(EscolherEscola, {}), _jsx(Conteudo, {}), _jsx(Rodape, {})] }));
};
const PrivateRoute = ({ element }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => setIsLoading(false), 100);
    }, []);
    if (isLoading)
        return _jsx("div", { children: "Carregando..." });
    return isAuthenticated ? _jsx(_Fragment, { children: element }) : _jsx(Navigate, { to: "/sem-acesso" });
};
const App = () => {
    return (_jsx(Provider, { store: store, children: _jsx(ConfigProvider, { children: _jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/validar", element: _jsx(Auth, {}) }), _jsx(Route, { path: "/sem-acesso", element: _jsx(SemAcesso, {}) }), _jsx(Route, { path: "/", element: _jsx(PrivateRoute, { element: _jsx(AppLayout, {}) }) }), _jsx(Route, { path: "/ues", element: _jsx(PrivateRoute, { element: _jsx(UesPage, {}) }) })] }) }) }) }));
};
export default App;
