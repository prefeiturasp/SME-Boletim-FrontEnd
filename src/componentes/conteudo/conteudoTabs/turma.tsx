import React, { useEffect, useState } from "react";
import { Table, Spin } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { servicos } from "../../../servicos";
import "./turma.css";

const Turma: React.FC = () => {
  const [dados, setDados] = useState<any[]>([]);
  const [estaCarregando, setEstaCarregando] = useState(false);

  const escolaSelecionada = useSelector(
    (state: RootState) => state.escola.escolaSelecionada
  );

  const buscarDadosTurmas = async () => {
    try {
      setEstaCarregando(true);
      const resposta = await servicos.get(
        `/api/boletimescolar/${escolaSelecionada.ueId}/turmas`
      );
      setDados(resposta.provas || []);
    } catch (error) {
      console.error("Erro ao buscar os dados da tabela:", error);
    } finally {
      setEstaCarregando(false);
    }
  };

  useEffect(() => {
    if (escolaSelecionada) {
      buscarDadosTurmas();
    }
  }, [escolaSelecionada]);

  const colunasNiveis = [
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

  const colunasTurmas = [
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

  return (
    <Spin spinning={estaCarregando} tip="Carregando...">
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
            {/* TODO - Grafico  */}
          </div>
        ))}
      </div>
    </Spin>
  );
};

export default Turma;
