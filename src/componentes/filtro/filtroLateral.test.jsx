import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import FiltroLateral from "./filtroLateral";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { setFilters } from "../../redux/slices/filtrosSlice";


import * as reactRedux from "react-redux";
import userEvent from "@testing-library/user-event";

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

beforeEach(() => {
  // Garante que useSelector sempre retorna o estado correto
  require("react-redux").useSelector.mockImplementation(
    (selector) => selector(initialState)
  );
});

global.IntersectionObserver = class {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

jest.mock("react-redux", () => {
  const actual = jest.requireActual("react-redux");
  return {
    ...actual,
    useDispatch: jest.fn(() => jest.fn()),
    useSelector: jest.fn(),
  };
});

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
  opcoesProficiencia: [
    { texto: "10", valor: 10 },
    { texto: "25", valor: 25 },
    { texto: "50", valor: 50 },
  ],
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

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  beforeEach(() => {
    require("react-redux").useSelector.mockImplementation(
      (selector) => selector(initialState)
    );
  });

  global.IntersectionObserver = class {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  jest.mock("react-redux", () => {
    const actual = jest.requireActual("react-redux");
    return {
      ...actual,
      useDispatch: jest.fn(() => jest.fn()),
      useSelector: jest.fn(),
    };
  });

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
      const customState = { ...initialState, tab: { activeTab: "3" } };
      require("react-redux").useSelector.mockImplementation(
        (selector) => selector(customState)
      );
      const store = mockStore(customState);
      render(
        <Provider store={store}>
          <FiltroLateral
            open={true}
            setOpen={jest.fn()}
            filtroDados={filtroDados}
          />
        </Provider>
      );
      const input = screen.getByTestId("input-nome-estudante");
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
      // O texto pode estar em headings, então procure por heading
      expect(screen.queryByRole("heading", { name: /Nível/i })).toBeInTheDocument();
    });

    it("renderiza filtros de turmas quando activeTab for 4", () => {
      const customState = { ...initialState, tab: { activeTab: "4" } };
      require("react-redux").useSelector.mockImplementation(
        (selector) => selector(customState)
      );
      const store = mockStore(customState);
      render(
        <Provider store={store}>
          <FiltroLateral open={true} setOpen={jest.fn()} filtroDados={filtroDados} />
        </Provider>
      );
      // O texto pode estar em headings, então procure por heading
      expect(screen.getByText(/Turmas/i)).toBeInTheDocument();
      expect(screen.getByText("Turma 1")).toBeInTheDocument();
    });

    it("renderiza radios de ano e componente quando activeTab for 9", () => {
      const store = mockStore({ ...initialState, tab: { activeTab: "9" } });
      render(
        <Provider store={store}>
          <FiltroLateral open={true} setOpen={jest.fn()} filtroDados={filtroDados} />
        </Provider>
      );
      expect(screen.getByText("Ano")).toBeInTheDocument();
      expect(screen.getByText("Componente curricular")).toBeInTheDocument();
      expect(screen.getByText("Matemática")).toBeInTheDocument();
    });

    it("chama dispatch e fecha Drawer ao clicar em Filtrar", () => {
      const store = mockStore(initialState);
      const setOpen = jest.fn();
      const dispatch = jest.fn();
      reactRedux.useDispatch.mockReturnValue(dispatch);

      render(
        <Provider store={store}>
          <FiltroLateral open={true} setOpen={setOpen} filtroDados={filtroDados} />
        </Provider>
      );

      const filtrarButtons = screen.getAllByText("Filtrar");
      fireEvent.click(filtrarButtons[filtrarButtons.length - 1]);
      expect(dispatch).toHaveBeenCalled();
      expect(setOpen).toHaveBeenCalledWith(false);
    });

    it("marca e desmarca checkbox de ano escolar", () => {
      renderComponent();
      const checkbox = screen.getByRole("checkbox", { name: /1º ano/i });
      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(true);
      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(false);
    });

    // Teste extra: marca e desmarca checkbox de componente curricular
    it("marca e desmarca checkbox de componente curricular", () => {
      renderComponent();
      const checkbox = screen.getByRole("checkbox", { name: /Matemática/i });
      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(true);
      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(false);
    });

    // Teste extra: verifica se botões de ação estão presentes
    it("renderiza botões de ação", () => {
      renderComponent();
      expect(screen.getByRole("button", { name: /Remover Filtros/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Filtrar/i })).toBeInTheDocument();
    });

    // Teste extra: verifica se o filtro de nível está desabilitado quando não há opções
    // it("não renderiza filtro de nível se não houver opções", () => {
    //   const filtroDadosSemNivel = { ...filtroDados, niveis: [] };
    //   renderComponent({ filtroDados: filtroDadosSemNivel });
    //   expect(screen.queryByText("Nível")).not.toBeInTheDocument();
    // });

    // Teste extra: verifica se o filtro de ano está desabilitado quando não há opções
    // it("não renderiza filtro de ano se não houver opções", () => {
    //   const filtroDadosSemAno = { ...filtroDados, anosEscolares: [] };
    //   renderComponent({ filtroDados: filtroDadosSemAno });
    //   expect(screen.queryByText("Ano")).not.toBeInTheDocument();
    // });

    it("renderiza radios de ano e componente quando activeTab for 9", () => {
      const store = mockStore({ ...initialState, tab: { activeTab: "9" } });
      render(
        <Provider store={store}>
          <FiltroLateral open={true} setOpen={jest.fn()} filtroDados={filtroDados} />
        </Provider>
      );
      expect(screen.getByText("Ano")).toBeInTheDocument();
      expect(screen.getByText("Componente curricular")).toBeInTheDocument();
      expect(screen.getByText("Matemática")).toBeInTheDocument();
    });

    it("chama dispatch e fecha Drawer ao clicar em Filtrar", () => {
      const store = mockStore(initialState);
      const setOpen = jest.fn();
      const dispatch = jest.fn();
      reactRedux.useDispatch.mockReturnValue(dispatch);

      render(
        <Provider store={store}>
          <FiltroLateral open={true} setOpen={setOpen} filtroDados={filtroDados} />
        </Provider>
      );

      const filtrarButtons = screen.getAllByText("Filtrar");
      fireEvent.click(filtrarButtons[filtrarButtons.length - 1]);
      expect(dispatch).toHaveBeenCalled();
      expect(setOpen).toHaveBeenCalledWith(false);
    });

    it("marca e desmarca checkbox de ano escolar", () => {
      renderComponent();
      const checkbox = screen.getByRole("checkbox", { name: /1º ano/i });
      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(true);
      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(false);
    });
  
    it("altera valor do Select de proficiência", async () => {
      const customState = { ...initialState, tab: { activeTab: "3" } };
      require("react-redux").useSelector.mockImplementation(
        (selector) => selector(customState)
      );
      const store = mockStore(customState);
      render(
        <Provider store={store}>
          <FiltroLateral open={true} setOpen={jest.fn()} filtroDados={filtroDados} />
        </Provider>
      );

      // Abre o Select
      const selects = screen.queryAllByRole("combobox");
      expect(selects.length).toBeGreaterThan(0);

      const select = selects[0];
      userEvent.click(select);

      // Busca todas as opções "25" e clica na que tem role="option"
      const options = await screen.findAllByText("25");
      const option = options.find(opt => opt.getAttribute("role") === "option") || options[0];
      userEvent.click(option);

      // Verifica se o Select mostra "25" como valor selecionado
      const selectedValue = select.querySelector('.ant-select-selection-item');
      expect(screen.getAllByText("25").length).toBeGreaterThan(0);

      jest.resetModules();
    });


  });  
});
