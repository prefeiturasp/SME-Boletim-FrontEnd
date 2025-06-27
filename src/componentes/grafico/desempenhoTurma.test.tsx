import React from "react";
import { render, screen } from "@testing-library/react";
import DesempenhoTurma from "./desempenhoTurma";

// Mock do Recharts
jest.mock("recharts", () => {
  const OriginalModule = jest.requireActual("recharts");

  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <OriginalModule.ResponsiveContainer width={800} height={500}>
        {children}
      </OriginalModule.ResponsiveContainer>
    ),
  };
});

const mockData = [
  { turma: "Turma A", mediaProficiencia: 75 },
  { turma: "Turma B", mediaProficiencia: 85 },
  { turma: "Turma C", mediaProficiencia: 90 },
];

describe("DesempenhoTurma", () => {
  it("renderiza o gráfico corretamente", () => {
    const { container } = render(<DesempenhoTurma dados={mockData} />);

    // Verifica elementos do gráfico
    expect(container.querySelector(".recharts-bar")).toBeInTheDocument();
    expect(screen.getByText("Média de proficiência")).toBeInTheDocument();
  });

  it("renderiza todas as barras correspondentes aos dados", () => {
    const { container } = render(<DesempenhoTurma dados={mockData} />);

    const bars = container.querySelectorAll(".recharts-bar-rectangle");
    expect(bars.length).toBe(mockData.length);
  });

  it("aplica cores diferentes para cada barra", () => {
    const { container } = render(<DesempenhoTurma dados={mockData} />);

    const cells = container.querySelectorAll(".recharts-cell");
    const colors = Array.from(cells).map(
      (cell) =>
        cell.getAttribute("fill") ||
        cell.getAttribute("style")?.includes("background-color")
    );

    const uniqueColors = new Set(colors);
    expect(uniqueColors.size).toBe(0);
  });
});
