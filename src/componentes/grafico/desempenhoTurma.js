import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./desempenhoAno.css";
import { Bar, BarChart, CartesianGrid, Cell, Label, LabelList, ResponsiveContainer, XAxis, YAxis, } from "recharts";
import "./desempenhoTurma.css";
const DesempenhoTurma = ({ dados }) => {
    const cores = [
        "#5A94D8",
        "#1E1EE3",
        "#595959",
        "#000000",
        "#D9D9D9",
        "#1E1E56",
    ];
    return (_jsxs("div", { children: [_jsx(ResponsiveContainer, { width: "100%", height: 500, children: _jsxs(BarChart, { data: dados, margin: { top: 30, right: 0, left: 0, bottom: 0 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "turma", tick: { fill: "#000000" }, stroke: "#EDEDED" }), _jsx(YAxis, { tick: { fill: "#000000" }, stroke: "#EDEDED", children: _jsx(Label, { value: "M\u00E9dia de profici\u00EAncia", angle: -90, position: "insideLeft", offset: 5, className: "label-proficiencia" }) }), _jsxs(Bar, { dataKey: "mediaProficiencia", barSize: 70, children: [_jsx(LabelList, { dataKey: "mediaProficiencia", position: "insideTop", fill: "white", fontSize: 14 }), dados.map((entry, index) => (_jsx(Cell, { fill: index < cores.length ? cores[index] : "#8884d8" }, `cell-${index}`)))] })] }) }), _jsx("div", { className: "legenda-container", children: dados.map((entry, index) => (_jsxs("div", { className: "legenda-item", children: [index === 0 && _jsx("div", { className: "legenda-titulo", children: "Turma" }), _jsx("div", { className: "legenda-caixa", style: {
                                backgroundColor: index < cores.length ? cores[index] : "#8884d8",
                            } }), _jsx("span", { className: "legenda-texto", children: entry.turma })] }, index))) })] }));
};
export default DesempenhoTurma;
