import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RelatorioAlunosPorDres from "./relatorioAlunosPorDres";
const getMock = require("../../servicos").servicos.get;
const notificationMock = require("antd").notification.open;

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

jest.mock("../../servicos", () => ({
  servicos: {
    get: jest.fn(),
  },
}));

jest.mock("antd", () => {
  const antd = jest.requireActual("antd");
  return {
    ...antd,
    notification: {
      open: jest.fn(),
    },
    Modal: (props: any) => props.open ? <div data-testid="modal">{props.children}</div> : null,
    Button: (props: any) => (
      <button
        onClick={props.onClick}
        disabled={props.disabled}
        data-testid={props["data-testid"]}
        className={props.className}
      >
        {props.children}
      </button>
    ),
  };
});

jest.mock("@ant-design/icons", () => ({
  CheckCircleOutlined: () => <span data-testid="check-icon" />,
  InfoCircleOutlined: () => <span data-testid="info-icon" />,
}));

jest.mock("../../assets/icon-formado.svg", () => "iconeFormado");
jest.mock("../../assets/icon-porcentagem.svg", () => "iconePorce");
jest.mock("../../assets/icon-downloadSeta.svg", () => "iconeDownload");

const defaultProps = {
  aplicacaoSelecionada: 123,
  dreSelecionadaNome: "DRE Teste",
};

describe("RelatorioAlunosPorDres", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza botão principal", () => {
    render(<RelatorioAlunosPorDres {...defaultProps} />);
    expect(screen.getAllByText(/Baixar os dados/i)[1]).toBeInTheDocument();
  });
  
  it("abre modal ao clicar no botão", () => {
    render(<RelatorioAlunosPorDres {...defaultProps} />);
    fireEvent.click(screen.getAllByText(/Baixar os dados/i)[1]);
    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByText(/Qual você gostaria de baixar primeiro/i)).toBeInTheDocument();
    expect(screen.getByText(/Dados de proficiência por alunos/i)).toBeInTheDocument();
    expect(screen.getByText(/Probabilidade de acerto por habilidade/i)).toBeInTheDocument();
  });

  it("seleciona opção e habilita botão de download", () => {
    render(<RelatorioAlunosPorDres {...defaultProps} />);
    fireEvent.click(screen.getAllByText(/Baixar os dados/i)[1]);
    fireEvent.click(screen.getByText(/Dados de proficiência por alunos/i));
    const downloadBtn = screen.getAllByText(/Baixar os dados/i)[1].closest("button");
    expect(downloadBtn).not.toBeDisabled();
  });

  it("faz download de relatório de proficiência com sucesso", async () => {
        // Mock necessário para ambiente de teste
        // @ts-ignore
        if (!URL.createObjectURL) URL.createObjectURL = jest.fn(() => "blob:url");
        // @ts-ignore
        if (!URL.revokeObjectURL) URL.revokeObjectURL = jest.fn();

        getMock.mockResolvedValueOnce("test");
        render(<RelatorioAlunosPorDres {...defaultProps} />);
        fireEvent.click(screen.getAllByText(/Baixar os dados/i)[1]);
        fireEvent.click(screen.getByText(/Dados de proficiência por alunos/i));

        // Clique no botão de download da modal
        const downloadBtn = screen.getAllByRole("button", { name: /Baixar os dados/i })[1];
        fireEvent.click(downloadBtn);

        await waitFor(() => {
            expect(getMock).toHaveBeenCalledWith("/api/BoletimEscolar/download-sme/123", { responseType: "blob" });
            expect(notificationMock).toHaveBeenCalled();
            expect(URL.createObjectURL).toHaveBeenCalled();
        });
    });  

  it("mostra notificação de erro ao falhar download", async () => {    
    render(<RelatorioAlunosPorDres {...defaultProps} />);
    fireEvent.click(screen.getAllByText(/Baixar os dados/i)[1]);
    fireEvent.click(screen.getByText(/Probabilidade de acerto por habilidade/i));

    getMock.mockRejectedValueOnce(new Error("erro"));
    const downloadBtns = screen.getAllByRole("button", { name: /Baixar os dados/i });
    fireEvent.click(downloadBtns[1]);
    
    await waitFor(() => {
      expect(notificationMock).toHaveBeenCalledWith(
        expect.objectContaining({
          key: "relatorioPrincipalErro",
          message: expect.anything(),
        })
      );
    });
  });

  
  it("fecha modal ao clicar em cancelar", () => {
        render(<RelatorioAlunosPorDres {...defaultProps} />);
        fireEvent.click(screen.getAllByText(/Baixar os dados/i)[1]);        
        // Busca pelo texto "Cancelar"
        const cancelarBtn = screen.getByText("Cancelar");
        expect(cancelarBtn).toBeInTheDocument();
        fireEvent.click(cancelarBtn);
        expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });

    it("desabilita o botão de download enquanto está carregando", async () => {
        // Mock necessário para ambiente de teste
        // @ts-ignore
        if (!URL.createObjectURL) URL.createObjectURL = jest.fn(() => "blob:url");
        // @ts-ignore
        if (!URL.revokeObjectURL) URL.revokeObjectURL = jest.fn();

        const getMock = require("../../servicos").servicos.get;
        // Não resolve a promise para simular loading
        getMock.mockImplementation(() => new Promise(() => {}));

        render(<RelatorioAlunosPorDres {...defaultProps} />);
        fireEvent.click(screen.getAllByText(/Baixar os dados/i)[1]);
        fireEvent.click(screen.getByText(/Dados de proficiência por alunos/i));
        const downloadBtn = screen.getAllByRole("button", { name: /Baixar os dados/i })[1];
        fireEvent.click(downloadBtn);

        // O botão deve ficar desabilitado enquanto está carregando
        expect(downloadBtn).toBeDisabled();
    });

    it("desabilita o botão de download quando nenhuma opção está selecionada", () => {
        render(<RelatorioAlunosPorDres {...defaultProps} />);
        fireEvent.click(screen.getAllByText(/Baixar os dados/i)[1]);
        // Não seleciona nenhuma opção
        const downloadBtn = screen.getAllByRole("button", { name: /Baixar os dados/i })[1];
        expect(downloadBtn).toBeDisabled();
    });

});