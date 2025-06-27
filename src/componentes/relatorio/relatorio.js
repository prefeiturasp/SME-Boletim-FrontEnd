import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Row, Col, Button } from "antd";
import "./relatorio.css";
import { DownloadOutlined } from "@ant-design/icons";
const DownloadRelatorio = ({ nomeEscola, downloadUrl, }) => {
    return (_jsx("div", { className: "download-section", children: _jsxs(Row, { gutter: 16, align: "middle", className: "download-content", children: [_jsx(Col, { span: 12, className: "text-col", children: _jsxs("p", { className: "school-text", children: ["Voc\u00EA pode baixar os dados da ", _jsxs("b", { children: [" ", nomeEscola, " "] }), ", clicando no bot\u00E3o ao lado"] }) }), _jsx(Col, { span: 12, className: "button-col", children: _jsx(Button, { type: "primary", href: downloadUrl, target: "_blank", rel: "noopener noreferrer", icon: _jsx(DownloadOutlined, {}), children: "Baixar os dados" }) })] }) }));
};
export default DownloadRelatorio;
