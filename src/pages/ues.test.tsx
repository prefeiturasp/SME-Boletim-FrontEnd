import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";
import UesPage from "./ues";

// Mock de serviços e navigate
jest.mock("../servicos", () => ({
  servicos: { get: jest.fn() },
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

import { servicos } from "../servicos";
const mockStore = configureStore();

function renderPage() {
  const store = mockStore({
    nomeAplicacao: { id: 1, nome: "Aplicação Teste", tipoTai: true, dataInicioLote: "" },
  });
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <UesPage />
      </MemoryRouter>
    </Provider>
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  (servicos.get as jest.Mock).mockImplementation((url: string) => {
    if (url.includes("aplicacoes-prova")) return Promise.resolve([{ id: 1, nome: "Aplicação Teste" }]);
    if (url.includes("anos-escolares")) return Promise.resolve([{ ano: 1, descricao: "1º Ano" }]);
    if (url.includes("Abrangencia/dres")) return Promise.resolve([{ id: 10, nome: "DRE Leste" }]);
    if (url.includes("resumo-dre")) return Promise.resolve({ totalUes: 1, totalAlunos: 10, proficienciaDisciplina: [] });
    if (url.includes("ues-por-dre")) return Promise.resolve([{ ueId: 100, descricao: "UE A" }]);
    if (url.includes("ue-por-dre-dados")) {
      return Promise.resolve({
        totalRegistros: 1,
        itens: [{
          id: 100,
          nome: "UE A",
          anoEscolar: 1,
          totalEstudantes: 10,
          totalEstudadesRealizaramProva: 8,
          percentualEstudadesRealizaramProva: 80,
          disciplinas: [],
        }],
      });
    }
    return Promise.resolve([]);
  });
});

test("renderiza e permite acessar uma UE", async () => {
  renderPage();

  expect(await screen.findByText(/Boletim de Provas/i)).toBeInTheDocument();
  expect(await screen.findByText("UE A")).toBeInTheDocument();

  const btn = screen.getByRole("button", { name: /Acessar UE/i });
  fireEvent.click(btn);

  expect(mockNavigate).toHaveBeenCalledWith("/?ueSelecionada=100");
});
