import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import DesempenhoPorMediaProficiencia from "./desempenhoPorMediaProficiencia";

jest.mock("./conteudo/tooltipMediaProficiencia", () => {
  return function MockedTooltipMediaProficiencia(props: any) {
    return (
      <div
        data-testid="tooltip-media-proficiencia"
        data-props={JSON.stringify(props)}
      />
    );
  };
});

const dadosTeste = [
  {
    dreNome: "CAMPO LIMPO",
    dreId: 11,
    diciplinas: [
      {
        disciplinaId: 4,
        disciplina: "Matemática",
        mediaProficiencia: 180.81,
      },
      {
        disciplinaId: 5,
        disciplina: "Língua portuguesa",
        mediaProficiencia: 179.35,
      },
    ],
  },
];

describe("Testando funcionamento basico do grafico", () => {
  test("testa se ao não receber dados se o grafico mostra mensagem correta", async () => {
    render(<DesempenhoPorMediaProficiencia dados={[]} />);

    expect(
      await screen.findByText(
        /NÃO FORAM ENCONTRADOS RESULTADOS PARA EXIBIÇÃO DO GRÁFICO/
      )
    ).toBeInTheDocument();
  });

  test("Testa se o grafico abre normalmente caso existam dados validos", async () => {
    render(<DesempenhoPorMediaProficiencia dados={dadosTeste} />);

    expect(
      await screen.queryByText(
        /NÃO FORAM ENCONTRADOS RESULTADOS PARA EXIBIÇÃO DO GRÁFICO/
      )
    ).not.toBeInTheDocument();
  });

  test("Testa se os textos aparecem corretamente", async () => {
    render(<DesempenhoPorMediaProficiencia dados={dadosTeste} />);

    expect(await screen.findByText(/Língua Portuguesa/i)).toBeInTheDocument();
    expect(await screen.findByText(/Matemática/i)).toBeInTheDocument();

    expect(
      await screen.findByText(/Componentes curriculares:/i)
    ).toBeInTheDocument();
  });


  //TODO: NÃO FUNCIONA TENTAR OUTRA FORMA DE TESTAR AS BARRAS
  /*test("quebra rótulos longos do eixo X em várias linhas", async () => {

    const { container } = render(<DesempenhoPorMediaProficiencia dados={dadosTeste} />);

    await waitFor(() => {
      const ticks = container.querySelectorAll(".recharts-cartesian-axis-tick text");
      expect(ticks.length).toBeGreaterThan(0);
    });

    const tickTextEls = Array.from(
      container.querySelectorAll<SVGTextElement>(".recharts-cartesian-axis-tick text")
    );
    const tickTexts = tickTextEls.map((t) => (t.textContent || "").trim().replace(/\s+/g, " "));

    const idx = tickTexts.findIndex((t) => t.includes("CAMPO LIMPO"));
    expect(idx).toBeGreaterThanOrEqual(0);

    const targetTextEl = tickTextEls[idx];
    const tspans = targetTextEl.querySelectorAll("tspan");
    expect(tspans.length).toBeGreaterThanOrEqual(2); // espera quebra em 2+ linhas
  });*/




});

