import React, { useEffect, useState } from "react";
import { Table, Spin } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { servicos } from "../../../servicos";
import "./turma.css";
import DesempenhoTurma from "../../grafico/desempenhoTurma";
import { ColumnsType } from "antd/es/table";
import LoadingBox from "../../loadingBox/loadingBox";

const colunasTurmaInicial = [
  { title: "Turma", dataIndex: "turma", key: "turma" },
  {
    title: "Abaixo do Básico",
    dataIndex: "abaixoBasico",
    key: "abaixoBasico",
  },
  { title: "Básico", dataIndex: "basico", key: "basico" },
  { title: "Adequado", dataIndex: "adequado", key: "adequado" },
  { title: "Avançado", dataIndex: "avancado", key: "avancado" },
  {
    title: "Total de Alunos",
    dataIndex: "total",
    key: "total",
    className: "col-total",
  },
  {
    title: "Média de Proficiência",
    dataIndex: "mediaProficiencia",
    key: "mediaProficiencia",
    className: "col-proficiencia",
  },
];

const colunasNiveisInicial = [
  { title: "Ano Escolar", dataIndex: "anoEscolar", key: "anoEscolar" },
  {
    title: "Abaixo do Básico",
    dataIndex: "abaixoBasico",
    key: "abaixoBasico",
  },
  { title: "Básico", dataIndex: "basico", key: "basico" },
  { title: "Adequado", dataIndex: "adequado", key: "adequado" },
  { title: "Avançado", dataIndex: "avancado", key: "avancado" },
];

const Turma: React.FC = () => {
  const [colunasTurmas, setColunasTurmas] =
    useState<any[]>(colunasTurmaInicial);
  const [colunasNiveis, setColunasNiveis] =
    useState<any[]>(colunasNiveisInicial);
  const [dados, setDados] = useState<any[]>([]);
  const [estaCarregando, setEstaCarregando] = useState(false);

  const escolaSelecionada = useSelector(
    (state: RootState) => state.escola.escolaSelecionada
  );

  const aplicacaoSelecionada = useSelector(
    (state: RootState) => state.nomeAplicacao.id
  );

  const activeTab = useSelector((state: RootState) => state.tab.activeTab);
  const filtrosSelecionados = useSelector((state: RootState) => state.filtros);

  const buscarDadosTurmas = async () => {
    try {
      setEstaCarregando(true);
      let filtros = "";
      if (
        filtrosSelecionados.anosEscolares.length > 0 ||
        filtrosSelecionados.componentesCurriculares.length > 0
      ) {
        const params = new URLSearchParams();

        filtrosSelecionados.anosEscolares.forEach((item) => {
          params.append("Ano", item.valor.toString());
        });

        filtrosSelecionados.componentesCurriculares.forEach((item) => {
          params.append("ComponentesCurriculares", item.valor.toString());
        });

        filtros = `?${params.toString()}`;
      }

      const resposta = await servicos.get(
        `/api/boletimescolar/${aplicacaoSelecionada}/${escolaSelecionada.ueId}/turmas${filtros}`
      );
      setDados(resposta.provas || []);
    } catch (error) {
      console.error("Erro ao buscar os dados da tabela:", error);
    } finally {
      setEstaCarregando(false);
    }
  };

  useEffect(() => {
    if (escolaSelecionada && activeTab == "2") {
      buscarDadosTurmas();
    }
  }, [escolaSelecionada, filtrosSelecionados, activeTab, aplicacaoSelecionada]);

  const toggleColumnVisibility = (
    columnsSetter: React.Dispatch<React.SetStateAction<any[]>>,
    key: string,
    value: boolean
  ) => {
    columnsSetter((prevColumns) =>
      prevColumns.map((col) =>
        col.key === key ? { ...col, hidden: value } : col
      )
    );
  };

  useEffect(() => {
    if (activeTab !== "2") return;

    const keys = [
      { key: "abaixoBasico", valor: 1 },
      { key: "basico", valor: 2 },
      { key: "adequado", valor: 3 },
      { key: "avancado", valor: 4 },
    ];

    keys.forEach(({ key, valor }) => {
      const isVisible = filtrosSelecionados.niveisAbaPrincipal.some(
        (item) => item.valor === valor
      );

      toggleColumnVisibility(setColunasTurmas, key, !isVisible);
      toggleColumnVisibility(setColunasNiveis, key, !isVisible);
    });
  }, [filtrosSelecionados, activeTab]);

  return (
    <div>
      {estaCarregando && <LoadingBox />}
      <div>
        <p className="secao-sobre-turmas">
          Esta seção apresenta uma tabelas e gráficos que ilustram a quantidade
          de estudantes e faixa de classificação em cada nível por turma.
        </p>
        {dados.map((prova) => (
          <div key={prova.id}>
            <p className="titulo-prova-turmas">{prova.descricao}</p>
            <p className="subtitulo-prova-turmas">
              Para facilitar o entendimento, esses são os valores de referência
              para os cortes{" "}
              <b> Abaixo do Básico (AB), Básico (B), Adequado (AD) </b> e
              <b> Avançado (AV) </b> em {prova.descricao}.
            </p>
            <Table
              columns={colunasNiveis}
              dataSource={prova.niveis}
              rowKey="anoEscolar"
              pagination={false}
              size="small"
              className="tabela-niveis-turmas"
            />
            <p className="dados-turmas">
              Distribuição do número de estudantes em cada nível por turma.
            </p>
            <Table
              columns={colunasTurmas}
              dataSource={prova.turmas}
              rowKey="turma"
              pagination={false}
              size="small"
            />
            <p className="dados-turmas">
              Média de proficiência em {prova.descricao} por turma
            </p>
            <DesempenhoTurma dados={prova.turmas} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Turma;
