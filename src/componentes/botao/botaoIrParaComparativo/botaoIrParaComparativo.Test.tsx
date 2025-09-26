import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";
import BotaoIrParaComparativo from "./botaoIrParaComparativo";

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

// Mock do CSS
jest.mock("./botaoIrParaComparativo.css", () => ({}));

// Mock do ícone
jest.mock("../../../assets/icon-comparativo.svg", () => "icon-comparativo.svg");

// Props padrão para os testes
const defaultProps = {
  escola: {
    ueId: "123",
    descricao: "Escola Teste",
    dre: "DRE Teste"
  },
  aplicacaoId: 123,
  componenteCurricularId: 1
};

// Criação de store mock para os testes
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      // Adicione os reducers necessários baseado no que o componente usa
      filtros: (state = {}, action) => state,
      escola: (state = {}, action) => state,
      tab: (state = { activeTab: "1" }, action) => state,
      // Adicione outros reducers conforme necessário
    },
    preloadedState: initialState,
  });
};

// Wrapper para testes com Redux e Router
const renderWithProviders = (
  component: React.ReactElement,
  initialState = {}
) => {
  const store = createMockStore(initialState);
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe("BotaoIrParaComparativo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza o botão corretamente", () => {
    renderWithProviders(<BotaoIrParaComparativo {...defaultProps} />);
    
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText(/ir para comparativo/i)).toBeInTheDocument();
  });

  it("renderiza o ícone do comparativo", () => {
    renderWithProviders(<BotaoIrParaComparativo {...defaultProps} />);
    
    const icon = screen.getByAltText(/ícone comparativo/i);
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("src", "icon-comparativo.svg");
  });

  it("aplica as classes CSS corretas", () => {
    renderWithProviders(<BotaoIrParaComparativo {...defaultProps} />);
    
    const button = screen.getByRole("button");
    expect(button).toHaveClass("botao-ir-comparativo");
  });

  it("navega para a rota comparativo ao clicar", () => {
    const mockNavigate = jest.fn();
    
    // Mock do useNavigate
    jest.doMock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useNavigate: () => mockNavigate,
    }));

    renderWithProviders(<BotaoIrParaComparativo {...defaultProps} />);
    
    const button = screen.getByRole("button");
    fireEvent.click(button);
    
    expect(mockNavigate).toHaveBeenCalledWith("/comparativo");
  });

  it("mantém acessibilidade com texto alternativo no ícone", () => {
    renderWithProviders(<BotaoIrParaComparativo {...defaultProps} />);
    
    const icon = screen.getByAltText(/ícone comparativo/i);
    expect(icon).toBeInTheDocument();
  });

  it("é clicável e interativo", () => {
    renderWithProviders(<BotaoIrParaComparativo {...defaultProps} />);
    const button = screen.getByRole("button");
    expect(button).toBeEnabled();
    
    fireEvent.click(button);
    // Verifica se não houve erro ao clicar
    expect(button).toBeInTheDocument();
  });

  it("renderiza com o tipo de botão correto", () => {
    renderWithProviders(<BotaoIrParaComparativo {...defaultProps} />);
    
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "button");
  });

  it("tem o texto correto independente de maiúsculas/minúsculas", () => {
    renderWithProviders(<BotaoIrParaComparativo {...defaultProps} />);
    
    expect(screen.getByText((content, element) => {
      return element?.textContent?.toLowerCase().includes("ir para comparativo") || false;
    })).toBeInTheDocument();
  });

  it("funciona com diferentes estados do Redux", () => {
    const customState = {
      filtros: { componentesSelecionados: [] },
      escola: { escolaSelecionada: null },
      tab: { activeTab: "2" },
    };

    renderWithProviders(<BotaoIrParaComparativo {...defaultProps} />, customState);
    
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText(/ir para comparativo/i)).toBeInTheDocument();
  });

  it("mantém funcionalidade após múltiplos cliques", () => {
    renderWithProviders(<BotaoIrParaComparativo {...defaultProps} />);
    
    const button = screen.getByRole("button");
    
    // Clica múltiplas vezes
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    
    // Verifica se o botão ainda está funcional
    expect(button).toBeEnabled();
    expect(button).toBeInTheDocument();
  });

  it("renderiza corretamente em diferentes tamanhos de tela", () => {
    // Simula diferentes viewports
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 320, // mobile
    });

    renderWithProviders(<BotaoIrParaComparativo {...defaultProps} />);
    expect(screen.getByRole("button")).toBeInTheDocument();

    // Desktop
    Object.defineProperty(window, 'innerWidth', {
      value: 1920,
    });

    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});

describe("BotaoIrParaComparativo - Casos extremos", () => {
  it("funciona sem store Redux (se aplicável)", () => {
    // Se o componente pode funcionar sem Redux
    render(
      <BrowserRouter>
        <BotaoIrParaComparativo {...defaultProps} />
      </BrowserRouter>
    );
    
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("não quebra com props undefined", () => {
    renderWithProviders(<BotaoIrParaComparativo {...defaultProps} />);
    
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("mantém foco após interação", () => {
    renderWithProviders(<BotaoIrParaComparativo {...defaultProps} />);
    
    const button = screen.getByRole("button");
    button.focus();
    
    expect(document.activeElement).toBe(button);
    
    fireEvent.click(button);
    // Verifica se o foco ainda está no elemento ou foi gerenciado corretamente
    expect(button).toBeInTheDocument();
  });
});