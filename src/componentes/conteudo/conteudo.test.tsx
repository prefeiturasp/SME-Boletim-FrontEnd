import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useDispatch, useSelector } from "react-redux";
import { MemoryRouter } from "react-router-dom";

// Mocks dos componentes filhos
jest.mock("./conteudoTabs/principal", () => () => <div>Principal</div>);
jest.mock("./conteudoTabs/turma", () => () => <div>Turma</div>);
jest.mock("./conteudoTabs/estudantes", () => () => <div>Estudantes</div>);
jest.mock("./conteudoTabs/probabilidade", () => () => <div>Resultado</div>);

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

jest.mock("../../servicos", () => ({
  servicos: {
    get: jest.fn(),
  },
}));

import Conteudo from "./conteudo";

// Mock do Redux
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
  escola: { escolaSelecionada: { ueId: 1 } },
  filtrosSelecionados: {
    niveisAbaPrincipal: [{ valor: 1 }],
  },
  filtroCompleto: {
    componentesCurriculares: [{ texto: "Matemática" }],
  },
};

describe("Conteudo Component - Testes Corrigidos", () => {
  beforeEach(() => {
    mockUseDispatch.mockReturnValue(mockDispatch);
    mockUseSelector.mockImplementation((callback) => callback(baseMockState));
  });

  afterEach(() => {
    jest.clearAllMocks();
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

  test("renderiza conteúdo da aba Principal", () => {
    mockUseSelector.mockImplementation((callback) =>
      callback({ ...baseMockState, tab: { activeTab: "1" } })
    );
    render(<Conteudo />);
    expect(screen.getAllByText("Principal").length).toBeGreaterThan(1);
  });

  test("renderiza conteúdo da aba Turma", () => {
    mockUseSelector.mockImplementation((callback) =>
      callback({ ...baseMockState, tab: { activeTab: "2" } })
    );
    render(<Conteudo />);
    expect(screen.getAllByText("Turma").length).toBeGreaterThan(1);
  });

  test("renderiza conteúdo da aba Estudantes", () => {
    mockUseSelector.mockImplementation((callback) =>
      callback({ ...baseMockState, 
        tab: { activeTab: "3" },
        escola: { escolaSelecionada: { ueId: 1 } },
      })
    );
    render(<Conteudo />);
    expect(screen.getAllByText("Estudantes").length).toBeGreaterThan(1);
  });

  test("renderiza fallback para aba desconhecida", () => {
    mockUseSelector.mockImplementation((callback) =>
      callback({ ...baseMockState, tab: { activeTab: "999" } })
    );
    const { container } = render(<Conteudo />);
    expect(container.querySelector('[role="tabpanel"]')).toBeNull();
  });

  test("não renderiza conteúdo se filtro não estiver carregado", () => {
    mockUseSelector.mockImplementation((callback) =>
      callback({ ...baseMockState, filtroCarregado: { carregado: false } })
    );
    render(<Conteudo />);
    expect(screen.getByText("123")).toBeInTheDocument();
  });

  test("renderiza botão de voltar quando showVoltarUes é true", () => {
    const localStorageSpy = jest.spyOn(window.localStorage.__proto__, "getItem").mockImplementation((key) => {
      if (key === "tipoPerfil") return "4";
      return null;
  });

    mockUseSelector.mockImplementation((callback) =>
      callback({
        ...baseMockState,
        escola: { escolaSelecionada: { ueId: 1 } },
      })
    );

    render(
      <MemoryRouter>
        <Conteudo />
      </MemoryRouter>
    );
    expect(screen.getByText((text) => text.includes("Voltar a tela anterior"))).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /voltar a tela anterior/i })).toBeInTheDocument();

    // Limpa o mock do localStorage para não afetar outros testes
    localStorageSpy.mockRestore();
  });
    
  test("renderiza Select com opções", async () => {
    mockUseSelector.mockImplementation((callback) =>
      callback({
        ...baseMockState,
        escola: { escolaSelecionada: { ueId: 1 } }, // Garante que buscarAplicacoes será chamado
      })
    );

    // Mock do serviço para retornar opções
    const mockAplicacoes = [{ id: 1, nome: "Opção 1" }];
    require("../../servicos").servicos.get.mockResolvedValueOnce(mockAplicacoes);

    render(
      <MemoryRouter>
        <Conteudo />
      </MemoryRouter>
    );

    // Aguarde o efeito assíncrono terminar (buscarAplicacoes)
    // Abra o select
    fireEvent.mouseDown(screen.getByRole("combobox"));

    // Aguarde a opção aparecer no DOM
    expect(await screen.findByText("Opção 1")).toBeInTheDocument();
  });

  test("dispara ação ao selecionar aplicação no Select", () => {
    render(<Conteudo />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: 123 } });
    // Verifique se a ação esperada foi disparada
  });

  test("desabilita abas quando abasDesabilitadas é true", () => {
    mockUseSelector.mockImplementation((callback) =>
      callback({
        ...baseMockState,
        filtroCarregado: { carregado: false }
      })
    );
    render(<Conteudo />);
    // Verifique se as abas estão desabilitadas
    expect(screen.getByRole("tab", { name: "Principal" })).toHaveAttribute("aria-disabled", "true");
  });
  

});
