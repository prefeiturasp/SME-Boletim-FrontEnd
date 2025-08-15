// src/pages/dres.test.tsx
import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

// no topo do arquivo (antes dos testes)
const originalConsoleError = console.error;
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation((...args: any[]) => {
    const msg = args[0];
    if (typeof msg === "string" && msg.includes("[antd:") && msg.includes("is deprecated")) {
      return;
    }
    originalConsoleError(...args);
  });
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const real = jest.requireActual("react-router-dom");
  return { ...real, useNavigate: () => mockNavigate };
});

jest.mock("../componentes/grafico/desempenhoPorMateria", () => {
  return function MockDesempenhoPorMateria(props: any) {
    return (
      <div data-testid="grafico-materia">
        GRAFICO_MATERIA (tipo={props.tipo}) itens={Array.isArray(props.dados) ? props.dados.length : 0}
      </div>
    );
  };
});
jest.mock("../componentes/grafico/desempenhoPorMediaProficiencia", () => {
  return function MockDesempenhoPorMediaProficiencia(props: any) {
    return (
      <div data-testid="grafico-media">
        GRAFICO_MEDIA itens={Array.isArray(props.dados) ? props.dados.length : 0}
      </div>
    );
  };
});
jest.mock("../componentes/relatorio/relatorioAlunosPorDres", () => {
  return function MockRelatorioAlunosPorDres(props: any) {
    return (
      <div data-testid="relatorio-dres">
        RELATORIO_DRES dreSelecionadaNome={props.dreSelecionadaNome ?? "-"} aplicacaoSelecionada={props.aplicacaoSelecionada ?? "-"}
      </div>
    );
  };
});

const mockServicosGet = jest.fn(async (url: string) => {
  const lower = url.toLowerCase();
  if (lower.includes("/api/boletimescolar/aplicacoes-prova")) {
    return [
      { id: 1, nome: "Aplicação 2025", tipoTai: true, dataInicioLote: "2025-01-01T00:00:00Z" },
      { id: 2, nome: "Aplicação 2024", tipoTai: true, dataInicioLote: "2024-01-01T00:00:00Z" },
    ];
  }
  if (lower.includes("/api/boletimescolar/1/anos-escolares")) {
    return [
      { ano: 5, descricao: "5º ano" },
      { ano: 9, descricao: "9º ano" },
    ];
  }
  if (lower.includes("/grafico/niveis-proficiencia-disciplina")) {
    return {
      disciplinas: [
        { disciplina: "Língua portuguesa", nivelProficiencia: "Adequado", mediaProficiencia: 245.12 },
        { disciplina: "Matemática", nivelProficiencia: "Básico", mediaProficiencia: 230.33 },
      ],
    };
  }
  if (lower.includes("/api/abrangencia/dres")) {
    return [
      { id: 101, nome: "DRE Campo Limpo" },
      { id: 102, nome: "DRE Santo Amaro" },
    ];
  }
  if (lower.includes("/api/boletimescolar/1/5/resumo-sme") || lower.includes("/api/boletimescolar/1/9/resumo-sme")) {
    return {
      totalDres: 13,
      totalUes: 1200,
      totalAlunos: 350000,
      proficienciaDisciplina: [
        { disciplinaNome: "Língua portuguesa", mediaProficiencia: 245.1 },
        { disciplinaNome: "Matemática", mediaProficiencia: 230.3 },
      ],
    };
  }
  if (lower.includes("/api/boletimescolar/5/1/dres") || lower.includes("/api/boletimescolar/9/1/dres")) {
    return [
      { dreId: 101, dreNome: "DRE Campo Limpo" },
      { dreId: 102, dreNome: "DRE Santo Amaro" },
    ];
  }
  if (lower.includes("/dres/proficiencia")) {
    return {
      totalTipoDisciplina: 2,
      itens: [
        {
          dreId: 101,
          dreNome: "DRE Campo Limpo",
          anoEscolar: 5,
          totalUes: 20,
          totalAlunos: 1000,
          totalRealizaramProva: 900,
          percentualParticipacao: 90,
          disciplinas: [
            { disciplina: "Língua portuguesa", nivelProficiencia: "Adequado", mediaProficiencia: 245.12 },
            { disciplina: "Matemática", nivelProficiencia: "Básico", mediaProficiencia: 230.33 },
          ],
        },
        {
          dreId: 102,
          dreNome: "DRE Santo Amaro",
          anoEscolar: 5,
          totalUes: 10,
          totalAlunos: 500,
          totalRealizaramProva: 450,
          percentualParticipacao: 90,
          disciplinas: [],
        },
      ],
    };
  }
  if (lower.includes("/grafico/media-proficiencia")) {
    return [
      { disciplina: "Língua portuguesa", media: 245.12 },
      { disciplina: "Matemática", media: 230.33 },
    ];
  }
  return [];
});

jest.mock("../servicos", () => ({
  servicos: {
    get: (...args: any[]) => mockServicosGet(...(args as [string])),
  },
}));

import DresPage from "./dres";
import { useSelector, useDispatch } from "react-redux";

const useSelectorMock = useSelector as unknown as jest.Mock;
const useDispatchMock = useDispatch as unknown as jest.Mock;

beforeAll(() => {
  class IO {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  }
  // @ts-ignore
  global.IntersectionObserver = IO;
  // @ts-ignore
  window.scrollTo = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
  window.localStorage.clear();
});

describe("DresPage - fluxo principal", () => {
  it("renderiza e interage com dados e navegação", async () => {
    const fakeState = {
      nomeAplicacao: { id: 1, nome: "Aplicação 2025", tipoTai: true, dataInicioLote: "2025-01-01T00:00:00Z" },
    };
    useDispatchMock.mockReturnValue(jest.fn());
    useSelectorMock.mockImplementation((selectorFn: any) => selectorFn(fakeState));
    window.localStorage.setItem("tipoPerfil", "5");

    render(
      <MemoryRouter initialEntries={["/dres"]}>
        <DresPage />
      </MemoryRouter>
    );

    expect(await screen.findByText("Boletim de Provas")).toBeInTheDocument();
    expect(screen.getByText("Boletim de Provas", { selector: ".titulo-principal" })).toBeInTheDocument();
    expect(screen.getByAltText(/Fluxo DRE/i)).toBeInTheDocument();

    expect(
      screen.getByText(/As informações são das Unidades Educacionais que realizaram a prova Aplicação 2025/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/^DREs$/)).toBeInTheDocument();
    expect(screen.getByText("Unidades Educacionais")).toBeInTheDocument();
    expect(screen.getByText(/Estudantes/)).toBeInTheDocument();

    const graficoMateria = await screen.findByTestId("grafico-materia");
    await waitFor(() => expect(graficoMateria).toHaveTextContent(/itens=2/));

    expect(screen.getByText(/Você pode filtrar por Diretoria Regional de Educação \(DRE\)\./i)).toBeInTheDocument();
    const sticky = screen
    .getByText(/Você pode filtrar por Diretoria Regional de Educação \(DRE\)\./i)
    .closest(".conteudo-fixo-dropdown") as HTMLElement;

    expect(sticky).toBeTruthy();
    expect(within(sticky).getByRole("combobox")).toBeInTheDocument();

    await waitFor(() => {
    // usa textContent para evitar problemas de texto quebrado em spans
    expect(
        screen.getByText((_, node) => node?.textContent === "DRE Campo Limpo")
    ).toBeInTheDocument();
    expect(
        screen.getByText((_, node) => node?.textContent === "DRE Santo Amaro")
    ).toBeInTheDocument();
    }, { timeout: 5000 });

    const cardCampoLimpo = screen.getByText((_, node) => node?.textContent === "DRE Campo Limpo");
    const cardSantoAmaro = screen.getByText((_, node) => node?.textContent === "DRE Santo Amaro");


    const cardCampoLimpoContainer = cardCampoLimpo.closest(".ant-card") as HTMLElement | null;
    expect(cardCampoLimpoContainer).toBeTruthy();
    if (cardCampoLimpoContainer) {
      const utils = within(cardCampoLimpoContainer as HTMLElement);
      expect(utils.getByText(/Ano:/)).toBeInTheDocument();
      expect(utils.getByText(/Média de proficiência/i)).toBeInTheDocument();
      expect(utils.getByRole("button", { name: /Acessar DRE/i })).toBeEnabled();
    }

    const cardSantoAmaroContainer = cardSantoAmaro.closest(".ant-card") as HTMLElement | null;
    expect(cardSantoAmaroContainer).toBeTruthy();
    if (cardSantoAmaroContainer) {
      const utils = within(cardSantoAmaroContainer as HTMLElement);
      expect(utils.getByText(/Não há dados cadastrados/i)).toBeInTheDocument();
      expect(utils.getByRole("button", { name: /Acessar DRE/i })).toBeDisabled();
    }

    const graficoMedia = await screen.findByTestId("grafico-media");
    await waitFor(() => expect(graficoMedia).toHaveTextContent(/itens=2/));

    expect(screen.getByTestId("relatorio-dres")).toBeInTheDocument();

    const user = userEvent.setup();
    if (cardCampoLimpoContainer) {
      const utils = within(cardCampoLimpoContainer);
      const botaoAcessar = utils.getByRole("button", { name: /Acessar DRE/i });
      await user.click(botaoAcessar);
      expect(mockNavigate).toHaveBeenCalledWith("/ues?dreUrlSelecionada=101");
      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    }

    const voltarTopo = screen.getByRole("button", { name: /Voltar para o início/i });
    await user.click(voltarTopo);
    const calls = (window.scrollTo as jest.Mock).mock.calls;
    expect(calls.some(([arg]) => typeof arg === "object" && arg && arg.top === 0)).toBe(true);
  });
});

describe("DresPage - redirecionamento por perfil", () => {
  it("redireciona para /ues se tipoPerfil != 5", async () => {
    const fakeState = {
      nomeAplicacao: { id: 1, nome: "Aplicação 2025", tipoTai: true, dataInicioLote: "2025-01-01T00:00:00Z" },
    };
    useDispatchMock.mockReturnValue(jest.fn());
    useSelectorMock.mockImplementation((selectorFn: any) => selectorFn(fakeState));
    window.localStorage.setItem("tipoPerfil", "0");

    render(
      <MemoryRouter initialEntries={["/dres"]}>
        <DresPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/ues");
    });
  });
});
