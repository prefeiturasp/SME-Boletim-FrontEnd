import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Principal from "./principal";
import { Provider } from "react-redux";
import { store } from "../../../redux/store";
import "@testing-library/jest-dom";
import { servicos } from "../../../servicos";

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

jest.mock("../../../servicos", () => ({
  servicos: {
    get: jest.fn(),
  },
}));

jest.mock("../../grafico/desempenhoAno", () => () => (
  <div data-testid="grafico-ano" />
));

jest.mock("react-redux", () => {
  const actual = jest.requireActual("react-redux");
  return {
    ...actual,
    useSelector: jest.fn(),
    useDispatch: () => jest.fn(),
  };
});

jest.mock("antd", () => {
  const actual = jest.requireActual("antd");
  return {
    ...actual,
    notification: { open: jest.fn() },
    Modal: { confirm: jest.fn() },
    Spin: actual.Spin,
    Row: actual.Row,
    Col: actual.Col,
    Button: actual.Button,
  };
});

const estadoBase = {
  escola: { escolaSelecionada: { ueId: "UE1", descricao: "Escola Teste" } },
  nomeAplicacao: { id: "APP1" },
  tab: { activeTab: "1" },
  filtros: {
    anosEscolares: [],
    componentesCurriculares: [],
    niveisAbaPrincipal: [],
  },
};

afterEach(() => {
  jest.clearAllMocks();
});

describe("Principal Component", () => {
  const mockDados = [
    {
      key: "1",
      componente: "Matemática",
      abaixoBasico: "10",
      basico: "20",
      adequado: "30",
      avancado: "40",
      total: 100,
      mediaProficiencia: 75,
    },
  ];

  it("deve exibir mensagem de carregamento enquanto os dados são buscados", async () => {
    const { useSelector } = jest.requireMock("react-redux");
    useSelector.mockImplementation((selector: any) => selector(estadoBase));

    const getSpy = jest.spyOn(servicos, "get").mockResolvedValueOnce([]);
    render(
      <Provider store={store}>
        <Principal />
      </Provider>
    );

    expect(
      screen.getByText("Não encontramos dados para a UE selecionada")
    ).toBeInTheDocument();

    getSpy.mockRestore();
  });

  it("mostra o texto introdutório da seção", () => {
    const { useSelector } = jest.requireMock("react-redux");
    useSelector.mockImplementation((selector: any) => selector(estadoBase));
    render(
      <Provider store={store}>
        <Principal />
      </Provider>
    );

    expect(
      screen.getByText(/Esta seção apresenta uma tabela e um gráfico/i)
    ).toBeInTheDocument();
  });

  it("tem o botão 'Baixar os dados'", () => {
    const { useSelector } = jest.requireMock("react-redux");
    useSelector.mockImplementation((selector: any) => selector(estadoBase));
    render(
      <Provider store={store}>
        <Principal />
      </Provider>
    );

    expect(
      screen.getByRole("button", { name: /Baixar os dados/i })
    ).toBeInTheDocument();
  });

  it("mostra o texto da seção de download", () => {
    const { useSelector } = jest.requireMock("react-redux");
    useSelector.mockImplementation((selector: any) => selector(estadoBase));
    render(
      <Provider store={store}>
        <Principal />
      </Provider>
    );

    expect(
      screen.getByText(/Você pode baixar os dados da/i)
    ).toBeInTheDocument();
  });

  it("não mostra o gráfico quando não há dados", async () => {
    const { useSelector } = jest.requireMock("react-redux");
    useSelector.mockImplementation((selector: any) => selector(estadoBase));
    render(
      <Provider store={store}>
        <Principal />
      </Provider>
    );

    expect(screen.queryByTestId("grafico-ano")).toBeNull();
  });


  it("aciona o download ao clicar no botão", async () => {
    const { useSelector } = jest.requireMock("react-redux");
    useSelector.mockImplementation((selector: any) => selector(estadoBase));
    // Primeiro fetch: dados da tabela (array)
    jest.spyOn(servicos, "get")
      .mockResolvedValueOnce([]) // para buscarAbrangencias
      .mockResolvedValueOnce(new Blob(["test"], { type: "application/vnd.ms-excel" })); // para download

    // Mock URL.createObjectURL para não quebrar no JSDOM
    global.URL.createObjectURL = jest.fn(() => "blob:http://fake-url");

    render(<Principal />);

    const botao = screen.getByRole("button", { name: /Baixar os dados/i });
    botao.click();

    await waitFor(() => {
      expect(servicos.get).toHaveBeenCalledWith(
        "/api/boletimescolar/download/APP1/UE1",
        { responseType: "blob" }
      );
      expect(require("antd").notification.open).toHaveBeenCalled();
    });
  });

  it("mostra notificação de erro ao falhar o download", async () => {
    const { useSelector } = jest.requireMock("react-redux");
    useSelector.mockImplementation((selector: any) => selector(estadoBase));
    jest.spyOn(servicos, "get").mockRejectedValueOnce(new Error("erro"));

    render(<Principal />);

    const botao = screen.getByRole("button", { name: /Baixar os dados/i });
    botao.click();

    await waitFor(() => {
      expect(require("antd").notification.open).toHaveBeenCalledWith(
        expect.objectContaining({
          key: "relatorioPrincipalErro",
        })
      );
    });
  });

  it("mostra o gráfico quando há dados", async () => {
    const { useSelector } = jest.requireMock("react-redux");
    useSelector.mockImplementation((selector: any) => selector(estadoBase));
    jest.spyOn(servicos, "get").mockResolvedValueOnce([{ componente: "Matemática" }]);

    render(<Principal />);

    await waitFor(() => {
      expect(screen.getByTestId("grafico-ano")).toBeInTheDocument();
    });
  });


});
