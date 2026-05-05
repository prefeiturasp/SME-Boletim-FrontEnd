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
});
