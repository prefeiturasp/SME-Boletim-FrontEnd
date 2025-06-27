import React from "react";
import { render, screen } from "@testing-library/react";
import TooltipCustomizada from "./tooltipCustomizada";

describe("TooltipCustomizada Component", () => {
  const mockPayload = [
    { name: "Matemática", value: 75, color: "#ff0000" },
    { name: "Português", value: 90, color: "#00ff00" },
  ];
  const mockLabel = "2024";

  test("não renderiza quando inactive", () => {
    const { container } = render(<TooltipCustomizada active={false} />);
    expect(container.firstChild).toBeNull();
  });

  test("não renderiza com payload vazio", () => {
    const { container } = render(<TooltipCustomizada active payload={[]} />);
    expect(container.firstChild).toBeNull();
  });

  test("renderiza corretamente com dados válidos", () => {
    render(
      <TooltipCustomizada active payload={mockPayload} label={mockLabel} />
    );

    // Verifica label
    expect(screen.getByText(mockLabel)).toBeInTheDocument();

    // Verifica itens do payload
    mockPayload.forEach((entry) => {
      expect(
        screen.getByText(`${entry.name}: ${entry.value}%`)
      ).toBeInTheDocument();
    });
  });

  test("aplica classes CSS corretamente", () => {
    const { container } = render(
      <TooltipCustomizada active payload={mockPayload} label={mockLabel} />
    );

    expect(container.querySelector(".tooltip-customizada")).toBeInTheDocument();
    expect(container.querySelector(".tooltip-label")).toHaveTextContent(
      mockLabel
    );
    expect(container.querySelectorAll(".tooltip-item")).toHaveLength(
      mockPayload.length
    );
  });
});
