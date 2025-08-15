import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DesempenhoPorMateria from "./desempenhoPorMateria";
import { ConverteDados, ConverteDadosDre } from "./desempenhoPorMateria";

const dados = [
  {
    disciplinaNome: "Matemática",
    uesPorNiveisProficiencia: [
      { codigo: 1, quantidadeUes: 2 },
      { codigo: 2, quantidadeUes: 3 },
      { codigo: 3, quantidadeUes: 1 },
      { codigo: 4, quantidadeUes: 0 },
    ],
  },
];

describe("ConverteDados (UEs)", () => {
  test("mapeia códigos 1..4 e preenche ausentes com 0", () => {
    const input = [
      {
        disciplinaNome: "Matemática",
        uesPorNiveisProficiencia: [
          { codigo: 1, quantidadeUes: 2 },
          { codigo: 3, quantidadeUes: 5 }, // sem 2 e 4
        ],
      },
    ];

    const out = ConverteDados(input);
    expect(out).toEqual([
      {
        name: "Matemática",
        abaixoDoBasico: 2,
        basico: 0,
        adequado: 5,
        avancado: 0,
      },
    ]);
  });

  test("suporta múltiplos itens", () => {
    const input = [
      {
        disciplinaNome: "Português",
        uesPorNiveisProficiencia: [
          { codigo: 1, quantidadeUes: 1 },
          { codigo: 2, quantidadeUes: 2 },
          { codigo: 3, quantidadeUes: 3 },
          { codigo: 4, quantidadeUes: 4 },
        ],
      },
      {
        disciplinaNome: "Matemática",
        uesPorNiveisProficiencia: [{ codigo: 2, quantidadeUes: 7 }],
      },
    ];

    const out = ConverteDados(input);
    expect(out).toEqual([
      {
        name: "Português",
        abaixoDoBasico: 1,
        basico: 2,
        adequado: 3,
        avancado: 4,
      },
      {
        name: "Matemática",
        abaixoDoBasico: 0,
        basico: 7,
        adequado: 0,
        avancado: 0,
      },
    ]);
  });

  test("entrada vazia retorna []", () => {
    expect(ConverteDados([])).toEqual([]);
  });
});

describe("ConverteDadosDre (DREs)", () => {
  test("mapeia códigos 1..4 para quantidadeDres", () => {
    const input = [
      {
        disciplinaNome: "Matemática",
        dresPorNiveisProficiencia: [
          { codigo: 1, quantidadeDres: 10 },
          { codigo: 2, quantidadeDres: 0 },
          { codigo: 4, quantidadeDres: 3 },
        ],
      },
    ];

    const out = ConverteDadosDre(input);
    expect(out).toEqual([
      {
        name: "Matemática",
        abaixoDoBasico: 10,
        basico: 0,
        adequado: 0,
        avancado: 3,
      },
    ]);
  });

  test("entrada vazia retorna []", () => {
    expect(ConverteDadosDre([])).toEqual([]);
  });
});

test("renderiza um bloco por item convertido", async () => {
  const dados = [
    {
      disciplinaNome: "Português",
      uesPorNiveisProficiencia: [{ codigo: 2, quantidadeUes: 2 }],
    },
    {
      disciplinaNome: "Matemática",
      uesPorNiveisProficiencia: [{ codigo: 3, quantidadeUes: 1 }],
    },
  ];
  render(<DesempenhoPorMateria dados={dados} tipo="UEs" />);

  expect(await screen.findByText(/Português/i)).toBeInTheDocument();
  expect(await screen.findByText(/Matemática/i)).toBeInTheDocument();
});

test("não renderiza o texto quando não há dados", () => {
  render(<DesempenhoPorMateria dados={[]} tipo="" />);

  expect(
    screen.queryByText(/Confira a quantidade de/i)
  ).not.toBeInTheDocument();
});

test("Renderiza se o grafico vai aparecer com algum dado preenchido", async () => {
  render(<DesempenhoPorMateria dados={dados} tipo="UEs" />);
  expect(
    await screen.findByText(/Confira a quantidade de/i)
  ).toBeInTheDocument();
});

test("mensagem reflete o tipo (UEs)", async () => {
  render(<DesempenhoPorMateria dados={dados} tipo="UEs" />);
  expect(
    await screen.findByText(/Unidades Educacionais \(UEs\)/i)
  ).toBeInTheDocument();
});

test("mensagem reflete o tipo (DREs)", async () => {
  const dadosDre = [
    {
      disciplinaNome: "Ciências",
      dresPorNiveisProficiencia: [{ codigo: 1, quantidadeDres: 1 }],
    },
  ];
  render(<DesempenhoPorMateria dados={dadosDre} tipo="DREs" />);
  expect(
    await screen.findByText(/Unidades Educacionais \(DREs\)/i)
  ).toBeInTheDocument();
});