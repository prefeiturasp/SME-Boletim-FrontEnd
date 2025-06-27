import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Layout, Breadcrumb } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "./cabecalho.css";
import { Row } from "antd";
const { Header } = Layout;
import { Link } from "react-router-dom";
const linkRetorno = "https://serap.sme.prefeitura.sp.gov.br/";
const Cabecalho = () => {
    return (_jsx(Row, { children: _jsxs(Header, { className: "cabecalho", children: [_jsxs("div", { className: "linha-superior", children: [_jsxs(Link, { to: linkRetorno, className: "retornar", children: [_jsx(ArrowLeftOutlined, { className: "icone-retorno" }), _jsx("span", { className: "texto-retorno", children: "Retornar \u00E0 tela inicial" })] }), _jsx("span", { className: "titulo-principal", children: "Boletim de Provas" })] }), _jsxs("div", { className: "barra-azul", children: [_jsxs(Breadcrumb, { className: "breadcrumb", children: [_jsx(Breadcrumb.Item, { children: "Home" }), _jsx(Breadcrumb.Item, { children: "Provas" }), _jsx(Breadcrumb.Item, { children: "Boletim de provas" })] }), _jsx("span", { className: "titulo-secundario", children: "Boletim de provas" })] })] }) }));
};
export default Cabecalho;
