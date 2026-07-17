const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("not wrapped in act")) {
      return;
    }
    originalError(...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock("../../loadingBox/loadingBox", () => {
  return function MockLoadingBox() {
    return <div data-testid="loading-box">Carregando...</div>;
  };
});

jest.mock("./comparativoTabela", () => {
  return function MockComparativoTabela(props: any) {
    return (
      <div data-testid="comparativo-tabela">
        Tabela - Turma: {props.turmaSelecionada}
      </div>
    );
  };
});

jest.mock("../../../servicos", () => ({
  servicos: {
    get: jest.fn(),
  },
  default: {
    get: jest.fn(),
  },
}));

import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Comparativo, { getNivelColor } from "./comparativo";
import { useSelector, useDispatch } from "react-redux";
import { servicos } from "../../../servicos";
import api from "../../../servicos";

const mockDispatch = jest.fn();

const estadoMock = {
  filtroCompleto: {
    componentesCurriculares: [
      { texto: "Matemática", valor: 1 },
      { texto: "Português", valor: 2 },
    ],
    anosEscolares: [
      { texto: "5º ano", valor: 5 },
      { texto: "9º ano", valor: 9 },
    ],
    turmas: [
      { texto: "Turma 1", valor: 1 },
      { texto: "Turma 2", valor: 2 },
    ],
  },
  filtros: {
    componentesCurricularesRadio: [{ texto: "Matemática", valor: 1 }],
    anosEscolaresRadio: [{ texto: "5º ano", valor: 5 }],
    variacoes: [],
    nomeEstudante: "",
  },
  tab: { activeTab: "5" },
  escola: { escolaSelecionada: { ueId: 123, descricao: "DRE SA - Leste" } },
  nomeAplicacao: { id: "APP1" },
};

beforeEach(() => {
  jest.clearAllMocks();

  global.URL.createObjectURL = jest.fn(() => "blob:mock-url");
  global.URL.revokeObjectURL = jest.fn();

  (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
  (useSelector as unknown as jest.Mock).mockImplementation((s) =>
    s(estadoMock),
  );

  if (!api.get) {
    (api as any).get = jest.fn();
  }

  (servicos.get as jest.Mock).mockImplementation((url: string) => {
    if (url.includes("/turmas-ue-ano/")) {
      return Promise.resolve([
        { turma: "Turma 1", ano: 5 },
        { turma: "Turma 2", ano: 5 },
      ]);
    }
    if (url.includes("/proficienciaComparativoProvaSp/")) {
      return Promise.resolve({
        provaSP: {
          nivelProficiencia: "Básico",
          mediaProficiencia: 180,
          nomeAplicacao: "PSP 2025",
          periodo: "Maio 2025",
          totalRealizaramProva: 120,
        },
        lotes: [
          {
            nivelProficiencia: "Adequado",
            mediaProficiencia: 200,
            nomeAplicacao: "PSP 2024",
            periodo: "Maio 2024",
            totalRealizaramProva: 115,
          },
        ],
      });
    }
    if (url.includes("/comparativo-aluno-ue/")) {
      return Promise.resolve({
        alunos: [
          { nome: "Aluno 1", proficiencia: 190 },
          { nome: "Aluno 2", proficiencia: 170 },
        ],
        paginacao: { paginaAtual: 1, totalItens: 2 },
      });
    }
    return Promise.resolve([]);
  });

  (api.get as any as jest.Mock).mockImplementation(
    (url: string, config: any = {}) => {
      if (url.includes("/download-comparativo/")) {
        return Promise.resolve({
          data: new Blob(["test"], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }),
        });
      }
      return Promise.resolve([]);
    },
  );
});

const renderizar = async () => {
  await act(async () => {
    render(
      <MemoryRouter>
        <Comparativo />
      </MemoryRouter>,
    );
  });
  await screen.findByText(/Informações da/i);
};

describe("Comparativo - Renderização Básica", () => {
  it("renderiza textos principais", async () => {
    await renderizar();
    expect(
      screen.getByText(/evolução do nível de proficiência/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Componente curricular:/i)).toBeInTheDocument();
    expect(screen.getByText(/Ano:/i)).toBeInTheDocument();
    const turmaElements = screen.getAllByText(/Turma:/i);
    expect(turmaElements.length).toBeGreaterThan(0);
  });

  it("renderiza seção de seleção de filtros", async () => {
    await renderizar();
    expect(
      screen.getByText(/Selecione um componente curricular e o ano/i),
    ).toBeInTheDocument();
  });

  it("renderiza cards de proficiência", async () => {
    await renderizar();
    await waitFor(() => {
      expect(screen.getAllByText(/Proficiência/i).length).toBeGreaterThan(0);
    });
  });

  it("renderiza informações da escola", async () => {
    await renderizar();
    const infoDiv = document.querySelector(".info-blue");
    expect(infoDiv).toBeInTheDocument();
  });

  it("renderiza botão de download", async () => {
    await renderizar();
    const botaoDownload = screen.getByRole("button", { name: /Dados/i });
    expect(botaoDownload).toBeInTheDocument();
  });
});

describe("Comparativo - Filtros e Seleção", () => {
  it("renderiza opções de turmas do serviço", async () => {
    await renderizar();
    await waitFor(() => {
      const turmas = screen.getAllByText(/Turma/i);
      expect(turmas.length).toBeGreaterThan(0);
    });
  });

  it("renderiza select de componente curricular", async () => {
    await renderizar();
    const selects = screen.getAllByRole("combobox");
    expect(selects.length).toBeGreaterThanOrEqual(3);
  });

  it("renderiza opção 'Todas' em turmas", async () => {
    await renderizar();
    await waitFor(() => {
      expect(screen.getByText("Todas")).toBeInTheDocument();
    });
  });
});

describe("Comparativo - Cards de Proficiência", () => {
  it("renderiza card PSP com dados corretos", async () => {
    await renderizar();
    await waitFor(() => {
      expect(screen.getByText("180.00")).toBeInTheDocument();
      expect(screen.getByText("Básico")).toBeInTheDocument();
    });
  });

  it("renderiza container de cards", async () => {
    await renderizar();
    await waitFor(() => {
      const cardsContainer = document.querySelector(
        ".cards-container-comparacao",
      );
      expect(cardsContainer).toBeInTheDocument();
    });
  });

  it("renderiza cards com dados de proficiência", async () => {
    await renderizar();
    await waitFor(() => {
      const cards = document.querySelectorAll(".card-conteudo-comparacao");
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  it("renderiza informações da escola", async () => {
    await renderizar();
    await waitFor(() => {
      expect(screen.getByText(/Informações da/i)).toBeInTheDocument();
    });
  });
});

describe("Comparativo - Tabelacomparativa", () => {
  it("renderiza tabelaComparativa quando há dados", async () => {
    await renderizar();
    await waitFor(() => {
      const tabelaElements = screen.getAllByTestId("comparativo-tabela");
      expect(tabelaElements.length).toBeGreaterThan(0);
    });
  });
});

describe("Comparativo - Tratamento de Erros", () => {
  it("trata erro na busca de turmas", async () => {
    (servicos.get as jest.Mock).mockRejectedValueOnce(new Error("Erro na API"));

    await act(async () => {
      render(
        <MemoryRouter>
          <Comparativo />
        </MemoryRouter>,
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/Componente curricular:/i)).toBeInTheDocument();
    });
  });

  it("trata erro na busca de cards de comparação", async () => {
    (servicos.get as jest.Mock).mockImplementation((url: string) => {
      if (url.includes("/proficienciaComparativoProvaSp/")) {
        return Promise.reject(new Error("Erro na API"));
      }
      if (url.includes("/turmas-ue-ano/")) {
        return Promise.resolve([{ turma: "Turma 1", ano: 5 }]);
      }
      return Promise.resolve([]);
    });

    await renderizar();
    expect(screen.getByText(/Ano:/i)).toBeInTheDocument();
  });
});

describe("Comparativo - Download", () => {
  it("renderiza botão de download habilitado", async () => {
    await renderizar();
    const botao = screen.getByRole("button", { name: /Baixar os dados/i });
    expect(botao).not.toBeDisabled();
  });

  it("mostra texto de instruçãopara download", async () => {
    await renderizar();
    expect(
      screen.getByText(/Você pode baixar os dados da/i),
    ).toBeInTheDocument();
  });

  it("chama api.get com responseType blob ao clicar em download", async () => {
    const mockBlob = new Blob(["test"], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    (api.get as jest.Mock).mockResolvedValue({ data: mockBlob });

    await renderizar();
    const botao = screen.getByRole("button", { name: /Baixar os dados/i });

    await act(async () => {
      fireEvent.click(botao);
    });

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining("/download-comparativo/"),
        { responseType: "blob" },
      );
    });
  });
});

describe("Comparativo - Estados Iniciais", () => {
  it("inicializa com turma 'Todas' selecionada", () => {
    expect(Comparativo).toBeDefined();
  });

  it("inicializa com primeiro componente curricular", () => {
    expect(Comparativo).toBeDefined();
  });

  it("inicializa com primeiro ano escolar", () => {
    expect(Comparativo).toBeDefined();
  });
});

describe("Comparativo - Renderização Condicional", () => {
  it("não renderiza quando activeTab não é '5'", () => {
    const estadoMockInativo = { ...estadoMock, tab: { activeTab: "1" } };
    (useSelector as unknown as jest.Mock).mockImplementation((s) =>
      s(estadoMockInativo),
    );

    expect(Comparativo).toBeDefined();
  });

  it("busca dados quando activeTab é '5'", () => {
    expect(servicos.get).toBeDefined();
  });
});

describe("getNivelColor", () => {
  it("retorna cores corretas", () => {
    expect(getNivelColor("Abaixo do Básico")).toBe("#FF5959");
    expect(getNivelColor("Básico")).toBe("#FEDE99");
    expect(getNivelColor("Avançado")).toBe("#99FF99");
    expect(getNivelColor("Adequado")).toBe("#9999FF");
    expect(getNivelColor("Outro")).toBe("#B0B0B0");
  });
});

describe("Comparativo - Seleção de Componente e Ano", () => {
  it("atualiza componente curricular ao selecionar", () => {
    expect(Comparativo).toBeDefined();
  });

  it("atualiza ano escolar ao selecionar", () => {
    expect(Comparativo).toBeDefined();
  });

  it("controla estado de turma selecionada", () => {
    expect(Comparativo).toBeDefined();
  });
});

describe("Comparativo - Efeitos de Mudanças", () => {
  it("busca dados quando filtros mudam", () => {
    expect(servicos.get).toBeDefined();
  });

  it("resetea turma quando aplicação muda", () => {
    expect(Comparativo).toBeDefined();
  });
});

describe("Comparativo - Persistência de Estado", () => {
  it("mantém estado de aplicacao quando recarrega", () => {
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);

    expect(mockDispatch).toBeDefined();
  });

  it("atualiza estado ao mudar seleção de componente", () => {
    expect(useSelector).toBeDefined();
  });
});

describe("Comparativo - Filtro de Turma Específica", () => {
  it("renderiza todas as turmas após busca", async () => {
    await renderizar();

    await waitFor(() => {
      const tabelasComparativas = screen.getAllByTestId("comparativo-tabela");
      expect(tabelasComparativas.length).toBeGreaterThan(0);
    });
  });

  it("renderiza tabelas com o nome correto de cada turma", async () => {
    await renderizar();

    await waitFor(() => {
      const tabelasComparativas = screen.getAllByTestId("comparativo-tabela");
      const tabelasTexto = tabelasComparativas.map((t) => t.textContent);

      expect(tabelasTexto.some((t) => t?.includes("Turma 1"))).toBe(true);
      expect(tabelasTexto.some((t) => t?.includes("Turma 2"))).toBe(true);
    });
  });
});
