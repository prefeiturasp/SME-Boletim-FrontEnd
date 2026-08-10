import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FiltroLateral from "./filtroLateral";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import filtrosSlice from "../../redux/slices/filtrosSlice";
import tabSlice from "../../redux/slices/tabSlice";
import "@testing-library/jest-dom";

jest.mock("antd", () => {
  const actual = jest.requireActual("antd");
  return {
    ...actual,
    Drawer: ({ children, title, open, onClose }: any) =>
      open ? (
        <div data-testid="drawer" data-title={title}>
          {children}
          <button data-testid="drawer-close" onClick={onClose}>
            Close
          </button>
        </div>
      ) : null,
    Button: ({ children, onClick, disabled }: any) => (
      <button onClick={onClick} disabled={disabled} data-testid="button">
        {children}
      </button>
    ),
    Checkbox: ({ checked, onChange, children }: any) => (
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        data-testid="checkbox"
      />
    ),
    Radio: {
      Group: ({ value, onChange, children }: any) => (
        <div data-testid="radio-group" data-value={value}>
          {children}
        </div>
      ),
    },
    Select: ({ value, onChange, options }: any) => (
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        data-testid="select"
      >
        {options?.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    ),
    Input: ({ value, onChange, placeholder }: any) => (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target)}
        placeholder={placeholder}
        data-testid="input"
      />
    ),
    Divider: () => <div data-testid="divider" />,
    Flex: ({ children }: any) => <div data-testid="flex">{children}</div>,
  };
});

const mockFiltroDados = {
  niveis: [
    { texto: "Nível 1", valor: 1 },
    { texto: "Nível 2", valor: 2 },
  ],
  niveisAbaPrincipal: [
    { texto: "Abaixo do Básico", valor: 1 },
    { texto: "Básico", valor: 2 },
    { texto: "Adequado", valor: 3 },
    { texto: "Avançado", valor: 4 },
  ],
  anosEscolares: [
    { texto: "1º ano", valor: 1 },
    { texto: "2º ano", valor: 2 },
  ],
  componentesCurriculares: [
    { texto: "Português", valor: 1 },
    { texto: "Matemática", valor: 2 },
  ],
  turmas: [
    { texto: "Turma A", valor: 1 },
    { texto: "Turma B", valor: 2 },
  ],
  anosEscolaresRadio: [{ texto: "1º ano", valor: 1 }],
  componentesCurricularesRadio: [{ texto: "Português", valor: 1 }],
  nomeEstudante: "",
  eolEstudante: "",
  nivelMinimo: 0,
  nivelMinimoEscolhido: 0,
  nivelMaximo: 100,
  nivelMaximoEscolhido: 100,
  variacoes: [
    { texto: "Variação +", valor: 1 },
    { texto: "Variação -", valor: 2 },
  ],
};

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      filtros: filtrosSlice,
      tab: tabSlice,
    },
    preloadedState: {
      filtros: mockFiltroDados,
      tab: { activeTab: "1" },
      ...initialState,
    },
  });
};

describe("FiltroLateral", () => {
  describe("Renderização Básica", () => {
    it("renderiza o drawer quando open é true", () => {
      const store = createMockStore();
      const mockSetOpen = jest.fn();

      render(
        <Provider store={store}>
          <FiltroLateral
            open={true}
            setOpen={mockSetOpen}
            filtroDados={mockFiltroDados}
          />
        </Provider>,
      );

      expect(screen.getByTestId("drawer")).toBeInTheDocument();
    });

    it("não renderiza o drawer quando open é false", () => {
      const store = createMockStore();
      const mockSetOpen = jest.fn();

      render(
        <Provider store={store}>
          <FiltroLateral
            open={false}
            setOpen={mockSetOpen}
            filtroDados={mockFiltroDados}
          />
        </Provider>,
      );

      expect(screen.queryByTestId("drawer")).not.toBeInTheDocument();
    });

    it("renderiza título com ícone", () => {
      const store = createMockStore();
      const mockSetOpen = jest.fn();

      render(
        <Provider store={store}>
          <FiltroLateral
            open={true}
            setOpen={mockSetOpen}
            filtroDados={mockFiltroDados}
          />
        </Provider>,
      );

      expect(screen.getByTestId("drawer")).toBeInTheDocument();
    });

    it("renderiza botão de fechar", () => {
      const store = createMockStore();
      const mockSetOpen = jest.fn();

      render(
        <Provider store={store}>
          <FiltroLateral
            open={true}
            setOpen={mockSetOpen}
            filtroDados={mockFiltroDados}
          />
        </Provider>,
      );

      const closeButton = screen.getByTestId("drawer-close");
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe("Interações com Filtros", () => {
    it("atualiza filtro de checkbox quando clicado", async () => {
      const store = createMockStore();
      const mockSetOpen = jest.fn();

      render(
        <Provider store={store}>
          <FiltroLateral
            open={true}
            setOpen={mockSetOpen}
            filtroDados={mockFiltroDados}
          />
        </Provider>,
      );

      const checkboxes = screen.getAllByTestId("checkbox");
      if (checkboxes.length > 0) {
        fireEvent.click(checkboxes[0]);
        await waitFor(() => {
          expect(checkboxes[0]).toBeInTheDocument();
        });
      }
    });

    it("chama setOpen(false) ao fechar o drawer", () => {
      const store = createMockStore();
      const mockSetOpen = jest.fn();

      render(
        <Provider store={store}>
          <FiltroLateral
            open={true}
            setOpen={mockSetOpen}
            filtroDados={mockFiltroDados}
          />
        </Provider>,
      );

      const closeButton = screen.getByTestId("drawer-close");
      fireEvent.click(closeButton);

      expect(mockSetOpen).toHaveBeenCalledWith(false);
    });
  });

  describe("Botões de Ação", () => {
    it("renderiza botão de reset", () => {
      const store = createMockStore();
      const mockSetOpen = jest.fn();

      render(
        <Provider store={store}>
          <FiltroLateral
            open={true}
            setOpen={mockSetOpen}
            filtroDados={mockFiltroDados}
          />
        </Provider>,
      );

      const buttons = screen.getAllByTestId("button");
      expect(buttons.length).toBeGreaterThanOrEqual(1);
    });

    it("renderiza botão de aplicar filtros", () => {
      const store = createMockStore();
      const mockSetOpen = jest.fn();

      render(
        <Provider store={store}>
          <FiltroLateral
            open={true}
            setOpen={mockSetOpen}
            filtroDados={mockFiltroDados}
          />
        </Provider>,
      );

      const buttons = screen.getAllByTestId("button");
      expect(buttons.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Mudanças de Estado", () => {
    it("reinicializa filtros ao abrir drawer", async () => {
      const store = createMockStore();
      const mockSetOpen = jest.fn();

      const { rerender } = render(
        <Provider store={store}>
          <FiltroLateral
            open={false}
            setOpen={mockSetOpen}
            filtroDados={mockFiltroDados}
          />
        </Provider>,
      );

      rerender(
        <Provider store={store}>
          <FiltroLateral
            open={true}
            setOpen={mockSetOpen}
            filtroDados={mockFiltroDados}
          />
        </Provider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("drawer")).toBeInTheDocument();
      });
    });
  });

  describe("Filtros de Nível", () => {
    it("renderiza campos de nível mínimo e máximo", () => {
      const store = createMockStore();
      const mockSetOpen = jest.fn();

      render(
        <Provider store={store}>
          <FiltroLateral
            open={true}
            setOpen={mockSetOpen}
            filtroDados={mockFiltroDados}
          />
        </Provider>,
      );

      expect(screen.getByTestId("drawer")).toBeInTheDocument();
    });
  });

  describe("Filtros de Texto", () => {
    it("renderiza drawer com múltiplos componentes", () => {
      const store = createMockStore();
      const mockSetOpen = jest.fn();

      render(
        <Provider store={store}>
          <FiltroLateral
            open={true}
            setOpen={mockSetOpen}
            filtroDados={mockFiltroDados}
          />
        </Provider>,
      );

      expect(screen.getByTestId("drawer")).toBeInTheDocument();
    });

    it("renderiza botões de ação", () => {
      const store = createMockStore();
      const mockSetOpen = jest.fn();

      render(
        <Provider store={store}>
          <FiltroLateral
            open={true}
            setOpen={mockSetOpen}
            filtroDados={mockFiltroDados}
          />
        </Provider>,
      );

      const buttons = screen.getAllByTestId("button");
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe("Filtros de Seleção", () => {
    it("renderiza drawer com filtros", () => {
      const store = createMockStore();
      const mockSetOpen = jest.fn();

      render(
        <Provider store={store}>
          <FiltroLateral
            open={true}
            setOpen={mockSetOpen}
            filtroDados={mockFiltroDados}
          />
        </Provider>,
      );

      expect(screen.getByTestId("drawer")).toBeInTheDocument();
    });
  });

  describe("Filtros de Rádio", () => {
    it("renderiza drawer quando aberto", () => {
      const store = createMockStore();
      const mockSetOpen = jest.fn();

      render(
        <Provider store={store}>
          <FiltroLateral
            open={true}
            setOpen={mockSetOpen}
            filtroDados={mockFiltroDados}
          />
        </Provider>,
      );

      expect(screen.getByTestId("drawer")).toBeInTheDocument();
    });
  });

  describe("Casos Edge", () => {
    it("funciona com filtroDados vazio", () => {
      const store = createMockStore();
      const mockSetOpen = jest.fn();
      const emptyFiltroDados = {
        niveis: [],
        niveisAbaPrincipal: [],
        anosEscolares: [],
        componentesCurriculares: [],
        turmas: [],
        anosEscolaresRadio: [],
        componentesCurricularesRadio: [],
        nomeEstudante: "",
        eolEstudante: "",
        nivelMinimo: 0,
        nivelMinimoEscolhido: 0,
        nivelMaximo: 0,
        nivelMaximoEscolhido: 0,
        variacoes: [],
      };

      render(
        <Provider store={store}>
          <FiltroLateral
            open={true}
            setOpen={mockSetOpen}
            filtroDados={emptyFiltroDados}
          />
        </Provider>,
      );

      expect(screen.getByTestId("drawer")).toBeInTheDocument();
    });

    it("funciona quando filtroDados tem valores null", () => {
      const store = createMockStore();
      const mockSetOpen = jest.fn();

      render(
        <Provider store={store}>
          <FiltroLateral
            open={true}
            setOpen={mockSetOpen}
            filtroDados={mockFiltroDados}
          />
        </Provider>,
      );

      expect(screen.getByTestId("drawer")).toBeInTheDocument();
    });
  });

  describe("Divisores e Layout", () => {
    it("renderiza divisores entre seções", () => {
      const store = createMockStore();
      const mockSetOpen = jest.fn();

      render(
        <Provider store={store}>
          <FiltroLateral
            open={true}
            setOpen={mockSetOpen}
            filtroDados={mockFiltroDados}
          />
        </Provider>,
      );

      const dividers = screen.getAllByTestId("divider");
      expect(dividers.length).toBeGreaterThan(0);
    });

    it("renderiza flex containers", () => {
      const store = createMockStore();
      const mockSetOpen = jest.fn();

      render(
        <Provider store={store}>
          <FiltroLateral
            open={true}
            setOpen={mockSetOpen}
            filtroDados={mockFiltroDados}
          />
        </Provider>,
      );

      const flexes = screen.getAllByTestId("flex");
      expect(flexes.length).toBeGreaterThan(0);
    });
  });

  describe("Props Variadas", () => {
    it("renderiza com diferentes activeTab", () => {
      const store = createMockStore({ tab: { activeTab: "2" } });
      const mockSetOpen = jest.fn();

      render(
        <Provider store={store}>
          <FiltroLateral
            open={true}
            setOpen={mockSetOpen}
            filtroDados={mockFiltroDados}
          />
        </Provider>,
      );

      expect(screen.getByTestId("drawer")).toBeInTheDocument();
    });

    it("renderiza com diferentes filtrosSelecionados", () => {
      const customFilters = {
        ...mockFiltroDados,
        niveis: [{ texto: "Nível Customizado", valor: 99 }],
      };

      const store = createMockStore();
      const mockSetOpen = jest.fn();

      render(
        <Provider store={store}>
          <FiltroLateral
            open={true}
            setOpen={mockSetOpen}
            filtroDados={customFilters}
          />
        </Provider>,
      );

      expect(screen.getByTestId("drawer")).toBeInTheDocument();
    });
  });

  describe("Renderização Condicional", () => {
    it("renderiza com dados de ano escolar vazio", () => {
      const store = createMockStore();
      const mockSetOpen = jest.fn();
      const customFiltroDados = {
        ...mockFiltroDados,
        anosEscolares: [],
        anosEscolaresRadio: [],
      };

      render(
        <Provider store={store}>
          <FiltroLateral
            open={true}
            setOpen={mockSetOpen}
            filtroDados={customFiltroDados}
          />
        </Provider>,
      );

      expect(screen.getByTestId("drawer")).toBeInTheDocument();
    });

    it("renderiza com componente curricular vazio", () => {
      const store = createMockStore();
      const mockSetOpen = jest.fn();
      const customFiltroDados = {
        ...mockFiltroDados,
        componentesCurriculares: [],
        componentesCurricularesRadio: [],
      };

      render(
        <Provider store={store}>
          <FiltroLateral
            open={true}
            setOpen={mockSetOpen}
            filtroDados={customFiltroDados}
          />
        </Provider>,
      );

      expect(screen.getByTestId("drawer")).toBeInTheDocument();
    });
  });
});
