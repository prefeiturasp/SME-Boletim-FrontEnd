// src/pages/semAcesso.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SemAcesso from "./semAcesso";

describe("Componente SemAcesso", () => {
  beforeEach(() => {
    render(<SemAcesso />);
  });

  test("renderiza a imagem com src e alt corretos", () => {
    const image = screen.getByAltText("Acesso Negado");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/acesso_negado.svg");
  });

  test("renderiza o título correto", () => {
    const title = screen.getByRole("heading", { level: 2 });
    expect(title).toHaveTextContent(
      "Desculpe, você não está autorizado a acessar esta página"
    );
  });

  test("renderiza o subtítulo correto", () => {
    const subtitle = screen.getByText(
      /Para acessar, primeiro você precisa realizar o seu login com usuário e senha./i
    );
    expect(subtitle).toBeInTheDocument();
  });

  test("renderiza botão com texto e link corretos", () => {
    const button = screen.getByRole("link", { name: /fazer login/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute(
      "href",
      "https://serap.sme.prefeitura.sp.gov.br/"
    );
  });

  test("botão é clicável e possui foco acessível", async () => {
    const user = userEvent.setup();
    const button = screen.getByRole("link", { name: /fazer login/i });
    await user.click(button);
    expect(button).toHaveFocus();
  });
});
