import React from "react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { render, screen, act } from "@testing-library/react";
import AppRoutes from "./AppRoutes";

jest.mock("./componentes/cabecalho/cabecalho", () => () => <div>Cabecalho</div>);
jest.mock("./componentes/escolherEscola/escolherEscola", () => () => <div>EscolherEscola</div>);
jest.mock("./componentes/conteudo/conteudo", () => () => <div>Conteudo</div>);
jest.mock("./componentes/rodape/rodape", () => () => <div>Rodape</div>);
jest.mock("./pages/auth", () => () => <div>Auth Page</div>);
jest.mock("./pages/semAcesso", () => () => <div>Sem Acesso Page</div>);
jest.mock("./pages/ues", () => () => <div>Ues Page</div>);
jest.mock("./pages/dres", () => () => <div>Dres Page</div>);

function makeStore(isAuthenticated: boolean) {
  const state = { auth: { isAuthenticated } };
  return {
    getState: () => state,
    dispatch: jest.fn(),
    subscribe: jest.fn(() => jest.fn()),
  } as any;
}

function renderWithProviders(
  ui: React.ReactElement,
  { initialEntries = ["/"], isAuthenticated = false }: { initialEntries?: string[]; isAuthenticated?: boolean } = {}
) {
  const store = makeStore(isAuthenticated);
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
    </Provider>
  );
}

const flushTimers = async (ms = 110) => {
  await act(async () => {
    jest.advanceTimersByTime(ms);
  });
};

describe("AppRoutes + PrivateRoute", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("mostra loader 'Carregando...' inicialmente no PrivateRoute", async () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ["/"], isAuthenticated: true });
    expect(screen.getByText("Carregando...")).toBeInTheDocument();

    await flushTimers();
  });

  test("redireciona para /sem-acesso quando não autenticado (rota /)", async () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ["/"], isAuthenticated: false });
    await flushTimers();
    expect(screen.getByText("Sem Acesso Page")).toBeInTheDocument();
  });

  test("renderiza AppLayout quando autenticado (rota /)", async () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ["/"], isAuthenticated: true });
    await flushTimers();
    expect(screen.getByText("Cabecalho")).toBeInTheDocument();
    expect(screen.getByText("EscolherEscola")).toBeInTheDocument();
    expect(screen.getByText("Conteudo")).toBeInTheDocument();
    expect(screen.getByText("Rodape")).toBeInTheDocument();
  });

  test("rota pública /validar sempre renderiza Auth", () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ["/validar"], isAuthenticated: false });
    expect(screen.getByText("Auth Page")).toBeInTheDocument();
  });

  test("rota pública /sem-acesso sempre renderiza", () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ["/sem-acesso"], isAuthenticated: false });
    expect(screen.getByText("Sem Acesso Page")).toBeInTheDocument();
  });

  test.each([
    ["/ues", "Ues Page"],
    ["/dres", "Dres Page"],
  ])("rota privada %s renderiza quando autenticado", async (path, expected) => {
    renderWithProviders(<AppRoutes />, { initialEntries: [path], isAuthenticated: true });
    await flushTimers();
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  test.each([["/ues"], ["/dres"]])("rota privada %s redireciona quando NÃO autenticado", async (path) => {
    renderWithProviders(<AppRoutes />, { initialEntries: [path], isAuthenticated: false });
    await flushTimers();
    expect(screen.getByText("Sem Acesso Page")).toBeInTheDocument();
  });
});
