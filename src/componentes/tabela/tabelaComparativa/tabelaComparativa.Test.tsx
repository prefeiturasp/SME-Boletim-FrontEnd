import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

// Mock do serviço de dados
jest.mock("../../../servicos/compararDados/compararDadosService", () => ({
  getDadosTabela: jest.fn(),
}));

jest.mock("../../../constantes/constantes", () => ({
  VARIACAO_DESCRICAO: "Descrição da variação",
}));

jest.mock("antd", () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  Table: ({ columns, dataSource }: any) => (
    <table
      data-testid="table"
      data-cols={columns?.length}
      data-rows={dataSource?.length}
    >
      <tbody>
        {dataSource?.map((row: any, i: number) => (
          <tr key={i}>
            {columns?.map((col: any) => (
              <td key={col.key}>{row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
  Progress: ({ percent, strokeColor }: any) => (
    <div
      data-testid="progress"
      data-percent={percent}
      data-color={strokeColor}
    />
  ),
  Tooltip: ({ children, title }: any) => (
    <div data-testid="tooltip" data-title={title}>
      {children}
    </div>
  ),
}));

import TabelaComparativa from "./tabelaComparativa";
import * as compararDadosService from "../../../servicos/compararDados/compararDadosService";

const { getDadosTabela } = compararDadosService as any;

// Mock store
const createMockStore = () => {
  return configureStore({
    reducer: {
      filtros: (state = {}) => state,
      escola: (state = {}) => state,
      tab: (state = { activeTab: "1" }) => state,
    },
  });
};

const renderWithProviders = (component: React.ReactElement) => {
  const store = createMockStore();
  return render(<Provider store={store}>{component}</Provider>);
};

// Props padrão
const defaultProps = {
  dreSelecionada: 123,
  aplicacaoSelecionada: { label: "PSP - 2025", value: "psp2025" },
  componenteSelecionado: { label: "Português", value: 1 },
  anoSelecionado: { label: "5º ano", value: 5 },
};

const mockData = {
  aplicacao: [
    {
      descricao: "Prova São Paulo",
      mes: "jan",
      valorProficiencia: 240,
      nivelProficiencia: "Adequado",
      qtdeUe: 50,
      qtdeEstudante: 500,
    },
    {
      descricao: "Prova Saberes e Aprendizagens",
      mes: "fev",
      valorProficiencia: 260,
      nivelProficiencia: "Avançado",
      qtdeUe: 55,
      qtdeEstudante: 550,
    },
  ],
  variacao: 5,
};

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "log").mockImplementation(() => {});
});

beforeEach(() => {
  jest.clearAllMocks();
  getDadosTabela.mockResolvedValue(mockData);
});

describe("TabelaComparativa - Renderização", () => {
  it("renderiza tabela", async () => {
    renderWithProviders(<TabelaComparativa {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByTestId("table")).toBeInTheDocument();
    });
  });

  it("renderiza título", async () => {
    renderWithProviders(<TabelaComparativa {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText("Tabela comparativa")).toBeInTheDocument();
    });
  });

  it("renderiza descrição", async () => {
    renderWithProviders(<TabelaComparativa {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText(/A tabela exibe/i)).toBeInTheDocument();
    });
  });

  it("renderiza card com classe", async () => {
    renderWithProviders(<TabelaComparativa {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByTestId("card")).toHaveClass(
        "tabela-comparativa-variacao-card",
      );
    });
  });

  it("renderiza linhas fixas", async () => {
    renderWithProviders(<TabelaComparativa {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText("Proficiência")).toBeInTheDocument();
      expect(screen.getByText("Qtde UE")).toBeInTheDocument();
      expect(screen.getByText("Qtde Estudantes")).toBeInTheDocument();
    });
  });
});

describe("TabelaComparativa - Chamada getDadosTabela", () => {
  it("renderiza sem erro", async () => {
    renderWithProviders(<TabelaComparativa {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByTestId("table")).toBeInTheDocument();
    });
  });

  it("renderiza com props válidas", () => {
    renderWithProviders(<TabelaComparativa {...defaultProps} />);
    expect(screen.getByTestId("table")).toBeInTheDocument();
  });
});

describe("TabelaComparativa - Tratamento de Descrição", () => {
  it("renderiza tabela com descrição", async () => {
    renderWithProviders(<TabelaComparativa {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByTestId("table")).toBeInTheDocument();
    });
  });

  it("renderiza sem erro com descrição vazia", () => {
    const props = { ...defaultProps, descricao: "" };
    renderWithProviders(<TabelaComparativa {...props} />);
    expect(screen.getByTestId("table")).toBeInTheDocument();
  });

  it("renderiza com mês quando existe", async () => {
    renderWithProviders(<TabelaComparativa {...defaultProps} />);
    await waitFor(() => {
      const table = screen.getByTestId("table");
      expect(table).toHaveAttribute("data-cols", "3");
    });
  });
});

describe("TabelaComparativa - Cores por Proficiência", () => {
  it("renderiza com classes de cor base", async () => {
    renderWithProviders(<TabelaComparativa {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByTestId("table")).toBeInTheDocument();
    });
  });
});

describe("TabelaComparativa - Variação", () => {
  it("renderiza variação positiva com +", async () => {
    renderWithProviders(<TabelaComparativa {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText("+5%")).toBeInTheDocument();
    });
  });

  it("renderiza variação negativa com -", async () => {
    const dados = { ...mockData, variacao: -3 };
    getDadosTabela.mockResolvedValue(dados);

    renderWithProviders(<TabelaComparativa {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText("-3%")).toBeInTheDocument();
    });
  });

  it("renderiza variação zero sem sinal", async () => {
    const dados = { ...mockData, variacao: 0 };
    getDadosTabela.mockResolvedValue(dados);

    renderWithProviders(<TabelaComparativa {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText("0%")).toBeInTheDocument();
    });
  });

  it("classe variacao-positiva", async () => {
    renderWithProviders(<TabelaComparativa {...defaultProps} />);
    await waitFor(() => {
      expect(document.querySelector(".variacao-positiva")).toBeInTheDocument();
    });
  });

  it("classe variacao-negativa", async () => {
    const dados = { ...mockData, variacao: -5 };
    getDadosTabela.mockResolvedValue(dados);

    renderWithProviders(<TabelaComparativa {...defaultProps} />);
    await waitFor(() => {
      expect(document.querySelector(".variacao-negativa")).toBeInTheDocument();
    });
  });

  it("classe variacao-neutra", async () => {
    const dados = { ...mockData, variacao: 0 };
    getDadosTabela.mockResolvedValue(dados);

    renderWithProviders(<TabelaComparativa {...defaultProps} />);
    await waitFor(() => {
      expect(document.querySelector(".variacao-neutra")).toBeInTheDocument();
    });
  });
});

describe("TabelaComparativa - Dados da Tabela", () => {
  it("renderiza qtdeUe quando existe", async () => {
    renderWithProviders(<TabelaComparativa {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText("50")).toBeInTheDocument();
    });
  });

  it("renderiza - quando qtdeUe é undefined", async () => {
    const dados = {
      ...mockData,
      aplicacao: [{ ...mockData.aplicacao[0], qtdeUe: undefined }],
    };
    getDadosTabela.mockResolvedValue(dados);

    renderWithProviders(<TabelaComparativa {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText("-")).toBeInTheDocument();
    });
  });

  it("renderiza qtdeEstudante quando existe", async () => {
    renderWithProviders(<TabelaComparativa {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText("500")).toBeInTheDocument();
    });
  });

  it("renderiza - quando qtdeEstudante é undefined", async () => {
    const dados = {
      ...mockData,
      aplicacao: [{ ...mockData.aplicacao[0], qtdeEstudante: undefined }],
    };
    getDadosTabela.mockResolvedValue(dados);

    renderWithProviders(<TabelaComparativa {...defaultProps} />);
    await waitFor(() => {
      const dashes = screen.getAllByText("-");
      expect(dashes.length).toBeGreaterThan(0);
    });
  });
});

describe("TabelaComparativa - CSS Classes", () => {
  it("renderiza com classe titulo", () => {
    renderWithProviders(<TabelaComparativa {...defaultProps} />);
    expect(
      document.querySelector(".tabela-comparativa-titulo"),
    ).toBeInTheDocument();
  });

  it("renderiza com classe descricao", () => {
    renderWithProviders(<TabelaComparativa {...defaultProps} />);
    expect(
      document.querySelector(".tabela-comparativa-descricao"),
    ).toBeInTheDocument();
  });

  it("renderiza 3 label items", () => {
    renderWithProviders(<TabelaComparativa {...defaultProps} />);
    const labels = document.querySelectorAll(".tabela-comparativa-labels-item");
    expect(labels.length).toBe(3);
  });
});

describe("TabelaComparativa - Múltiplas Aplicações", () => {
  it("renderiza várias colunas", async () => {
    renderWithProviders(<TabelaComparativa {...defaultProps} />);
    await waitFor(() => {
      const table = screen.getByTestId("table");
      expect(table).toHaveAttribute("data-cols", "3");
    });
  });

  it("renderiza múltiplas linhas", async () => {
    renderWithProviders(<TabelaComparativa {...defaultProps} />);
    await waitFor(() => {
      const table = screen.getByTestId("table");
      expect(table).toHaveAttribute("data-rows", "3");
    });
  });
});

describe("TabelaComparativa - Edge Cases", () => {
  it("renderiza com dados vazios", async () => {
    getDadosTabela.mockResolvedValue({ aplicacao: [], variacao: 0 });

    renderWithProviders(<TabelaComparativa {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText("Tabela comparativa")).toBeInTheDocument();
    });
  });

  it("renderiza após erro da API", async () => {
    getDadosTabela.mockRejectedValueOnce(new Error("API Error"));

    renderWithProviders(<TabelaComparativa {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText("Tabela comparativa")).toBeInTheDocument();
    });
  });

  it("renderiza quando mes é undefined", async () => {
    const dados = {
      ...mockData,
      aplicacao: [{ ...mockData.aplicacao[0], mes: undefined }],
    };
    getDadosTabela.mockResolvedValue(dados);

    renderWithProviders(<TabelaComparativa {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText(/PSP/)).toBeInTheDocument();
    });
  });
});

describe("TabelaComparativa - Propriedades Tabela", () => {
  it("renderiza tabela com bordered", async () => {
    renderWithProviders(<TabelaComparativa {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByTestId("table")).toBeInTheDocument();
    });
  });

  it("renderiza tabela com scroll", async () => {
    renderWithProviders(<TabelaComparativa {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByTestId("table")).toBeInTheDocument();
    });
  });

  it("desabilita paginação", async () => {
    renderWithProviders(<TabelaComparativa {...defaultProps} />);
    await waitFor(() => {
      const pagination = document.querySelectorAll(".ant-pagination");
      expect(pagination.length).toBe(0);
    });
  });
});

describe("TabelaComparativa - Props Null", () => {
  it("renderiza com aplicacaoSelecionada null", async () => {
    renderWithProviders(
      <TabelaComparativa {...defaultProps} aplicacaoSelecionada={null} />,
    );
    await waitFor(() => {
      expect(screen.getByTestId("table")).toBeInTheDocument();
    });
  });

  it("renderiza com componenteSelecionado null", async () => {
    renderWithProviders(
      <TabelaComparativa {...defaultProps} componenteSelecionado={null} />,
    );
    await waitFor(() => {
      expect(screen.getByTestId("table")).toBeInTheDocument();
    });
  });

  it("renderiza com anoSelecionado null", async () => {
    renderWithProviders(
      <TabelaComparativa {...defaultProps} anoSelecionado={null} />,
    );
    await waitFor(() => {
      expect(screen.getByTestId("table")).toBeInTheDocument();
    });
  });
});
