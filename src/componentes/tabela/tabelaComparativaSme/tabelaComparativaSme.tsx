import React from "react";
import "./tabelaComparativaSme.css";
import { Card, Table, Progress } from "antd";
import { AAAParametrosTabelaComparativaProps } from "../../../interfaces/tabelaComparativaPropsNova";

const TabelaComparativaSME: React.FC<AAAParametrosTabelaComparativaProps> = ({
  dados,
  aplicacaoSelecionada,
  componenteSelecionado,
  anoSelecionado,
}) => {
  const linhasFixas = [
    { key: "proficiencia", aplicacao: "Proficiência" },
    { key: "qtdeDre", aplicacao: "Qtde DRE" },
    { key: "qtdeUE", aplicacao: "Qtde UE" },
    { key: "qtdeEstudante", aplicacao: "Qtde Estudantes" },
  ];

  if(dados === undefined)
    return <></>

  const colunasDinamicas = dados?.aplicacao?.map((item, index) => {
    const colKey = `${item.descricao}-${item.mes}-${index}`;
    return {
      title: item.mes ? `${item.descricao} (${item.mes})` : item.descricao,
      dataIndex: colKey,
      key: colKey,
      align: "left" as const,
      width: 120,
      onHeaderCell: () => ({
        className: "tabela-comparativa-header",
      }),
    };
  });

  const pegaCoresBarraProgresso = (nivelProficiencia: string) => {
    if (nivelProficiencia === "Abaixo do Básico") return "#FF5959";
    if (nivelProficiencia === "Básico") return "#FEDE99";
    if (nivelProficiencia === "Adequado") return "#9999FF";
    if (nivelProficiencia === "Avançado") return "#99FF99";
    return "#B0B0B0";
  };

  function getClasseVariacao(variacao: number): string {
    if (variacao > 0) return "variacao-positiva";
    if (variacao < 0) return "variacao-negativa";
    return "variacao-neutra";
  }

  function formatarVariacao(variacao: number): string {
    if (variacao > 0) return `+${variacao}%`;
    if (variacao < 0) return `${variacao}%`;
    return "0%";
  }

  const dataSource = linhasFixas.map((linha) => {
    const row: any = { key: linha.key, aplicacao: linha.aplicacao };

    dados?.aplicacao?.forEach((item, index) => {
      const colKey = `${item.descricao}-${item.mes}-${index}`;

      if (linha.key === "proficiencia") {
        row[colKey] = (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <div>{item.valorProficiencia}</div>
            <Progress
              percent={Math.min(100, (item.valorProficiencia / 300) * 100)}
              showInfo={false}
              size={{ width: 120, height: 10 }}
              strokeColor={pegaCoresBarraProgresso(item.nivelProficiencia)}
              style={{ width: "100%", paddingLeft: 8, marginTop: 3 }}
            />
          </div>
        );
      } else if (linha.key === "qtdeDre") {
        row[colKey] = item["qtdeDre"] || "-";
      } else if (linha.key === "qtdeUE") {
        row[colKey] = item["qtdeUe"] || "-";
      } else if (linha.key === "qtdeEstudante") {
        row[colKey] = item["qtdeEstudante"] || "-";
      }
    });

    return row;
  });

  const columns = [
    {
      title: "Aplicação",
      dataIndex: "aplicacao",
      key: "aplicacao",
      fixed: "left" as const,
      width: 120,
      ellipsis: true,
      onHeaderCell: () => ({
        className: "tabela-comparativa-header",
      }),
      render: (text: string) => (
        <div
          style={{
            color: "#595959",
            fontWeight: 700,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {text}
        </div>
      ),
    },
    ...(colunasDinamicas ?? []),
  ];

  return (
    <>
      <div className="tabela-comparativa-titulo">
        <b>Tabela comparativa</b>
      </div>
      <div className="tabela-comparativa-descricao">
        <div className="tabela-comparativa-descricao-texto">
          A tabela exibe a proficiência da Secretaria Municipal de Educação nas
          aplicações da Prova São Paulo e da Prova Saberes e Aprendizagens.
        </div>
        <div className="tabela-comparativa-labels">
          <div
            className="tabela-comparativa-labels-item"
            style={{ width: "130px" }}
          >
            {componenteSelecionado?.label}
          </div>
          <div
            className="tabela-comparativa-labels-item"
            style={{ width: "45px" }}
          >
            {anoSelecionado?.label + "º ano"}
          </div>
          <div
            className="tabela-comparativa-labels-item"
            style={{ width: "31px" }}
          >
            {aplicacaoSelecionada?.label}
          </div>
        </div>
      </div>
      <br />
      <Card className="tabela-comparativa-variacao-card">
        <div className="tabela-comparativa-variacao">
          <div className="tabela-comparativa-variacao-label">Variação</div>
          <div
            className={`tabela-comparativa-variacao-valor ${getClasseVariacao(
              dados?.variacao ?? 0
            )}`}
          >
            {formatarVariacao(dados?.variacao ?? 0)}
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          bordered
          scroll={{ x: true }}
        />
      </Card>
    </>
  );
};

export default TabelaComparativaSME;
