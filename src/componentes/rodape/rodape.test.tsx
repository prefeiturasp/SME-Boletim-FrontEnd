import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Rodape from "./rodape";

// Mock do ícone do antd
jest.mock("@ant-design/icons", () => ({
  UpOutlined: () => <span>icon</span>,
}));

describe("Rodape Component", () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  test("renderiza o botão de voltar ao início", () => {
    render(<Rodape />);
    expect(
      screen.getByRole("button", { name: /voltar para o início/i })
    ).toBeInTheDocument();
    expect(screen.getByText("icon")).toBeInTheDocument();
  });

  test("ao clicar no botão chama window.scrollTo", () => {
    render(<Rodape />);
    const button = screen.getByRole("button", {
      name: /voltar para o início/i,
    });
    fireEvent.click(button);
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });

  test("renderiza a versão corretamente", () => {
    render(<Rodape />);
    expect(screen.getByText(/Boletim: Versão 1.0/i)).toBeInTheDocument();
  });

  test("renderiza o texto de direitos reservados", () => {
    render(<Rodape />);
    expect(
      screen.getByText(/Todos os direitos reservados/i)
    ).toBeInTheDocument();
  });
});
