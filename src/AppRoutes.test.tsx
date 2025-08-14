// AppRoutes.test.tsx
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import { act } from "react";
import AppRoutes from "./AppRoutes";

// ---- Mocks dos componentes de página/layout para facilitar asserções ----
jest.mock("./componentes/cabecalho/cabecalho", () => () => <div>Cabecalho</div>);
jest.mock("./componentes/escolherEscola/escolherEscola", () => () => <div>EscolherEscola</div>);
jest.mock("./componentes/conteudo/conteudo", () => () => <div>Conteudo</div>);
jest.mock("./componentes/rodape/rodape", () => () => <div>Rodape</div>);

jest.mock("./pages/auth", () => () => <div>Auth Page</div>);
jest.mock("./pages/semAcesso", () => () => <div>Sem Acesso Page</div>);
jest.mock("./pages/ues", () => () => <div>Ues Page</div>);
jest.mock("./pages/dres", () => () => <div>Dres Page</div>);

// ---- Helper: store mínimo compatível com react-redux ----
function makeStore(isAuthenticated: boolean) {
  const state = { auth: { isAuthenticated } };
  return {
    getState: () => state,
    dispatch: jest.fn(),
    subscribe: jest.fn(() => jest.fn()),
    // @ts-expect-error reducer não é usado nesses testes
    replaceReducer: jest.fn(),
    // @ts-expect-error método opcional
    [Symbol.observable]: undefined,
  };
}

function renderWithProviders(
  ui: React.ReactElement,
  {
    initialEntries = ["/"],
    isAuthenticated = false,
  }: { initialEntries?: string[]; isAuthenticated?: boolean } = {}
) {
  const store = makeStore(isAuthenticated);
  return render(
    <Provider store={store as any}>
      <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
    </Provider>
  );
}

describe("AppRoutes + PrivateRoute", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("mostra loader 'Carregando...' inicialmente no PrivateRoute", () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ["/"], isAuthenticated: true });

    // Antes do timeout interno de 100ms
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  test("redireciona para /sem-acesso quando não autenticado (rota /)", async () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ["/"], isAuthenticated: false });

    // Avança o timer de 100ms do PrivateRoute
    await act(async () => {
      jest.advanceTimersByTime(110);
    });

    // Como Navigate ocorreu, devemos ver a página pública
    expect(screen.getByText("Sem Acesso Page")).toBeInTheDocument();
  });

  test("renderiza AppLayout quando autenticado (rota /)", async () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ["/"], isAuthenticated: true });

    await act(async () => {
      jest.advanceTimersByTime(110);
    });

    // Componentes do layout privado visíveis
    expect(screen.getByText("Cabecalho")).toBeInTheDocument();
    expect(screen.getByText("EscolherEscola")).toBeInTheDocument();
    expect(screen.getByText("Conteudo")).toBeInTheDocument();
    expect(screen.getByText("Rodape")).toBeInTheDocument();
  });

  test("rota pública /validar sempre renderiza Auth", async () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ["/validar"], isAuthenticated: false });

    // Nem precisa esperar timer, pois rota pública não passa pelo PrivateRoute
    expect(screen.getByText("Auth Page")).toBeInTheDocument();
  });

  test("rota pública /sem-acesso sempre renderiza", async () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ["/sem-acesso"], isAuthenticated: false });

    expect(screen.getByText("Sem Acesso Page")).toBeInTheDocument();
  });

  test.each([
    ["/ues", "Ues Page"],
    ["/dres", "Dres Page"],
  ])("rota privada %s renderiza quando autenticado", async (path, expected) => {
    renderWithProviders(<AppRoutes />, { initialEntries: [path], isAuthenticated: true });

    await act(async () => {
      jest.advanceTimersByTime(110);
    });

    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  test.each([
    ["/ues"],
    ["/dres"],
  ])("rota privada %s redireciona quando NÃO autenticado", async (path) => {
    renderWithProviders(<AppRoutes />, { initialEntries: [path], isAuthenticated: false });

    await act(async () => {
      jest.advanceTimersByTime(110);
    });

    expect(screen.getByText("Sem Acesso Page")).toBeInTheDocument();
  });
});
