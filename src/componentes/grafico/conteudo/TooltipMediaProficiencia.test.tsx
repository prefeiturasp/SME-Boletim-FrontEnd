// TooltipMediaProficiencia.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import TooltipMediaProficiencia from "./tooltipMediaProficiencia";

describe("TooltipMediaProficiencia", () => {
  const payloadBasico = [
    { name: "portugues", value: 123.45 },
    { name: "matematica", value: 67.89 },
  ];

  it("não renderiza nada quando active é falso", () => {
    const { container } = render(
      <TooltipMediaProficiencia active={false} payload={payloadBasico} label="BUTANTÃ" showPercentage={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("não renderiza nada quando payload está vazio", () => {
    const { container } = render(
      <TooltipMediaProficiencia active={true} payload={[]} label="BUTANTÃ" showPercentage={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("exibe o label e os itens mapeados quando active é verdadeiro", () => {
    render(
      <TooltipMediaProficiencia active={true} payload={payloadBasico} label="BUTANTÃ" showPercentage={false} />
    );

    expect(screen.getByText("BUTANTÃ")).toBeInTheDocument();
    expect(screen.getByText(/Língua Portuguesa: 123\.45$/)).toBeInTheDocument();
    expect(screen.getByText(/Matemática: 67\.89$/)).toBeInTheDocument();
  });

  it("mostra o símbolo de porcentagem quando showPercentage=true", () => {
    render(
      <TooltipMediaProficiencia active={true} payload={payloadBasico} label="DRE X" showPercentage={true} />
    );

    expect(screen.getByText(/Língua Portuguesa: 123\.45%$/)).toBeInTheDocument();
    expect(screen.getByText(/Matemática: 67\.89%$/)).toBeInTheDocument();
  });

  it("não mostra porcentagem quando showPercentage=false", () => {
    render(
      <TooltipMediaProficiencia active={true} payload={payloadBasico} label="DRE Y" showPercentage={false} />
    );

    expect(screen.getByText(/Língua Portuguesa: 123\.45$/)).toBeInTheDocument();
    expect(screen.queryByText(/Língua Portuguesa: 123\.45%$/)).not.toBeInTheDocument();
  });

  it("usa o nome original quando a chave não existe no mapa", () => {
    const payloadDesconhecido = [{ name: "ciencias", value: 50 }];
    render(
      <TooltipMediaProficiencia active={true} payload={payloadDesconhecido} label="DRE Z" showPercentage={false} />
    );

    expect(screen.getByText("ciencias: 50")).toBeInTheDocument();
  });
});
