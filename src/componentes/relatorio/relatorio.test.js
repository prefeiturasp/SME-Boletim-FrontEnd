import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from "@testing-library/react";
import DownloadRelatorio from "./relatorio";
// Mock do ícone do antd
jest.mock("@ant-design/icons", () => ({
    DownloadOutlined: () => _jsx("span", { children: "icon" }),
}));
describe("DownloadRelatorio Component", () => {
    const nomeEscola = "Escola Exemplo";
    const downloadUrl = "http://example.com/download";
    test("renderiza com os props fornecidos", () => {
        render(_jsx(DownloadRelatorio, { nomeEscola: nomeEscola, downloadUrl: downloadUrl }));
        expect(screen.getByText(/Você pode baixar os dados da/i)).toBeInTheDocument();
        expect(screen.getByText(nomeEscola)).toBeInTheDocument();
        expect(screen.getByRole("link")).toHaveAttribute("href", downloadUrl);
    });
    test("botão possui os atributos corretos", () => {
        render(_jsx(DownloadRelatorio, { nomeEscola: nomeEscola, downloadUrl: downloadUrl }));
        const button = screen.getByRole("link");
        expect(button).toHaveAttribute("target", "_blank");
        expect(button).toHaveAttribute("rel", "noopener noreferrer");
    });
    test("renderiza corretamente quando nomeEscola é null", () => {
        render(_jsx(DownloadRelatorio, { nomeEscola: null, downloadUrl: downloadUrl }));
        expect(screen.getByText(/Você pode baixar os dados da/i)).toBeInTheDocument();
        expect(screen.getByRole("link")).toHaveAttribute("href", downloadUrl);
    });
});
