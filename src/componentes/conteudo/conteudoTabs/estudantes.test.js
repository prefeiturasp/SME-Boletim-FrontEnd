import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, waitFor } from "@testing-library/react";
import Estudantes from "./estudantes";
import { useSelector as useSelectorBase } from "react-redux";
import { servicos } from "../../../servicos";
// Mock do serviço
jest.mock("../../../servicos", () => ({
    servicos: {
        get: jest.fn(),
    },
}));
// Mock do componente de gráfico
jest.mock("../../grafico/estudantePorMateria", () => () => _jsx("div", { children: "Gr\u00E1fico" }));
// Mock do useSelector
jest.mock("react-redux", () => ({
    __esModule: true,
    ...jest.requireActual("react-redux"),
    useSelector: jest.fn(),
}));
// Cast seguro para o mock do useSelector
const useSelector = useSelectorBase;
const mockEscola = { ueId: 1 };
const mockFiltros = {
    nomeEstudante: "",
    eolEstudante: "",
    anosEscolares: [],
    componentesCurriculares: [],
    niveis: [],
    nivelMinimoEscolhido: 0,
    nivelMaximoEscolhido: 0,
};
const mockActiveTab = "3";
function setupReduxMocks() {
    useSelector.mockImplementation((selectorFn) => {
        // Simula o estado global do Redux
        return selectorFn({
            escola: { escolaSelecionada: mockEscola },
            filtros: mockFiltros,
            tab: { activeTab: mockActiveTab },
        });
    });
}
describe("Estudantes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        setupReduxMocks();
    });
    test("renderiza textos principais e tabela vazia", async () => {
        servicos.get.mockResolvedValueOnce({
            estudantes: { itens: [], totalRegistros: 0 },
            disciplinas: [],
        });
        servicos.get.mockResolvedValueOnce([]);
        render(_jsx(Estudantes, {}));
        expect(screen.getByText(/Esta seção apresenta uma tabela/i)).toBeInTheDocument();
        expect(screen.getByText(/Distribuição de estudantes em cada nível por turma/i)).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText(/Não encontramos dados/i)).toBeInTheDocument();
        });
    });
    test("exibe disciplinas corretamente", async () => {
        servicos.get.mockResolvedValueOnce({
            estudantes: { itens: [], totalRegistros: 0 },
            disciplinas: ["Matemática", "Português"],
        });
        servicos.get.mockResolvedValueOnce([]);
        render(_jsx(Estudantes, {}));
        await waitFor(() => {
            expect(screen.getByText(/Matemática e Português/i)).toBeInTheDocument();
        });
    });
});
