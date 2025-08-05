import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { useSelector } from "react-redux";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(),
}));

jest.mock("./componentes/cabecalho/cabecalho", () => () => <div>Mock Cabecalho</div>);
jest.mock("./componentes/escolherEscola/escolherEscola", () => () => <div>Mock Escolher Escola</div>);
jest.mock("./componentes/conteudo/conteudo", () => () => <div>Mock Conteudo</div>);
jest.mock("./componentes/rodape/rodape", () => () => <div>Mock Rodape</div>);
jest.mock("./pages/auth", () => () => <div>Mock Auth</div>);
jest.mock("./pages/semAcesso", () => () => <div>Mock Sem Acesso</div>);
jest.mock("./pages/ues", () => () => <div>Mock UES</div>);

describe("AppRoutes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve redirecionar para /sem-acesso se não estiver autenticado", async () => {
    (useSelector as unknown  as jest.Mock).mockImplementation(() => false);

    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText("Carregando...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Mock Sem Acesso")).toBeInTheDocument();
    });
  });

  it("deve renderizar layout completo quando autenticado", async () => {
    (useSelector as unknown as jest.Mock).mockImplementation(() => true);

    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText("Carregando...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Mock Cabecalho")).toBeInTheDocument();
      expect(screen.getByText("Mock Escolher Escola")).toBeInTheDocument();
      expect(screen.getByText("Mock Conteudo")).toBeInTheDocument();
      expect(screen.getByText("Mock Rodape")).toBeInTheDocument();
    });
  });

  it("deve renderizar a página de autenticação na rota /validar", () => {
    (useSelector as unknown as jest.Mock).mockImplementation(() => false);

    render(
      <MemoryRouter initialEntries={["/validar"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText("Mock Auth")).toBeInTheDocument();
  });

  it("deve renderizar a rota /ues quando autenticado", async () => {
    (useSelector as unknown as jest.Mock).mockImplementation(() => true);

    render(
      <MemoryRouter initialEntries={["/ues"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText("Carregando...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Mock UES")).toBeInTheDocument();
    });
  });
});
