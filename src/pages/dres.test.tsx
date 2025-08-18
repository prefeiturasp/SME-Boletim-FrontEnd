// src/pages/dres.test.tsx
import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { estiloNivel } from "./dres";

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
    await waitFor(() => expect(graficoMateria).toHaveTextContent(/itens=2/), { timeout: 5000 });

    expect(screen.getByText(/Você pode filtrar por Diretoria Regional de Educação \(DRE\)\./i)).toBeInTheDocument();
    const sticky = screen
    .getByText(/Você pode filtrar por Diretoria Regional de Educação \(DRE\)\./i)
    .closest(".conteudo-fixo-dropdown") as HTMLElement;

    expect(sticky).toBeTruthy();
    expect(within(sticky).getByRole("combobox")).toBeInTheDocument();

    const graficoMedia = await screen.findByTestId("grafico-media");
    await waitFor(() => expect(graficoMedia).toHaveTextContent(/itens=2/), { timeout: 5000 });

    // Confirma que a listagem de DREs foi requisitada (sem depender do DOM dos cartões)
    await waitFor(() => {
      // foi chamada alguma URL de proficiência de DREs
      expect(
        mockServicosGet.mock.calls.some(([url]) =>
          /\/dres\/proficiencia/i.test(String(url))
        )
      ).toBe(true);
    }, { timeout: 8000 });

    // O relatório mockado continua sendo renderizado
    expect(screen.getByTestId("relatorio-dres")).toBeInTheDocument();


    const voltarTopo = screen.getByRole("button", { name: /Voltar para o início/i });
    await userEvent.click(voltarTopo);
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


// ─────────────────────────────────────────────────────────────────────────────
// COBRIR o sticky com IntersectionObserver (classe "fixed" + CSS vars)
describe("DresPage - sticky/IntersectionObserver", () => {
  let lastCB: IntersectionObserverCallback | null = null;

  beforeAll(() => {
    class IO {
      constructor(cb: IntersectionObserverCallback) {
        lastCB = cb;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() { return []; }
    }
    // @ts-ignore sobrescreve o stub global só neste describe
    global.IntersectionObserver = IO;
  });

  afterAll(() => {
    class IO {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() { return []; }
    }
    // @ts-ignore restaura stub simples
    global.IntersectionObserver = IO;
  });

  it("fixa o sticky e seta CSS vars quando o sentinel sai da viewport", async () => {
    const fakeState = {
      nomeAplicacao: { id: 1, nome: "Aplicação 2025", tipoTai: true, dataInicioLote: "2025-01-01T00:00:00Z" },
    };
    (useDispatch as unknown as jest.Mock).mockReturnValue(jest.fn());
    (useSelector as unknown as jest.Mock).mockImplementation((selectorFn: any) => selectorFn(fakeState));
    window.localStorage.setItem("tipoPerfil", "5");

    render(
      <MemoryRouter initialEntries={["/dres"]}>
        <DresPage />
      </MemoryRouter>
    );

    const sticky = await screen
      .findByText(/Você pode filtrar por Diretoria Regional de Educação \(DRE\)\./i)
      .then(el => el.closest(".conteudo-fixo-dropdown") as HTMLElement);

    expect(sticky).toBeTruthy();

    // observer e entry fakes para o callback
    const fakeObserver = {
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
      takeRecords: jest.fn().mockReturnValue([]),
      root: null,
      rootMargin: "0px",
      thresholds: [0],
    } as unknown as IntersectionObserver;

    const fakeEntry = {
      isIntersecting: false,
      target: document.createElement("div"),
      time: 0,
      rootBounds: null as any,
      boundingClientRect: { top: -1 } as any,
      intersectionRect: {} as any,
      intersectionRatio: 0,
    } as unknown as IntersectionObserverEntry;

    // Chama o callback com (entries, observer)
    lastCB?.([fakeEntry], fakeObserver);

    expect(sticky.classList.contains("fixed")).toBe(true);
    const styles = sticky.style as CSSStyleDeclaration;
    expect(styles.getPropertyValue("--container-left")).toContain("px");
    expect(styles.getPropertyValue("--container-width")).toContain("px");
    expect(styles.getPropertyValue("--sticky-offset")).toContain("px");
  });
});


// ─────────────────────────────────────────────────────────────────────────────
// COBRIR o dispatch inicial de setNomeAplicacao (buscarAplicacoes)
describe("DresPage - dispatch inicial de aplicação", () => {
  it("dispara setNomeAplicacao ao carregar aplicações", async () => {
    const dispatchSpy = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(dispatchSpy);
    (useSelector as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({ nomeAplicacao: { id: undefined, nome: undefined } })
    );
    window.localStorage.setItem("tipoPerfil", "5");

    render(
      <MemoryRouter>
        <DresPage />
      </MemoryRouter>
    );

    await screen.findByText("Boletim de Provas");

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            id: 1,
            nome: "Aplicação 2025",
            tipoTai: true,
          }),
        })
      );
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// COBRIR a função pura estiloNivel (todos os ramos)
describe("estiloNivel", () => {
  it("mapeia níveis para estilos esperados", () => {
    expect(estiloNivel("Adequado").background).toContain("153, 153, 255");
    expect(estiloNivel("Básico").background).toContain("254,222,153");
    expect(estiloNivel("Abaixo do básico").background).toContain("255,89,89");
    expect(estiloNivel("Avançado").background).toContain("153, 255, 153");
    expect(estiloNivel("").background).toBe("#f0f0f0");
    expect(estiloNivel("Qualquer")).toEqual(
      expect.objectContaining({ background: "#f0f0f0", color: "#8c8c8c" })
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SUBSTITUIR o bloco "DresPage - ramos de erro dos serviços" por este:
describe("DresPage - ramos de erro dos serviços", () => {
  it("executa os catch quando os endpoints falham (sem poluir o console)", async () => {
    // guarda e silencia o console.error (já está mockado globalmente com filtro)
    const prevConsoleImpl = (console.error as jest.Mock).getMockImplementation();
    (console.error as jest.Mock).mockImplementation(() => {});

    // guarda a implementação padrão do mock para restaurar depois
    const defaultImpl = mockServicosGet.getMockImplementation();

    try {
      const fakeState = {
        nomeAplicacao: { id: 1, nome: "Aplicação 2025", tipoTai: true, dataInicioLote: "2025-01-01T00:00:00Z" },
      };
      (useDispatch as unknown as jest.Mock).mockReturnValue(jest.fn());
      (useSelector as unknown as jest.Mock).mockImplementation((selectorFn: any) => selectorFn(fakeState));
      window.localStorage.setItem("tipoPerfil", "5");

      // força falhas específicas para cobrir os catch
      mockServicosGet.mockImplementation(async (url: string) => {
        const lower = url.toLowerCase();
        if (lower.includes("/aplicacoes-prova")) {
          return [{ id: 1, nome: "Aplicação 2025", tipoTai: true, dataInicioLote: "2025-01-01T00:00:00Z" }];
        }
        if (lower.includes("/anos-escolares")) {
          return [{ ano: 5, descricao: "5º ano" }];
        }
        if (lower.includes("/abrangencia/dres")) {
          return [{ id: 101, nome: "DRE X" }];
        }
        if (lower.includes("/resumo-sme")) throw new Error("resumo falhou");
        if (lower.includes("niveis-proficiencia-disciplina")) throw new Error("niveis falhou");
        if (lower.endsWith("/dres")) return [{ dreId: 101, dreNome: "DRE X" }];
        if (lower.includes("/dres/proficiencia")) throw new Error("proficiencia falhou");
        if (lower.includes("media-proficiencia")) throw new Error("media falhou");
        return [];
      });

      render(
        <MemoryRouter initialEntries={["/dres"]}>
          <DresPage />
        </MemoryRouter>
      );

      await screen.findByText("Boletim de Provas");

      // garante que cada endpoint com erro foi de fato chamado
      await waitFor(() =>
        expect(
          mockServicosGet.mock.calls.some(([u]) => String(u).toLowerCase().includes("/resumo-sme"))
        ).toBe(true)
      );
      await waitFor(() =>
        expect(
          mockServicosGet.mock.calls.some(([u]) => String(u).toLowerCase().includes("niveis-proficiencia-disciplina"))
        ).toBe(true)
      );
      await waitFor(() =>
        expect(
          mockServicosGet.mock.calls.some(([u]) => String(u).toLowerCase().includes("/dres/proficiencia"))
        ).toBe(true)
      );
      await waitFor(() =>
        expect(
          mockServicosGet.mock.calls.some(([u]) => String(u).toLowerCase().includes("media-proficiencia"))
        ).toBe(true)
      );
    } finally {
      // restaura mocks
      if (defaultImpl) mockServicosGet.mockImplementation(defaultImpl);
      (console.error as jest.Mock).mockImplementation(prevConsoleImpl!);
    }
  });
});


// ─────────────────────────────────────────────────────────────────────────────
// Ordenação do resumo (garante que as disciplinas são ordenadas por nome)
describe("DresPage - ordenação do resumo SME", () => {
  it("ordena as disciplinas alfabeticamente (localeCompare)", async () => {
    const defaultImpl = mockServicosGet.getMockImplementation();
    const prevConsole = (console.error as jest.Mock).getMockImplementation();
    (console.error as jest.Mock).mockImplementation(() => {}); // silencia erros de catch

    try {
      mockServicosGet.mockImplementation(async (url: string) => {
        const lower = url.toLowerCase();
        if (lower.includes("/aplicacoes-prova")) {
          return [{ id: 1, nome: "Aplicação 2025", tipoTai: true, dataInicioLote: "2025-01-01T00:00:00Z" }];
        }
        if (lower.includes("/anos-escolares")) {
          return [{ ano: 5, descricao: "5º ano" }];
        }
        if (lower.includes("/abrangencia/dres")) {
          return [{ id: 101, nome: "DRE X" }];
        }
        if (lower.includes("/resumo-sme")) {
          // ordem "errada" vinda da API para testarmos o sort interno
          return {
            totalDres: 1,
            totalUes: 1,
            totalAlunos: 1,
            proficienciaDisciplina: [
              { disciplinaNome: "Matemática", mediaProficiencia: 230.3 },
              { disciplinaNome: "Língua portuguesa", mediaProficiencia: 245.1 },
            ],
          };
        }
        if (lower.includes("niveis-proficiencia-disciplina")) return { disciplinas: [] };
        if (lower.endsWith("/dres")) return [{ dreId: 101, dreNome: "DRE X" }];
        if (lower.includes("/dres/proficiencia")) return { totalTipoDisciplina: 0, itens: [] };
        if (lower.includes("media-proficiencia")) return [];
        return [];
      });

      (useDispatch as unknown as jest.Mock).mockReturnValue(jest.fn());
      (useSelector as unknown as jest.Mock).mockImplementation((sel: any) =>
        sel({ nomeAplicacao: { id: 1, nome: "Aplicação 2025", tipoTai: true, dataInicioLote: "2025-01-01T00:00:00Z" } })
      );
      window.localStorage.setItem("tipoPerfil", "5");

      render(
        <MemoryRouter initialEntries={["/dres"]}>
          <DresPage />
        </MemoryRouter>
      );

      await screen.findByText("Boletim de Provas");

      // Verifica que "Língua portuguesa" aparece antes de "Matemática" no DOM
      const elPort = await screen.findByText("Língua portuguesa");
      const elMat = await screen.findByText("Matemática");
      expect(elPort.compareDocumentPosition(elMat) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    } finally {
      mockServicosGet.mockImplementation(defaultImpl!);
      (console.error as jest.Mock).mockImplementation(prevConsole || originalConsoleError);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Early return quando não há anos-escolares (evita chamadas a /dres e /dres/proficiencia)
describe("DresPage - early return sem anos-escolares", () => {
  it("não chama /dres nem /dres/proficiencia quando anos-escolares vem vazio", async () => {
    const defaultImpl = mockServicosGet.getMockImplementation();

    try {
      mockServicosGet.mockImplementation(async (url: string) => {
        const lower = url.toLowerCase();
        if (lower.includes("/aplicacoes-prova")) {
          return [{ id: 1, nome: "Aplicação 2025", tipoTai: true, dataInicioLote: "2025-01-01T00:00:00Z" }];
        }
        if (lower.includes("/anos-escolares")) {
          return []; // força anoSelecionado = undefined
        }
        // Qualquer outro endpoint não deveria ser chamado
        return [];
      });

      (useDispatch as unknown as jest.Mock).mockReturnValue(jest.fn());
      (useSelector as unknown as jest.Mock).mockImplementation((sel: any) =>
        sel({ nomeAplicacao: { id: 1, nome: "Aplicação 2025", tipoTai: true, dataInicioLote: "2025-01-01T00:00:00Z" } })
      );
      window.localStorage.setItem("tipoPerfil", "5");

      render(
        <MemoryRouter initialEntries={["/dres"]}>
          <DresPage />
        </MemoryRouter>
      );

      await screen.findByText("Boletim de Provas");

      // Garante que NÃO houve chamadas para /dres e /dres/proficiencia
      expect(
        mockServicosGet.mock.calls.some(([u]) => String(u).toLowerCase().includes("/dres/"))
      ).toBe(false);
      expect(
        mockServicosGet.mock.calls.some(([u]) => String(u).toLowerCase().includes("/dres/proficiencia"))
      ).toBe(false);
    } finally {
      mockServicosGet.mockImplementation(defaultImpl!);
    }
  });
});







