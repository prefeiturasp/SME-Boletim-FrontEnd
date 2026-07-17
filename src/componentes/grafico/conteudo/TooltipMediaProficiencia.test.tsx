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
      <TooltipMediaProficiencia
        active={false}
        payload={payloadBasico}
        label="BUTANTÃ"
        showPercentage={false}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("não renderiza nada quando payload está vazio", () => {
    const { container } = render(
      <TooltipMediaProficiencia
        active={true}
        payload={[]}
        label="BUTANTÃ"
        showPercentage={false}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("exibe o label e os itens mapeados quando active é verdadeiro", () => {
    render(
      <TooltipMediaProficiencia
        active={true}
        payload={payloadBasico}
        label="BUTANTÃ"
        showPercentage={false}
      />,
    );

    expect(screen.getByText("BUTANTÃ")).toBeInTheDocument();
    const items = screen.getAllByText((content, element) => {
      return element?.textContent?.includes("Língua Portuguesa") &&
        element?.textContent?.includes("123,45")
        ? true
        : false;
    });
    expect(items.length).toBeGreaterThan(0);
    const matemativaItems = screen.getAllByText((content, element) => {
      return element?.textContent?.includes("Matemática") &&
        element?.textContent?.includes("67,89")
        ? true
        : false;
    });
    expect(matemativaItems.length).toBeGreaterThan(0);
  });

  it("mostra o símbolo de porcentagem quando showPercentage=true", () => {
    render(
      <TooltipMediaProficiencia
        active={true}
        payload={payloadBasico}
        label="DRE X"
        showPercentage={true}
      />,
    );

    const portuItems = screen.getAllByText((content, element) => {
      return element?.textContent?.includes("Língua Portuguesa") &&
        element?.textContent?.includes("123,45") &&
        element?.textContent?.includes("%")
        ? true
        : false;
    });
    expect(portuItems.length).toBeGreaterThan(0);
    const matItems = screen.getAllByText((content, element) => {
      return element?.textContent?.includes("Matemática") &&
        element?.textContent?.includes("67,89") &&
        element?.textContent?.includes("%")
        ? true
        : false;
    });
    expect(matItems.length).toBeGreaterThan(0);
  });

  it("não mostra porcentagem quando showPercentage=false", () => {
    render(
      <TooltipMediaProficiencia
        active={true}
        payload={payloadBasico}
        label="DRE Y"
        showPercentage={false}
      />,
    );

    const semPorcentItems = screen.getAllByText((content, element) => {
      return element?.textContent?.includes("Língua Portuguesa") &&
        element?.textContent?.includes("123,45")
        ? true
        : false;
    });
    expect(semPorcentItems.length).toBeGreaterThan(0);
    const comPorcentItems = screen.queryAllByText((content, element) => {
      return element?.textContent?.includes("Língua Portuguesa") &&
        element?.textContent?.includes("123,45%")
        ? true
        : false;
    });
    expect(comPorcentItems.length).toBe(0);
  });

  it("usa o nome original quando a chave não existe no mapa", () => {
    const payloadDesconhecido = [{ name: "ciencias", value: 50 }];
    render(
      <TooltipMediaProficiencia
        active={true}
        payload={payloadDesconhecido}
        label="DRE Z"
        showPercentage={false}
      />,
    );

    expect(screen.getByText("ciencias: 50")).toBeInTheDocument();
  });
});
