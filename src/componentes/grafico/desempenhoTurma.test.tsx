import React from "react";
import { render, screen } from "@testing-library/react";
import DesempenhoTurma from "./desempenhoTurma";

const mockDados = [
  { turma: "Turma A", mediaProficiencia: 220 },
  { turma: "Turma B", mediaProficiencia: 180 },
  { turma: "Turma C", mediaProficiencia: 260 },
];

describe("DesempenhoTurma", () => {
  it("Mostra o Grafico com os dados", () => {
    render(<DesempenhoTurma dados={mockDados} />);
    
    expect(screen.getByText("Turma")).toBeInTheDocument(); // título da legenda
    expect(screen.getByText("Turma A")).toBeInTheDocument();
    expect(screen.getByText("Turma B")).toBeInTheDocument();
    expect(screen.getByText("Turma C")).toBeInTheDocument();
  });

  it("Mostra o total de legendas", () => {
    render(<DesempenhoTurma dados={mockDados} />);
    const legendItems = screen.getAllByText(/Turma [A-C]/);
    expect(legendItems.length).toBe(3);
  });

  it("Tenta pegar os valores do doom", () => {
    render(<DesempenhoTurma dados={mockDados} />);
    expect(screen.getByText("220")).toBeInTheDocument();
    expect(screen.getByText("180")).toBeInTheDocument();
    expect(screen.getByText("260")).toBeInTheDocument();
  });
});
