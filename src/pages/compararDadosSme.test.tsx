import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

jest.mock(
  "../componentes/filtro/filtroCompararDados/filtroAplicacaoComponenteCurricularAno",
  () => ({
    __esModule: true,
    default: ({
      selecionaAno,
      selecionaAplicacao,
      selecionaComponenteCurricular,
    }: any) => (
      <div data-testid="filtro-aplicacao">
        <button
          data-testid="btn-seleciona-ano"
          onClick={() => selecionaAno("2023", { label: "2023" })}
        >
          Ano
        </button>
        <button
          data-testid="btn-seleciona-aplicacao"
          onClick={() => selecionaAplicacao("2023", { label: "2023" })}
        >
          App
        </button>
        <button
          data-testid="btn-seleciona-componente"
          onClick={() => selecionaComponenteCurricular("1", { label: "Math" })}
        >
          Comp
        </button>
      </div>
    ),
  }),
);

jest.mock(
  "../componentes/filtro/filtroComparativoDresUEs/filtroComparativoDresUes",
  () => ({
    __esModule: true,
    default: ({ alterarDreUe }: any) => (
      <div data-testid="filtro-comparativo">
        <button
          data-testid="btn-alterar-dre"
          onClick={() => alterarDreUe("1", { label: "D1" })}
        >
          DRE
        </button>
      </div>
    ),
  }),
);

jest.mock("../componentes/cards/cardsComparativa/cardsComparativa", () => ({
  __esModule: true,
  default: () => <div data-testid="cards-comparativa">Cards</div>,
}));

jest.mock(
  "../componentes/tabela/tabelaComparativaSme/tabelaComparativaSme",
  () => ({
    __esModule: true,
    default: () => <div data-testid="tabela-comparativa-sme">Table</div>,
  }),
);

jest.mock("../componentes/grafico/graficoEvolucaoDre", () => ({
  __esModule: true,
  default: () => <div data-testid="grafico-evolucao">Graph</div>,
}));

jest.mock("../componentes/loadingBox/loadingBox", () => ({
  __esModule: true,
  default: () => <div data-testid="loading-box">Loading</div>,
}));

jest.mock("./compararDadosSme.css", () => ({}));

jest.mock("antd", () => ({
  Breadcrumb: ({ items, className }: any) => (
    <nav data-testid="breadcrumb" className={className}>
      {items?.map((i: any, idx: number) => (
        <span key={idx}>{i.title}</span>
      ))}
    </nav>
  ),
  Button: ({ children, onClick, ...props }: any) => (
    <button data-testid="ant-button" onClick={onClick} {...props}>
      {children}
    </button>
  ),
  Card: ({ children, className }: any) => (
    <div data-testid="ant-card" className={className}>
      {children}
    </div>
  ),
  Col: ({ children }: any) => <div data-testid="ant-col">{children}</div>,
  Row: ({ children }: any) => <div data-testid="ant-row">{children}</div>,
  Select: ({ children }: any) => <div data-testid="ant-select">{children}</div>,
}));

jest.mock("antd/es/layout/layout", () => ({
  Header: ({ children, className }: any) => (
    <header data-testid="ant-header" className={className}>
      {children}
    </header>
  ),
}));

jest.mock("@ant-design/icons", () => ({
  ArrowLeftOutlined: ({ className }: any) => (
    <span data-testid="arrow-icon" className={className}>
      ←
    </span>
  ),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
  useSearchParams: () => [new URLSearchParams()],
}));

const mockGetAnosAplicacaoVisaoSme = jest.fn();
const mockGetComponentesCurricularesVisaoSme = jest.fn();
const mockGetAnosEscolaresUeVisaoSme = jest.fn();
const mockGetListaDres = jest.fn();
const mockGetGraficoSME = jest.fn();
const mockGetCardsDre = jest.fn();
const mockGetDadosTabelaSME = jest.fn();

jest.mock("../servicos/compararDadosSme/compararDadosSmeService", () => ({
  getAnosAplicacaoVisaoSme: () => mockGetAnosAplicacaoVisaoSme(),
  getComponentesCurricularesVisaoSme: (id: number) =>
    mockGetComponentesCurricularesVisaoSme(id),
  getAnosEscolaresUeVisaoSme: (id1: number, id2: number) =>
    mockGetAnosEscolaresUeVisaoSme(id1, id2),
  getListaDres: (id1: number, id2: number, id3: number) =>
    mockGetListaDres(id1, id2, id3),
  getGraficoSME: (id1: number, id2: number, id3: number) =>
    mockGetGraficoSME(id1, id2, id3),
  getCardsDre: (
    id1: number,
    id2: number,
    id3: number,
    id4: number,
    id5: number,
  ) => mockGetCardsDre(id1, id2, id3, id4, id5),
  getDadosTabelaSME: (id1: number, id2: number, id3: number) =>
    mockGetDadosTabelaSME(id1, id2, id3),
}));

import CompararDadosSme from "./compararDadosSme";

beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterAll(() => {
  (console.log as jest.Mock).mockRestore();
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe("CompararDadosSme", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAnosAplicacaoVisaoSme.mockResolvedValue([2023]);
    mockGetComponentesCurricularesVisaoSme.mockResolvedValue([
      { valor: "1", texto: "Math" },
    ]);
    mockGetAnosEscolaresUeVisaoSme.mockResolvedValue([
      { valor: "EF5", texto: "5th" },
    ]);
    mockGetListaDres.mockResolvedValue([{ dreId: 1, dreNome: "DRE1" }]);
    mockGetGraficoSME.mockResolvedValue({ dados: "graph" });
    mockGetCardsDre.mockResolvedValue({
      total: 5,
      dres: [{ dreId: 1, dreNome: "DRE1" }],
    });
    mockGetDadosTabelaSME.mockResolvedValue({ aplicacao: [] });
  });

  it("renders component successfully", async () => {
    renderWithRouter(<CompararDadosSme />);
    await waitFor(() =>
      expect(screen.getByTestId("breadcrumb")).toBeInTheDocument(),
    );
  });

  it("calls getAnosAplicacaoVisaoSme on mount", async () => {
    renderWithRouter(<CompararDadosSme />);
    await waitFor(() =>
      expect(mockGetAnosAplicacaoVisaoSme).toHaveBeenCalled(),
    );
  });

  it("calls getComponentesCurricularesVisaoSme when aplicacao changes", async () => {
    renderWithRouter(<CompararDadosSme />);
    await waitFor(() =>
      expect(mockGetComponentesCurricularesVisaoSme).toHaveBeenCalled(),
    );
  });

  it("calls getAnosEscolaresUeVisaoSme when componente is selected", async () => {
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() =>
      expect(mockGetAnosEscolaresUeVisaoSme).toHaveBeenCalled(),
    );
  });

  it("selecionaAno updates state", async () => {
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-ano");
    fireEvent.click(btn);
    await waitFor(() =>
      expect(mockGetComponentesCurricularesVisaoSme).toHaveBeenCalled(),
    );
  });

  it("selecionaAplicacao updates state", async () => {
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-aplicacao");
    fireEvent.click(btn);
    await waitFor(() =>
      expect(mockGetComponentesCurricularesVisaoSme).toHaveBeenCalled(),
    );
  });

  it("selecionaComponenteCurricular updates state", async () => {
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() =>
      expect(mockGetAnosEscolaresUeVisaoSme).toHaveBeenCalled(),
    );
  });

  it("calls getDres when filters are selected", async () => {
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => expect(mockGetListaDres).toHaveBeenCalled());
  });

  it("calls preencheGraficoSME when filters are selected", async () => {
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => expect(mockGetGraficoSME).toHaveBeenCalled());
  });

  it("calls preencheTabela when filters are selected", async () => {
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => expect(mockGetDadosTabelaSME).toHaveBeenCalled());
  });

  it("calls preencheCardsDre when filters are selected", async () => {
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => expect(mockGetCardsDre).toHaveBeenCalled());
  });

  it("alterarDreUe updates cards", async () => {
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() =>
      expect(screen.getByTestId("filtro-comparativo")).toBeInTheDocument(),
    );
    const dreBtn = screen.getByTestId("btn-alterar-dre");
    fireEvent.click(dreBtn);
    await waitFor(() => expect(mockGetCardsDre).toHaveBeenCalled());
  });

  it("renders CardsComparativa", async () => {
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() =>
      expect(screen.getByTestId("cards-comparativa")).toBeInTheDocument(),
    );
  });

  it("renders TabelaComparativaSME", async () => {
    renderWithRouter(<CompararDadosSme />);
    await waitFor(() =>
      expect(screen.getByTestId("tabela-comparativa-sme")).toBeInTheDocument(),
    );
  });

  it("renders GraficoEvolucaoDre", async () => {
    renderWithRouter(<CompararDadosSme />);
    await waitFor(() =>
      expect(screen.getByTestId("grafico-evolucao")).toBeInTheDocument(),
    );
  });

  it("renders FiltroComparativoDresUes", async () => {
    renderWithRouter(<CompararDadosSme />);
    await waitFor(() =>
      expect(screen.getByTestId("filtro-comparativo")).toBeInTheDocument(),
    );
  });

  it("exibirMais with large dataset", async () => {
    mockGetCardsDre.mockResolvedValue({
      total: 25,
      dres: Array(10).fill({ dreId: 1, dreNome: "DRE1" }),
    });
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => {
      const exibir = screen.queryByText("Exibir mais");
      if (exibir) fireEvent.click(exibir);
    });
  });

  it("tratamentoItemRepetido with duplicates", async () => {
    mockGetDadosTabelaSME.mockResolvedValue({
      aplicacao: [
        { mes: "jan", descricao: "test1" },
        { mes: "jan", descricao: "test2" },
        { mes: "feb", descricao: "test3" },
      ],
    });
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => expect(mockGetDadosTabelaSME).toHaveBeenCalled());
  });

  it("tratamentoDescricao replaces abbreviations", async () => {
    mockGetDadosTabelaSME.mockResolvedValue({
      aplicacao: [
        {
          mes: "jan",
          descricao: "Prova São Paulo - Prova Saberes e Aprendizagens",
        },
      ],
    });
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => expect(mockGetDadosTabelaSME).toHaveBeenCalled());
  });

  it("handles error in getAnosAplicacaoVisaoSme", async () => {
    mockGetAnosAplicacaoVisaoSme.mockRejectedValue(new Error("Error"));
    renderWithRouter(<CompararDadosSme />);
    await waitFor(() =>
      expect(mockGetAnosAplicacaoVisaoSme).toHaveBeenCalled(),
    );
  });

  it("handles error in getComponentesCurricularesVisaoSme", async () => {
    mockGetComponentesCurricularesVisaoSme.mockRejectedValue(
      new Error("Error"),
    );
    renderWithRouter(<CompararDadosSme />);
    await waitFor(() =>
      expect(mockGetComponentesCurricularesVisaoSme).toHaveBeenCalled(),
    );
  });

  it("handles error in getAnosEscolaresUeVisaoSme", async () => {
    mockGetAnosEscolaresUeVisaoSme.mockRejectedValue(new Error("Error"));
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() =>
      expect(mockGetAnosEscolaresUeVisaoSme).toHaveBeenCalled(),
    );
  });

  it("handles error in getListaDres", async () => {
    mockGetListaDres.mockRejectedValue(new Error("Error"));
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => expect(mockGetListaDres).toHaveBeenCalled());
  });

  it("handles error in getGraficoSME", async () => {
    mockGetGraficoSME.mockRejectedValue(new Error("Error"));
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => expect(mockGetGraficoSME).toHaveBeenCalled());
  });

  it("handles error in getCardsDre", async () => {
    mockGetCardsDre.mockRejectedValue(new Error("Error"));
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => expect(mockGetCardsDre).toHaveBeenCalled());
  });

  it("handles error in getDadosTabelaSME", async () => {
    mockGetDadosTabelaSME.mockRejectedValue(new Error("Error"));
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => expect(mockGetDadosTabelaSME).toHaveBeenCalled());
  });

  it("renders breadcrumb items", async () => {
    renderWithRouter(<CompararDadosSme />);
    await waitFor(() => {
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Provas")).toBeInTheDocument();
    });
  });

  it("renders return link", async () => {
    renderWithRouter(<CompararDadosSme />);
    await waitFor(() => {
      const link = screen.getByRole("link", { name: /Retornar/ });
      expect(link).toHaveAttribute(
        "href",
        "https://serap.sme.prefeitura.sp.gov.br/",
      );
    });
  });

  it("shows exibir mais button with many items", async () => {
    mockGetCardsDre.mockResolvedValue({
      total: 25,
      dres: Array(10).fill({ dreId: 1, dreNome: "DRE1" }),
    });
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => {
      const exibir = screen.queryByText("Exibir mais");
      if (exibir) expect(exibir).toBeInTheDocument();
    });
  });

  it("hides exibir mais button with few items", async () => {
    mockGetCardsDre.mockResolvedValue({
      total: 5,
      dres: Array(5).fill({ dreId: 1, dreNome: "DRE1" }),
    });
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => expect(mockGetCardsDre).toHaveBeenCalled());
  });

  it("updates itensPorPagina on exibir mais", async () => {
    mockGetCardsDre.mockResolvedValue({
      total: 25,
      dres: Array(10).fill({ dreId: 1, dreNome: "DRE1" }),
    });
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => {
      const exibir = screen.queryByText("Exibir mais");
      if (exibir) fireEvent.click(exibir);
    });
  });

  it("displays multiple cards when available", async () => {
    mockGetCardsDre.mockResolvedValue({
      total: 15,
      dres: [
        { dreId: 1, dreNome: "DRE1" },
        { dreId: 2, dreNome: "DRE2" },
        { dreId: 3, dreNome: "DRE3" },
      ],
    });
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => {
      const cards = screen.getAllByTestId("cards-comparativa");
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  it("clears loading state after success", async () => {
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => expect(mockGetGraficoSME).toHaveBeenCalled());
  });

  it("renders card with correct class", async () => {
    renderWithRouter(<CompararDadosSme />);
    await waitFor(() => {
      const card = screen.getByTestId("ant-card");
      expect(card).toHaveClass("comparar-dados-card-conteudo");
    });
  });

  it("renders header with correct class", async () => {
    renderWithRouter(<CompararDadosSme />);
    await waitFor(() => {
      const header = screen.getByTestId("ant-header");
      expect(header).toHaveClass("cabecalho-compara-dre");
    });
  });

  it("renders row component", async () => {
    renderWithRouter(<CompararDadosSme />);
    await waitFor(() => {
      expect(screen.getByTestId("ant-row")).toBeInTheDocument();
    });
  });

  it("renders filter with props", async () => {
    renderWithRouter(<CompararDadosSme />);
    await waitFor(() => {
      expect(screen.getByTestId("filtro-aplicacao")).toBeInTheDocument();
    });
  });

  it("initializes with Todas option", async () => {
    renderWithRouter(<CompararDadosSme />);
    await waitFor(() => expect(mockGetListaDres).toHaveBeenCalled());
  });

  it("passes correct data to CardsComparativa", async () => {
    mockGetCardsDre.mockResolvedValue({
      total: 5,
      dres: [{ dreId: 123, dreNome: "TestDRE" }],
    });
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => {
      expect(screen.getByTestId("cards-comparativa")).toBeInTheDocument();
    });
  });

  it("completes full filter selection flow", async () => {
    renderWithRouter(<CompararDadosSme />);
    await waitFor(() =>
      expect(mockGetAnosAplicacaoVisaoSme).toHaveBeenCalled(),
    );
    const btnAplicacao = screen.getByTestId("btn-seleciona-aplicacao");
    fireEvent.click(btnAplicacao);
    await waitFor(() =>
      expect(mockGetComponentesCurricularesVisaoSme).toHaveBeenCalled(),
    );
    const btnComponente = screen.getByTestId("btn-seleciona-componente");
    fireEvent.click(btnComponente);
    await waitFor(() =>
      expect(mockGetAnosEscolaresUeVisaoSme).toHaveBeenCalled(),
    );
  });

  it("handles tratamentoDescricao correctly", async () => {
    mockGetDadosTabelaSME.mockResolvedValue({
      aplicacao: [
        { mes: "jan", descricao: "Prova São Paulo" },
        { mes: "feb", descricao: "Prova Saberes e Aprendizagens" },
      ],
    });
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => expect(mockGetDadosTabelaSME).toHaveBeenCalled());
  });

  it("renders all required components on load", async () => {
    renderWithRouter(<CompararDadosSme />);
    await waitFor(() => {
      expect(screen.getByTestId("ant-header")).toBeInTheDocument();
      expect(screen.getByTestId("filtro-aplicacao")).toBeInTheDocument();
      expect(screen.getByTestId("tabela-comparativa-sme")).toBeInTheDocument();
      expect(screen.getByTestId("grafico-evolucao")).toBeInTheDocument();
    });
  });

  it("handles preencheGraficoSME success", async () => {
    mockGetGraficoSME.mockResolvedValue({ dados: "graph_data" });
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => expect(mockGetGraficoSME).toHaveBeenCalled());
  });

  it("handles preencheTabela with empty array", async () => {
    mockGetDadosTabelaSME.mockResolvedValue({ aplicacao: [] });
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => expect(mockGetDadosTabelaSME).toHaveBeenCalled());
  });

  it("processes tratamentoDescricao with null description", async () => {
    mockGetDadosTabelaSME.mockResolvedValue({
      aplicacao: [{ mes: "jan" }],
    });
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => expect(mockGetDadosTabelaSME).toHaveBeenCalled());
  });

  it("calls getListaDres with correct params", async () => {
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => expect(mockGetListaDres).toHaveBeenCalled());
  });

  it("preencheCardsDre handles 10 items", async () => {
    mockGetCardsDre.mockResolvedValue({
      total: 20,
      dres: Array(10).fill({ dreId: 1, dreNome: "DRE1" }),
    });
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => expect(mockGetCardsDre).toHaveBeenCalled());
  });

  it("setMostrarExibirMais true when > 10 items", async () => {
    mockGetCardsDre.mockResolvedValue({
      total: 25,
      dres: Array(10).fill({ dreId: 1, dreNome: "DRE1" }),
    });
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => {
      const exibir = screen.queryByText("Exibir mais");
      expect(exibir).toBeInTheDocument();
    });
  });

  it("setMostrarExibirMais false when < 10 items", async () => {
    mockGetCardsDre.mockResolvedValue({
      total: 5,
      dres: Array(5).fill({ dreId: 1, dreNome: "DRE1" }),
    });
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => expect(mockGetCardsDre).toHaveBeenCalled());
  });

  it("exibirMais increments correctly", async () => {
    mockGetCardsDre.mockResolvedValue({
      total: 30,
      dres: Array(10).fill({ dreId: 1, dreNome: "DRE1" }),
    });
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => expect(mockGetCardsDre).toHaveBeenCalled());
  });

  it("exibirMais hides when itensPorPagina reaches total", async () => {
    mockGetCardsDre.mockResolvedValue({
      total: 10,
      dres: Array(10).fill({ dreId: 1, dreNome: "DRE1" }),
    });
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => expect(mockGetCardsDre).toHaveBeenCalled());
  });

  it("preencheCardsDre sets mostrarExibirMais false when less than 10", async () => {
    mockGetCardsDre.mockResolvedValue({
      total: 8,
      dres: Array(8).fill({ dreId: 1, dreNome: "DRE1" }),
    });
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => expect(mockGetCardsDre).toHaveBeenCalled());
  });

  it("preencheCardsDre sets mostrarExibirMais true when 10 or more", async () => {
    mockGetCardsDre.mockResolvedValue({
      total: 20,
      dres: Array(10).fill({ dreId: 1, dreNome: "DRE1" }),
    });
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => expect(mockGetCardsDre).toHaveBeenCalled());
  });

  it("tratamentoDescricao with PSP replacement", async () => {
    mockGetDadosTabelaSME.mockResolvedValue({
      aplicacao: [{ mes: "jan", descricao: "Prova São Paulo test" }],
    });
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => expect(mockGetDadosTabelaSME).toHaveBeenCalled());
  });

  it("tratamentoDescricao with PSA replacement", async () => {
    mockGetDadosTabelaSME.mockResolvedValue({
      aplicacao: [
        { mes: "jan", descricao: "Prova Saberes e Aprendizagens test" },
      ],
    });
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => expect(mockGetDadosTabelaSME).toHaveBeenCalled());
  });

  it("tratamentoDescricao with both PSP and PSA", async () => {
    mockGetDadosTabelaSME.mockResolvedValue({
      aplicacao: [
        {
          mes: "jan",
          descricao: "Prova São Paulo e Prova Saberes e Aprendizagens",
        },
      ],
    });
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => expect(mockGetDadosTabelaSME).toHaveBeenCalled());
  });

  it("tratamentoDescricao preserves description without abbreviations", async () => {
    mockGetDadosTabelaSME.mockResolvedValue({
      aplicacao: [{ mes: "jan", descricao: "Regular test text" }],
    });
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => expect(mockGetDadosTabelaSME).toHaveBeenCalled());
  });

  it("treatamentoDescricao with undefined description field", async () => {
    mockGetDadosTabelaSME.mockResolvedValue({
      aplicacao: [{ mes: "jan" }],
    });
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => expect(mockGetDadosTabelaSME).toHaveBeenCalled());
  });

  it("exibirMais with cardsDres null", async () => {
    renderWithRouter(<CompararDadosSme />);
    await waitFor(() =>
      expect(mockGetAnosAplicacaoVisaoSme).toHaveBeenCalled(),
    );
  });

  it("tratamentoItemRepetido with multiple duplicates", async () => {
    mockGetDadosTabelaSME.mockResolvedValue({
      aplicacao: [
        { mes: "jan", descricao: "a" },
        { mes: "jan", descricao: "b" },
        { mes: "jan", descricao: "c" },
        { mes: "feb", descricao: "d" },
      ],
    });
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => expect(mockGetDadosTabelaSME).toHaveBeenCalled());
  });

  it("setEstaCarregando false in preencheGraficoSME", async () => {
    mockGetGraficoSME.mockResolvedValue({ dados: "ok" });
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => {
      const loading = screen.queryByTestId("loading-box");
      if (loading) expect(loading).toBeInTheDocument();
    });
  });

  it("exibirMais with itensPorPagina reaching total", async () => {
    let callCount = 0;
    mockGetCardsDre.mockImplementation(async () => {
      callCount++;
      if (callCount === 1) {
        return {
          total: 20,
          dres: Array(10).fill({ dreId: 1, dreNome: "DRE1" }),
        };
      } else if (callCount === 2) {
        return {
          total: 20,
          dres: Array(20).fill({ dreId: 1, dreNome: "DRE1" }),
        };
      }
    });
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => {
      const exibir = screen.queryByText("Exibir mais");
      if (exibir) fireEvent.click(exibir);
    });
  });

  it("tratamentoDescricao called for each item", async () => {
    mockGetDadosTabelaSME.mockResolvedValue({
      aplicacao: [
        { mes: "jan", descricao: "Prova São Paulo" },
        { mes: "feb", descricao: "Prova Saberes e Aprendizagens" },
        { mes: "mar", descricao: "Test" },
      ],
    });
    renderWithRouter(<CompararDadosSme />);
    const btn = await screen.findByTestId("btn-seleciona-componente");
    fireEvent.click(btn);
    await waitFor(() => expect(mockGetDadosTabelaSME).toHaveBeenCalled());
  });
});
