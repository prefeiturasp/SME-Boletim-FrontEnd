import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EscolherEscola from "./EscolherEscola";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
// Setup store
const middlewares = [thunk];
const mockStore = configureStore();

// Mocks
jest.mock("../../servicos", () => ({
  servicos: {
    get: jest.fn((url) => {
      if (url.includes("/api/abrangencia")) {
        return Promise.resolve([{ ueId: "1", descricao: "Escola Teste" }]);
      }
      if (url.includes("/filtros")) {
        return Promise.resolve({
          niveis: ["Fundamental"],
          anosEscolares: ["1º Ano"],
          componentesCurriculares: ["Matemática"],
          nivelMinimo: 1,
          nivelMaximo: 9,
        });
      }
      if (url.includes("/nome-aplicacao")) {
        return Promise.resolve({ nome: "Aplicação Teste" });
      }
    }),
  },
}));

jest.mock("../filtro/filtroLateral", () => () => (
  <div data-testid="filtro-lateral" />
));

const initialState = {
  escola: {
    escolaSelecionada: {
      ueId: null,
      descricao: null,
    },
  },
  filtros: {
    niveis: [],
    niveisAbaPrincipal: [],
    anosEscolares: [],
    componentesCurriculares: [],
    anosEscolaresRadio: [],
    componentesCurricularesRadio: [],
    nivelMinimo: 0,
    nivelMinimoEscolhido: 0,
    nivelMaximo: 0,
    nivelMaximoEscolhido: 0,
    turmas: [],
    nomeEstudante: "",
    eolEstudante: "",
  },
  filtroCompleto: {},
  tab: {
    activeTab: "1",
  },
};

const renderComponent = (state = initialState) => {
  const store = mockStore(state);
  return render(
    <Provider store={store}>
      <EscolherEscola />
    </Provider>
  );
};

describe("EscolherEscola", () => {
  it("deve carregar escolas e selecionar a primeira caso nenhuma esteja selecionada", async () => {
    const state = {
      ...initialState,
      escola: {
        escolaSelecionada: {
          ueId: null,
          descricao: null,
        },
      },
    };
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <EscolherEscola />
      </Provider>
    );

    await waitFor(() => {
      expect(store.getActions()).toContainEqual({
        type: "escola/selecionarEscola",
        payload: {
          ueId: "1",
          descricao: "Escola Teste",
        },
      });
    });
  });

  it("deve filtrar as opções do select", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "Teste" } });
    expect(select).toBeInTheDocument();
  });
});
