// src/pages/compararDados.test.tsx

declare global {
  interface ImportMeta {
    env: Record<string, string>;
  }
}

import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import CompararDados from "./compararDados";

jest.mock("../servicos/compararDados/compararDadosService", () => ({
  getAnosAplicacaoDre: jest.fn(),
  getAnosEscolaresUe: jest.fn(),
  getComponentesCurricularesDre: jest.fn(),
  getComporativoUe: jest.fn(),
  getListaUes: jest.fn(),
}));

jest.mock("../componentes/tabela/tabelaComparativa/tabelaComparativa", () => () => <div>TabelaComparativa</div>);
jest.mock("../componentes/filtro/filtroComparativoUEs/filtroComparativoUEs", () => () => <div>FiltroComparativoUes</div>);
jest.mock("../componentes/cards/cardsComparativa/cardsComparativa", () => () => <div>CardsComparativa</div>);

describe("Componente CompararDados", () => {
  it("deve renderizar o título principal", () => {
    render(
      <MemoryRouter>
        <CompararDados />
      </MemoryRouter>
    );

    const titulos = screen.getAllByText("Boletim de provas");
    expect(titulos[0]).toBeInTheDocument();
  });

  it("deve renderizar o breadcrumb com texto esperado", () => {
    render(
      <MemoryRouter>
        <CompararDados />
      </MemoryRouter>
    );

    expect(screen.getByText("Comparativo de resultados")).toBeInTheDocument();
  });

  /*it("deve renderizar os três filtros Select", () => {
    render(
      <MemoryRouter>
        <CompararDados />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText("Selecione uma aplicação...")).toBeInTheDocument();
    expect(screen.getByText("Componente curricular")).toBeInTheDocument();
    expect(screen.getByText("Ano")).toBeInTheDocument();
  });*/

  it("deve renderizar o link 'Voltar a tela anterior'", () => {
    render(
      <MemoryRouter>
        <CompararDados />
      </MemoryRouter>
    );

    expect(screen.getByText("Voltar a tela anterior")).toBeInTheDocument();
  });

  it("deve renderizar o botão 'Exibir mais' quando mostrarExibirMais for true", () => {
    render(
      <MemoryRouter>
        <CompararDados />
      </MemoryRouter>
    );

    expect(screen.getByText("Exibir mais")).toBeInTheDocument();
  });

  it("deve permitir clicar no botão 'Exibir mais'", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <CompararDados />
      </MemoryRouter>
    );

    const botao = screen.getByText("Exibir mais");
    expect(botao).toBeInTheDocument();
    await user.click(botao);
  });
});
