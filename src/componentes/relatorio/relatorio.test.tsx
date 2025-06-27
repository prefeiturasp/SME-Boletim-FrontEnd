import React from "react";
import { render, screen } from "@testing-library/react";
import DownloadRelatorio from "./relatorio";

// Mock do ícone do antd
jest.mock("@ant-design/icons", () => ({
  DownloadOutlined: () => <span>icon</span>,
}));

describe("DownloadRelatorio Component", () => {
  const nomeEscola = "Escola Exemplo";
  const downloadUrl = "http://example.com/download";

  test("renderiza com os props fornecidos", () => {
    render(
      <DownloadRelatorio nomeEscola={nomeEscola} downloadUrl={downloadUrl} />
    );
    expect(
      screen.getByText(/Você pode baixar os dados da/i)
    ).toBeInTheDocument();
    expect(screen.getByText(nomeEscola)).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", downloadUrl);
  });

  test("botão possui os atributos corretos", () => {
    render(
      <DownloadRelatorio nomeEscola={nomeEscola} downloadUrl={downloadUrl} />
    );
    const button = screen.getByRole("link");
    expect(button).toHaveAttribute("target", "_blank");
    expect(button).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("renderiza corretamente quando nomeEscola é null", () => {
    render(<DownloadRelatorio nomeEscola={null} downloadUrl={downloadUrl} />);
    expect(
      screen.getByText(/Você pode baixar os dados da/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", downloadUrl);
  });
});
