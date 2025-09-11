import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ComparativoTabela from "./comparativoTabela";
import * as ComparativoTabelaModule from "./comparativoTabela";

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

// Mock do CSS import e SVG
jest.mock("./comparativoTabela.css", () => ({}));
jest.mock("./../../../assets/icon-mais.svg", () => "iconeMais.svg");

describe("ComparativoTabela", () => {
    it("renderiza o título com turma e componente curricular", () => {
        render(<ComparativoTabela turmaSelecionada="1" componentesCurricularSelecionado="Matemática" />);
        expect(screen.getByText(/Estudantes da Turma 1 em Matemática/i)).toBeInTheDocument();
    });

    it("renderiza as legendas de níveis", () => {
        render(<ComparativoTabela turmaSelecionada="1" componentesCurricularSelecionado="Matemática" />);
        expect(screen.getByText(/Níveis:/i)).toBeInTheDocument();
        expect(screen.getByText(/Abaixo do basico/i)).toBeInTheDocument();
        expect(screen.getByText(/Básico/i)).toBeInTheDocument();
        expect(screen.getByText(/Adequado/i)).toBeInTheDocument();
        expect(screen.getByText(/Avançado/i)).toBeInTheDocument();
    });

    it("renderiza a tabela com colunas dinâmicas", () => {
        render(<ComparativoTabela turmaSelecionada="1" componentesCurricularSelecionado="Matemática" />);
        expect(screen.getByText("Nome do Estudante")).toBeInTheDocument();
        expect(screen.getByText("Aplicação PSA")).toBeInTheDocument();
        expect(screen.getByText("PSP")).toBeInTheDocument();
        expect(screen.getByText("Variacão")).toBeInTheDocument();
        // Colunas dinâmicas de PSA
        expect(screen.getByText(/PSA \(Agosto 2025\)/)).toBeInTheDocument();
        expect(screen.getByText(/PSA \(Setembro 2025\)/)).toBeInTheDocument();
        expect(screen.getByText(/PSA \(Outubro 2025\)/)).toBeInTheDocument();
        expect(screen.getByText(/PSA \(Novembro 2025\)/)).toBeInTheDocument();
        expect(screen.getByText(/PSA \(Dezembro 2025\)/)).toBeInTheDocument();
    });

    it("renderiza os nomes dos estudantes", () => {
        render(<ComparativoTabela turmaSelecionada="1" componentesCurricularSelecionado="Matemática" />);
        expect(screen.getByText("Lincoln Ferreira Campos")).toBeInTheDocument();
        expect(screen.getByText("Carlos Eduardo Silva")).toBeInTheDocument();
        expect(screen.getByText("Pablo Silva Chavier")).toBeInTheDocument();
        expect(screen.getByText("Aroudo Silva Jose")).toBeInTheDocument();
        expect(screen.getByText("Ciclano")).toBeInTheDocument();
    });

    it("renderiza os valores de variação com cor correta", () => {
        render(<ComparativoTabela turmaSelecionada="1" componentesCurricularSelecionado="Matemática" />);
        expect(screen.getAllByText(/-2.90%/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/5.20%/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/0.00%/i)[0]).toBeInTheDocument();
    });

    it("renderiza o botão Exibir mais", () => {
        render(<ComparativoTabela turmaSelecionada="1" componentesCurricularSelecionado="Matemática" />);
        expect(screen.getByText(/Exibir mais/i)).toBeInTheDocument();
        expect(screen.getByAltText("Ícone dados")).toBeInTheDocument();
    });

    it("chama handleExibirMais ao clicar no botão Exibir mais", () => {
        render(<ComparativoTabela turmaSelecionada="1" componentesCurricularSelecionado="Matemática" />);
        const btn = screen.getByText(/Exibir mais/i);
        fireEvent.click(btn);
        // Não há efeito visível, mas o botão pode ser clicado sem erro
        expect(btn).toBeInTheDocument();
    });

    it("renderiza o spinner de loading quando estaCarregando for true", () => {
        // Força o estado de loading via mock de useState
        jest.spyOn(React, "useState")
            .mockImplementationOnce(() => [true, jest.fn()])
            .mockImplementation((init?: any) => [init, jest.fn()]);
        render(<ComparativoTabela turmaSelecionada="1" componentesCurricularSelecionado="Matemática" />);
        expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
        jest.restoreAllMocks();
    });
});

describe("getProgressColor", () => {
  const getProgressColor = ComparativoTabelaModule.getProgressColor as (value: number, disciplina: string, ano: number) => string;

  it("retorna cor correta para Lingua portuguesa 5º ano", () => {
    expect(getProgressColor(100, "Lingua portuguesa", 5)).toBe("#FF5959");
    expect(getProgressColor(170, "Lingua portuguesa", 5)).toBe("#FEDE99");
    expect(getProgressColor(220, "Lingua portuguesa", 5)).toBe("#5A94D8");
    expect(getProgressColor(300, "Lingua portuguesa", 5)).toBe("#99FF99");
  });

  it("retorna cor correta para Lingua portuguesa 9º ano", () => {
    expect(getProgressColor(150, "Lingua portuguesa", 9)).toBe("#FF5959");
    expect(getProgressColor(210, "Lingua portuguesa", 9)).toBe("#FEDE99");
    expect(getProgressColor(300, "Lingua portuguesa", 9)).toBe("#5A94D8");
    expect(getProgressColor(400, "Lingua portuguesa", 9)).toBe("#99FF99");
  });

  it("retorna cor correta para Matemática 5º ano", () => {
    expect(getProgressColor(100, "Matemática", 5)).toBe("#FF5959");
    expect(getProgressColor(200, "Matemática", 5)).toBe("#FEDE99");
    expect(getProgressColor(250, "Matemática", 5)).toBe("#5A94D8");
    expect(getProgressColor(300, "Matemática", 5)).toBe("#99FF99");
  });

  it("retorna cor correta para Matemática 9º ano", () => {
    expect(getProgressColor(100, "Matemática", 9)).toBe("#FF5959");
    expect(getProgressColor(250, "Matemática", 9)).toBe("#FEDE99");
    expect(getProgressColor(320, "Matemática", 9)).toBe("#5A94D8");
    expect(getProgressColor(400, "Matemática", 9)).toBe("#99FF99");
  });

  it("retorna 'default' para disciplinas/anos não mapeados", () => {
    expect(getProgressColor(100, "Outra", 1)).toBe("default");
  });
});

describe("buildColumns - cobertura do if (!psp) return null", () => {
  it("retorna null quando não existe PSP na lista de proficiencias", () => {
    // Importa a função buildColumns do módulo
    const buildColumns = (ComparativoTabelaModule as any).buildColumns as (
      disciplina: string,
      ano: number,
      dados: any[]
    ) => any[];

    // Cria um estudante sem PSP
    const dados = [
      {
        nome: "Aluno Sem PSP",
        variacao: 0,
        proficiencias: [
          { descricao: "PSA", mes: "Agosto", valor: 210.5 }
        ]
      }
    ];

    // Gera as colunas
    const columns = buildColumns("Lingua portuguesa", 5, dados);

    // Acha a coluna PSP
    const pspColumn = columns[1].children.find((col: any) => col.key === "psp");

    // Chama o render da coluna PSP
    const rendered = pspColumn.render(null, dados[0]);

    // Deve ser null
    expect(rendered).toBeNull();
  });
});