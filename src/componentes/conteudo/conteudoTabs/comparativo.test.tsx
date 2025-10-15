// 🔇 Silencia todos os avisos de "not wrapped in act(...)" do React
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("not wrapped in act")
    ) {
      return;
    }
    originalError(...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Comparativo, { getNivelColor } from "./comparativo";
import { useSelector, useDispatch } from "react-redux";
import { servicos } from "../../../servicos";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock("../../../servicos", () => ({
  servicos: {
    get: jest.fn(),
  },
}));

const mockDispatch = jest.fn();

const estadoMock = {
  filtroCompleto: {
    componentesCurriculares: [
      { texto: "Matemática", valor: 1 },
      { texto: "Português", valor: 2 },
    ],
    anosEscolares: [
      { texto: "5º ano", valor: 5 },
      { texto: "9º ano", valor: 9 },
    ],
    turmas: [
      { texto: "Turma 1", valor: 1 },
      { texto: "Turma 2", valor: 2 },
    ],
  },
  filtros: {
    componentesCurricularesRadio: [{ texto: "Matemática", valor: 1 }],
    anosEscolaresRadio: [{ texto: "5º ano", valor: 5 }],
  },
  tab: { activeTab: "5" },
  escola: { escolaSelecionada: { ueId: 123, descricao: "DRE SA - Leste" } },
  nomeAplicacao: { id: "APP1" },
};

beforeEach(() => {
  jest.clearAllMocks();
  (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
  (useSelector as unknown as jest.Mock).mockImplementation((s) => s(estadoMock));

  (servicos.get as jest.Mock).mockImplementation((url: string) => {
    if (url.includes("/turmas-ue-ano/")) {
      return Promise.resolve([
        { turma: "Turma 1", ano: 5 },
        { turma: "Turma 2", ano: 5 },
      ]);
    }
    if (url.includes("/proficienciaComparativoProvaSp/")) {
      return Promise.resolve({
        provaSP: { nivelProficiencia: "Básico", mediaProficiencia: 180 },
        lotes: [],
      });
    }
    return Promise.resolve([]);
  });
});

const renderizar = async () => {
  await act(async () => {
    render(
      <MemoryRouter>
        <Comparativo />
      </MemoryRouter>
    );
  });
  await screen.findByText(/Informações da/i);
};

describe("Comparativo", () => {
  it("renderiza textos principais", async () => {
    await renderizar();
    expect(
      screen.getByText(/evolução do nível de proficiência/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Componente curricular:/i)).toBeInTheDocument();
    expect(screen.getByText(/Ano:/i)).toBeInTheDocument();
    expect(screen.getByText(/Turma:/i)).toBeInTheDocument();
  });

  it("renderiza opções de turmas do serviço", async () => {
    await renderizar();
    const turmas = await screen.findAllByText(/Turma/i);
    expect(turmas.length).toBeGreaterThan(0);
  });

  it("troca de componente curricular", async () => {
    await renderizar();
    const selects = screen.getAllByRole("combobox");
    const selectComponente = selects[0];
    await act(async () => {
      fireEvent.mouseDown(selectComponente);
    });
    const option = await screen.findByText("Português");
    fireEvent.click(option);
    expect(option).toBeInTheDocument();
  });

  it("troca de ano", async () => {
    await renderizar();
    const selects = screen.getAllByRole("combobox");
    const selectAno = selects[1];
    await act(async () => {
      fireEvent.mouseDown(selectAno);
    });
    const option = await screen.findByText("9º anoº ano");
    fireEvent.click(option);
    expect(option).toBeInTheDocument();
  });

  it("troca de turma", async () => {
    await renderizar();
    const selects = screen.getAllByRole("combobox");
    const selectTurma = selects[2];
    await act(async () => {
      fireEvent.mouseDown(selectTurma);
    });
    const option = await screen.findByText("Turma 2");
    fireEvent.click(option);
    expect(option).toBeInTheDocument();
  });
});

describe("getNivelColor", () => {
  it("retorna cores corretas", () => {
    expect(getNivelColor("Abaixo do Básico")).toBe("#FF5959");
    expect(getNivelColor("Básico")).toBe("#FEDE99");
    expect(getNivelColor("Avançado")).toBe("#99FF99");
    expect(getNivelColor("Adequado")).toBe("#9999FF");
    expect(getNivelColor("Outro")).toBe("#B0B0B0");
  });
});
