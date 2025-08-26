// desempenhoAno.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import DesempenhoAno from "./desempenhoAno";

beforeAll(() => {
  jest.spyOn(window, 'location', 'get').mockReturnValue({
    ...window.location,
    assign: jest.fn(),
  });
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

// Mock do Recharts seguindo as recomendações oficiais
jest.mock("recharts", () => {
  const OriginalModule = jest.requireActual("recharts");

  return {
    ...OriginalModule,
    ResponsiveContainer: (props: any) => (
      <OriginalModule.ResponsiveContainer {...props} width={800} height={600} />
    ),
  };
});

// Interface Filtro mantida igual ao componente
interface Filtro {
  niveisAbaPrincipal: Array<{ texto: string; valor: number }>;
  niveis: Array<{ texto: string; valor: number }>;
  anosEscolares: Array<{ texto: string; valor: number }>;
  componentesCurriculares: Array<{ texto: string; valor: number }>;
  anosEscolaresRadio: Array<{ texto: string; valor: number }>;
  componentesCurricularesRadio: Array<{ texto: string; valor: number }>;
  nomeEstudante: string;
  eolEstudante: string;
  nivelMinimo: number;
  nivelMinimoEscolhido: number;
  nivelMaximo: number;
  nivelMaximoEscolhido: number;
  turmas: Array<{ texto: string; valor: number }>;
}

const mockData = [
  {
    componenteCurricular: "Matemática",
    abaixoBasico: "10 (20%)",
    basico: "15 (30%)",
    adequado: "20 (40%)",
    avancado: "5 (10%)",
  },
];

const mockFilters: Filtro = {
  niveisAbaPrincipal: [
    { texto: "Abaixo do Básico", valor: 1 },
    { texto: "Básico", valor: 2 },
    { texto: "Adequado", valor: 3 },
    { texto: "Avançado", valor: 4 },
  ],
  niveis: [],
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
};

describe("DesempenhoAno", () => {
  it("renderiza o gráfico com dados processados", () => {
    const { container } = render(
      <DesempenhoAno dados={mockData} filtrosSelecionados={mockFilters} />
    );

    // Verifica elementos principais
    expect(container.querySelector(".recharts-bar")).toBeInTheDocument();
    expect(
      container.querySelector(".recharts-cartesian-grid")
    ).toBeInTheDocument();
  });

  it("renderiza todas as barras quando todos os filtros estão ativos", () => {
    const { container } = render(
      <DesempenhoAno dados={mockData} filtrosSelecionados={mockFilters} />
    );

    const bars = container.querySelectorAll(".recharts-bar-rectangle");
    expect(bars.length).toBe(5);
  });

  it("não renderiza barras quando filtros estão desativados", () => {
    const emptyFilters: Filtro = {
      ...mockFilters,
      niveisAbaPrincipal: [],
    };

    const { container } = render(
      <DesempenhoAno dados={mockData} filtrosSelecionados={emptyFilters} />
    );

    const bars = container.querySelectorAll(".recharts-bar-rectangle");
    expect(bars.length).toBe(1);
  });
});
