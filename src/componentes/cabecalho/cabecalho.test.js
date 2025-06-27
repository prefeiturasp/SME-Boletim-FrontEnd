import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Cabecalho from "./cabecalho";
describe("Cabecalho Component", () => {
    test("link de retorno possui href correto", () => {
        render(_jsx(MemoryRouter, { children: _jsx(Cabecalho, {}) }));
        const link = screen.getByRole("link", { name: /Retornar à tela inicial/i });
        expect(link).toHaveAttribute("href", "https://serap.sme.prefeitura.sp.gov.br/");
    });
    test("breadcrumb possui 3 itens", () => {
        render(_jsx(MemoryRouter, { children: _jsx(Cabecalho, {}) }));
        const items = screen.getAllByRole("listitem");
        expect(items).toHaveLength(3);
        expect(items[0]).toHaveTextContent("Home");
        expect(items[1]).toHaveTextContent("Provas");
        expect(items[2]).toHaveTextContent("Boletim de provas");
    });
});
