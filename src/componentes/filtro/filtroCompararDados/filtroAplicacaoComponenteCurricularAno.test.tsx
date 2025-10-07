import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import FiltroAplicacaoComponenteCurricularAno from "./filtroAplicacaoComponenteCurricularAno";

describe("FiltroAplicacaoComponenteCurricularAno", () => {
  const mockSelecionaAplicacao = jest.fn();
  const mockSelecionaComponente = jest.fn();
  const mockSelecionaAno = jest.fn();

  const defaultProps = {
    dreSelecionadaNome: "DRE Teste",
    aplicacaoSelecionada: { label: "2024", value: "2024" },
    componenteSelecionado: { label: "Matemática", value: "Matemática" },
    anoSelecionado: { label: "5º Ano", value: "5º Ano" },
    aplicacoes: [
      { label: "2023", value: "2023" },
      { label: "2024", value: "2024" },
    ],
    componentesCurriculares: [
      { label: "Português", value: "Português" },
      { label: "Matemática", value: "Matemática" },
    ],
    anos: [
      { label: "4º Ano", value: "4º Ano" },
      { label: "5º Ano", value: "5º Ano" },
    ],
    selecionaAno: mockSelecionaAno,
    selecionaAplicacao: mockSelecionaAplicacao,
    selecionaComponenteCurricular: mockSelecionaComponente,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o nome da DRE", () => {
    render(
      <MemoryRouter>
        <FiltroAplicacaoComponenteCurricularAno {...defaultProps} />
      </MemoryRouter>
    );
    expect(screen.getByText("DRE Teste")).toBeInTheDocument();
  });

  it("deve renderizar o link 'Voltar a tela anterior'", () => {
    render(
      <MemoryRouter>
        <FiltroAplicacaoComponenteCurricularAno {...defaultProps} />
      </MemoryRouter>
    );
    expect(screen.getByText("Voltar a tela anterior")).toBeInTheDocument();
  });

  it("deve renderizar o texto explicativo", () => {
    render(
      <MemoryRouter>
        <FiltroAplicacaoComponenteCurricularAno {...defaultProps} />
      </MemoryRouter>
    );
    expect(
      screen.getByText(/acompanhar a evolução do nível de proficiência/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Para começar, selecione o componente curricular/i)
    ).toBeInTheDocument();
  });

  it("deve renderizar os 3 selects", () => {
    render(
      <MemoryRouter>
        <FiltroAplicacaoComponenteCurricularAno {...defaultProps} />
      </MemoryRouter>
    );

    expect(screen.getByText("Ano da aplicação")).toBeInTheDocument();
    expect(screen.getByText("Componente curricular")).toBeInTheDocument();
    expect(screen.getByText("Ano")).toBeInTheDocument();
  });

  /*it("deve chamar os callbacks ao trocar valores dos selects", () => {
    render(
      <MemoryRouter>
        <FiltroAplicacaoComponenteCurricularAno {...defaultProps} />
      </MemoryRouter>
    );

    // Trocar aplicação
    fireEvent.mouseDown(screen.getAllByRole("combobox")[0]);
    fireEvent.click(screen.getByText("2023"));
    expect(mockSelecionaAplicacao).toHaveBeenCalledWith("2023", expect.anything());

    // Trocar componente curricular
    fireEvent.mouseDown(screen.getAllByRole("combobox")[1]);
    fireEvent.click(screen.getByText("Português"));
    expect(mockSelecionaComponente).toHaveBeenCalledWith("Português", expect.anything());

    // Trocar ano
    fireEvent.mouseDown(screen.getAllByRole("combobox")[2]);
    fireEvent.click(screen.getByText("4º Ano"));
    expect(mockSelecionaAno).toHaveBeenCalledWith("4º Ano", expect.anything());
  });*/
});
