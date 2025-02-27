import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import EscolherEscola from "./EscolherEscola";
import { servicos } from "../../__mocks__/servicos";

jest.mock("../../servicos");

const mockStore = configureStore([]);

describe("EscolherEscola Componente", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      escola: { escolaSelecionada: { ueId: null, descricao: "" } },
    });

    servicos.get.mockResolvedValueOnce([
      { ueId: "1", descricao: "Escola A" },
      { ueId: "2", descricao: "Escola B" },
    ]);
  });

  test("Renderizar componente EscolherEscola", async () => {
    render(
      <Provider store={store}>
        <EscolherEscola />
      </Provider>
    );

    screen.debug();

    await waitFor(() =>
      expect(screen.getByRole("combobox")).toBeInTheDocument()
    );
  });

  test("Abrir drawer de filtros", async () => {
    render(
      <Provider store={store}>
        <EscolherEscola />
      </Provider>
    );

    const botaoFiltrar = screen.getByText("Filtrar");
    fireEvent.click(botaoFiltrar);

    await waitFor(() => {
      expect(screen.getByText("Níveis")).toBeInTheDocument();
    });
  });
});
