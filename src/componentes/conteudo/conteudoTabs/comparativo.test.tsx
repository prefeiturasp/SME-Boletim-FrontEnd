// Mocks do Redux
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Comparativo from "./comparativo";
import { useSelector, useDispatch } from "react-redux";
import { servicos } from "../../../servicos";

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

beforeEach(() => {
  jest.clearAllMocks();
  (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
  (useSelector as unknown as jest.Mock).mockImplementation((selector) => selector(mockState));
});


// Mock do serviço
jest.mock("../../../servicos", () => ({
  servicos: {
    get: jest.fn().mockResolvedValue([]),
  },
}));

const mockDispatch = jest.fn();

const mockState = {
  filtroCompleto: {
    componentesCurriculares: [
      { texto: "Matemática", valor: 1 },
      { texto: "Português", valor: 2 },
    ],
    anosEscolares: [
      { texto: "5", valor: 5 },
      { texto: "9", valor: 9 },
    ],
  },
  filtros: {
    componentesCurricularesRadio: [{ texto: "Matemática", valor: 1 }],
    anosEscolaresRadio: [{ texto: "5", valor: 5 }],
  },
  tab: { activeTab: "1" },
  escola: { escolaSelecionada: { ueId: 123, descricao: "DRE SA - Leste" } },
  nomeAplicacao: { id: "APP1" },
};

describe("Comparativo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // @ts-expect-error: Jest mock typing
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    // @ts-expect-error: Jest mock typing
    (useSelector as jest.Mock).mockImplementation((selector) => selector(mockState));
  });

  it("deve renderizar textos principais e selects", () => {
    render(<Comparativo />);
    expect(screen.getByText(/evolução do nível de proficiência/i)).toBeInTheDocument();
    expect(screen.getByText(/Componente curricular:/i)).toBeInTheDocument();
    expect(screen.getByText(/Ano:/i)).toBeInTheDocument();
    expect(screen.getByText(/Turma:/i)).toBeInTheDocument();    
    const profSpans = screen.getAllByText(/Proficiência/i).filter(
      el => el.tagName === "SPAN"
    );
    expect(profSpans.length).toBe(4);
    expect(screen.getByText(/Informações da/i)).toBeInTheDocument();
    expect(screen.getByText("Leste")).toBeInTheDocument();
  });

  it("deve renderizar selects com opções corretas", () => {
    render(<Comparativo />);
    // Abre o select de componente curricular
    fireEvent.mouseDown(screen.getAllByRole("combobox")[0]);
    // Corrigido: verifica se há pelo menos uma opção "Matemática" e "Português"
    expect(screen.getAllByText("Matemática").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Português").length).toBeGreaterThan(0);

    // Abre o select de ano
    fireEvent.mouseDown(screen.getAllByRole("combobox")[1]);
    expect(screen.getAllByText("5º ano").length).toBeGreaterThan(0);
    expect(screen.getAllByText("9º ano").length).toBeGreaterThan(0);
  });

  it("deve chamar dispatch ao trocar componente curricular", () => {
    render(<Comparativo />);
    fireEvent.mouseDown(screen.getAllByRole("combobox")[0]);
    // Corrigido: seleciona a primeira opção "Português" disponível
    const options = screen.getAllByText("Português");
    fireEvent.click(options[options.length - 1]);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it("deve chamar dispatch ao trocar ano escolar", () => {
    render(<Comparativo />);
    fireEvent.mouseDown(screen.getAllByRole("combobox")[1]);
    const options = screen.getAllByText("9º ano");
    fireEvent.click(options[0]);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it("deve mostrar loading quando estaCarregando for true", () => {
    // Força o estado de loading
    jest.spyOn(React, "useState")
      .mockImplementationOnce((init?: any) => [true, jest.fn()]) // estaCarregando
      .mockImplementation((init?: any) => [init, jest.fn()]);
    render(<Comparativo />);
    expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
    jest.restoreAllMocks();
  });

  it("deve exibir cards de Proficiência", () => {
    render(<Comparativo />);
    const profSpans = screen.getAllByText(/Proficiência/i).filter(
      el => el.tagName === "SPAN"
    );
    expect(profSpans.length).toBe(4);
    expect(screen.getAllByText("862 (95,6%)").length).toBe(4);
  });

  it("deve renderizar select de turma vazio inicialmente", () => {
    render(<Comparativo />);
    fireEvent.mouseDown(screen.getAllByRole("combobox")[2]);
    expect(screen.getByText("Nenhuma turma encontrada")).toBeInTheDocument();
  });

  it("deve exibir placeholder correto nos selects", () => {
    // Deixe os selects sem valor selecionado
    const mockStateSemSelecionados = {
      ...mockState,
      filtros: {
        componentesCurricularesRadio: [],
        anosEscolaresRadio: [],
      },
    };
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => selector(mockStateSemSelecionados));
    render(<Comparativo />);
    expect(screen.getAllByText("Selecione").length).toBeGreaterThan(0);
    expect(screen.getByText("Todas")).toBeInTheDocument();
  });

  it("deve renderizar corretamente o texto de informações da escola", () => {
    render(<Comparativo />);
    expect(screen.getByText(/Informações da/i)).toBeInTheDocument();
    expect(screen.getByText("Leste")).toBeInTheDocument();
    expect(screen.getByText(/provas São Paulo/i)).toBeInTheDocument();
  });

  it("deve renderizar todos os cards de Proficiência com valores corretos", () => {
    render(<Comparativo />);
    expect(screen.getAllByText("Proficiência").length).toBe(4);
    expect(screen.getAllByText("862 (95,6%)").length).toBe(4);
    expect(screen.getAllByText("2025").length).toBe(4);
    expect(screen.getAllByText("192.2").length).toBeGreaterThan(0);
  });

  it("deve renderizar todos os níveis dos cards", () => {
    render(<Comparativo />);
    expect(screen.getAllByText("Abaixo do básico").length).toBe(4);
  });
});