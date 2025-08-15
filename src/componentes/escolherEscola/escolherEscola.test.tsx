import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EscolherEscola from "./escolherEscola";

jest.mock("react-redux", () => ({
  useDispatch: () => jest.fn(),
  useSelector: (sel: any) =>
    sel({
      escola: { escolaSelecionada: { ueId: 1, descricao: "Minha Escola" } },
      nomeAplicacao: { id: 1 },
      filtroCompleto: {},
      filtros: {
        niveisAbaPrincipal: [],
        anosEscolares: [],
        componentesCurriculares: [],
        niveis: [],
        turmas: [],
        nomeEstudante: "",
        eolEstudante: "",
        nivelMinimo: 0,
        nivelMinimoEscolhido: 0,
        nivelMaximo: 0,
        nivelMaximoEscolhido: 0,
      },
      tab: { activeTab: "1" },
    }),
}));

jest.mock("react-router-dom", () => ({
  useLocation: () => ({ search: "" }),
}));

jest.mock("../../servicos", () => ({
  servicos: {
    get: jest.fn().mockImplementation((url: string) => {
      if (url === "/api/abrangencia") {
        // Promessa resolvida (assíncrona) -> precisa de await nos testes
        return Promise.resolve([{ ueId: 1, descricao: "Minha Escola" }]);
      }
      if (url.startsWith("/api/boletimescolar/")) {
        return Promise.resolve({
          niveis: [],
          anosEscolares: [],
          componentesCurriculares: [],
          nivelMinimo: 0,
          nivelMaximo: 0,
        });
      }
      return Promise.resolve({});
    }),
  },
}));

jest.mock("../filtro/filtroLateral", () => (props: any) => (
  <div data-testid="filtro-lateral" data-open={props.open ? "true" : "false"}>
    Filtro lateral
  </div>
));

test("mostra o ícone/botão de filtrar", async () => {
  render(<EscolherEscola />);
  // aguarda os updates assíncronos do useEffect
  const botaoFiltrar = await screen.findByAltText(/Filtrar/i);
  expect(botaoFiltrar).toBeInTheDocument();
});

test("mostra o nome da escola vindo do Redux", async () => {
  render(<EscolherEscola />);
  // usa findBy* para esperar a conclusão do update assíncrono
  expect(await screen.findByText("Minha Escola")).toBeInTheDocument();
});

test("abre o filtro ao clicar no ícone 'Filtrar'", async () => {
  render(<EscolherEscola />);

  // garante que o painel está presente antes
  const painel = screen.getByTestId("filtro-lateral");
  expect(painel).toHaveAttribute("data-open", "false");

  const botaoFiltrar = await screen.findByAltText(/Filtrar/i);
  fireEvent.click(botaoFiltrar);

  // espera a mudança de estado refletir no DOM
  await waitFor(() =>
    expect(screen.getByTestId("filtro-lateral")).toHaveAttribute("data-open", "true")
  );
});
