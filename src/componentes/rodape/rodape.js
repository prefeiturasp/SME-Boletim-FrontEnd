import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button, Col, Row } from "antd";
import { UpOutlined } from "@ant-design/icons";
import "./rodape.css";
const Rodape = () => {
    const voltarAoInicio = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const versao = "1.0";
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "rodape", children: _jsx(Button, { type: "primary", icon: _jsx(UpOutlined, {}), onClick: voltarAoInicio, children: "Voltar para o In\u00EDcio" }) }), _jsx("div", { className: "rodape-versao", children: _jsxs(Row, { className: "versao-secao", children: [_jsx(Col, { span: 12, className: "text-left", children: _jsxs("p", { children: ["Boletim: Vers\u00E3o ", versao] }) }), _jsx(Col, { span: 12, className: "text-right", children: _jsx("p", { children: "Todos os direitos reservados" }) })] }) })] }));
};
export default Rodape;
