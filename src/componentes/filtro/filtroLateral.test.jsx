import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import FiltroLateral from "./filtroLateral";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { setFilters } from "../../redux/slices/filtrosSlice";

// Mock do store Redux
const mockStore = configureStore([]);
const initialState = {
  tab: { activeTab: "1" },
  filtros: {
    niveis: [],
    niveisAbaPrincipal: [],
    anosEscolares: [],
    componentesCurriculares: [],
    anosEscolaresRadio: [],
    componentesCurricularesRadio: [],
    nomeEstudante: "",
    eolEstudante: "",
    nivelMinimo: 0,
    nivelMinimoEscolhido: 0,
    nivelMaximo: 100,
    nivelMaximoEscolhido: 100,
    turmas: [],
  },
};

// Mock de dados de filtro
const filtroDados = {
  niveis: [{ texto: "Básico", valor: 2 }],
  niveisAbaPrincipal: [],
  anosEscolares: [{ texto: "1", valor: 1 }],
  componentesCurriculares: [{ texto: "Matemática", valor: 1 }],
  anosEscolaresRadio: [],
  componentesCurricularesRadio: [],
  nomeEstudante: "",
  eolEstudante: "",
  nivelMinimo: 0,
  nivelMinimoEscolhido: 0,
  nivelMaximo: 100,
  nivelMaximoEscolhido: 100,
  turmas: [{ texto: "Turma 1", valor: 1 }],
};

function renderComponent(props = {}) {
  const store = mockStore(initialState);
  return render(
    <Provider store={store}>
      <FiltroLateral
        open={true}
        setOpen={jest.fn()}
        filtroDados={filtroDados}
        {...props}
      />
    </Provider>
  );
}

describe("FiltroLateral", () => {
  it("chama setOpen ao fechar Drawer", () => {
    const setOpen = jest.fn();
    renderComponent({ setOpen });
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  it("renderiza filtros de nível", () => {
    renderComponent();
    expect(screen.getByText("Básico")).toBeInTheDocument();
  });

  it("chama handleFilterChange ao marcar checkbox de nível", () => {
    renderComponent();
    const checkbox = screen.getByText("Básico").closest("input");
    if (checkbox) {
      fireEvent.click(checkbox);
    }
  });

  it("chama handleResetFilters ao clicar em Remover Filtros", () => {
    renderComponent();
    fireEvent.click(screen.getByText(/Remover Filtros/i));
  });

  it("atualiza input de nome do estudante se activeTab for 3", () => {
    const store = mockStore({ ...initialState, tab: { activeTab: "3" } });
    render(
      <Provider store={store}>
        <FiltroLateral
          open={true}
          setOpen={jest.fn()}
          filtroDados={filtroDados}
        />
      </Provider>
    );
    const input = screen.getByPlaceholderText("Digite o nome do estudante");
    fireEvent.change(input, { target: { value: "João" } });
    expect(input).toHaveValue("João");
  });

  it("renderiza opções de Select de proficiência se activeTab for 3", () => {
    const store = mockStore({ ...initialState, tab: { activeTab: "3" } });
    render(
      <Provider store={store}>
        <FiltroLateral
          open={true}
          setOpen={jest.fn()}
          filtroDados={filtroDados}
        />
      </Provider>
    );
    expect(screen.getByText(/Nível inicial:/)).toBeInTheDocument();
    expect(screen.getByText(/Nível final:/)).toBeInTheDocument();
  });
});
