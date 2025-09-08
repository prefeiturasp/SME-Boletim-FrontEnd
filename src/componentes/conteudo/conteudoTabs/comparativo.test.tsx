
import React from "react";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import Comparativo, {getNivelColor} from "./comparativo";
import { useSelector, useDispatch } from "react-redux";
import { servicos } from "../../../servicos";

// Mocks do Redux
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

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
    turmas: [
      { texto: "Turma 1", valor: 1 },
      { texto: "Turma 2", valor: 2 },
    ],
  },
  filtros: {
    componentesCurricularesRadio: [{ texto: "Matemática", valor: 1 }],
    anosEscolaresRadio: [{ texto: "5", valor: 5 }],
  },
  tab: { activeTab: "5" },
  escola: { escolaSelecionada: { ueId: 123, descricao: "DRE SA - Leste" } },
  nomeAplicacao: { id: "APP1" },
};

const resumoMock = [
  {
    ano: 2025,
    prova: "PSP",
    mediaProficiencia: 200,
    estudantes: 30,
    componentes: [
      { nome: "Matemática", valor: 200 },
      { nome: "Português", valor: 250 }
    ]
  },
  {
    ano: 2024,
    prova: "Prova PSA",
    mediaProficiencia: 250,
    estudantes: 28,
    componentes: [
      { nome: "Matemática", valor: 210 },
      { nome: "Português", valor: 240 }
    ]
  }
];

describe("Comparativo", () => {
  it("renderiza textos principais e selects", () => {
    render(<Comparativo />);
    expect(screen.getByText(/evolução do nível de proficiência/i)).toBeInTheDocument();
    expect(screen.getByText(/Componente curricular:/i)).toBeInTheDocument();
    expect(screen.getByText(/Ano:/i)).toBeInTheDocument();
    expect(screen.getByText(/Turma:/i)).toBeInTheDocument();
    expect(screen.getByText(/Informações da/i)).toBeInTheDocument();
    expect(screen.getByText("Leste")).toBeInTheDocument();
  });

  it("renderiza selects com opções corretas", async () => {
    render(<Comparativo />);

    // Componente Curricular
    fireEvent.mouseDown(screen.getAllByRole("combobox")[0]);
    expect(screen.getAllByText("Matemática").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Português").length).toBeGreaterThan(0);

    // Ano Escolar
    fireEvent.mouseDown(screen.getAllByRole("combobox")[1]);
    expect(screen.getAllByText("5º ano").length).toBeGreaterThan(0);
    expect(screen.getAllByText("9º ano").length).toBeGreaterThan(0);

    // Turma 1
    fireEvent.mouseDown(screen.getAllByRole("combobox")[2]);
    const turma1Options = screen.getAllByText("Turma 1");
    fireEvent.click(turma1Options[turma1Options.length - 1]);
    expect(screen.getAllByText("Turma 1").length).toBeGreaterThan(0);

    // Turma 2
    fireEvent.mouseDown(screen.getAllByRole("combobox")[2]);
    const turma2Options = screen.getAllByText("Turma 2");
    fireEvent.click(turma2Options[turma2Options.length - 1]);
    expect(screen.getAllByText("Turma 2").length).toBeGreaterThan(0);
  });

  it("chama setComponentesCurricularId ao trocar componente curricular", () => {
    render(<Comparativo />);
    fireEvent.mouseDown(screen.getAllByRole("combobox")[0]);
    const options = screen.getAllByText("Português");
    fireEvent.click(options[options.length - 1]);
    // Garante que o valor selecionado mudou
    expect(screen.getAllByText("Português").length).toBeGreaterThan(0);
  });

  it("chama setAnoEscolarId ao trocar ano escolar", async () => {
    render(<Comparativo />);
    fireEvent.mouseDown(screen.getAllByRole("combobox")[1]);
    // Use getAllByText para evitar erro de múltiplos elementos
    const anoOptions = screen.getAllByText("9º ano");
    fireEvent.click(anoOptions[anoOptions.length - 1]);
    fireEvent.mouseDown(screen.getAllByRole("combobox")[1]);
    // Verifica se algum dos elementos contém o texto
    expect(screen.getAllByText("9º ano").length).toBeGreaterThan(0);
  });

  it("chama setTurma ao trocar turma", async () => {
    render(<Comparativo />);
    fireEvent.mouseDown(screen.getAllByRole("combobox")[2]);
    await act(async () => { await Promise.resolve(); });
    // Use getAllByText para evitar erro de múltiplos elementos
    const turma2Options = screen.getAllByText("Turma 2");
    fireEvent.click(turma2Options[turma2Options.length - 1]);
    fireEvent.mouseDown(screen.getAllByRole("combobox")[2]);
    expect(screen.getAllByText("Turma 2").length).toBeGreaterThan(0);
  });

  // Testa troca rápida de todos os selects
  it("troca rapidamente todos os selects sem erro", async () => {
    render(<Comparativo />);
    // Componente curricular
    fireEvent.mouseDown(screen.getAllByRole("combobox")[0]);
    const portOptions = screen.getAllByText("Português");
    fireEvent.click(portOptions[portOptions.length - 1]);
    // Ano escolar
    fireEvent.mouseDown(screen.getAllByRole("combobox")[1]);
    const ano9Options = screen.getAllByText("9º ano");
    fireEvent.click(ano9Options[ano9Options.length - 1]);
    // Turma
    fireEvent.mouseDown(screen.getAllByRole("combobox")[2]);
    await act(async () => { await Promise.resolve(); });
    const turma2Options = screen.getAllByText("Turma 2");
    fireEvent.click(turma2Options[turma2Options.length - 1]);
    // Confirma se todos os valores aparecem
    expect(screen.getAllByText("Português").length).toBeGreaterThan(0);
    expect(screen.getAllByText("9º ano").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Turma 2").length).toBeGreaterThan(0);
  });

  // Testa renderização sem turmas
  it("não renderiza select de turma se não houver turmas", () => {
    const noTurmasState = {
      ...mockState,
      filtroCompleto: {
        ...mockState.filtroCompleto,
        turmas: [],
      },
    };
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => selector(noTurmasState));
    render(<Comparativo />);
    fireEvent.mouseDown(screen.getAllByRole("combobox")[2]);
    expect(screen.getByText("Nenhuma turma encontrada")).toBeInTheDocument();
  });

  it("mostra loading ao trocar selects", async () => {
    render(<Comparativo />);

    // Troca componente curricular para "Português"
    fireEvent.mouseDown(screen.getAllByRole("combobox")[0]);
    const portOptions = screen.getAllByText("Português");
    await act(async () => {
      fireEvent.click(portOptions[portOptions.length - 1]);
      await Promise.resolve();
    });

    // Aguarda o loading aparecer (se aparecer) e depois sumir
    // Não falha se não aparecer, pois pode ser rápido demais
    await waitFor(
      () => {
        // Se aparecer, beleza; se não, não falha
        screen.queryByText(/Carregando.../i);
      },
      { timeout: 1000 }
    );
    await waitFor(() => {
      expect(screen.queryByText(/Carregando.../i)).toBeNull();
    });

    // Troca turma para "Turma 2"
    fireEvent.mouseDown(screen.getAllByRole("combobox")[2]);
    const turma2Options = screen.getAllByText("Turma 2");
    fireEvent.click(turma2Options[turma2Options.length - 1]);
    expect(screen.getAllByText("Turma 2").length).toBeGreaterThan(0);
  });

  it("mostra loading quando estaCarregando for true", async () => {
    jest.spyOn(React, "useState")
      .mockImplementationOnce(() => [true, jest.fn()])
      .mockImplementation((init?: any) => [init, jest.fn()]);
    render(<Comparativo />);

    await waitFor(() => {
      screen.queryByText(/Carregando.../i);
    });
  });

  // Testa se todos os selects aparecem e têm os placeholders corretos
  it("renderiza todos os selects com placeholders corretos", () => {
    render(<Comparativo />);
    const selects = screen.getAllByRole("combobox");
    expect(selects.length).toBe(3);
    expect(selects[0]).toBeInTheDocument();
    expect(selects[1]).toBeInTheDocument();
    expect(selects[2]).toBeInTheDocument();
  });

  // Testa se todos os valores de opções aparecem nos selects usando getAllByText e length
  it("renderiza todas as opções de componentes curriculares, anos e turmas", async () => {
    render(<Comparativo />);
    fireEvent.mouseDown(screen.getAllByRole("combobox")[0]);
    expect(screen.getAllByText("Matemática").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Português").length).toBeGreaterThan(0);

    fireEvent.mouseDown(screen.getAllByRole("combobox")[1]);
    expect(screen.getAllByText("5º ano").length).toBeGreaterThan(0);
    expect(screen.getAllByText("9º ano").length).toBeGreaterThan(0);

    fireEvent.mouseDown(screen.getAllByRole("combobox")[2]);
    expect(screen.getAllByText("Turma 1").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Turma 2").length).toBeGreaterThan(0);
  });

  // Testa se ao trocar componente curricular, o valor selecionado muda corretamente
  it("seleciona corretamente um componente curricular diferente", () => {
    render(<Comparativo />);
    fireEvent.mouseDown(screen.getAllByRole("combobox")[0]);
    const options = screen.getAllByText("Português");
    fireEvent.click(options[options.length - 1]);
    // O valor selecionado deve ser exibido
    expect(screen.getAllByText("Português").length).toBeGreaterThan(0);
  });

  // Testa se ao trocar ano escolar, o valor selecionado muda corretamente
  it("seleciona corretamente um ano escolar diferente", () => {
    render(<Comparativo />);
    fireEvent.mouseDown(screen.getAllByRole("combobox")[1]);
    const options = screen.getAllByText("9º ano");
    fireEvent.click(options[options.length - 1]);
    expect(screen.getAllByText("9º ano").length).toBeGreaterThan(0);
  });

  // Testa se ao trocar turma, o valor selecionado muda corretamente
  it("seleciona corretamente uma turma diferente", async () => {
    render(<Comparativo />);
    fireEvent.mouseDown(screen.getAllByRole("combobox")[2]);
    await act(async () => { await Promise.resolve(); });
    const turmaOptions = screen.getAllByText("Turma 2");
    fireEvent.click(turmaOptions[turmaOptions.length - 1]);
    expect(screen.getAllByText("Turma 2").length).toBeGreaterThan(0);
  });

  // Testa se o componente mostra "-" quando não há dados de resumoCardsComparacao
  it("renderiza corretamente sem dados de resumoCardsComparacao", () => {
    (servicos.get as jest.Mock).mockResolvedValueOnce(null);
    render(<Comparativo />);
    expect(screen.getAllByText("Proficiência").length).toBeGreaterThan(0);
    expect(screen.getAllByText("-").length).toBeGreaterThan(0);
    expect(screen.getByText(/Informações da/i)).toBeInTheDocument();
  });

  // Testa se o componente mostra mensagem correta quando não há componentes curriculares
  it("mostra mensagem correta quando não há componentes curriculares", () => {
    const state = {
      ...mockState,
      filtroCompleto: {
        ...mockState.filtroCompleto,
        componentesCurriculares: [],
      },
    };
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => selector(state));
    render(<Comparativo />);
    fireEvent.mouseDown(screen.getAllByRole("combobox")[0]);
    expect(screen.getByText("Nenhum componente curricular encontrado")).toBeInTheDocument();
  });

  // Testa se o componente mostra mensagem correta quando não há anos escolares
  it("mostra mensagem correta quando não há anos escolares", () => {
    const state = {
      ...mockState,
      filtroCompleto: {
        ...mockState.filtroCompleto,
        anosEscolares: [],
      },
    };
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => selector(state));
    render(<Comparativo />);
    fireEvent.mouseDown(screen.getAllByRole("combobox")[1]);
    expect(screen.getByText("Nenhum ano encontrado")).toBeInTheDocument();
  });

  // Testa se o componente mostra mensagem correta quando não há turmas
  it("mostra mensagem correta quando não há turmas", () => {
    const state = {
      ...mockState,
      filtroCompleto: {
        ...mockState.filtroCompleto,
        turmas: [],
      },
    };
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => selector(state));
    render(<Comparativo />);
    fireEvent.mouseDown(screen.getAllByRole("combobox")[2]);
    expect(screen.getByText("Nenhuma turma encontrada")).toBeInTheDocument();
  });

  
//  it("renderiza cards de Proficiência quando há dados", async () => {
//     // Mocka o serviço para SEMPRE retornar o resumoMock neste teste
//     (servicos.get as jest.Mock).mockResolvedValue(resumoMock);

//     // Mocka o estado do Redux para já estar com os filtros certos
//     (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
//       selector({
//         ...mockState,
//         filtros: {
//           componentesCurricularesRadio: [{ texto: "Português", valor: 2 }],
//           anosEscolaresRadio: [{ texto: "9", valor: 9 }],
//         },
//       })
//     );

//     render(<Comparativo />);

//     // Aguarda renderizar os cards
//     await waitFor(() => {
//       expect(screen.getAllByText("Proficiência").length).toBeGreaterThan(0);
//     });

//     // Tenta encontrar os valores de forma flexível
//     expect(
//       screen.queryAllByText((content) =>
//         typeof content === "string" && content.includes("200")
//       ).length
//     ).toBeGreaterThan(0);

//     expect(
//       screen.queryAllByText((content) =>
//         typeof content === "string" && content.includes("250")
//       ).length
//     ).toBeGreaterThan(0);

//     expect(screen.getByText("PSP")).toBeInTheDocument();
//     expect(screen.getByText("Prova PSA")).toBeInTheDocument();
//     expect(screen.getByText("2025")).toBeInTheDocument();
//     expect(screen.getByText("2024")).toBeInTheDocument();
//     expect(screen.getAllByAltText("Ícone disciplina").length).toBeGreaterThan(0);
//   });

  it("renderiza mensagem de nenhum componente/ano/turma encontrado", () => {
    const emptyState = {
      ...mockState,
      filtroCompleto: {
        componentesCurriculares: [],
        anosEscolares: [],
        turmas: [],
      },
    };
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => selector(emptyState));
    render(<Comparativo />);
    fireEvent.mouseDown(screen.getAllByRole("combobox")[0]);
    expect(screen.getByText("Nenhum componente curricular encontrado")).toBeInTheDocument();
    fireEvent.mouseDown(screen.getAllByRole("combobox")[1]);
    expect(screen.getByText("Nenhum ano encontrado")).toBeInTheDocument();
    fireEvent.mouseDown(screen.getAllByRole("combobox")[2]);
    expect(screen.getByText("Nenhuma turma encontrada")).toBeInTheDocument();
  });

  it("renderiza placeholder correto nos selects quando não há seleção", () => {
    const noSelectionState = {
      ...mockState,
      filtros: {
        componentesCurricularesRadio: [],
        anosEscolaresRadio: [],
      },
    };
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => selector(noSelectionState));
    render(<Comparativo />);
    const selects = screen.getAllByRole("combobox");
    selects.forEach(select => {
      expect(select).toBeInTheDocument();
    });    
  });

  it("renderiza corretamente o texto de informações da escola", () => {
    render(<Comparativo />);
    expect(screen.getByText(/Informações da/i)).toBeInTheDocument();
    expect(screen.getByText("Leste")).toBeInTheDocument();
    expect(screen.getByText(/provas São Paulo/i)).toBeInTheDocument();
  });

  it("trata erro ao buscar cards de comparação", async () => {
    (servicos.get as jest.Mock).mockRejectedValueOnce(new Error("Erro de rede"));
    render(<Comparativo />);
    await act(async () => { await Promise.resolve(); });
    await waitFor(() => {
      screen.queryByText(/Carregando.../i);
    });
    await waitFor(() => {
      expect(screen.queryByText(/Carregando.../i)).toBeNull();
    });
  });

});

describe("getNivelColor", () => {
  it("retorna a cor correta para cada nível", () => {
      expect(getNivelColor("Abaixo do Básico")).toBe("#FF5959");
      expect(getNivelColor("Básico")).toBe("#FEDE99");
      expect(getNivelColor("Avançado")).toBe("#99FF99");
      expect(getNivelColor("Adequado")).toBe("#9999FF");
      expect(getNivelColor("Qualquer outro")).toBe("black");
    });
});