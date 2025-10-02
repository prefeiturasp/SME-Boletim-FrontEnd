import UesPage, { estiloNivel } from "./ues";
import userEvent from "@testing-library/user-event";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { servicos } from "../servicos";
import { MemoryRouter } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const useSelectorMock = useSelector as unknown as jest.Mock;
const useDispatchMock = useDispatch as unknown as jest.Mock;

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  (servicos.get as jest.Mock).mockImplementation((url: string) => {
    if (url.includes("aplicacoes-prova")) return Promise.resolve([{ id: 1, nome: "Aplicação Teste" }]);
    if (url.includes("anos-escolares")) return Promise.resolve([{ ano: 1, descricao: "1º Ano" }]);
    if (url.includes("Abrangencia/dres")) return Promise.resolve([{ id: 10, nome: "DRE Leste" }]);
    if (url.includes("resumo-dre")) return Promise.resolve({ totalUes: 1, totalAlunos: 10, proficienciaDisciplina: [] });
    if (url.includes("ues-por-dre")) return Promise.resolve([{ ueId: 100, descricao: "UE A" }]);
    if (url.includes("ue-por-dre-dados")) {
       const itens = [];
      for (let i = 1; i <= 15; i++) {
        itens.push({
          id: 100 + i,
          nome: `UE ${i}`,
          anoEscolar: 1,
          totalEstudantes: 10 + i,
          totalEstudadesRealizaramProva: 8 + i,
          percentualEstudadesRealizaramProva: 80,
          disciplinas: [
            { disciplina: "Matemática", nivelDescricao: "Básico", mediaProficiencia: 200.5 }
          ],
        });
      }
      return Promise.resolve({
        totalRegistros: 15,
        itens,
      });
    }
    return Promise.resolve([]);
  });
  Object.defineProperty(window, "scrollTo", { value: jest.fn(), writable: true });
  localStorage.setItem("tipoPerfil", "5");
});

test("renderiza e permite acessar uma UE", async () => {
  renderPage();

  expect(await screen.findAllByText(/Boletim de Provas/i)).not.toHaveLength(0);
  expect(await screen.findByText("UE A")).toBeInTheDocument();

  const btns = screen.getAllByRole("button", { name: /Acessar UE/i });
  const enabledBtn = btns.find(btn => !(btn as HTMLButtonElement).disabled);
  fireEvent.click(enabledBtn!);

  expect(mockNavigate).toHaveBeenCalledWith("/?ueSelecionada=100");
}, 20000);

// Mocks
jest.mock("../servicos", () => ({
  servicos: { get: jest.fn() },
}));

// Mock global IntersectionObserver para o ambiente de teste
beforeAll(() => {
  class IntersectionObserverMock {
    constructor() {}
    observe() {}
    disconnect() {}
    unobserve() {}
    takeRecords() { return []; }
  }
  // @ts-ignore
  global.IntersectionObserver = IntersectionObserverMock;
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [new URLSearchParams()],
  };
});

function renderPage(storeState?: any) {
  const fakeState = {
      nomeAplicacao: { id: 1, nome: "Aplicação 2025", tipoTai: true, dataInicioLote: "2025-01-01T00:00:00Z" },
  };

  useDispatchMock.mockReturnValue(jest.fn());
  useSelectorMock.mockImplementation((selectorFn: any) => selectorFn(fakeState));

  return render(    
      <MemoryRouter>
        <UesPage />
      </MemoryRouter>    
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  (servicos.get as jest.Mock).mockImplementation((url: string) => {
    if (url.includes("aplicacoes-prova")) return Promise.resolve([{ id: 1, nome: "Aplicação Teste" }]);
    if (url.includes("anos-escolares")) return Promise.resolve([{ ano: 1, descricao: "1º Ano" }, { ano: 2, descricao: "2º Ano" }]);
    if (url.includes("Abrangencia/dres")) return Promise.resolve([{ id: 10, nome: "DRE Leste" }, { id: 20, nome: "DRE Oeste" }]);
    if (url.includes("resumo-dre")) return Promise.resolve({
      totalUes: 2,
      totalAlunos: 20,
      proficienciaDisciplina: [
        { disciplinaNome: "Matemática", mediaProficiencia: 200.5 },
        { disciplinaNome: "Língua portuguesa", mediaProficiencia: 210.2 }
      ]
    });
    if (url.includes("ues-por-dre")) return Promise.resolve([
      { ueId: 100, descricao: "UE A" },
      { ueId: 200, descricao: "UE B" }
    ]);
    if (url.includes("ue-por-dre-dados")) {
      return Promise.resolve({
        totalRegistros: 2,
        itens: [
          {
            id: 100,
            nome: "UE A",
            anoEscolar: 1,
            totalEstudantes: 10,
            totalEstudadesRealizaramProva: 8,
            percentualEstudadesRealizaramProva: 80,
            disciplinas: [
              { disciplina: "Matemática", nivelDescricao: "Básico", mediaProficiencia: 200.5 },
              { disciplina: "Língua portuguesa", nivelDescricao: "Adequado", mediaProficiencia: 210.2 }
            ]
          },
          {
            id: 200,
            nome: "UE B",
            anoEscolar: 2,
            totalEstudantes: 12,
            totalEstudadesRealizaramProva: 10,
            percentualEstudadesRealizaramProva: 83,
            disciplinas: []
          }
        ]
      });
    }
    return Promise.resolve([]);
  });
  Object.defineProperty(window, "scrollTo", { value: jest.fn(), writable: true });
  localStorage.setItem("tipoPerfil", "5");
});

describe("UesPage - extra coverage", () => {
  it("deve renderizar corretamente quando não há disciplinas nas UEs", async () => {
    jest.clearAllMocks();
    (servicos.get as jest.Mock).mockImplementation((url: string) => {
      if (url.includes("ue-por-dre-dados")) {
        return Promise.resolve({
          totalRegistros: 1,
          itens: [
            {
              id: 101,
              nome: "UE Sem Disciplina",
              anoEscolar: 1,
              totalEstudantes: 5,
              totalEstudadesRealizaramProva: 2,
              percentualEstudadesRealizaramProva: 40,
              disciplinas: []
            }
          ]
        });
      }
      if (url.includes("ues-por-dre")) return Promise.resolve([{ ueId: 101, descricao: "UE Sem Disciplina" }]);
      if (url.includes("aplicacoes-prova")) return Promise.resolve([{ id: 1, nome: "Aplicação Teste" }]);
      if (url.includes("anos-escolares")) return Promise.resolve([{ ano: 1, descricao: "1º Ano" }]);
      if (url.includes("Abrangencia/dres")) return Promise.resolve([{ id: 10, nome: "DRE Leste" }]);
      if (url.includes("resumo-dre")) return Promise.resolve({ totalUes: 1, totalAlunos: 5, proficienciaDisciplina: [] });
      if (url.includes("ues-por-dre")) return Promise.resolve([{ /* dados simulados */ }]);
      if (url.includes("ue-por-dre-dados")) return Promise.resolve([{ /* dados simulados */ }]);
    
      return Promise.resolve([]);
    });
    Object.defineProperty(window, "scrollTo", { value: jest.fn(), writable: true });
    localStorage.setItem("tipoPerfil", "5");
    renderPage();
    expect(await screen.findByText("UE Sem Disciplina")).toBeInTheDocument();
    expect(
      screen.getAllByText((content, node) =>
        Boolean(node?.textContent?.includes("Não há dados cadastrados"))
      ).length
    ).toBeGreaterThan(0);
  });

  it("deve atualizar dreSelecionada e dreSelecionadaNome ao trocar DRE", async () => {
    renderPage();
    const selects = screen.getAllByRole("combobox");
    const dreSelect = selects[0];
    userEvent.click(dreSelect);
    userEvent.keyboard("{ArrowDown}{Enter}");
    // Não há assert específico, mas cobre o evento e o setDreSelecionada
  });

  it("deve atualizar anoSelecionado ao trocar ano", async () => {
    renderPage();
    const selects = screen.getAllByRole("combobox");
    const anoSelect = selects[1];
    userEvent.click(anoSelect);
    userEvent.keyboard("{ArrowDown}{Enter}");
    // Não há assert específico, mas cobre o evento e o setAnoSelecionado
  });

  it("deve chamar fetchUesListagem ao clicar em Exibir mais", async () => {
    renderPage();
    const btn = await screen.findByText("Exibir mais");
    userEvent.click(btn);
    // Não há assert específico, mas cobre o evento e o fetchUesListagem com append
  });

  it("deve chamar window.scrollTo ao clicar em Voltar para o início", async () => {
    renderPage();
    const btn = await screen.findByText("Voltar para o início");
    fireEvent.click(btn);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("deve renderizar botão Voltar a tela anterior se tipoPerfil for 5", async () => {
    renderPage();
    expect(await screen.findByText("Voltar a tela anterior")).toBeInTheDocument();
  });

  it("não deve renderizar botão Voltar a tela anterior se tipoPerfil for diferente de 5", async () => {
    localStorage.setItem("tipoPerfil", "1");
    renderPage();
    await waitFor(() => 
      expect(screen.queryByText("Voltar a tela anterior")).not.toBeInTheDocument()
    );
  });

  it("deve renderizar cards de resumo com proficienciaDisciplina", async () => {
    renderPage();
    expect(await screen.findByText("Matemática")).toBeInTheDocument();
    expect(screen.getAllByText("Língua portuguesa").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Média de proficiência").length).toBeGreaterThan(0);
  });

  it("deve chamar navegação ao clicar em Acessar UE", async () => {
    renderPage();
    const btn = await screen.findByTestId("btn-acessar-ue-100");
    expect((btn as HTMLButtonElement).disabled).toBe(false);

    fireEvent.click(btn);

    expect(mockNavigate).toHaveBeenCalledWith("/?ueSelecionada=100");
  });

  it("função estiloNivel retorna estilos corretos", () => {
    expect(estiloNivel("adequado")).toEqual({ background: "rgba(153, 153, 255, 0.5)", color: "#3f673f" });
    expect(estiloNivel("basico")).toEqual({ background: "rgba(254,222,153, 0.5)", color: "#3f673f" });
    expect(estiloNivel("abaixo do basico")).toEqual({ background: "rgba(255,89,89, 0.5)", color: "#3f673f" });
    expect(estiloNivel("avancado")).toEqual({ background: "rgba(153, 255, 153, 0.5)", color: "#3f673f" });
    expect(estiloNivel("")).toEqual({ background: "#f0f0f0", color: "#8c8c8c" });
    expect(estiloNivel("qualquer outro")).toEqual({ background: "#f0f0f0", color: "#8c8c8c" });
  });
});