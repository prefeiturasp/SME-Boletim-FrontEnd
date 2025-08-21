import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Estudantes from "./estudantes";
import { useSelector as useSelectorBase } from "react-redux";
import { servicos } from "../../../servicos";

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

jest.mock("../../servicos", () => ({
  servicos: {
    get: jest.fn(),
  },
}));
import Conteudo from "./conteudo";

// Mock do componente de gráfico
jest.mock("../../grafico/estudantePorMateria", () => () => <div>Gráfico</div>);

// Mock do useSelector
jest.mock("react-redux", () => ({
  __esModule: true,
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(),
}));

// Cast seguro para o mock do useSelector
const useSelector = useSelectorBase as unknown as jest.Mock;

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
    (servicos.get as jest.Mock).mockResolvedValueOnce({
      estudantes: { itens: [], totalRegistros: 0 },
      disciplinas: [],
    });
    (servicos.get as jest.Mock).mockResolvedValueOnce([]);

    render(<Estudantes />);
    expect(
      screen.getByText(/Esta seção apresenta uma tabela/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Distribuição de estudantes em cada nível por turma/i)
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Não encontramos dados/i)).toBeInTheDocument();
    });
  });

  test("exibe disciplinas corretamente", async () => {
    (servicos.get as jest.Mock).mockResolvedValueOnce({
      estudantes: { itens: [], totalRegistros: 0 },
      disciplinas: ["Matemática", "Português"],
    });
    (servicos.get as jest.Mock).mockResolvedValueOnce([]);

    render(<Estudantes />);
    await waitFor(() => {
      expect(screen.getByText(/Matemática e Português/i)).toBeInTheDocument();
    });
  });
});
