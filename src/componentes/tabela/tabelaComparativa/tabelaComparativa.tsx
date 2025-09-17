import React from "react";
import "./tabelaComparativa.css";
import { Card, Table, Progress } from "antd";
import dreComparativa from "../../../mocks/dreComparativa.json"


interface AplicacaoItem {
  descricao: string;
  mes: string;
  valorProficiencia: number;
  nivelProficiencia: string;
  ["Qtde UE"]: string;
  ["Qtde Estudante"]: string;
}

interface Payload {
  variacao: number;
  Aplicacao: AplicacaoItem[];
}

const TabelaComparativa: React.FC<TabelaComparativaProps> = ({ 
    aplicacaoSelecionada, componenteSelecionado, anoSelecionado 
}) => {

    // 🔹 Linhas fixas
    const linhasFixas = [
        { key: "proficiencia", aplicacao: "Proficiência" },
        { key: "qtdeUE", aplicacao: "Qtde UE" },
        { key: "qtdeEstudante", aplicacao: "Qtde Estudantes" },
    ];

    // 🔹 Monta colunas dinâmicas
    const colunasDinamicas = dreComparativa.Aplicacao.map((item, index) => {
        const colKey = `${item.descricao}-${item.mes || index}`;
        return {
            title: item.mes ? `${item.descricao} (${item.mes})` : item.descricao,
            dataIndex: colKey,
            key: colKey,
            align: "left" as const,
            width: 120,
        };
    });

   // 🔹 Monta o dataSource transposto
    const dataSource = linhasFixas.map((linha) => {
        const row: any = { key: linha.key, aplicacao: linha.aplicacao };

        dreComparativa.Aplicacao.forEach((item, index) => {
        const colKey = `${item.descricao}-${item.mes || index}`;

        if (linha.key === "proficiencia") {
            row[colKey] = (
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                <div>{item.valorProficiencia}</div>
                <Progress
                percent={Math.min(100, (item.valorProficiencia / 300) * 100)} // Exemplo de cálculo
                size="small"
                showInfo={false}
                strokeColor={
                    item.nivelProficiencia === "Adequado"
                    ? "green"
                    : item.nivelProficiencia === "Básico"
                    ? "orange"
                    : "red"
                }
                style={{ width: "100%", paddingLeft: 8 }}
                />                
            </div>
            );
        } else if (linha.key === "qtdeUE") {
            row[colKey] = item["Qtde UE"] || "-";
        } else if (linha.key === "qtdeEstudante") {
            row[colKey] = item["Qtde Estudante"] || "-";
        }
        });

        return row;
    });

    // 🔹 Colunas finais
    const columns = [
        {
            title: "Aplicação",
            dataIndex: "aplicacao",
            key: "aplicacao",
            fixed: "left" as const,
            width: 120,
            ellipsis: true,          // 🔹 corta texto se passar do limite
            render: (text: string) => (
            <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {text}
            </div>
            ),
        },
        ...colunasDinamicas,
    ];
  

  return (
    <>
     <div className="tabela-comparativa-titulo">
        <b>Tabela comparativa</b>
     </div>
     <div className="tabela-comparativa-descricao">
        <div className="tabela-comparativa-descricao-texto">
            A tabela exibe a proficiência da Secretaria Municipal de Educação nas aplicações da Prova São Paulo e da Prova Saberes e Aprendizagens.
        </div>
        <div className="tabela-comparativa-labels">
            <div className="tabela-comparativa-labels-item">{componenteSelecionado?.label}</div>
            <div className="tabela-comparativa-labels-item">{anoSelecionado?.label}</div>
            <div className="tabela-comparativa-labels-item">{aplicacaoSelecionada?.label}</div>            
        </div>
     </div>
     <br />    
        <Card className="tabela-comparativa-variacao-card">
            <div className="tabela-comparativa-variacao">
                <div className="tabela-comparativa-variacao-label">Variação</div>
                <div className="tabela-comparativa-variacao-valor">{dreComparativa.variacao > 0 ? `+${dreComparativa.variacao}%` : `${dreComparativa.variacao}%`}</div>
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

export default TabelaComparativa;