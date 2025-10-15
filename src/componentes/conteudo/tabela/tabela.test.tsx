import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Tabela from "./tabela";
import { useSelector } from "react-redux";

// Mock do useSelector
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(),
}));

const mockDados = [
  {
    key: "1",
    componenteCurricular: "Matemática",
    abaixoBasico: "2",
    basico: "3",
    adequado: "1",
    avancado: "0",
    total: 6,
    mediaProficiencia: 180,
  },
];

const mockState = {
  tab: { activeTab: "1" },
  filtros: {
    niveisAbaPrincipal: [
      { texto: "Abaixo do Básico", valor: 1 },
      { texto: "Básico", valor: 2 },
      { texto: "Adequado", valor: 3 },
      { texto: "Avançado", valor: 4 },
    ],
  },
};

describe("Tabela", () => {
  beforeEach(() => {
    (useSelector as unknown as jest.Mock).mockImplementation((cb) =>
      cb(mockState)
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza tabela com dados corretamente", () => {
    render(
      <Tabela dados={mockDados} origem="principal" estaCarregando={false} />
    );

    expect(screen.getByText("Matemática")).toBeInTheDocument();
    expect(screen.getByText("Abaixo do básico")).toBeInTheDocument();
    expect(screen.getByText("Básico")).toBeInTheDocument();
    expect(screen.getByText("Adequado")).toBeInTheDocument();
    expect(screen.getByText("Avançado")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("Média de proficiência")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("180")).toBeInTheDocument();
  });

  it("exibe mensagem de vazio quando não há dados", () => {
    render(<Tabela dados={[]} origem="principal" estaCarregando={false} />);
    expect(
      screen.getByText("Não encontramos dados para a UE selecionada")
    ).toBeInTheDocument();
  });

  it("renderiza com estado de carregamento (spinner)", () => {
    render(<Tabela dados={mockDados} origem="principal" estaCarregando />);
    const spinner = document.querySelector(".ant-spin");
    expect(spinner).toBeTruthy();
  });

  it("executa drag and drop entre colunas sem erro", () => {
    render(
      <Tabela dados={mockDados} origem="principal" estaCarregando={false} />
    );

    const headers = screen.getAllByText(
      /Componente curricular|Abaixo do básico|Básico|Adequado|Avançado|Total|Média de proficiência/
    );

    const dataTransfer = {
      effectAllowed: "",
      setData: jest.fn(),
      getData: jest.fn(),
    };

    fireEvent.dragStart(headers[0], { dataTransfer });
    fireEvent.dragOver(headers[1]);
    fireEvent.drop(headers[1], { dataTransfer });

    expect(headers[0]).toBeInTheDocument();
  });

  it("simula mudança de visibilidade de colunas (toggleColumnVisibility)", () => {
    // mock para capturar atualizações de colunas
    const mockSetColunas = jest.fn();

    // simulamos um estado inicial de colunas
    const colunasMock = [
      { key: "basico", hidden: false },
      { key: "adequado", hidden: false },
    ];

    jest.spyOn(React, "useState")
      // 1° useState - colunas
      .mockReturnValueOnce([colunasMock, mockSetColunas])
      // 2° useState - draggedColumn
      .mockReturnValueOnce([null, jest.fn()]);

    render(
      <Tabela dados={mockDados} origem="principal" estaCarregando={false} />
    );

    // pegamos o argumento passado ao setColunas e executamos a função
    const atualizador = mockSetColunas.mock.calls[0]?.[0];
    if (typeof atualizador === "function") {
      const novo = atualizador(colunasMock);
      expect(Array.isArray(novo)).toBe(true);
    }

    expect(mockSetColunas).toHaveBeenCalled();
  });

  it("executa useEffect e atualiza colunas conforme filtros", () => {
    const mockState2 = {
      ...mockState,
      filtros: {
        niveisAbaPrincipal: [
          { texto: "Abaixo do Básico", valor: 1 },
          // removidos outros valores
        ],
      },
    };

    (useSelector as unknown as jest.Mock).mockImplementation((cb) =>
      cb(mockState2)
    );

    render(
      <Tabela dados={mockDados} origem="principal" estaCarregando={false} />
    );

    expect(screen.getByText("Matemática")).toBeInTheDocument();
  });

  it("não quebra se a aba ativa for diferente de 1", () => {
    const mockState3 = {
      ...mockState,
      tab: { activeTab: "2" },
    };

    (useSelector as unknown as jest.Mock).mockImplementation((cb) =>
      cb(mockState3)
    );

    render(
      <Tabela dados={mockDados} origem="principal" estaCarregando={false} />
    );

    expect(screen.getByText("Matemática")).toBeInTheDocument();
  });
});
