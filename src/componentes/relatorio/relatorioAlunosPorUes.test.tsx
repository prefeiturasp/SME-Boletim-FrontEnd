import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RelatorioAlunosPorUes from "./relatorioAlunosPorUes";
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

// Ajuste as props conforme o esperado pelo seu componente
const defaultProps = {
  aplicacaoSelecionada: 123,
  dreSelecionadaNome: "DRE Teste",
  dreSelecionada: 1
};

describe("RelatorioAlunosPorUes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
  it("renderiza botão principal", () => {
    render(<RelatorioAlunosPorUes {...defaultProps} />);
    expect(screen.getByRole("button", { name: /Baixar os dados/i })).toBeInTheDocument();
  });

  it("abre modal ao clicar no botão", () => {
    render(<RelatorioAlunosPorUes {...defaultProps} />);
    fireEvent.click(screen.getAllByText(/Baixar os dados/i)[1]);
    // fireEvent.click(screen.getByRole("button", { name: /Baixar os dados/i }));
    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByText(/Qual você gostaria de baixar primeiro/i)).toBeInTheDocument();
    expect(screen.getByText(/Dados de proficiência por alunos/i)).toBeInTheDocument();
    expect(screen.getByText(/Probabilidade de acerto por habilidade/i)).toBeInTheDocument();
  });

  it("seleciona opção e habilita botão de download", () => {
    render(<RelatorioAlunosPorUes {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /Baixar os dados/i }));
    fireEvent.click(screen.getByText(/Dados de proficiência por alunos/i)); // ajuste conforme opção real
    const downloadBtn = screen.getAllByRole("button", { name: /Baixar os dados/i })[1];
    expect(downloadBtn).not.toBeDisabled();
  });

  it("fecha modal ao clicar em cancelar", () => {
    render(<RelatorioAlunosPorUes {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /Baixar os dados/i }));
    const cancelarBtn = screen.getByText(/Cancelar/i);
    fireEvent.click(cancelarBtn);
    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("faz download de relatório de proficiência com sucesso", async () => {
        // Mock necessário para ambiente de teste
        // @ts-ignore
        if (!URL.createObjectURL) URL.createObjectURL = jest.fn(() => "blob:url");
        // @ts-ignore
        if (!URL.revokeObjectURL) URL.revokeObjectURL = jest.fn();

        const getMock = require("../../servicos").servicos.get;
        const notificationMock = require("antd").notification.open;
        getMock.mockResolvedValueOnce("test");

        render(<RelatorioAlunosPorUes {...defaultProps} />);
        fireEvent.click(screen.getByRole("button", { name: /Baixar os dados/i }));
        fireEvent.click(screen.getByText(/Dados de proficiência por alunos/i));
        const downloadBtn = screen.getAllByRole("button", { name: /Baixar os dados/i })[1];
        fireEvent.click(downloadBtn);

        await waitFor(() => {
            expect(getMock).toHaveBeenCalled();
            expect(notificationMock).toHaveBeenCalled();
            expect(URL.createObjectURL).toHaveBeenCalled();
        });
    });

    it("faz download de relatório de probabilidade com sucesso", async () => {
        // Mock necessário para ambiente de teste
        // @ts-ignore
        if (!URL.createObjectURL) URL.createObjectURL = jest.fn(() => "blob:url");
        // @ts-ignore
        if (!URL.revokeObjectURL) URL.revokeObjectURL = jest.fn();

        const getMock = require("../../servicos").servicos.get;
        const notificationMock = require("antd").notification.open;
        getMock.mockResolvedValueOnce("test");

        render(<RelatorioAlunosPorUes {...defaultProps} />);
        fireEvent.click(screen.getByRole("button", { name: /Baixar os dados/i }));
        fireEvent.click(screen.getByText(/Probabilidade de acerto por habilidade/i));
        const downloadBtn = screen.getAllByRole("button", { name: /Baixar os dados/i })[1];
        fireEvent.click(downloadBtn);

        await waitFor(() => {
            expect(getMock).toHaveBeenCalled();
            expect(notificationMock).toHaveBeenCalled();
            expect(URL.createObjectURL).toHaveBeenCalled();
        });
    });

    it("não faz download se getUrlDownload retorna null", () => {
       
        const getMock = require("../../servicos").servicos.get;  
        render(<RelatorioAlunosPorUes {...defaultProps} />);
        // Abre o modal
        fireEvent.click(screen.getByRole("button", { name: /Baixar os dados/i }));
        // Não seleciona nenhuma opção (tipoSelecionado continua null)
        // Clica no botão de download da modal
        const downloadBtn = screen.getAllByRole("button", { name: /Baixar os dados/i })[1];
        fireEvent.click(downloadBtn);
        // Não deve chamar o serviço de download
        expect(getMock).not.toHaveBeenCalled();
    });


    it("mostra notificação de erro ao falhar download", async () => {    
    render(<RelatorioAlunosPorUes {...defaultProps} />);
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

});