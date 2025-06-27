import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent } from "@testing-library/react";
import Conteudo from "./conteudo";
import { useDispatch, useSelector } from "react-redux";
// Mock dos componentes filhos (mantido igual)
jest.mock("./conteudoTabs/principal", () => () => _jsx("div", { children: "Principal" }));
jest.mock("./conteudoTabs/turma", () => () => _jsx("div", { children: "Turma" }));
jest.mock("./conteudoTabs/estudantes", () => () => _jsx("div", { children: "Estudantes" }));
jest.mock("./conteudoTabs/probabilidade", () => () => _jsx("div", { children: "Resultado" }));
// Mock do Redux corrigido
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));
const mockDispatch = jest.fn();
const mockUseSelector = useSelector;
const mockUseDispatch = useDispatch;
// Estado base corrigido
const baseMockState = {
    tab: { activeTab: "1" },
    nomeAplicacao: { nome: "Aplicação Teste" },
    filtroCarregado: { carregado: true },
};
describe("Conteudo Component - Testes Corrigidos", () => {
    beforeEach(() => {
        mockUseDispatch.mockReturnValue(mockDispatch);
        mockUseSelector.mockImplementation((callback) => callback(baseMockState));
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    test("renderiza o título corretamente", () => {
        render(_jsx(Conteudo, {}));
        expect(screen.getByText("Aplicação Teste")).toBeInTheDocument();
    });
    test("dispara ação ao mudar aba", () => {
        render(_jsx(Conteudo, {}));
        fireEvent.click(screen.getByText("Turma"));
        expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
            type: "tab/setActiveTab",
            payload: "2",
        }));
    });
    test("renderiza conteúdo da aba ativa", () => {
        mockUseSelector.mockImplementation((callback) => callback({
            ...baseMockState,
            tab: { activeTab: "4" },
        }));
        render(_jsx(Conteudo, {}));
        expect(screen.getByText("Resultado")).toBeInTheDocument();
    });
});
