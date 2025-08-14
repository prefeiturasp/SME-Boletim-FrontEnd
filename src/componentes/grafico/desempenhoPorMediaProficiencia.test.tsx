import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DesempenhoPorMediaProficiencia from "./desempenhoPorMediaProficiencia";

jest.mock("../conteudo/tooltipMediaProficiencia", () => {
  return function MockedTooltipMediaProficiencia(props: any) {
    return <div data-testid="tooltip-media-proficiencia" data-props={JSON.stringify(props)} />;
  };
});

const dadosExemplo = [
  {
    dreNome: "BUTANTA",
    dreId: 3,
    diciplinas: [
      { disciplinaId: 4, disciplina: "Matemática", mediaProficiencia: 171.41 },
      { disciplinaId: 5, disciplina: "Língua portuguesa", mediaProficiencia: 212.35 },
    ],
  },
  {
    dreNome: "CAMPO LIMPO",
    dreId: 11,
    diciplinas: [
      { disciplinaId: 4, disciplina: "Matemática", mediaProficiencia: 180.81 },
      { disciplinaId: 5, disciplina: "Língua portuguesa", mediaProficiencia: 179.35 },
    ],
  },
  {
    dreNome: "CAPELA DO SOCORRO",
    dreId: 12,
    diciplinas: [
      { disciplinaId: 4, disciplina: "Matemática", mediaProficiencia: 190.12 },
      { disciplinaId: 5, disciplina: "Língua portuguesa", mediaProficiencia: 200.5 },
    ],
  },
];

describe("DesempenhoPorMediaProficiencia", () => {
  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterAll(() => {
    (console.log as jest.Mock).mockRestore();
  });

  test("renderiza estado vazio quando não há dados", () => {
    render(<DesempenhoPorMediaProficiencia dados={[]} />);
    expect(
      screen.getByText(/NÃO FORAM ENCONTRADOS RESULTADOS PARA EXIBIÇÃO DO GRÁFICO/i)
    ).toBeInTheDocument();
  });

  test("renderiza gráfico, legenda e rótulos dos eixos com dados", () => {
    const { container } = render(<DesempenhoPorMediaProficiencia dados={dadosExemplo} />);
    expect(screen.getByText("Componentes curriculares:")).toBeInTheDocument();
    expect(screen.getByText("Língua Portuguesa")).toBeInTheDocument();
    expect(screen.getByText("Matemática")).toBeInTheDocument();
    expect(screen.getByText("Diretorias Regionais (DRE)")).toBeInTheDocument();
    expect(screen.getByText("Média de proficiência")).toBeInTheDocument();
    const barrasPortugues = container.querySelectorAll('path[fill="#5A94D8"]');
    expect(barrasPortugues.length).toBeGreaterThan(0);
    const barrasMatematica = container.querySelectorAll('path[fill="#EDEDED"]');
    expect(barrasMatematica.length).toBeGreaterThan(0);
    expect(screen.getByTestId("tooltip-media-proficiencia")).toBeInTheDocument();
  });

  /*test("quebra rótulos longos do eixo X em várias linhas", () => {
    const { container } = render(<DesempenhoPorMediaProficiencia dados={dadosExemplo} />);
    const textosEixoX = Array.from(container.querySelectorAll("g.recharts-layer.recharts-cartesian-axis-x text"));
    const tickCapela = textosEixoX.find((t) =>
      (t.textContent || "").replace(/\s+/g, " ").includes("CAPELA DO SOCORRO")
    );
    expect(tickCapela).toBeTruthy();
    const tspans = tickCapela ? within(tickCapela).queryAllByText(/CAPELA|DO|SOCORRO/i) : [];
    expect(tspans.length).toBeGreaterThanOrEqual(2);
  });*/
});
