import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Turma from "./turma";
import { useSelector } from "react-redux";
import { servicos } from "../../../servicos";

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
    escolaSelecionada: { ueId: 123 },
  },
  nomeAplicacao: { id: "APP1" },
  filtros: {
    anosEscolares: [],
    componentesCurriculares: [],
    niveisAbaPrincipal: [],
  },
  tab: {
    activeTab: "2",
  },
};

describe("Turma Component - Testes Corrigidos", () => {
  beforeEach(() => {
  jest.clearAllMocks();
  (useSelector as unknown as jest.Mock).mockImplementation((selector) => selector(mockStableState));
  (servicos.get as jest.Mock).mockImplementation((url: any) => {
    if (url.includes("matematica")) return Promise.resolve({ /* dados */ });
    return Promise.resolve({
      provas: [
        {
          id: 1,
          descricao: "Matemática",
          niveis: [{ anoEscolar: "5º" }],
          turmas: [{ turma: "A" }],
        },
      ],
    });
  });
});

  test("renderiza sem loop infinito", async () => {
    render(<Turma />);

    await waitFor(() => {
      expect(screen.queryByText(/Carregando.../i)).not.toBeInTheDocument();
    });
    expect(screen.getByText("Matemática")).toBeInTheDocument();
  });
});