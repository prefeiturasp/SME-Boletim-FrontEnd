import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Probabilidade from "./probabilidade";
import { useSelector, useDispatch } from "react-redux";
import { servicos } from "../../../servicos";
// Mock estável do Redux
jest.mock("react-redux", () => ({
    __esModule: true,
    ...jest.requireActual("react-redux"),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));
const mockDispatch = jest.fn();
const mockUseSelector = useSelector;
const mockUseDispatch = useDispatch;
// Mock estável do estado do Redux
const mockState = {
    escola: {
        escolaSelecionada: {
            ueId: 1,
            descricao: "Escola Teste",
        },
    },
    filtros: {
        componentesCurricularesRadio: [{ texto: "Matemática", valor: 1 }],
        anosEscolaresRadio: [{ texto: "5", valor: 5 }],
        turmas: [],
        niveisAbaPrincipal: [],
    },
    filtroCompleto: {
        componentesCurriculares: [
            { texto: "Matemática", valor: 1 },
            { texto: "Português", valor: 2 },
        ],
        anosEscolares: [
            { texto: "5", valor: 5 },
            { texto: "6", valor: 6 },
        ],
    },
    tab: { activeTab: "4" },
};
// Mock do serviço
jest.mock("../../../servicos", () => ({
    servicos: {
        get: jest.fn().mockResolvedValue({
            resultados: [],
            totalRegistros: 0,
        }),
    },
}));
// Mock dos ícones
jest.mock("@ant-design/icons", () => ({
    DownloadOutlined: () => _jsx("span", { children: "download" }),
    InfoCircleOutlined: () => _jsx("span", { children: "info" }),
    SearchOutlined: () => _jsx("span", { children: "search" }),
    CheckCircleOutlined: () => _jsx("span", { children: "check" }),
}));
describe("Probabilidade Component", () => {
    beforeEach(() => {
        mockUseDispatch.mockReturnValue(mockDispatch);
        mockUseSelector.mockImplementation((selector) => selector(mockState));
        servicos.get.mockClear();
    });
    test("renderiza textos principais sem dados", async () => {
        render(_jsx(Probabilidade, {}));
        expect(screen.getByText(/percentuais por habilidade ajudam/i)).toBeInTheDocument();
        expect(screen.getByText(/Selecione um componente curricular/i)).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText(/Não encontramos dados/i)).toBeInTheDocument();
        });
    });
    test("permite digitação no campo de busca", async () => {
        render(_jsx(Probabilidade, {}));
        const input = screen.getByPlaceholderText(/Digite o código ou habilidade/i);
        fireEvent.change(input, { target: { value: "fração" } });
        expect(input).toHaveValue("fração");
    });
    test("botão de download está presente", () => {
        render(_jsx(Probabilidade, {}));
        expect(screen.getByRole("button", { name: /Baixar os dados/i })).toBeInTheDocument();
    });
});
