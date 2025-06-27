import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, waitFor } from "@testing-library/react";
import Turma from "./turma";
import { useSelector } from "react-redux";
// Mock estável do Redux
jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
}));
// Mock estável do serviço
jest.mock("../../../servicos", () => ({
    servicos: {
        get: jest.fn().mockResolvedValue({
            provas: [
                {
                    id: 1,
                    descricao: "Matemática",
                    niveis: [{ anoEscolar: "5º" }],
                    turmas: [{ turma: "A" }],
                },
            ],
        }),
    },
}));
// Mock estável do estado
const mockStableState = {
    escola: {
        escolaSelecionada: { ueId: 123 }, // Valor primitivo estável
    },
    filtros: {
        anosEscolares: [], // Array vazio estável
        componentesCurriculares: [], // Array vazio estável
        niveisAbaPrincipal: [],
    },
    tab: {
        activeTab: "2", // Valor fixo
    },
};
describe("Turma Component - Testes Corrigidos", () => {
    beforeEach(() => {
        // Mock do useSelector com valores estáveis
        useSelector.mockImplementation((callback) => {
            return callback(mockStableState);
        });
    });
    test("renderiza sem loop infinito", async () => {
        render(_jsx(Turma, {}));
        await waitFor(() => {
            expect(screen.getByText("Matemática")).toBeInTheDocument();
            expect(screen.queryByText(/Carregando.../i)).not.toBeInTheDocument();
        });
    });
});
