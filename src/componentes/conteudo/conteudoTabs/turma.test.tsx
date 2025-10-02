import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Turma from "./turma";

jest.mock("react-redux", () => {
  const actual = jest.requireActual("react-redux");
  return { ...actual, useSelector: jest.fn() };
});

jest.mock("../../../servicos", () => ({
  servicos: { get: jest.fn() },
}));

jest.mock("../../grafico/desempenhoTurma", () => () => (
  <div data-testid="grafico-turma" />
));

const { useSelector } = jest.requireMock("react-redux") as {
  useSelector: jest.Mock;
};

const { servicos } = jest.requireMock("../../../servicos") as {
  servicos: { get: jest.Mock };
};

jest.mock("antd", () => {
  const actual = jest.requireActual("antd");
  return {
    ...actual,
    Table: ({ columns, dataSource, rowKey, className }: any) => (
      <div
        data-testid={`table-${className || "default"}`}
        data-columns={JSON.stringify(columns)}
      >
        {(dataSource || []).map((r: any, index: number) => (
          <div key={r[rowKey] ?? r.anoEscolar ?? r.turma ?? index}>
            {JSON.stringify(r)}
          </div>
        ))}
      </div>
    ),
  };
});


const estadoBase = (overrides?: Partial<any>) => ({
  escola: { escolaSelecionada: { ueId: "UE1" } },
  nomeAplicacao: { id: "APP1" },
  tab: { activeTab: "2" },
  filtros: {
    anosEscolares: [],
    componentesCurriculares: [],
    niveisAbaPrincipal: [
      { valor: 1 },
      { valor: 2 },
      { valor: 3 },
      { valor: 4 },
    ],
  },
  ...overrides,
});

const mockUseSelector = (state: any) => {
  useSelector.mockImplementation((selector: any) => selector(state));
};

const respostaProvas = {
  provas: [
    {
      id: "P1",
      descricao: "Matemática",
      niveis: [
        {
          anoEscolar: "6º",
          abaixoBasico: 1,
          basico: 2,
          adequado: 3,
          avancado: 4,
        },
      ],
      turmas: [
        {
          turma: "6A",
          abaixoBasico: 5,
          basico: 6,
          adequado: 7,
          avancado: 8,
          total: 26,
          mediaProficiencia: 245.3,
        },
        {
          turma: "6B",
          abaixoBasico: 2,
          basico: 3,
          adequado: 4,
          avancado: 5,
          total: 20,
          mediaProficiencia: 238.1,
        },
      ],
    },
  ],
};

describe("Turma", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("busca dados quando activeTab é '2' e renderiza tabelas e gráfico", async () => {
    mockUseSelector(estadoBase());
    servicos.get.mockResolvedValueOnce(respostaProvas);
    render(<Turma />);

    await waitFor(() => {
      expect(servicos.get).toHaveBeenCalledTimes(1);
    });

    const urlChamado = servicos.get.mock.calls[0][0] as string;
    expect(urlChamado).toBe(
      "/api/boletimescolar/APP1/UE1/turmas"
    );

    const tabelaNiveis = await screen.findByTestId("table-tabela-niveis-turmas");
    const tabelaTurmas = await screen.findByTestId("table-default");
    expect(tabelaNiveis).toBeInTheDocument();
    expect(tabelaTurmas).toBeInTheDocument();

    const rowsNiveis = JSON.parse(tabelaNiveis.getAttribute("data-rows") || "[]");
    const rowsTurmas = JSON.parse(tabelaTurmas.getAttribute("data-rows") || "[]");
    expect(rowsNiveis).toEqual(["6º"]);
    expect(rowsTurmas).toEqual(["6A", "6B"]);

    expect(screen.getByTestId("grafico-turma")).toBeInTheDocument();
  });

  test("não busca quando activeTab não é '2'", async () => {
    mockUseSelector(estadoBase({ tab: { activeTab: "1" } }));
    render(<Turma />);
    await waitFor(() => {
      expect(servicos.get).not.toHaveBeenCalled();
    });
  });
});
