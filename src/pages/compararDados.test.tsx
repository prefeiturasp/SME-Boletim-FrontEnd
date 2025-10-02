import React from "react"; 
import { render, screen, fireEvent } from "@testing-library/react"; 
import { MemoryRouter } from "react-router-dom"; 
import FiltroAplicacaoComponenteCurricularAno from "../componentes/filtro/filtroCompararDados/filtroAplicacaoComponenteCurricularAno"; 

// Definir a interface localmente para o teste
interface ParametrosPadraoAntDesign {
  label: string;
  value: string | number;
}

describe("FiltroAplicacaoComponenteCurricularAno", () => { 
  const mockSelecionaAplicacao = jest.fn(); 
  const mockSelecionaComponente = jest.fn(); 
  const mockSelecionaAno = jest.fn(); 

  const defaultProps = { 
    dreSelecionadaNome: "DRE Teste", 
    aplicacaoSelecionada: { label: "2024", value: "2024" } as ParametrosPadraoAntDesign, 
    componenteSelecionado: { label: "Matemática", value: "Matemática" } as ParametrosPadraoAntDesign, 
    anoSelecionado: { label: "5º Ano", value: "5º Ano" } as ParametrosPadraoAntDesign, 
    aplicacoes: [ 
      { label: "2023", value: "2023" }, 
      { label: "2024", value: "2024" }, 
    ] as ParametrosPadraoAntDesign[], 
    componentesCurriculares: [ 
      { label: "Português", value: "Português" }, 
      { label: "Matemática", value: "Matemática" }, 
    ] as ParametrosPadraoAntDesign[], 
    anos: [ 
      { label: "4º Ano", value: "4º Ano" }, 
      { label: "5º Ano", value: "5º Ano" }, 
    ] as ParametrosPadraoAntDesign[], 
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

  it("deve renderizar os textos explicativos", () => { 
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

    // Aplicação 
    fireEvent.mouseDown(screen.getAllByRole("combobox")[0]); 
    fireEvent.click(screen.getByText("2023")); 
    expect(mockSelecionaAplicacao).toHaveBeenCalled(); 

    // Componente 
    fireEvent.mouseDown(screen.getAllByRole("combobox")[1]); 
    fireEvent.click(screen.getByText("Português")); 
    expect(mockSelecionaComponente).toHaveBeenCalled(); 

    // Ano 
    fireEvent.mouseDown(screen.getAllByRole("combobox")[2]); 
    fireEvent.click(screen.getByText("4º Ano")); 
    expect(mockSelecionaAno).toHaveBeenCalled(); 
  }); */

  // Teste adicional para quando os valores são null/undefined
  it("deve renderizar corretamente quando valores são null", () => { 
    const propsWithNulls = {
      ...defaultProps,
      aplicacaoSelecionada: null,
      componenteSelecionado: null,
      anoSelecionado: null,
    };
    
    render( 
      <MemoryRouter> 
        <FiltroAplicacaoComponenteCurricularAno {...propsWithNulls} /> 
      </MemoryRouter> 
    ); 
    
    expect(screen.getByText("DRE Teste")).toBeInTheDocument(); 
  }); 
});