import escolaReducer, { selecionarEscola } from "./escolaSlice";
import filtroCarregadoReducer, { filtroCarregado } from "./filtroCarregado";
import filtroCompletoReducer, { setFiltroDados } from "./filtroCompletoSlice";
import filtrosReducer, { setFilters, resetFilters } from "./filtrosSlice";
import nomeAplicacaoReducer, { setNomeAplicacao } from "./nomeAplicacaoSlice";
import tabReducer, { setActiveTab } from "./tabSlice";

// ─── escolaSlice ────────────────────────────────────────────────────────────

describe("escolaSlice", () => {
  const estadoInicial = { escolaSelecionada: { ueId: null, descricao: null } };

  it("retorna estado inicial", () => {
    const state = escolaReducer(undefined, { type: "@@INIT" });
    expect(state).toEqual(estadoInicial);
  });

  it("selecionarEscola atualiza ueId e descricao", () => {
    const payload = { ueId: "123", descricao: "Escola Teste" };
    const state = escolaReducer(estadoInicial, selecionarEscola(payload));
    expect(state.escolaSelecionada.ueId).toBe("123");
    expect(state.escolaSelecionada.descricao).toBe("Escola Teste");
  });

  it("selecionarEscola sobrescreve valor anterior", () => {
    const primeiro = escolaReducer(
      estadoInicial,
      selecionarEscola({ ueId: "1", descricao: "Antiga" }),
    );
    const segundo = escolaReducer(
      primeiro,
      selecionarEscola({ ueId: "2", descricao: "Nova" }),
    );
    expect(segundo.escolaSelecionada.ueId).toBe("2");
    expect(segundo.escolaSelecionada.descricao).toBe("Nova");
  });
});

// ─── filtroCarregadoSlice ────────────────────────────────────────────────────

describe("filtroCarregadoSlice", () => {
  const estadoInicial = { carregado: false };

  it("retorna estado inicial", () => {
    const state = filtroCarregadoReducer(undefined, { type: "@@INIT" });
    expect(state).toEqual(estadoInicial);
  });

  it("filtroCarregado define carregado como true", () => {
    const state = filtroCarregadoReducer(estadoInicial, filtroCarregado(true));
    expect(state.carregado).toBe(true);
  });

  it("filtroCarregado define carregado como false", () => {
    const state = filtroCarregadoReducer(
      { carregado: true },
      filtroCarregado(false),
    );
    expect(state.carregado).toBe(false);
  });
});

// ─── filtroCompletoSlice ─────────────────────────────────────────────────────

describe("filtroCompletoSlice", () => {
  it("retorna estado inicial com nivelMinimo 50", () => {
    const state = filtroCompletoReducer(undefined, { type: "@@INIT" });
    expect(state.nivelMinimo).toBe(50);
    expect(state.nivelMaximo).toBe(275);
    expect(state.niveisAbaPrincipal).toHaveLength(4);
  });

  it("setFiltroDados mescla payload com estado atual", () => {
    const initial = filtroCompletoReducer(undefined, { type: "@@INIT" });
    const state = filtroCompletoReducer(
      initial,
      setFiltroDados({ nomeEstudante: "Maria" } as any),
    );
    expect(state.nomeEstudante).toBe("Maria");
    expect(state.nivelMinimo).toBe(50);
  });

  it("setFiltroDados atualiza múltiplos campos", () => {
    const initial = filtroCompletoReducer(undefined, { type: "@@INIT" });
    const state = filtroCompletoReducer(
      initial,
      setFiltroDados({
        nomeEstudante: "João",
        eolEstudante: "999",
        nivelMinimo: 100,
      } as any),
    );
    expect(state.nomeEstudante).toBe("João");
    expect(state.eolEstudante).toBe("999");
    expect(state.nivelMinimo).toBe(100);
  });

  it("setFiltroDados sobrescreve componentesCurriculares", () => {
    const initial = filtroCompletoReducer(undefined, { type: "@@INIT" });
    const novosComponentes = [{ valor: 99, texto: "Arte" }];
    const state = filtroCompletoReducer(
      initial,
      setFiltroDados({ componentesCurriculares: novosComponentes } as any),
    );
    expect(state.componentesCurriculares).toEqual(novosComponentes);
  });
});

// ─── filtrosSlice ────────────────────────────────────────────────────────────

describe("filtrosSlice", () => {
  it("retorna estado inicial com nivelMinimo 0", () => {
    const state = filtrosReducer(undefined, { type: "@@INIT" });
    expect(state.nivelMinimo).toBe(0);
    expect(state.niveisAbaPrincipal).toHaveLength(4);
    expect(state.niveis).toEqual([]);
  });

  it("setFilters mescla payload com estado atual", () => {
    const initial = filtrosReducer(undefined, { type: "@@INIT" });
    const state = filtrosReducer(
      initial,
      setFilters({ nomeEstudante: "Carlos" }),
    );
    expect(state.nomeEstudante).toBe("Carlos");
    expect(state.nivelMinimo).toBe(0);
  });

  it("setFilters atualiza niveis", () => {
    const initial = filtrosReducer(undefined, { type: "@@INIT" });
    const novoNiveis = [{ valor: 2, texto: "Básico" }];
    const state = filtrosReducer(initial, setFilters({ niveis: novoNiveis }));
    expect(state.niveis).toEqual(novoNiveis);
  });

  it("resetFilters retorna ao estado inicial", () => {
    const modificado = filtrosReducer(
      undefined,
      setFilters({ nomeEstudante: "Teste", nivelMinimo: 100 }),
    );
    const state = filtrosReducer(modificado, resetFilters());
    expect(state.nomeEstudante).toBe("");
    expect(state.nivelMinimo).toBe(0);
  });

  it("setFilters atualiza anosEscolares", () => {
    const initial = filtrosReducer(undefined, { type: "@@INIT" });
    const anos = [{ valor: 5, texto: "5" }];
    const state = filtrosReducer(initial, setFilters({ anosEscolares: anos }));
    expect(state.anosEscolares).toEqual(anos);
  });
});

// ─── nomeAplicacaoSlice ──────────────────────────────────────────────────────

describe("nomeAplicacaoSlice", () => {
  it("retorna estado inicial", () => {
    const state = nomeAplicacaoReducer(undefined, { type: "@@INIT" });
    expect(state.id).toBe(0);
    expect(state.nome).toBe("-");
    expect(state.tipoTai).toBe(true);
  });

  it("setNomeAplicacao substitui estado inteiro", () => {
    const payload = {
      id: 42,
      nome: "PSP 2025",
      tipoTai: false,
      dataInicioLote: "2025-03-01T00:00:00Z",
    };
    const state = nomeAplicacaoReducer(undefined, setNomeAplicacao(payload));
    expect(state.id).toBe(42);
    expect(state.nome).toBe("PSP 2025");
    expect(state.tipoTai).toBe(false);
    expect(state.dataInicioLote).toBe("2025-03-01T00:00:00Z");
  });

  it("setNomeAplicacao sobrescreve aplicação anterior", () => {
    const first = nomeAplicacaoReducer(
      undefined,
      setNomeAplicacao({
        id: 1,
        nome: "App1",
        tipoTai: true,
        dataInicioLote: "2024-01-01T00:00:00Z",
      }),
    );
    const second = nomeAplicacaoReducer(
      first,
      setNomeAplicacao({
        id: 2,
        nome: "App2",
        tipoTai: false,
        dataInicioLote: "2025-01-01T00:00:00Z",
      }),
    );
    expect(second.id).toBe(2);
    expect(second.nome).toBe("App2");
  });
});

// ─── tabSlice ────────────────────────────────────────────────────────────────

describe("tabSlice", () => {
  const estadoInicial = { activeTab: "1" };

  it("retorna estado inicial com aba '1'", () => {
    const state = tabReducer(undefined, { type: "@@INIT" });
    expect(state).toEqual(estadoInicial);
  });

  it("setActiveTab muda para aba '2'", () => {
    const state = tabReducer(estadoInicial, setActiveTab("2"));
    expect(state.activeTab).toBe("2");
  });

  it("setActiveTab muda para aba '5'", () => {
    const state = tabReducer(estadoInicial, setActiveTab("5"));
    expect(state.activeTab).toBe("5");
  });

  it("setActiveTab sobrescreve valor anterior", () => {
    const state1 = tabReducer(estadoInicial, setActiveTab("3"));
    const state2 = tabReducer(state1, setActiveTab("4"));
    expect(state2.activeTab).toBe("4");
  });
});
