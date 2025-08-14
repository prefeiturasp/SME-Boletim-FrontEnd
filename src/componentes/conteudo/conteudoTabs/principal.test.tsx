import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Principal from "./principal";
import { Provider } from "react-redux";
import { store } from "../../../redux/store";
import "@testing-library/jest-dom";
import { servicos } from "../../../servicos";

// jest.mock("../../../servicos", () => ({
//   servicos: {
//     get: jest.fn(),
//   },
// }));

describe("Principal Component", () => {
  const mockDados = [
    {
      key: "1",
      componente: "Matemática",
      abaixoBasico: "10",
      basico: "20",
      adequado: "30",
      avancado: "40",
      total: 100,
      mediaProficiencia: 75,
    },
  ];

  it("deve exibir mensagem de carregamento enquanto os dados são buscados", async () => {
    const getSpy = jest.spyOn(servicos, "get").mockResolvedValueOnce([]);
    render(
      <Provider store={store}>
        <Principal />
      </Provider>
    );

    expect(
      screen.getByText("Não encontramos dados para a UE selecionada")
    ).toBeInTheDocument();

    getSpy.mockRestore();
  });
});
