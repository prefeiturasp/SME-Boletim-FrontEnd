import authReducer, { setUserLogged, logout } from "./authSlice";

describe("authSlice", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.useFakeTimers().setSystemTime(new Date("2025-01-01T10:00:00Z"));
    jest.resetModules();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("deve inicializar corretamente quando há token válido", async () => {
    localStorage.setItem("authToken", "123abc");
    localStorage.setItem(
      "authExpiresAt",
      new Date("2025-12-01T10:00:00Z").toISOString()
    );
    localStorage.setItem("tipoPerfil", "2");

    const { default: reducer } = await import("./authSlice");
    const state = reducer(undefined, { type: "@@INIT" });

    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe("123abc");
    expect(state.tipoPerfil).toBe(2);
  });

  it("deve inicializar como não autenticado se o token expirou", async () => {
    localStorage.setItem("authToken", "abc");
    localStorage.setItem(
      "authExpiresAt",
      new Date("2020-01-01T00:00:00Z").toISOString()
    );

    const { default: reducer } = await import("./authSlice");
    const state = reducer(undefined, { type: "@@INIT" });

    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBe("abc");
  });

  it("deve armazenar corretamente o usuário logado", () => {
    const estadoInicial = {
      isAuthenticated: false,
      token: null,
      dataHoraExpiracao: null,
      tipoPerfil: null,
    };

    const payload = {
      token: "abc123",
      dataHoraExpiracao: "2025-12-01T10:00:00Z",
      tipoPerfil: 3,
    };

    const novoEstado = authReducer(estadoInicial, setUserLogged(payload));

    expect(novoEstado.isAuthenticated).toBe(true);
    expect(novoEstado.token).toBe("abc123");
    expect(novoEstado.tipoPerfil).toBe(3);
    expect(localStorage.getItem("authToken")).toBe("abc123");
    expect(localStorage.getItem("tipoPerfil")).toBe("3");
  });

  it("deve limpar o estado e o localStorage ao fazer logout", () => {
    localStorage.setItem("authToken", "abc123");
    localStorage.setItem("authExpiresAt", "2025-12-01T10:00:00Z");
    localStorage.setItem("tipoPerfil", "3");

    const estadoInicial = {
      isAuthenticated: true,
      token: "abc123",
      dataHoraExpiracao: "2025-12-01T10:00:00Z",
      tipoPerfil: 3,
    };

    const novoEstado = authReducer(estadoInicial, logout());

    expect(novoEstado.isAuthenticated).toBe(false);
    expect(novoEstado.token).toBeNull();
    expect(novoEstado.tipoPerfil).toBeNull();
    expect(localStorage.getItem("authToken")).toBeNull();
    expect(localStorage.getItem("tipoPerfil")).toBeNull();
  });
});
