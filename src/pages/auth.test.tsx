import { render, screen, waitFor } from "@testing-library/react";
import Auth from "./auth";
import { servicos } from "../servicos";
import * as reactRouterDom from "react-router-dom";

const mockDispatch = jest.fn();

jest.mock("react-redux", () => {
  const originalModule = jest.requireActual("react-redux");
  return {
    __esModule: true,
    ...originalModule,
    useDispatch: () => mockDispatch,
  };
});

jest.mock("../servicos", () => ({
  servicos: {
    post: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
const mockUseSearchParams = jest.fn();

jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    useNavigate: () => mockNavigate,
    useSearchParams: () => mockUseSearchParams(),
  };
});

import * as authSlice from "../redux/slices/authSlice";

describe("Componente Auth", () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    jest.clearAllMocks();
    localStorage.clear();
    mockNavigate.mockReset();
  });

  function renderComponent() {
    return render(<Auth />, { wrapper: reactRouterDom.BrowserRouter });
  }

  test("Exibe texto inicial", () => {
    mockUseSearchParams.mockReturnValue([{ get: () => null }]);
    renderComponent();
    expect(screen.getByText("Autenticando...")).toBeInTheDocument();
  });

  test("Usa token válido no localStorage e navega conforme tipoPerfil", async () => {
    const futureDate = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    localStorage.setItem("authToken", "token_ok");
    localStorage.setItem("authExpiresAt", futureDate);
    localStorage.setItem("tipoPerfil", "2");

    mockUseSearchParams.mockReturnValue([{ get: () => null }]);

    renderComponent();

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        authSlice.setUserLogged({
          token: "token_ok",
          dataHoraExpiracao: futureDate,
          tipoPerfil: "2",
        })
      );
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  test("Token expirado deve disparar logout e navegar para /sem-acesso", async () => {
    const pastDate = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    localStorage.setItem("authToken", "token_expirado");
    localStorage.setItem("authExpiresAt", pastDate);
    localStorage.setItem("tipoPerfil", "2");

    mockUseSearchParams.mockReturnValue([{ get: () => null }]);

    renderComponent();

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(authSlice.logout());
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/sem-acesso");
    });
  });

  test("Sem token, com código válido autentica e navega", async () => {
    localStorage.clear();
    const codigo = "codigo123";
    mockUseSearchParams.mockReturnValue([
      { get: (key: string) => (key === "codigo" ? codigo : null) },
    ]);

    (servicos.post as jest.Mock).mockResolvedValue({
      token: "token_post",
      dataHoraExpiracao: new Date(Date.now() + 3600000).toISOString(),
      tipoPerfil: 4,
    });

    renderComponent();

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        authSlice.setUserLogged({
          token: "token_post",
          dataHoraExpiracao: expect.any(String),
          tipoPerfil: 4,
        })
      );
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/ues");
    });
  });

  test("Autenticação com código inválido navega para /sem-acesso", async () => {
    localStorage.clear();
    const codigo = "codigo_invalido";
    mockUseSearchParams.mockReturnValue([
      { get: (key: string) => (key === "codigo" ? codigo : null) },
    ]);

    (servicos.post as jest.Mock).mockRejectedValue(new Error("Invalid code"));

    renderComponent();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/sem-acesso");
    });

    expect(mockDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: authSlice.setUserLogged.type,
      })
    );
  });

  test("Sem token e sem código navega para /sem-acesso sem dispatch", async () => {
    localStorage.clear();
    mockUseSearchParams.mockReturnValue([{ get: () => null }]);

    renderComponent();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/sem-acesso");
    });

    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
