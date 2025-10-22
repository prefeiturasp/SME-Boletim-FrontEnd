import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FiltroComparativoDresUes from "./filtroComparativoDresUes";

describe("Componente FiltroComparativoDresUes", () => {
  const mockAlterarUe = jest.fn();

  const mockProps = {
    dados: [
      { value: "1", label: "UE Teste 1" },
      { value: "2", label: "UE Teste 2" },
    ],
    valorSelecionado: { value: "1", label: "UE Teste 1" },
    alterarDreUe: mockAlterarUe,
    aplicacaoSelecionada: { value: "2024", label: "2024" },
    componenteSelecionado: { value: "Matemática", label: "Matemática" },
    anoSelecionado: { value: "5", label: "5" },
    visao: "dre",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o título principal", () => {
    render(<FiltroComparativoDresUes {...mockProps} />);
    expect(
      screen.getByText("Evolução por Unidade Educacional (UE)")
    ).toBeInTheDocument();
  });

  it("deve renderizar os subtítulos de tags", () => {
    render(<FiltroComparativoDresUes {...mockProps} />);
    expect(screen.getByText("Matemática")).toBeInTheDocument();
    expect(screen.getByText("5º ano")).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
  });

  it("deve chamar alterarDreUe ao selecionar uma nova UE", async () => {
    const user = userEvent.setup();
    render(<FiltroComparativoDresUes {...mockProps} />);

    await act(async () => {
      const select = screen.getByRole("combobox");
      await user.click(select);
    });

    const opcao = await screen.findByText("UE Teste 2");

    await act(async () => {
      await user.click(opcao);
    });

    await waitFor(() => {
      expect(mockAlterarUe).toHaveBeenCalled();
    });
  });
});
