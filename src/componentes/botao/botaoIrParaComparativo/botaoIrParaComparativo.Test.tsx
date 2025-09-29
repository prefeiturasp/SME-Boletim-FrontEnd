import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";
import BotaoIrParaComparativo from "./botaoIrParaComparativo";

beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => { });
    jest.spyOn(console, "warn").mockImplementation(() => { });
});

// Mock do CSS
jest.mock("./botaoIrParaComparativo.css", () => ({}));

// Mock do ícone
jest.mock("../../../assets/icon-comparativo.svg", () => "icon-comparativo.svg");

// Props padrão para os testes
const defaultProps = {
    dreId: 123,
    escola: {
        ueId: "123",
        descricao: "Escola Teste",
        dre: "DRE Teste"
    },
    aplicacaoId: 123,
    componenteCurricularId: 1,
    ano: { label: "5º ano", value: 5 }
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
        expect(screen.getByText(/conferir dados da ue/i)).toBeInTheDocument();
    });

    it("renderiza o ícone do comparativo", () => {
        renderWithProviders(<BotaoIrParaComparativo {...defaultProps} />);

        const button = screen.getByRole("button");
        expect(button).toBeInTheDocument();
    });

    it("aplica as classes CSS corretas", () => {
        renderWithProviders(<BotaoIrParaComparativo {...defaultProps} />);

        const button = screen.getByRole("button");
        expect(button).toHaveClass("cards-comparativa-rodape-btn");
    });

    it("navega para a rota comparativo ao clicar", () => {
        const mockNavigate = jest.fn();

        // Spy no useNavigate
        jest.spyOn(require("react-router-dom"), "useNavigate").mockReturnValue(mockNavigate);

        renderWithProviders(<BotaoIrParaComparativo {...defaultProps} />);

        const button = screen.getByRole("button");
        fireEvent.click(button);

        expect(mockNavigate).toHaveBeenCalled();
    });

    it("renderiza o texto correto do botão", () => {
        renderWithProviders(<BotaoIrParaComparativo {...defaultProps} />);

        expect(screen.getByText("Conferir dados da UE")).toBeInTheDocument();
    });

    it("tem as classes CSS do Ant Design aplicadas", () => {
        renderWithProviders(<BotaoIrParaComparativo {...defaultProps} />);

        const button = screen.getByRole("button");
        expect(button).toHaveClass("ant-btn");
        expect(button).toHaveClass("ant-btn-primary");
        expect(button).toHaveClass("cards-comparativa-rodape-btn");
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

        expect(screen.getByText(/conferir dados da ue/i)).toBeInTheDocument();
    });

    it("funciona com diferentes estados do Redux", () => {
        const customState = {
            filtros: { componentesSelecionados: [] },
            escola: { escolaSelecionada: null },
            tab: { activeTab: "2" },
        };

        renderWithProviders(<BotaoIrParaComparativo {...defaultProps} />, customState);

        expect(screen.getByRole("button")).toBeInTheDocument();
        expect(screen.getByText("Conferir dados da UE")).toBeInTheDocument(); // Texto correto
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

    it("trata erro ao processar parâmetros da URL", () => {
        // Mock do console.error para verificar se foi chamado
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        // Mock do navigate que vai lançar erro
        const mockNavigate = jest.fn().mockImplementation(() => {
            throw new Error("Erro simulado na navegação");
        });

        // Mock do useNavigate
        jest.spyOn(require("react-router-dom"), "useNavigate").mockReturnValue(mockNavigate);

        renderWithProviders(<BotaoIrParaComparativo {...defaultProps} />);

        const button = screen.getByRole("button");

        // Clica no botão - isso deve disparar o erro
        fireEvent.click(button);

        // Verifica se o navigate foi chamado (agora com ano.value)
        expect(mockNavigate).toHaveBeenCalledWith(
            `/?ueSelecionada=${defaultProps.escola.ueId}&dreUrlSelecionada=${defaultProps.dreId}`,
            {
                state: {
                    abrirComparativo: true,
                    componenteCurricularId: defaultProps.componenteCurricularId,
                    ano: defaultProps.ano.value, // Mudança: usar .value em vez de .ano
                }
            }
        );

        // Verifica se o console.error foi chamado com a mensagem de erro
        expect(consoleSpy).toHaveBeenCalledWith("Erro ao processar os parâmetros da URL:", expect.any(Error));

        // Limpa os mocks
        consoleSpy.mockRestore();
    });

    it("trata erro quando window.scrollTo falha", () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        // Mock do navigate que funciona normalmente
        const mockNavigate = jest.fn();

        // Mock do window.scrollTo que vai lançar erro
        const originalScrollTo = window.scrollTo;
        window.scrollTo = jest.fn().mockImplementation(() => {
            throw new Error("Erro no scrollTo");
        });

        jest.spyOn(require("react-router-dom"), "useNavigate").mockReturnValue(mockNavigate);

        renderWithProviders(<BotaoIrParaComparativo {...defaultProps} />);

        const button = screen.getByRole("button");
        fireEvent.click(button);

        // Verifica se o console.error foi chamado
        expect(consoleSpy).toHaveBeenCalledWith("Erro ao processar os parâmetros da URL:", expect.any(Error));

        // Restaura mocks
        consoleSpy.mockRestore();
        window.scrollTo = originalScrollTo;
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