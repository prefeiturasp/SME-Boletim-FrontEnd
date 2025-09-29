import React from "react";
import { render, screen } from "@testing-library/react";
import LoadingBox from "./loadingBox";

// Mock do CSS
jest.mock("./loadingBox.css", () => ({}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("LoadingBox", () => {
  it("renderiza o componente LoadingBox corretamente", () => {
    render(<LoadingBox />);
    
    expect(screen.getByTestId("loading-box")).toBeInTheDocument();
  });

  it("renderiza o spinner de loading", () => {
    render(<LoadingBox />);
    
    // Verifica se o elemento de loading está presente
    const loadingElement = screen.getByTestId("loading-box");
    expect(loadingElement).toBeInTheDocument();
  });

  it("aplica as classes CSS corretas", () => {
    render(<LoadingBox />);
    
    const loadingBox = screen.getByTestId("loading-box");
    expect(loadingBox).toHaveClass("loading-box");
  });

  it("renderiza o texto de loading se fornecido", () => {
    const loadingText = "Carregando dados...";
    render(<LoadingBox text={loadingText} />);
    
    expect(screen.getByText(loadingText)).toBeInTheDocument();
  });

  it("não renderiza texto quando não fornecido", () => {
    render(<LoadingBox />);
    
    // Verifica que não há texto específico de loading
    expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument();
  });

  it("renderiza apenas com prop text válida", () => {
    render(<LoadingBox text="Processando..." />);
    
    const loadingBox = screen.getByTestId("loading-box");
    expect(loadingBox).toBeInTheDocument();
    expect(screen.getByText("Processando...")).toBeInTheDocument();
  });

  it("renderiza dentro de um container se fornecido", () => {
    render(
      <div data-testid="container">
        <LoadingBox />
      </div>
    );
    
    const container = screen.getByTestId("container");
    const loadingBox = screen.getByTestId("loading-box");
    
    expect(container).toContainElement(loadingBox);
  });

  it("mantém acessibilidade com role adequado", () => {
    render(<LoadingBox />);
    
    const loadingBox = screen.getByTestId("loading-box");
    expect(loadingBox).toHaveAttribute("role", "status");
  });

  it("renderiza com aria-label para acessibilidade", () => {
    render(<LoadingBox />);
    
    const loadingBox = screen.getByTestId("loading-box");
    expect(loadingBox).toHaveAttribute("aria-label", "Carregando");
  });

  it("renderiza múltiplas instâncias sem conflito", () => {
    render(
      <div>
        <LoadingBox />
        <LoadingBox />
      </div>
    );
    
    expect(screen.getAllByTestId("loading-box")).toHaveLength(2);
  });
});

describe("LoadingBox - Props e variações", () => {
  it("funciona apenas com prop text", () => {
    render(<LoadingBox text="Teste" />);
    
    const loadingBox = screen.getByTestId("loading-box");
    expect(loadingBox).toBeInTheDocument();
    expect(screen.getByText("Teste")).toBeInTheDocument();
  });

  it("renderiza com diferentes textos de loading", () => {
    const { rerender } = render(<LoadingBox text="Processando..." />);
    expect(screen.getByText("Processando...")).toBeInTheDocument();

    rerender(<LoadingBox text="Aguarde..." />);
    expect(screen.getByText("Aguarde...")).toBeInTheDocument();
  });

  it("funciona sem props obrigatórias", () => {
    render(<LoadingBox />);
    
    expect(screen.getByTestId("loading-box")).toBeInTheDocument();
  });

  it("mantém estrutura HTML correta", () => {
    render(<LoadingBox />);
    
    const loadingBox = screen.getByTestId("loading-box");
    expect(loadingBox.tagName).toBe("DIV");
  });
});

describe("LoadingBox - Estados e comportamentos", () => {
  it("é visível por padrão", () => {
    render(<LoadingBox />);
    
    const loadingBox = screen.getByTestId("loading-box");
    expect(loadingBox).toBeVisible();
  });

  it("responde a mudanças de props text", () => {
    const { rerender } = render(<LoadingBox text="Texto inicial" />);
    expect(screen.getByText("Texto inicial")).toBeInTheDocument();

    rerender(<LoadingBox text="Texto alterado" />);
    expect(screen.getByText("Texto alterado")).toBeInTheDocument();
    expect(screen.queryByText("Texto inicial")).not.toBeInTheDocument();
  });

  it("mantém referência estável", () => {
    const { rerender } = render(<LoadingBox />);
    const firstRender = screen.getByTestId("loading-box");

    rerender(<LoadingBox />);
    const secondRender = screen.getByTestId("loading-box");

    expect(firstRender).toBeInTheDocument();
    expect(secondRender).toBeInTheDocument();
  });

  it("alterna entre com e sem texto", () => {
    const { rerender } = render(<LoadingBox />);
    expect(screen.getByTestId("loading-box")).toBeInTheDocument();
    expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument();

    rerender(<LoadingBox text="Carregando..." />);
    expect(screen.getByText("Carregando...")).toBeInTheDocument();

    rerender(<LoadingBox />);
    expect(screen.queryByText("Carregando...")).not.toBeInTheDocument();
  });
});

describe("LoadingBox - Casos extremos", () => {
  it("funciona com texto muito longo", () => {
    const longText = "Este é um texto muito longo para testar se o componente consegue lidar com textos extensos sem quebrar a interface ou causar problemas de renderização";
    
    render(<LoadingBox text={longText} />);
    
    expect(screen.getByText(longText)).toBeInTheDocument();
  });

  it("funciona com caracteres especiais", () => {
    const specialText = "Carregando... ÀÇÈÑÔß @#$%&*()";
    
    render(<LoadingBox text={specialText} />);
    
    expect(screen.getByText(specialText)).toBeInTheDocument();
  });

  it("funciona com texto vazio", () => {
    render(<LoadingBox text="" />);
    
    const loadingBox = screen.getByTestId("loading-box");
    expect(loadingBox).toBeInTheDocument();
  });

  it("não quebra com prop text undefined", () => {
    render(<LoadingBox text={undefined} />);
    
    expect(screen.getByTestId("loading-box")).toBeInTheDocument();
  });

  it("funciona em diferentes contextos de renderização", () => {
    const { unmount, rerender } = render(<LoadingBox />);
    
    expect(screen.getByTestId("loading-box")).toBeInTheDocument();
    
    unmount();
    expect(screen.queryByTestId("loading-box")).not.toBeInTheDocument();
    
    rerender(<LoadingBox />);
    expect(screen.getByTestId("loading-box")).toBeInTheDocument();
  });

  it("renderiza corretamente com números como texto", () => {
    render(<LoadingBox text="50%" />);
    
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("funciona com quebras de linha no texto", () => {
    const textWithBreaks = "Linha 1\nLinha 2";
    render(<LoadingBox text={textWithBreaks} />);
    
    expect(screen.getByText(textWithBreaks)).toBeInTheDocument();
  });
});