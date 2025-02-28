import React from "react";
import { render, screen } from "@testing-library/react";
import Tabela from "./tabela";
import "@testing-library/jest-dom";

describe("Tabela Component", () => {
  it("deve exibir um texto de carregamento quando 'estaCarregando' for true", () => {
    render(<Tabela dados={[]} origem="principal" estaCarregando={true} />);

    expect(
      screen.getByText("Não encontramos dados para a UE selecionada")
    ).toBeInTheDocument();
  });

  it("deve mostrar mensagem quando não houver dados", () => {
    render(<Tabela dados={[]} origem="principal" estaCarregando={false} />);

    expect(
      screen.getByText("Não encontramos dados para a UE selecionada")
    ).toBeInTheDocument();
  });
});
