import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import UesPage from "./ues";
import * as servicos from "../servicos";

jest.mock("../servicos", () => ({
  servicos: {
    get: jest.fn(),
    post: jest.fn(),
    // ...adicione aqui outros métodos usados se existirem
  },
}));

// Mocks componentes filhos
jest.mock("../componentes/grafico/desempenhoPorMateria", () => () => (
  <div>Mocked DesempenhoPorMateria</div>
));
jest.mock("../componentes/relatorio/relatorioAlunosPorUes", () => () => (
  <div>Mocked RelatorioAlunosPorUes</div>
));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    useNavigate: () => mockNavigate,
  };
});

const mockStore = configureStore(); // REMOVIDO o thunk

describe("UesPage Component", () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    jest.clearAllMocks();

    store = mockStore({
      nomeAplicacao: {
        id: 1,
        nome: "Aplicação Teste",
        tipoTai: true,
        dataInicioLote: new Date().toISOString(),
      },
    });

    (servicos.servicos.get as jest.Mock).mockImplementation((url: string) => {
      if (url.includes("aplicacoes-prova")) {
        return Promise.resolve([
          {
            id: 1,
            nome: "Aplicação Teste",
            tipoTai: true,
            dataInicioLote: "2023-01-01",
          },
          {
            id: 2,
            nome: "Outra Aplicação",
            tipoTai: false,
            dataInicioLote: "2023-02-01",
          },
        ]);
      }
      if (url.includes("anos-escolares")) {
        return Promise.resolve([
          { ano: 1, descricao: "1º Ano" },
          { ano: 2, descricao: "2º Ano" },
        ]);
      }
      if (url.includes("dres")) {
        return Promise.resolve([
          { id: 10, nome: "DRE Leste" },
          { id: 20, nome: "DRE Oeste" },
        ]);
      }
      if (url.includes("resumo-dre")) {
        return Promise.resolve({
          totalUes: 5,
          totalAlunos: 100,
          proficienciaDisciplina: [
            { disciplinaNome: "Matemática", mediaProficiencia: 3.5 },
            { disciplinaNome: "Português", mediaProficiencia: 4.2 },
          ],
        });
      }
      if (url.includes("ues-por-dre")) {
        return Promise.resolve([
          { ueId: 100, descricao: "UE A" },
          { ueId: 101, descricao: "UE B" },
        ]);
      }
      if (url.includes("ue-por-dre-dados")) {
        return Promise.resolve({
          totalRegistros: 2,
          itens: [
            {
              id: 100,
              nome: "UE A",
              anoEscolar: 1,
              totalEstudantes: 50,
              totalEstudadesRealizaramProva: 40,
              percentualEstudadesRealizaramProva: 80,
              disciplinas: [
                {
                  disciplina: "Língua portuguesa",
                  nivelDescricao: "Adequado",
                  mediaProficiencia: 4.0,
                },
              ],
            },
            {
              id: 101,
              nome: "UE B",
              anoEscolar: 2,
              totalEstudantes: 50,
              totalEstudadesRealizaramProva: 45,
              percentualEstudadesRealizaramProva: 90,
              disciplinas: [],
            },
          ],
        });
      }
      if (url.includes("grafico")) {
        return Promise.resolve({ disciplinas: [] });
      }

      return Promise.resolve([]);
    });
  });

  function renderComponent() {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <UesPage />
        </BrowserRouter>
      </Provider>
    );
  }

  test("renderiza componentes principais e dados carregados", async () => {
    renderComponent();

    expect(screen.getAllByText(/Boletim de Provas/i).length).toBeGreaterThan(0);

    expect(screen.getByText("Ano escolar")).toBeInTheDocument();

    await waitFor(() => {
      const elementos = screen.getAllByText("DRE Leste");
      expect(elementos.length).toBeGreaterThan(0);
      expect(screen.getByText("Aplicação Teste")).toBeInTheDocument();
      expect(screen.getByText("1º Ano")).toBeInTheDocument();
      expect(screen.getByText("Unidades Educacionais")).toBeInTheDocument();
      expect(screen.getByText("Estudantes")).toBeInTheDocument();
      expect(
        screen.getByText("Média de proficiência Matemática")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Média de proficiência Português")
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Mocked DesempenhoPorMateria")).toBeInTheDocument();
    expect(
      screen.getByText("Mocked RelatorioAlunosPorUes")
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("UE A")).toBeInTheDocument();
      expect(screen.getByText("UE B")).toBeInTheDocument();
    });

    const botaoAcessarUE = screen.getAllByRole("button", {
      name: /Acessar UE/i,
    })[0];
    expect(botaoAcessarUE).toBeEnabled();
  });

  test("muda seleção de aplicação e atualiza store", async () => {
    renderComponent();

    // Aguarda o Select da aplicação estar presente pelo data-testid
    const seletorAplicacao = await screen.findByTestId("select-aplicacao");
    expect(seletorAplicacao).toBeInTheDocument();

    // Abre o dropdown do Select do Ant Design
    fireEvent.mouseDown(seletorAplicacao);

    // Aguarda alguma pequena atualização da store caso necessário
    await waitFor(() => {
      // Verifica que o Redux mockStore recebeu a ação correta para setNomeAplicacao
      const actions = store.getActions();

      expect(actions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: "nomeAplicacao/setNomeAplicacao",
            payload: expect.objectContaining({
              id: 1,
              nome: "Aplicação Teste",
            }),
          }),
        ])
      );
    });
  });

  test("botão Acessar UE chama navigate", async () => {
    renderComponent();

    await waitFor(() => screen.getByText("UE A"));

    const botaoAcessarUE = screen.getAllByRole("button", {
      name: /Acessar UE/i,
    })[0];

    fireEvent.click(botaoAcessarUE);

    expect(mockNavigate).toHaveBeenCalledWith("/?ueSelecionada=100");
  });
});
