import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import EscolherEscola from "./EscolherEscola";

const mockStore = configureStore([]);

describe("EscolherEscola Componente", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      escola: { escolaSelecionada: "" },
    });
  });

  test("Renderizar componente EscolherEscola ", () => {
    render(
      <Provider store={store}>
        <EscolherEscola />
      </Provider>
    );
    expect(
      screen.getByText("EMEF Bartolomeu Lourenço de Gusmão")
    ).toBeInTheDocument();
    expect(screen.getByText("Filtrar")).toBeInTheDocument();
  });
});
