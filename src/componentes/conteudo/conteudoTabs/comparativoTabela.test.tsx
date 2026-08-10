import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import * as ComparativoTabelaModule from "./comparativoTabela";

const ComparativoTabela = (ComparativoTabelaModule as any).default;

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

jest.mock("./comparativoTabela.css", () => ({}));

const mockExibirMais = jest.fn();
const mockDadosTurma = {
  itens: [
    {
      nome: "Aluno 1",
      variacao: -2.9,
      proficiencias: [{ descricao: "PSA", mes: "Agosto 2025", valor: 200 }],
    },
    {
      nome: "Aluno 2",
      variacao: 1.0,
      proficiencias: [{ descricao: "PSA", mes: "Setembro 2025", valor: 210 }],
    },
    {
      nome: "Aluno 3",
      variacao: 2.2,
      proficiencias: [{ descricao: "PSA", mes: "Outubro 2025", valor: 220 }],
    },
    {
      nome: "Aluno 4",
      variacao: 0.0,
      proficiencias: [{ descricao: "PSA", mes: "Novembro 2025", valor: 230 }],
    },
    {
      nome: "Aluno 5",
      variacao: 5.2,
      proficiencias: [{ descricao: "PSA", mes: "Dezembro 2025", valor: 240 }],
    },
  ],
  total: 10,
};

const renderComparativoTabela = () =>
  render(
    <ComparativoTabela
      index={0}
      exibirMais={mockExibirMais}
      dadosTurma={mockDadosTurma}
      turmaSelecionada="1"
      componentesCurricularSelecionado="Matemática"
    />,
  );

describe("ComparativoTabela", () => {
  it("renderiza o título com turma e componente curricular", () => {
    renderComparativoTabela();
    expect(
      screen.getByText(/Estudantes da turma 1 em Matemática/i),
    ).toBeInTheDocument();
  });

  it("renderiza as legendas de níveis", () => {
    renderComparativoTabela();
    expect(screen.getByText(/Níveis:/i)).toBeInTheDocument();
    expect(screen.getByText(/Abaixo do básico/i)).toBeInTheDocument();
    // multiple “Básico” texts, so check at least one exists
    expect(screen.getAllByText(/Básico/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Adequado/i)).toBeInTheDocument();
    expect(screen.getByText(/Avançado/i)).toBeInTheDocument();
  });

  it("renderiza a tabela e nomes dos estudantes", () => {
    renderComparativoTabela();
    expect(screen.getAllByText("Nome do estudante")[0]).toBeInTheDocument();
    expect(screen.getByText("Aluno 1")).toBeInTheDocument();
    expect(screen.getByText("Aluno 5")).toBeInTheDocument();
  });

  it("renderiza o botão Exibir mais e chama exibirMais", () => {
    renderComparativoTabela();
    const btn = screen.getByRole("button", { name: /Exibir mais/i });
    fireEvent.click(btn);
    expect(mockExibirMais).toHaveBeenCalledWith(0);
  });

  it("renderiza o spinner de loading quando estaCarregando for true", () => {
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [true, jest.fn()])
      .mockImplementation((init?: any) => [init, jest.fn()]);
    renderComparativoTabela();
    expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
    jest.restoreAllMocks();
  });
});
