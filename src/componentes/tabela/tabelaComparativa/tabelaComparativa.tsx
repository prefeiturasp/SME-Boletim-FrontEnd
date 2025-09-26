import React, { useEffect } from "react";
import "./tabelaComparativa.css";
import { Card, Table, Progress } from "antd";
import {
    ParametrosTabelaComparativaProps,
    ValueTabelaComparativaProps
} from "../../../interfaces/tabelaComparativaProps";
import { getDadosTabela } from "../../../servicos/compararDados/compararDadosService";

const TabelaComparativa: React.FC<ParametrosTabelaComparativaProps> = ({
    dreSelecionada,
    aplicacaoSelecionada,
    componenteSelecionado,
    anoSelecionado
}) => {
    const [dadosTabela, setDadosTabela] = React.useState<ValueTabelaComparativaProps>();
    
    const preencheTabela = async () => {
        try {
            const ValueTabela: ValueTabelaComparativaProps = await getDadosTabela(
                Number(dreSelecionada ?? 0),
                Number(aplicacaoSelecionada!.value ?? 0),
                Number(componenteSelecionado!.value ?? 0),
                Number(anoSelecionado?.value ?? 0),
            );
            console.log(ValueTabela);

            // const dadosTratados = tratamentoItemRepetido(ValueTabela);
            // tratamentoDescricao(dadosTratados);

            const dadosTratados = ValueTabela;
            tratamentoDescricao(dadosTratados);

            setDadosTabela(dadosTratados);           

        } catch (error) {
            console.log(error);
        }
    };

    const tratamentoItemRepetido = (
        dados: ValueTabelaComparativaProps
    ): ValueTabelaComparativaProps => {
        const vistos = new Set<string>();
        const aplicacaoUnica = dados.aplicacao.filter((item) => {
            if (vistos.has(item.mes)) return false;
            vistos.add(item.mes);
            return true;
        });

        return { ...dados, aplicacao: aplicacaoUnica };
    };

    const tratamentoDescricao = (dados: ValueTabelaComparativaProps) => {
        dados.aplicacao.forEach((item) => {
            if (item.descricao) {
                item.descricao = item.descricao
                    .replace("Prova São Paulo", "PSP")
                    .replace("Prova Saberes e Aprendizagens", "PSA");
            }
        });
    };

    useEffect(() => {
        if (dreSelecionada != 0 && dreSelecionada !== null && aplicacaoSelecionada &&
            componenteSelecionado && anoSelecionado)
            preencheTabela();
    }, [
        dreSelecionada,
        aplicacaoSelecionada,
        componenteSelecionado,
        anoSelecionado,
    ]);

    const linhasFixas = [
        { key: "proficiencia", aplicacao: "Proficiência" },
        { key: "qtdeUE", aplicacao: "Qtde UE" },
        { key: "qtdeEstudante", aplicacao: "Qtde Estudantes" },
    ];

    const colunasDinamicas = dadosTabela?.aplicacao?.map((item, index) => {
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

        dadosTabela?.aplicacao?.forEach((item, index) => {
            const colKey = `${item.descricao}-${item.mes}-${index}`;

            if (linha.key === "proficiencia") {
                row[colKey] = (
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
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
                <div style={{ color: "#595959", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
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
                    A tabela exibe a proficiência da Secretaria Municipal de Educação nas aplicações da Prova São Paulo e da Prova Saberes e Aprendizagens.
                </div>
                <div className="tabela-comparativa-labels">
                    <div className="tabela-comparativa-labels-item" style={{ width: "130px" }}>{componenteSelecionado?.label}</div>
                    <div className="tabela-comparativa-labels-item" style={{ width: "45px" }}>{anoSelecionado?.label + "º ano"}</div>
                    <div className="tabela-comparativa-labels-item" style={{ width: "31px" }}>{aplicacaoSelecionada?.label}</div>
                </div>
            </div>
            <br />
            <Card className="tabela-comparativa-variacao-card">
                <div className="tabela-comparativa-variacao">
                    <div className="tabela-comparativa-variacao-label">Variação</div>
                    <div className={`tabela-comparativa-variacao-valor ${getClasseVariacao(dadosTabela?.variacao ?? 0)}`}>
                        {formatarVariacao(dadosTabela?.variacao ?? 0)}
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

export default TabelaComparativa;