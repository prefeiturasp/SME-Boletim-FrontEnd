import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./legendaCustomizada.css";
const LegendaCustomizada = ({ payload }) => {
    if (!payload)
        return null;
    return (_jsxs("div", { className: "legenda-container", children: [_jsx("span", { className: "legenda-titulo", children: "Distribui\u00E7\u00E3o dos estudantes em cada n\u00EDvel." }), _jsxs("div", { className: "legenda-itens", children: [_jsx("span", { className: "legenda-titulo", children: "N\u00EDveis: " }), payload.map((entry, index) => (_jsxs("span", { className: "legenda-item", children: [_jsx("div", { className: "legenda-cor-caixa", style: { backgroundColor: entry.color } }), _jsx("span", { className: "legenda-texto", children: entry.value })] }, index)))] })] }));
};
export default LegendaCustomizada;
