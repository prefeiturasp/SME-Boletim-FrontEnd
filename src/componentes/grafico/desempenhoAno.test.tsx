import React from "react";
import { render, screen } from "@testing-library/react";
import DesempenhoAno from "./desempenhoAno";

jest.mock("./conteudo/tooltipCustomizada", () => () => <div>Tooltip</div>);
jest.mock("./conteudo/legendaCustomizada", () => () => <div>Legenda</div>);

const mockDados = [
  {
    componenteCurricular: "Matemática",
    abaixoBasico: "Abaixo (25%)",
    basico: "Básico (35%)",
    adequado: "Adequado (30%)",
    avancado: "Avançado (10%)",
  },
];

const filtroPadrao: Filtro = {
  niveis: [
    { valor: 1, texto: "abaixoBasico" },
    { valor: 4, texto: "avançado" },
  ],
  niveisAbaPrincipal: [
    {
      texto: "Abaixo do Básico",
      valor: 1,
    },
    {
      texto: "Básico",
      valor: 2,
    },
    {
      texto: "Adequado",
      valor: 3,
    },
    {
      texto: "Avançado",
      valor: 4,
    },
  ],
  anosEscolares: [
    { valor: 5, texto: "5" },
    { valor: 9, texto: "9" },
  ],
  componentesCurriculares: [
    { valor: 5, texto: "Lingua Portuguesa" },
    { valor: 4, texto: "Matemática" },
  ],
  anosEscolaresRadio: [],
  componentesCurricularesRadio: [],
  nivelMinimo: 50,
  nivelMaximo: 275,
  turmas: [
    { valor: "A", texto: "A" },
    { valor: "A", texto: "A" },
    { valor: "A", texto: "A" },
    { valor: "A", texto: "A" },
  ],
  nivelMinimoEscolhido: 0,
  nivelMaximoEscolhido: 0,
  nomeEstudante: "",
  eolEstudante: "",
};

const renderComponent = (itens: number[]) => {
  const filtroFinal = filtroPadrao;
  filtroFinal.niveisAbaPrincipal=[]
  itens.forEach((i) => {
    filtroFinal.niveisAbaPrincipal.push(filtroPadrao.niveisAbaPrincipal[i]);
  });

  return render(
    <DesempenhoAno dados={mockDados} filtrosSelecionados={filtroFinal} />
  );
};

describe("DesempenhoAno", () => {
  it("Renderiza Documentos", () => {
    renderComponent([1]);
    expect(screen.getByText("Legenda")).toBeInTheDocument();
    expect(screen.getByText("Tooltip")).toBeInTheDocument();
  });

  it("Mostra apenas abaixo do basico", () => {
    renderComponent([1]);
    expect(screen.getByText("1 - Abaixo do Básico")).toBeInTheDocument();
    expect(screen.queryByText("2 - Básico")).not.toBeInTheDocument();
    expect(screen.queryByText("3 - Adequado")).not.toBeInTheDocument();
    expect(screen.queryByText("4 - Avançado")).not.toBeInTheDocument();
  });

  it("Mostra tudo quando todas abas estiverem ativas", () => {
    renderComponent([1, 2, 3, 4]);
    expect(screen.getByText("1 - Abaixo do Básico")).toBeInTheDocument();
    expect(screen.getByText("2 - Básico")).toBeInTheDocument();
    expect(screen.getByText("3 - Adequado")).toBeInTheDocument();
    expect(screen.getByText("4 - Avançado")).toBeInTheDocument();
  });

  it("Não mostra nada quando nenhuma aba esta selecionada", () => {
    renderComponent([]);
    expect(screen.queryByText("1 - Abaixo do Básico")).not.toBeInTheDocument();
    expect(screen.queryByText("2 - Básico")).not.toBeInTheDocument();
    expect(screen.queryByText("3 - Adequado")).not.toBeInTheDocument();
    expect(screen.queryByText("4 - Avançado")).not.toBeInTheDocument();
  });
});
