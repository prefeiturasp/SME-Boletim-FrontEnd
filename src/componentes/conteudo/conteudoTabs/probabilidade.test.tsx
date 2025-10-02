import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Probabilidade from "./probabilidade";
jest.mock("react-redux", () => {
  return {
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  };
});

jest.mock("../../../servicos", () => ({
  servicos: { get: jest.fn() },
}));

describe("Probabilidade", () => {
  const { useSelector, useDispatch } = require("react-redux");
  const { servicos } = require("../../../servicos");

  const fakeState = {
    escola: { escolaSelecionada: { ueId: 123, descricao: "Escola X" } },
    nomeAplicacao: { id: "APP-1" },
    tab: { activeTab: "4" },
    filtros: {
      turmas: [],
      componentesCurricularesRadio: [{ texto: "Matemática", valor: 1 }],
      anosEscolaresRadio: [{ texto: "5", valor: 5 }],
      niveisAbaPrincipal: [{ valor: 1 }, { valor: 2 }, { valor: 3 }, { valor: 4 }],
    },
    filtroCompleto: {
      componentesCurriculares: [
        { texto: "Matemática", valor: 1 },
        { texto: "Português", valor: 2 },
      ],
      anosEscolares: [
        { texto: "5", valor: 5 },
        { texto: "6", valor: 6 },
      ],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    
    (useSelector as jest.Mock).mockImplementation((sel: any) => sel(fakeState));

    
    (useDispatch as jest.Mock).mockReturnValue(jest.fn());

    
    (servicos.get as jest.Mock).mockImplementation((url: string) => {
      if (url.includes("/resultado-probabilidade/lista")) {
        return Promise.resolve({
          resultados: [
            {
              key: "1",
              codigoHabilidade: "HAB-01",
              habilidadeDescricao: "abcdefg",
              turmaDescricao: "5A",
              abaixoDoBasico: 10,
              basico: 20,
              adequado: 30,
              avancado: 40,
            },
          ],
          totalRegistros: 1,
        });
      }
      
      return Promise.resolve(new Uint8Array([1, 2, 3]));
    });
  });

  test("testa rota servico", async () => {
    render(<Probabilidade />);
    await waitFor(() => {
      expect(servicos.get).toHaveBeenCalledWith(
        expect.stringMatching(/\/resultado-probabilidade\/lista\?Pagina=1&TamanhoPagina=10/),
      );
    });
  });
});
