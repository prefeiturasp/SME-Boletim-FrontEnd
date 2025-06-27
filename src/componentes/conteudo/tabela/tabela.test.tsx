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
    (useSelector as unknown as jest.Mock).mockImplementation((callback) =>
      callback(mockState)
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza tabela com dados", () => {
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
    expect(screen.getByText("2")).toBeInTheDocument(); // abaixoBasico
    expect(screen.getByText("3")).toBeInTheDocument(); // basico
    expect(screen.getByText("1")).toBeInTheDocument(); // adequado
    expect(screen.getByText("0")).toBeInTheDocument(); // avancado
    expect(screen.getByText("6")).toBeInTheDocument(); // total
    expect(screen.getByText("180")).toBeInTheDocument(); // mediaProficiencia
  });

  it("mostra mensagem de vazio quando dados estão vazios", () => {
    render(<Tabela dados={[]} origem="principal" estaCarregando={false} />);
    expect(
      screen.getByText("Não encontramos dados para a UE selecionada")
    ).toBeInTheDocument();
  });

  it("executa drag and drop entre colunas", () => {
    render(
      <Tabela dados={mockDados} origem="principal" estaCarregando={false} />
    );
    const draggableHeaders = screen.getAllByText(
      /Componente curricular|Abaixo do básico|Básico|Adequado|Avançado|Total|Média de proficiência/
    );
    // Simula drag and drop (mock do dataTransfer)
    const dataTransfer = {
      effectAllowed: "",
      setData: jest.fn(),
      getData: jest.fn(),
    };
    fireEvent.dragStart(draggableHeaders[0], { dataTransfer });
    fireEvent.dragOver(draggableHeaders[1]);
    fireEvent.drop(draggableHeaders[1], { dataTransfer });
  });
});
