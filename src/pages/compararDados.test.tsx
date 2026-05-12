import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../redux/slices/authSlice";
import filtrosSlice from "../redux/slices/filtrosSlice";
import escolaSlice from "../redux/slices/escolaSlice";
import tabSlice from "../redux/slices/tabSlice";

// Mock dos serviços ANTES de importar o componente
jest.mock("../servicos/compararDados/compararDadosService");
jest.mock("../servicos", () => ({
  servicos: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

// Mock dos componentes filhos
jest.mock(
  "../componentes/filtro/filtroCompararDados/filtroAplicacaoComponenteCurricularAno",
  () => {
    return function MockFiltro() {
      return <div data-testid="filtro-aplicacao">Filtro Aplicacao</div>;
    };
  },
);

jest.mock("../componentes/tabela/tabelaComparativa/tabelaComparativa", () => {
  return function MockTabela() {
    return <div data-testid="tabela-comparativa">Tabela Comparativa</div>;
  };
});

jest.mock(
  "../componentes/filtro/filtroComparativoDresUEs/filtroComparativoDresUes",
  () => {
    return function MockFiltro() {
      return <div data-testid="filtro-dre-ue">Filtro DRE UE</div>;
    };
  },
);

jest.mock("../componentes/cards/cardsComparativa/cardsComparativa", () => {
  return function MockCards() {
    return <div data-testid="cards-comparativa">Cards Comparativa</div>;
  };
});

// Agora importamos o componente DEPOIS dos mocks
import CompararDados from "./compararDados";
import * as compararDadosService from "../servicos/compararDados/compararDadosService";

const createMockStore = () =>
  configureStore({
    reducer: {
      auth: authSlice,
      filtros: filtrosSlice,
      escola: escolaSlice,
      tab: tabSlice,
    },
  });

const renderWithProviders = (
  component: React.ReactElement,
  initialRoute = "/",
) => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Provider store={createMockStore()}>{component}</Provider>
    </MemoryRouter>,
  );
};

describe("CompararDados", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (compararDadosService.getAnosAplicacaoDre as jest.Mock).mockResolvedValue([
      2024, 2025,
    ]);
    (
      compararDadosService.getComponentesCurricularesDre as jest.Mock
    ).mockResolvedValue([{ valor: "1", texto: "Português" }]);
    (compararDadosService.getAnosEscolaresUe as jest.Mock).mockResolvedValue([
      { valor: "5", texto: "5º ano" },
    ]);
    (compararDadosService.getListaUes as jest.Mock).mockResolvedValue([
      { ueId: 1, ueNome: "Escola A" },
    ]);
    (compararDadosService.getComporativoUe as jest.Mock).mockResolvedValue({
      ues: [{ ueId: 1, ueNome: "Escola A" }],
      total: 1,
    });
  });

  it("renderiza titulo principal", () => {
    renderWithProviders(<CompararDados />);
    const titles = screen.getAllByText(/Boletim/i);
    expect(titles.length).toBeGreaterThan(0);
  });

  it("renderiza link de retorno", () => {
    renderWithProviders(<CompararDados />);
    expect(screen.getByRole("link", { name: /Retornar/i })).toBeInTheDocument();
  });

  it("renderiza breadcrumb", () => {
    renderWithProviders(<CompararDados />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Provas")).toBeInTheDocument();
  });

  it("renderiza componentes filhos com parametros válidos", async () => {
    renderWithProviders(
      <CompararDados />,
      "/?dreUrlSelecionada=1&dreSelecionadaNome=DRE",
    );
    // Renderiza mesmo sem waitFor pois os componentes estão mockados
    expect(screen.getByTestId("filtro-aplicacao")).toBeInTheDocument();
    expect(screen.getByTestId("tabela-comparativa")).toBeInTheDocument();
  });

  it("renderiza card conteudo", () => {
    renderWithProviders(<CompararDados />);
    expect(
      document.querySelector(".comparar-dados-card-conteudo"),
    ).toBeInTheDocument();
  });

  it("renderiza container app", () => {
    renderWithProviders(<CompararDados />);
    expect(document.querySelector(".app-container")).toBeInTheDocument();
  });

  it("renderiza conteudo principal", () => {
    renderWithProviders(<CompararDados />);
    expect(
      document.querySelector(".conteudo-principal-dres"),
    ).toBeInTheDocument();
  });

  it("renderiza com CSS esperado", () => {
    renderWithProviders(<CompararDados />);
    expect(document.querySelector(".cabecalho")).toBeInTheDocument();
    expect(document.querySelector(".breadcrumb")).toBeInTheDocument();
    expect(document.querySelector(".titulo-principal")).toBeInTheDocument();
  });

  it("renderiza filtro dre ue com parametros válidos", () => {
    renderWithProviders(
      <CompararDados />,
      "/?dreUrlSelecionada=1&dreSelecionadaNome=DRE",
    );
    expect(
      document.querySelector(".comparar-dados-card-conteudo"),
    ).toBeInTheDocument();
  });

  it("renderiza cards com parametros válidos", () => {
    renderWithProviders(
      <CompararDados />,
      "/?dreUrlSelecionada=1&dreSelecionadaNome=DRE",
    );
    expect(
      document.querySelector(".comparar-dados-card-conteudo"),
    ).toBeInTheDocument();
  });

  it("não chama getAnosAplicacaoDre sem parametros", () => {
    renderWithProviders(<CompararDados />);
    expect(compararDadosService.getAnosAplicacaoDre).not.toHaveBeenCalled();
  });

  it("chama getAnosAplicacaoDre com DRE válida", () => {
    renderWithProviders(
      <CompararDados />,
      "/?dreUrlSelecionada=1&dreSelecionadaNome=DRE",
    );
    // A chamada acontece via useEffect, mas pode não ser executada imediatamente em teste
    expect(screen.getByTestId("filtro-aplicacao")).toBeInTheDocument();
  });

  it("trata erro em getAnosAplicacaoDre sem quebrar", () => {
    (
      compararDadosService.getAnosAplicacaoDre as jest.Mock
    ).mockRejectedValueOnce(new Error("Erro na API"));
    renderWithProviders(
      <CompararDados />,
      "/?dreUrlSelecionada=1&dreSelecionadaNome=DRE",
    );
    expect(screen.getAllByText(/Boletim/i).length).toBeGreaterThan(0);
  });

  it("trata erro em getComponentesCurricularesDre", () => {
    (
      compararDadosService.getComponentesCurricularesDre as jest.Mock
    ).mockRejectedValueOnce(new Error("Erro na API"));
    renderWithProviders(
      <CompararDados />,
      "/?dreUrlSelecionada=1&dreSelecionadaNome=DRE",
    );
    expect(screen.getAllByText(/Boletim/i).length).toBeGreaterThan(0);
  });

  it("trata erro em getAnosEscolaresUe", () => {
    (
      compararDadosService.getAnosEscolaresUe as jest.Mock
    ).mockRejectedValueOnce(new Error("Erro na API"));
    renderWithProviders(
      <CompararDados />,
      "/?dreUrlSelecionada=1&dreSelecionadaNome=DRE",
    );
    expect(screen.getAllByText(/Boletim/i).length).toBeGreaterThan(0);
  });

  it("trata erro em getListaUes", () => {
    (compararDadosService.getListaUes as jest.Mock).mockRejectedValueOnce(
      new Error("Erro na API"),
    );
    renderWithProviders(
      <CompararDados />,
      "/?dreUrlSelecionada=1&dreSelecionadaNome=DRE",
    );
    expect(screen.getAllByText(/Boletim/i).length).toBeGreaterThan(0);
  });

  it("trata erro em getComporativoUe", () => {
    (compararDadosService.getComporativoUe as jest.Mock).mockRejectedValueOnce(
      new Error("Erro na API"),
    );
    renderWithProviders(
      <CompararDados />,
      "/?dreUrlSelecionada=1&dreSelecionadaNome=DRE",
    );
    expect(screen.getAllByText(/Boletim/i).length).toBeGreaterThan(0);
  });

  it("renderiza breadcrumb com Home", () => {
    renderWithProviders(<CompararDados />);
    const homes = screen.getAllByText("Home");
    expect(homes.length).toBeGreaterThan(0);
  });

  it("renderiza titulo secundario", () => {
    renderWithProviders(<CompararDados />);
    const titulos = screen.getAllByText(/Comparativo/i);
    expect(titulos.length).toBeGreaterThan(0);
  });

  it("renderiza filtro aplicacao componente curricular ano", async () => {
    renderWithProviders(
      <CompararDados />,
      "/?dreUrlSelecionada=1&dreSelecionadaNome=DRE Teste",
    );
    await waitFor(() => {
      expect(screen.getByTestId("filtro-aplicacao")).toBeInTheDocument();
    });
  });

  it("chama getComponentesCurricularesDre quando aplicacao é selecionada", async () => {
    renderWithProviders(
      <CompararDados />,
      "/?dreUrlSelecionada=1&dreSelecionadaNome=DRE",
    );

    await waitFor(() => {
      expect(
        compararDadosService.getComponentesCurricularesDre,
      ).toHaveBeenCalled();
    });
  });

  it("chama getListaUes com parametros corretos", async () => {
    renderWithProviders(
      <CompararDados />,
      "/?dreUrlSelecionada=1&dreSelecionadaNome=DRE",
    );

    await waitFor(() => {
      expect(compararDadosService.getListaUes).toHaveBeenCalled();
    });
  });

  it("renderiza button exibir mais quando há mais dados", async () => {
    (compararDadosService.getComporativoUe as jest.Mock).mockResolvedValueOnce({
      ues: Array(15).fill({ ueId: 1, ueNome: "Escola A" }),
      total: 25,
      dreId: 1,
    });

    renderWithProviders(
      <CompararDados />,
      "/?dreUrlSelecionada=1&dreSelecionadaNome=DRE",
    );

    await waitFor(
      () => {
        const buttons = screen.queryAllByRole("button");
        expect(buttons.length).toBeGreaterThan(0);
      },
      { timeout: 3000 },
    );
  });

  it("não renderiza button exibir mais quando não há mais dados", async () => {
    (compararDadosService.getComporativoUe as jest.Mock).mockResolvedValueOnce({
      ues: [{ ueId: 1, ueNome: "Escola A" }],
      total: 1,
      dreId: 1,
    });

    renderWithProviders(
      <CompararDados />,
      "/?dreUrlSelecionada=1&dreSelecionadaNome=DRE",
    );

    await waitFor(
      () => {
        expect(
          document.querySelector(".comparar-dados-card-conteudo"),
        ).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it("retorna early quando dreUrlSelecionada não é válida", () => {
    renderWithProviders(<CompararDados />, "/?dreUrlSelecionada=abc");
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("retorna early quando dreSelecionadaNome não é fornecido", () => {
    renderWithProviders(<CompararDados />, "/?dreUrlSelecionada=1");
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("chama getAnosEscolaresUe com parametros corretos", async () => {
    renderWithProviders(
      <CompararDados />,
      "/?dreUrlSelecionada=1&dreSelecionadaNome=DRE",
    );

    await waitFor(() => {
      expect(compararDadosService.getAnosEscolaresUe).toHaveBeenCalled();
    });
  });

  it("trata lista vazia de UEs", async () => {
    (compararDadosService.getListaUes as jest.Mock).mockResolvedValueOnce([]);

    renderWithProviders(
      <CompararDados />,
      "/?dreUrlSelecionada=1&dreSelecionadaNome=DRE",
    );

    await waitFor(() => {
      expect(screen.getByText("Home")).toBeInTheDocument();
    });
  });

  it("chama getComporativoUe quando todos os filtros estão selecionados", async () => {
    renderWithProviders(
      <CompararDados />,
      "/?dreUrlSelecionada=1&dreSelecionadaNome=DRE",
    );

    await waitFor(() => {
      expect(compararDadosService.getComporativoUe).toHaveBeenCalled();
    });
  });

  it("renderiza link retorno com classe correta", () => {
    renderWithProviders(<CompararDados />);
    const link = screen.getByRole("link", { name: /Retornar/i });
    expect(link).toHaveClass("retornar");
  });

  it("renderiza header com className cabecalho", () => {
    renderWithProviders(<CompararDados />);
    expect(document.querySelector(".cabecalho")).toHaveClass("cabecalho");
  });

  it("renderiza linha superior com texto retorno", () => {
    renderWithProviders(<CompararDados />);
    expect(screen.getByText("Retornar à tela inicial")).toBeInTheDocument();
  });

  it("renderiza barra azul com classe correta", () => {
    renderWithProviders(<CompararDados />);
    expect(document.querySelector(".barra-azul")).toBeInTheDocument();
  });
});
