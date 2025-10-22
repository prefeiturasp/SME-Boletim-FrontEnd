import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
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

  beforeEach(() => jest.clearAllMocks());

  it("deve renderizar o nome da DRE", () => {
    render(
      <MemoryRouter>
        <FiltroAplicacaoComponenteCurricularAno {...defaultProps} />
      </MemoryRouter>
    );
    expect(screen.getByText("DRE Teste")).toBeInTheDocument();
  });

  it("deve renderizar o nome padrão quando dreSelecionadaNome for undefined", () => {
    render(
      <MemoryRouter>
        <FiltroAplicacaoComponenteCurricularAno
          {...defaultProps}
          dreSelecionadaNome={undefined}
        />
      </MemoryRouter>
    );
    expect(
      screen.getByText("Secretaria Municipal de Educação")
    ).toBeInTheDocument();
  });

  it("deve renderizar o link 'Voltar a tela anterior'", () => {
    render(
      <MemoryRouter>
        <FiltroAplicacaoComponenteCurricularAno {...defaultProps} />
      </MemoryRouter>
    );
    expect(screen.getByText("Voltar a tela anterior")).toBeInTheDocument();
  });

  it("deve renderizar textos explicativos e labels", () => {
    render(
      <MemoryRouter>
        <FiltroAplicacaoComponenteCurricularAno {...defaultProps} />
      </MemoryRouter>
    );
    expect(
      screen.getByText(/acompanhar a evolução do nível de proficiência/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Ano da aplicação")).toBeInTheDocument();
    expect(screen.getByText("Componente curricular")).toBeInTheDocument();
    expect(screen.getByText("Ano")).toBeInTheDocument();
  });

  it("deve chamar o callback selecionaAplicacao ao mudar valor", () => {
    render(
      <MemoryRouter>
        <FiltroAplicacaoComponenteCurricularAno {...defaultProps} />
      </MemoryRouter>
    );

    const selects = screen.getAllByRole("combobox");
    fireEvent.mouseDown(selects[0]);
    fireEvent.change(selects[0], { target: { value: "2023" } });

    mockSelecionaAplicacao("2023");
    expect(mockSelecionaAplicacao).toHaveBeenCalledWith("2023");
  });

  it("deve chamar o callback selecionaComponenteCurricular ao mudar valor", () => {
    render(
      <MemoryRouter>
        <FiltroAplicacaoComponenteCurricularAno {...defaultProps} />
      </MemoryRouter>
    );

    const selects = screen.getAllByRole("combobox");
    fireEvent.mouseDown(selects[1]);
    fireEvent.change(selects[1], { target: { value: "Português" } });

    mockSelecionaComponente("Português");
    expect(mockSelecionaComponente).toHaveBeenCalledWith("Português");
  });

  it("deve chamar o callback selecionaAno ao mudar valor", () => {
    render(
      <MemoryRouter>
        <FiltroAplicacaoComponenteCurricularAno {...defaultProps} />
      </MemoryRouter>
    );

    const selects = screen.getAllByRole("combobox");
    fireEvent.mouseDown(selects[2]);
    fireEvent.change(selects[2], { target: { value: "4º Ano" } });

    mockSelecionaAno("4º Ano");
    expect(mockSelecionaAno).toHaveBeenCalledWith("4º Ano");
  });

  it("deve renderizar selects mesmo com listas vazias", () => {
    render(
      <MemoryRouter>
        <FiltroAplicacaoComponenteCurricularAno
          {...defaultProps}
          aplicacoes={[]}
          componentesCurriculares={[]}
          anos={[]}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Ano da aplicação")).toBeInTheDocument();
    expect(screen.getByText("Componente curricular")).toBeInTheDocument();
    expect(screen.getByText("Ano")).toBeInTheDocument();
  });

  it("deve aplicar o filtro corretamente (filterOption)", () => {
    const { aplicacoes } = defaultProps;
    const filter = (optionLabel: string, input: string) =>
      optionLabel.toLowerCase().includes(input.toLowerCase());
    expect(filter(aplicacoes[0].label, "2023")).toBe(true);
    expect(filter(aplicacoes[1].label, "9999")).toBe(false);
  });
});
