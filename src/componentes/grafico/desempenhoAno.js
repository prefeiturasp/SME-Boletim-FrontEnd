import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label, } from "recharts";
import "./desempenhoAno.css";
import TooltipCustomizada from "./conteudo/tooltipCustomizada";
import LegendaCustomizada from "./conteudo/legendaCustomizada";
const DesempenhoAno = ({ dados, filtrosSelecionados, }) => {
    const apiData = [];
    for (let i = 0; i < dados.length; i++) {
        const item = dados[i];
        apiData.push({
            name: item.componenteCurricular,
            abaixoDoBasico: item.abaixoBasico
                .split(" ")[1]
                .replace("(", "")
                .replace(")", "")
                .replace("%", ""),
            basico: item.basico
                .split(" ")[1]
                .replace("(", "")
                .replace(")", "")
                .replace("%", ""),
            adequado: item.adequado
                .split(" ")[1]
                .replace("(", "")
                .replace(")", "")
                .replace("%", ""),
            avancado: item.avancado
                .split(" ")[1]
                .replace("(", "")
                .replace(")", "")
                .replace("%", ""),
        });
    }
    return (_jsx(ResponsiveContainer, { width: "100%", height: 700, children: _jsxs(BarChart, { layout: "vertical", data: apiData, margin: { top: 30, right: 5, left: 20, bottom: 0 }, barCategoryGap: "0%", barGap: 0, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { type: "number", stroke: "#EDEDED", tick: { fill: "#595959" } }), _jsx(YAxis, { dataKey: "name", type: "category", width: 160, interval: 0, tickFormatter: (value) => value, tick: { fill: "#595959" }, stroke: "#EDEDED", children: _jsx(Label, { value: "Componente por ano de escolaridade", angle: -90, position: "insideLeft", offset: -15, style: {
                            textAnchor: "middle",
                            fontSize: 14,
                            fontWeight: "bold",
                            fill: "#595959",
                        } }) }), _jsx(Tooltip, { content: _jsx(TooltipCustomizada, {}), wrapperStyle: {
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        borderRadius: "5px",
                        color: "#fff",
                    } }), _jsx(Legend, { verticalAlign: "top", align: "center", content: _jsx(LegendaCustomizada, {}) }), filtrosSelecionados.niveisAbaPrincipal.some((item) => item.valor === 1) && (_jsx(Bar, { dataKey: "abaixoDoBasico", barSize: 70, fill: "#FF5959", name: "1 - Abaixo do B\u00E1sico" })), filtrosSelecionados.niveisAbaPrincipal.some((item) => item.valor === 2) && (_jsx(Bar, { dataKey: "basico", barSize: 70, fill: "#FEDE99", name: "2 - B\u00E1sico" })), filtrosSelecionados.niveisAbaPrincipal.some((item) => item.valor === 3) && (_jsx(Bar, { dataKey: "adequado", barSize: 70, fill: "#9999FF", name: "3 - Adequado" })), filtrosSelecionados.niveisAbaPrincipal.some((item) => item.valor === 4) && (_jsx(Bar, { dataKey: "avancado", barSize: 70, fill: "#99FF99", name: "4 - Avan\u00E7ado" })), _jsx(Bar, { dataKey: "", barSize: 5, fill: "#ffffff", name: "" })] }) }));
};
export default DesempenhoAno;
