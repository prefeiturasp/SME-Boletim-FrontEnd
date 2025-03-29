import React from "react";
import { render, screen } from "@testing-library/react";
import EstudantesPorMateria from "./estudantePorMateria";

const mockDadosMatematica = {
  turma: "8A",
  disciplina: "Matemática",
  alunos: [
    { nome: "Ana", proficiencia: 220 },
    { nome: "Bruno", proficiencia: 180 },
  ],
};

const mockDadosPortugues = {
  turma: "7B",
  disciplina: "Português",
  alunos: [
    { nome: "Carlos", proficiencia: 250 },
    { nome: "Daniela", proficiencia: 210 },
  ],
};

describe("EstudantesPorMateria", () => {
  it("Testa o titulo do grafico", () => {
    render(<EstudantesPorMateria dados={mockDadosMatematica} />);
    expect(
      screen.getByText("Estudantes da turma 8A em Matemática")
    ).toBeInTheDocument();
  });

  it("renders YAxis label as 'Estudantes'", () => {
    render(<EstudantesPorMateria dados={mockDadosMatematica} />);
    expect(screen.getByText("Estudantes")).toBeInTheDocument();
  });

  it("Testa se grafico de matematica possui as cores e fontes corretas", () => {
    const { container } = render(
      <EstudantesPorMateria dados={mockDadosMatematica} />
    );
    const bars = container.querySelectorAll(".bar-texto-preto");
    expect(bars.length).toBeGreaterThan(0);
  });

  it("Testa se grafico de portugês possui as cores e fontes corretas", () => {
    const { container } = render(
      <EstudantesPorMateria dados={mockDadosPortugues} />
    );
    const bars = container.querySelectorAll(".bar-texto-branco");
    expect(bars.length).toBeGreaterThan(0);
  });

  it("Mostra Nomes Estudantes", () => {
    render(<EstudantesPorMateria dados={mockDadosPortugues} />);
    expect(screen.getByText("Carlos")).toBeInTheDocument();
    expect(screen.getByText("Daniela")).toBeInTheDocument();
  });
});
