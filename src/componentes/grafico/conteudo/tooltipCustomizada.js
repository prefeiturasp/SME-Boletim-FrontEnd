import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./tooltipCustomizada.css";
const TooltipCustomizada = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (_jsxs("div", { className: "tooltip-customizada", children: [_jsx("p", { className: "tooltip-label", children: label }), payload.map((entry, index) => (_jsxs("p", { className: "tooltip-item", children: [entry.name, ": ", entry.value, "%"] }, index)))] }));
    }
    return null;
};
export default TooltipCustomizada;
