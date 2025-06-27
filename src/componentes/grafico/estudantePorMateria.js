import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./estudantePorMateria.css";
import { Bar, BarChart, Label, LabelList, ResponsiveContainer, XAxis, YAxis, } from "recharts";
const EstudantesPorMateria = ({ dados }) => {
    let altura = dados.alunos.length * 50;
    const cor = dados.disciplina == "Matemática" ? "#EDEDED" : "#5A94D8";
    const barraClass = dados.disciplina == "Matemática" ? "bar-texto-preto" : "bar-texto-branco";
    if (altura <= 150)
        altura = 150;
    return (_jsxs("div", { children: [_jsx("span", { className: "titulo-grafico", children: `Estudantes da turma ${dados.turma} em ${dados.disciplina}` }), _jsx(ResponsiveContainer, { width: "100%", height: altura, children: _jsxs(BarChart, { layout: "vertical", data: dados.alunos, margin: { top: 30, right: 30, left: 20, bottom: 0 }, children: [_jsx(XAxis, { tick: { fill: "#595959" }, stroke: "#EDEDED", type: "number" }), _jsx(YAxis, { tick: { fill: "#595959" }, stroke: "#EDEDED", dataKey: "nome", type: "category", width: 300, fontSize: 13, children: _jsx(Label, { value: "Estudantes", angle: -90, position: "insideLeft", offset: 0, className: "titulo-grafico" }) }), _jsx(Bar, { dataKey: "proficiencia", fill: cor, children: _jsx(LabelList, { position: "insideLeft", fill: "white", fontSize: 14, className: barraClass }) })] }) })] }));
};
export default EstudantesPorMateria;
