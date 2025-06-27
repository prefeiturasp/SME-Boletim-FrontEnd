import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from "@testing-library/react";
import EstudantesPorMateria from "./estudantePorMateria";
// Mock do Recharts
jest.mock("recharts", () => {
    const OriginalModule = jest.requireActual("recharts");
    return {
        ...OriginalModule,
        ResponsiveContainer: ({ children }) => (_jsx(OriginalModule.ResponsiveContainer, { width: 800, height: 500, children: children })),
    };
});
const mockDataMatematica = {
    turma: "A",
    disciplina: "Matemática",
    alunos: [
        { nome: "Aluno 1", proficiencia: 75 },
        { nome: "Aluno 2", proficiencia: 85 },
    ],
};
const mockDataPortugues = {
    turma: "B",
    disciplina: "Português",
    alunos: [
        { nome: "Aluno 3", proficiencia: 65 },
        { nome: "Aluno 4", proficiencia: 90 },
    ],
};
describe("EstudantesPorMateria", () => {
    it("renderiza o gráfico corretamente para Matemática", () => {
        const { container } = render(_jsx(EstudantesPorMateria, { dados: mockDataMatematica }));
        // Verifica elementos principais
        expect(screen.getByText(`Estudantes da turma ${mockDataMatematica.turma} em ${mockDataMatematica.disciplina}`)).toBeInTheDocument();
        expect(container.querySelector(".recharts-bar")).toBeInTheDocument();
    });
    it("renderiza altura mínima quando há poucos alunos", () => {
        const { container } = render(_jsx(EstudantesPorMateria, { dados: {
                ...mockDataMatematica,
                alunos: [mockDataMatematica.alunos[0]],
            } }));
        const responsiveContainer = container.querySelector(".recharts-responsive-container");
        expect(responsiveContainer).toHaveStyle("height: 500px");
    });
    it("renderiza todos os alunos corretamente", () => {
        render(_jsx(EstudantesPorMateria, { dados: mockDataMatematica }));
        mockDataMatematica.alunos.forEach((aluno) => {
            expect(screen.getByText(aluno.nome)).toBeInTheDocument();
        });
    });
});
