import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Conteudo from "./conteudo";
import { useDispatch, useSelector } from "react-redux";

// Mock dos componentes filhos (mantido igual)
jest.mock("./conteudoTabs/principal", () => () => <div>Principal</div>);
jest.mock("./conteudoTabs/turma", () => () => <div>Turma</div>);
jest.mock("./conteudoTabs/estudantes", () => () => <div>Estudantes</div>);
jest.mock("./conteudoTabs/probabilidade", () => () => <div>Resultado</div>);

// Mock do Redux corrigido
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

const mockDispatch = jest.fn();
const mockUseSelector = useSelector as unknown as jest.Mock;
const mockUseDispatch = useDispatch as unknown as jest.Mock;

// Estado base corrigido
const baseMockState = {
  tab: { activeTab: "1" },
  nomeAplicacao: { nome: "Aplicação Teste" },
  filtroCarregado: { carregado: true },
};

describe("Conteudo Component - Testes Corrigidos", () => {
  beforeEach(() => {
    mockUseDispatch.mockReturnValue(mockDispatch);
    mockUseSelector.mockImplementation((callback) => callback(baseMockState));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza o título corretamente", () => {
    render(<Conteudo />);
    expect(screen.getByText("Aplicação Teste")).toBeInTheDocument();
  });

  test("dispara ação ao mudar aba", () => {
    render(<Conteudo />);
    fireEvent.click(screen.getByText("Turma"));
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "tab/setActiveTab",
        payload: "2",
      })
    );
  });

  test("renderiza conteúdo da aba ativa", () => {
    mockUseSelector.mockImplementation((callback) =>
      callback({
        ...baseMockState,
        tab: { activeTab: "4" },
      })
    );

    render(<Conteudo />);
    expect(screen.getByText("Resultado")).toBeInTheDocument();
  });
});
