import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from "@testing-library/react";
import LegendaCustomizada from "./legendaCustomizada";
describe("LegendaCustomizada", () => {
    test("não renderiza nada se payload não for fornecido", () => {
        const { container } = render(_jsx(LegendaCustomizada, {}));
        expect(container.firstChild).toBeNull();
    });
    test("renderiza o título corretamente", () => {
        render(_jsx(LegendaCustomizada, { payload: [] }));
        expect(screen.getByText(/Distribuição dos estudantes em cada nível/i)).toBeInTheDocument();
        expect(screen.getByText(/Níveis:/i)).toBeInTheDocument();
    });
    test("renderiza corretamente múltiplos itens", () => {
        const payload = [
            { color: "#123456", value: "A" },
            { color: "#654321", value: "B" },
            { color: "#abcdef", value: "C" },
        ];
        render(_jsx(LegendaCustomizada, { payload: payload }));
        payload.forEach((item) => {
            expect(screen.getByText(item.value)).toBeInTheDocument();
        });
    });
});
