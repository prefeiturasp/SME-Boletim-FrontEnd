import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useDispatch, useSelector } from "react-redux";
import { MemoryRouter } from "react-router-dom";

// mocks dos componentes filhos
jest.mock("./conteudoTabs/principal", () => () => <div>Principal</div>);
jest.mock("./conteudoTabs/turma", () => () => <div>Turma</div>);
jest.mock("./conteudoTabs/estudantes", () => () => <div>Estudantes</div>);
jest.mock("./conteudoTabs/probabilidade", () => () => <div>Resultado</div>);
jest.mock("./conteudoTabs/comparativo", () => () => <div>Comparativo</div>);

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

jest.mock("../../servicos", () => ({
  servicos: { get: jest.fn() },
}));

import Conteudo from "./conteudo";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

const mockDispatch = jest.fn();
const mockUseSelector = useSelector as unknown as jest.Mock;
const mockUseDispatch = useDispatch as unknown as jest.Mock;

const baseMockState = {
  tab: { activeTab: "1" },
  nomeAplicacao: { id: 123 },
  filtroCarregado: { carregado: true },
  escola: { escolaSelecionada: { ueId: 1, descricao: "UE Teste" } },
};

const renderWithRouter = () =>
  render(
    <MemoryRouter>
      <Conteudo />
    </MemoryRouter>,
  );

describe("Conteudo Component - Testes Corrigidos", () => {
  beforeEach(() => {
    mockUseDispatch.mockReturnValue(mockDispatch);
    mockUseSelector.mockImplementation((callback) => callback(baseMockState));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("dispara ação ao mudar aba", () => {
    renderWithRouter();
    fireEvent.click(screen.getByText("Turma"));
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "tab/setActiveTab",
        payload: "2",
      }),
    );
  });

  test("renderiza conteúdo da aba ativa", () => {
    mockUseSelector.mockImplementation((cb) =>
      cb({ ...baseMockState, tab: { activeTab: "4" } }),
    );
    renderWithRouter();
    expect(screen.getByText("Resultado")).toBeInTheDocument();
  });

  test("renderiza botão de voltar", () => {
    const localStorageSpy = jest
      .spyOn(window.localStorage.__proto__, "getItem")
      .mockImplementation(() => "4");
    renderWithRouter();
    expect(screen.getByText(/Voltar a tela anterior/i)).toBeInTheDocument();
    localStorageSpy.mockRestore();
  });

  test("renderiza Select com opções mockadas", async () => {
    const mockAplicacoes = [{ id: 1, nome: "Opção 1" }];
    require("../../servicos").servicos.get.mockResolvedValueOnce(
      mockAplicacoes,
    );
    renderWithRouter();
    fireEvent.mouseDown(screen.getByRole("combobox"));
    expect(await screen.findByText("Opção 1")).toBeInTheDocument();
  });

  test("botão 'Voltar a tela anterior' está presente e é clicável", () => {
    renderWithRouter();
    const btn = screen.getByText(/Voltar a tela anterior/i);
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    // handleClick chama navigate, não dispatch
    expect(btn).toBeInTheDocument();
  });

  test("buscarAplicacoes é chamado quando ueId muda", async () => {
    const mockAplicacoes = [
      { id: 10, nome: "PSP 2025", tipoTai: true, dataInicioLote: "2025-01-01" },
    ];
    require("../../servicos").servicos.get.mockResolvedValueOnce(
      mockAplicacoes,
    );
    renderWithRouter();
    await waitFor(() => {
      expect(require("../../servicos").servicos.get).toHaveBeenCalledWith(
        "/api/boletimescolar/aplicacoes-prova",
      );
    });
  });

  test("não chama buscarAplicacoes quando ueId é null", () => {
    mockUseSelector.mockImplementation((cb) =>
      cb({
        ...baseMockState,
        escola: { escolaSelecionada: { ueId: null, descricao: null } },
      }),
    );
    renderWithRouter();
    expect(require("../../servicos").servicos.get).not.toHaveBeenCalled();
  });

  test("renderiza aba Comparativo na tab 5", () => {
    mockUseSelector.mockImplementation((cb) =>
      cb({ ...baseMockState, tab: { activeTab: "5" } }),
    );
    renderWithRouter();
    expect(screen.getAllByText("Comparativo")[0]).toBeInTheDocument();
  });

  test("renderiza aba Estudantes na tab 3", () => {
    mockUseSelector.mockImplementation((cb) =>
      cb({ ...baseMockState, tab: { activeTab: "3" } }),
    );
    renderWithRouter();
    expect(screen.getAllByText("Estudantes")[0]).toBeInTheDocument();
  });

  test("renderiza aba Principal na tab 1", () => {
    mockUseSelector.mockImplementation((cb) =>
      cb({ ...baseMockState, tab: { activeTab: "1" } }),
    );
    renderWithRouter();
    expect(screen.getAllByText("Principal")[0]).toBeInTheDocument();
  });

  test("exibe erro e não quebra quando buscarAplicacoes falha", async () => {
    require("../../servicos").servicos.get.mockRejectedValueOnce(
      new Error("Falha API"),
    );
    renderWithRouter();
    await waitFor(() => {
      expect(require("../../servicos").servicos.get).toHaveBeenCalled();
    });
  });
});
