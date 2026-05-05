import React from "react";
import { render, screen } from "@testing-library/react";
import TabelaComparativaSME from "./tabelaComparativaSme";
import { ParametrosTabelaComparativaNovaProps } from "../../../interfaces/tabelaComparativaPropsNova";

jest.mock("antd", () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  Table: ({ columns, dataSource, pagination, bordered, scroll }: any) => (
    <table
      data-testid="table"
      data-columns={columns?.length}
      data-rows={dataSource?.length}
    >
      <thead>
        <tr>
          {columns?.map((col: any, idx: number) => (
            <th key={idx} data-testid={`header-${col.key}`}>
              {col.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataSource?.map((row: any, idx: number) => (
          <tr key={idx}>
            {columns?.map((col: any) => (
              <td key={col.key} data-testid={`cell-${col.key}-${idx}`}>
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
  Progress: ({ percent, showInfo, strokeColor }: any) => (
    <div
      data-testid="progress"
      data-percent={percent}
      data-color={strokeColor}
      data-showinfo={showInfo}
    />
  ),
  Tooltip: ({ children, placement, title }: any) => (
    <div data-testid="tooltip" data-placement={placement} data-title={title}>
      {children}
    </div>
  ),
}));

jest.mock("../../../constantes/constantes", () => ({
  VARIACAO_DESCRICAO: "Descrição da variação",
}));

const defaultProps: ParametrosTabelaComparativaNovaProps = {
  dados: {
    aplicacao: [
      {
        descricao: "PSP - Matemática",
        mes: "janeiro",
        valorProficiencia: 240,
        nivelProficiencia: "Adequado",
        qtdeDre: 10,
        qtdeUe: 50,
        qtdeEstudante: 500,
      },
      {
        descricao: "PSA - Português",
        mes: "fevereiro",
        valorProficiencia: 260,
        nivelProficiencia: "Avançado",
        qtdeDre: 12,
        qtdeUe: 55,
        qtdeEstudante: 550,
      },
    ],
    variacao: 5.2,
  },
  aplicacaoSelecionada: { label: "PSP - 2025", value: "psp2025" },
  componenteSelecionado: { label: "Matemática", value: 1 },
  anoSelecionado: { label: "5º ano", value: 5 },
};

describe("TabelaComparativaSME", () => {
  describe("Renderização Básica", () => {
    it("renderiza o componente sem erros", () => {
      render(<TabelaComparativaSME {...defaultProps} />);
      expect(screen.getByTestId("table")).toBeInTheDocument();
    });

    it("renderiza o título da tabela", () => {
      render(<TabelaComparativaSME {...defaultProps} />);
      expect(screen.getByText("Tabela comparativa")).toBeInTheDocument();
    });

    it("renderiza a descrição da tabela", () => {
      render(<TabelaComparativaSME {...defaultProps} />);
      expect(
        screen.getByText(
          /A tabela exibe a proficiência da Secretaria Municipal/i,
        ),
      ).toBeInTheDocument();
    });

    it("renderiza o card com classe correta", () => {
      render(<TabelaComparativaSME {...defaultProps} />);
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("tabela-comparativa-variacao-card");
    });
  });

  describe("Linhas Fixas", () => {
    it("renderiza a linha de proficiência", () => {
      render(<TabelaComparativaSME {...defaultProps} />);
      expect(screen.getByText("Proficiência")).toBeInTheDocument();
    });

    it("renderiza a linha de qtde DRE", () => {
      render(<TabelaComparativaSME {...defaultProps} />);
      expect(screen.getByText("Qtde DRE")).toBeInTheDocument();
    });

    it("renderiza a linha de qtde UE", () => {
      render(<TabelaComparativaSME {...defaultProps} />);
      expect(screen.getByText("Qtde UE")).toBeInTheDocument();
    });

    it("renderiza a linha de qtde Estudantes", () => {
      render(<TabelaComparativaSME {...defaultProps} />);
      expect(screen.getByText("Qtde Estudantes")).toBeInTheDocument();
    });

    it("renderiza coluna de aplicação", () => {
      render(<TabelaComparativaSME {...defaultProps} />);
      expect(screen.getByText("Aplicação")).toBeInTheDocument();
    });
  });

  describe("Colunas Dinâmicas", () => {
    it("renderiza colunas dinâmicas com base nos dados", () => {
      render(<TabelaComparativaSME {...defaultProps} />);
      const headers = screen.getAllByTestId(/^header-/);
      expect(headers.length).toBeGreaterThan(1);
    });

    it("renderiza título da coluna com descricao e mês", () => {
      render(<TabelaComparativaSME {...defaultProps} />);
      const headerTexts = screen.getAllByTestId(/^header-/);
      expect(
        headerTexts.some((h) =>
          h.textContent?.includes("PSP - Matemática (janeiro)"),
        ),
      ).toBe(true);
    });

    it("renderiza barra de progresso para proficiência", () => {
      render(<TabelaComparativaSME {...defaultProps} />);
      const progresses = screen.getAllByTestId("progress");
      expect(progresses.length).toBeGreaterThan(0);
    });
  });

  describe("Cores da Barra de Progresso", () => {
    it("aplica cor correta para Abaixo do Básico", () => {
      const props = {
        ...defaultProps,
        dados: {
          ...defaultProps.dados!,
          aplicacao: [
            {
              ...defaultProps.dados!.aplicacao[0],
              nivelProficiencia: "Abaixo do Básico",
            },
          ],
        },
      };
      render(<TabelaComparativaSME {...props} />);
      const progress = screen.getByTestId("progress");
      expect(progress).toHaveAttribute("data-color", "#FF5959");
    });

    it("aplica cor correta para Básico", () => {
      const props = {
        ...defaultProps,
        dados: {
          ...defaultProps.dados!,
          aplicacao: [
            {
              ...defaultProps.dados!.aplicacao[0],
              nivelProficiencia: "Básico",
            },
          ],
        },
      };
      render(<TabelaComparativaSME {...props} />);
      const progress = screen.getByTestId("progress");
      expect(progress).toHaveAttribute("data-color", "#FEDE99");
    });

    it("aplica cor correta para Adequado", () => {
      const props = {
        ...defaultProps,
        dados: {
          ...defaultProps.dados!,
          aplicacao: [
            {
              ...defaultProps.dados!.aplicacao[0],
              nivelProficiencia: "Adequado",
            },
          ],
        },
      };
      render(<TabelaComparativaSME {...props} />);
      const progress = screen.getByTestId("progress");
      expect(progress).toHaveAttribute("data-color", "#9999FF");
    });

    it("aplica cor correta para Avançado", () => {
      const props = {
        ...defaultProps,
        dados: {
          ...defaultProps.dados!,
          aplicacao: [
            {
              ...defaultProps.dados!.aplicacao[0],
              nivelProficiencia: "Avançado",
            },
          ],
        },
      };
      render(<TabelaComparativaSME {...props} />);
      const progress = screen.getByTestId("progress");
      expect(progress).toHaveAttribute("data-color", "#99FF99");
    });

    it("aplica cor padrão para nível desconhecido", () => {
      const props = {
        ...defaultProps,
        dados: {
          ...defaultProps.dados!,
          aplicacao: [
            {
              ...defaultProps.dados!.aplicacao[0],
              nivelProficiencia: "Desconhecido",
            },
          ],
        },
      };
      render(<TabelaComparativaSME {...props} />);
      const progress = screen.getByTestId("progress");
      expect(progress).toHaveAttribute("data-color", "#B0B0B0");
    });
  });

  describe("Variação", () => {
    it("renderiza valor de variação positiva com sinal +", () => {
      const props = {
        ...defaultProps,
        dados: { ...defaultProps.dados!, variacao: 5.2 },
      };
      render(<TabelaComparativaSME {...props} />);
      expect(screen.getByText("+5.2%")).toBeInTheDocument();
    });

    it("renderiza valor de variação negativa com sinal -", () => {
      const props = {
        ...defaultProps,
        dados: { ...defaultProps.dados!, variacao: -3.5 },
      };
      render(<TabelaComparativaSME {...props} />);
      expect(screen.getByText("-3.5%")).toBeInTheDocument();
    });

    it("renderiza valor de variação zero sem sinal", () => {
      const props = {
        ...defaultProps,
        dados: { ...defaultProps.dados!, variacao: 0 },
      };
      render(<TabelaComparativaSME {...props} />);
      expect(screen.getByText("0%")).toBeInTheDocument();
    });

    it("aplica classe variacao-positiva quando variação > 0", () => {
      const props = {
        ...defaultProps,
        dados: { ...defaultProps.dados!, variacao: 5 },
      };
      render(<TabelaComparativaSME {...props} />);
      const variacaoElement = document.querySelector(".variacao-positiva");
      expect(variacaoElement).toBeInTheDocument();
    });

    it("aplica classe variacao-negativa quando variação < 0", () => {
      const props = {
        ...defaultProps,
        dados: { ...defaultProps.dados!, variacao: -5 },
      };
      render(<TabelaComparativaSME {...props} />);
      const variacaoElement = document.querySelector(".variacao-negativa");
      expect(variacaoElement).toBeInTheDocument();
    });

    it("aplica classe variacao-neutra quando variação = 0", () => {
      const props = {
        ...defaultProps,
        dados: { ...defaultProps.dados!, variacao: 0 },
      };
      render(<TabelaComparativaSME {...props} />);
      const variacaoElement = document.querySelector(".variacao-neutra");
      expect(variacaoElement).toBeInTheDocument();
    });

    it("renderiza tooltip com descrição de variação", () => {
      render(<TabelaComparativaSME {...defaultProps} />);
      const tooltip = screen.getByTestId("tooltip");
      expect(tooltip).toHaveAttribute("data-title", "Descrição da variação");
    });
  });

  describe("Labels de Filtros", () => {
    it("renderiza label da aplicação selecionada", () => {
      render(<TabelaComparativaSME {...defaultProps} />);
      expect(screen.getByText("PSP - 2025")).toBeInTheDocument();
    });

    it("renderiza label do componente selecionado", () => {
      render(<TabelaComparativaSME {...defaultProps} />);
      expect(screen.getByText("Matemática")).toBeInTheDocument();
    });

    it("renderiza label do ano selecionado com formatação", () => {
      render(<TabelaComparativaSME {...defaultProps} />);
      expect(screen.getByText("5º anoº ano")).toBeInTheDocument();
    });

    it("renderiza todos os labels em divisões corretas", () => {
      render(<TabelaComparativaSME {...defaultProps} />);
      const labels = document.querySelectorAll(
        ".tabela-comparativa-labels-item",
      );
      expect(labels.length).toBe(3);
    });
  });

  describe("Dados das Aplicações", () => {
    it("renderiza valores de proficiência para cada aplicação", () => {
      render(<TabelaComparativaSME {...defaultProps} />);
      const cells = screen.getAllByTestId(/^cell-/);
      expect(cells.length).toBeGreaterThan(0);
    });

    it("renderiza qtde DRE quando disponível", () => {
      render(<TabelaComparativaSME {...defaultProps} />);
      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByText("12")).toBeInTheDocument();
    });

    it("renderiza '-' quando qtde DRE não está disponível", () => {
      const props = {
        ...defaultProps,
        dados: {
          ...defaultProps.dados!,
          aplicacao: [
            {
              ...defaultProps.dados!.aplicacao[0],
              qtdeDre: undefined,
            },
          ],
        },
      };
      render(<TabelaComparativaSME {...props} />);
      expect(screen.getByText("-")).toBeInTheDocument();
    });

    it("renderiza qtde UE quando disponível", () => {
      render(<TabelaComparativaSME {...defaultProps} />);
      expect(screen.getByText("50")).toBeInTheDocument();
    });

    it("renderiza '-' quando qtde UE não está disponível", () => {
      const props = {
        ...defaultProps,
        dados: {
          ...defaultProps.dados!,
          aplicacao: [
            {
              ...defaultProps.dados!.aplicacao[0],
              qtdeUe: undefined,
            },
          ],
        },
      };
      render(<TabelaComparativaSME {...props} />);
      expect(screen.getByText("-")).toBeInTheDocument();
    });

    it("renderiza qtde Estudante quando disponível", () => {
      render(<TabelaComparativaSME {...defaultProps} />);
      expect(screen.getByText("500")).toBeInTheDocument();
    });

    it("renderiza '-' quando qtde Estudante não está disponível", () => {
      const props = {
        ...defaultProps,
        dados: {
          ...defaultProps.dados!,
          aplicacao: [
            {
              ...defaultProps.dados!.aplicacao[0],
              qtdeEstudante: undefined,
            },
          ],
        },
      };
      render(<TabelaComparativaSME {...props} />);
      expect(screen.getByText("-")).toBeInTheDocument();
    });
  });

  describe("Progresso de Proficiência", () => {
    it("calcula percentual correto de progresso", () => {
      render(<TabelaComparativaSME {...defaultProps} />);
      const progresses = screen.getAllByTestId("progress");
      const firstProgress = progresses[0];
      const expectedPercent = (240 / 300) * 100;
      expect(firstProgress).toHaveAttribute(
        "data-percent",
        String(expectedPercent),
      );
    });

    it("limita percentual máximo a 100", () => {
      const props = {
        ...defaultProps,
        dados: {
          ...defaultProps.dados!,
          aplicacao: [
            {
              ...defaultProps.dados!.aplicacao[0],
              valorProficiencia: 350,
            },
          ],
        },
      };
      render(<TabelaComparativaSME {...props} />);
      const progress = screen.getByTestId("progress");
      expect(progress).toHaveAttribute("data-percent", "100");
    });

    it("renderiza progresso com showInfo false", () => {
      render(<TabelaComparativaSME {...defaultProps} />);
      const progresses = screen.getAllByTestId("progress");
      expect(progresses[0]).toHaveAttribute("data-showinfo", "false");
    });
  });

  describe("Dados Undefined", () => {
    it("renderiza vazio quando dados são undefined", () => {
      const props = {
        ...defaultProps,
        dados: undefined,
      };
      const { container } = render(<TabelaComparativaSME {...props} />);
      expect(container.firstChild).toBeNull();
    });

    it("renderiza com dados vazios", () => {
      const props = {
        ...defaultProps,
        dados: {
          aplicacao: [],
          variacao: 0,
        },
      };
      render(<TabelaComparativaSME {...props} />);
      expect(screen.getByText("Tabela comparativa")).toBeInTheDocument();
    });
  });

  describe("Múltiplas Aplicações", () => {
    it("renderiza múltiplas colunas dinâmicas", () => {
      const props = {
        ...defaultProps,
        dados: {
          ...defaultProps.dados!,
          aplicacao: [
            ...defaultProps.dados!.aplicacao,
            {
              descricao: "PSP - Ciências",
              mes: "março",
              valorProficiencia: 250,
              nivelProficiencia: "Adequado",
              qtdeDre: 11,
              qtdeUe: 52,
              qtdeEstudante: 520,
            },
          ],
        },
      };
      render(<TabelaComparativaSME {...props} />);
      const headers = screen.getAllByTestId(/^header-/);
      expect(headers.length).toBe(4);
    });

    it("renderiza dados para todas as aplicações", () => {
      render(<TabelaComparativaSME {...defaultProps} />);
      const table = screen.getByTestId("table");
      expect(table).toHaveAttribute("data-rows", "4");
    });
  });

  describe("Formatação", () => {
    it("renderiza coluna de aplicação com classe formatada", () => {
      render(<TabelaComparativaSME {...defaultProps} />);
      expect(screen.getByText("Proficiência")).toBeInTheDocument();
    });

    it("aplica estilos corretos no container de progresso", () => {
      render(<TabelaComparativaSME {...defaultProps} />);
      const progresses = screen.getAllByTestId("progress");
      expect(progresses.length).toBeGreaterThan(0);
    });
  });

  describe("Props Null", () => {
    it("renderiza com aplicacaoSelecionada null", () => {
      const props = {
        ...defaultProps,
        aplicacaoSelecionada: null,
      };
      render(<TabelaComparativaSME {...props} />);
      expect(screen.getByTestId("table")).toBeInTheDocument();
    });

    it("renderiza com componenteSelecionado null", () => {
      const props = {
        ...defaultProps,
        componenteSelecionado: null,
      };
      render(<TabelaComparativaSME {...props} />);
      expect(screen.getByTestId("table")).toBeInTheDocument();
    });

    it("renderiza com anoSelecionado null", () => {
      const props = {
        ...defaultProps,
        anoSelecionado: null,
      };
      render(<TabelaComparativaSME {...props} />);
      expect(screen.getByTestId("table")).toBeInTheDocument();
    });
  });

  describe("Tooltip Placement", () => {
    it("renderiza tooltip com placement correto", () => {
      render(<TabelaComparativaSME {...defaultProps} />);
      const tooltip = screen.getByTestId("tooltip");
      expect(tooltip).toHaveAttribute("data-placement", "top");
    });
  });

  describe("Variação Edge Cases", () => {
    it("trata variação null como 0", () => {
      const props = {
        ...defaultProps,
        dados: {
          ...defaultProps.dados!,
          variacao: null as any,
        },
      };
      render(<TabelaComparativaSME {...props} />);
      expect(screen.getByText("0%")).toBeInTheDocument();
    });

    it("trata variação undefined como 0", () => {
      const props = {
        ...defaultProps,
        dados: {
          ...defaultProps.dados!,
          variacao: undefined as any,
        },
      };
      render(<TabelaComparativaSME {...props} />);
      expect(screen.getByText("0%")).toBeInTheDocument();
    });
  });

  describe("Tabela Scroll e Propriedades", () => {
    it("renderiza tabela com scroll horizontal", () => {
      render(<TabelaComparativaSME {...defaultProps} />);
      const table = screen.getByTestId("table");
      expect(table).toBeInTheDocument();
    });

    it("renderiza tabela com borders", () => {
      render(<TabelaComparativaSME {...defaultProps} />);
      const table = screen.getByTestId("table");
      expect(table).toBeInTheDocument();
    });

    it("desabilita paginação da tabela", () => {
      render(<TabelaComparativaSME {...defaultProps} />);
      const paginationElements = document.querySelectorAll(".ant-pagination");
      expect(paginationElements.length).toBe(0);
    });
  });

  describe("Render Function", () => {
    it("renderiza render function da coluna aplicacao com formatação", () => {
      render(<TabelaComparativaSME {...defaultProps} />);
      const cells = screen.getAllByText(
        /Proficiência|Qtde DRE|Qtde UE|Qtde Estudantes/,
      );
      expect(cells.length).toBeGreaterThan(0);
    });
  });

  describe("Quando mes não existe", () => {
    it("renderiza descrição sem mês quando mes não existe", () => {
      const props = {
        ...defaultProps,
        dados: {
          ...defaultProps.dados!,
          aplicacao: [
            {
              descricao: "PSP",
              mes: undefined,
              valorProficiencia: 240,
              nivelProficiencia: "Adequado",
              qtdeDre: 10,
              qtdeUe: 50,
              qtdeEstudante: 500,
            },
          ],
        },
      };
      render(<TabelaComparativaSME {...props} />);
      expect(screen.getByText("PSP")).toBeInTheDocument();
    });
  });
});
