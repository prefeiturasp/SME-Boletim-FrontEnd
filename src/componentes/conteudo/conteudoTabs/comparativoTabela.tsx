import { Children, useState } from "react";
import { Table, Progress, Tag, Spin, Button } from "antd";
import "./comparativoTabela.css";
import iconeMais from "./../../../assets/icon-mais.svg";

interface ComparativoTabelaProps {
  index: number;
  exibirMais: (value: number) => void;
  dadosTurma: any;
  turmaSelecionada: string;
  componentesCurricularSelecionado: string;
}

const ComparativoTabela: React.FC<ComparativoTabelaProps> = ({
  index,
  exibirMais,
  dadosTurma,
  turmaSelecionada,
  componentesCurricularSelecionado,
}) => {
  const [estaCarregando, setEstaCarregando] = useState(false);
  const disciplina = "Lingua portuguesa";
  const ano = 5;
  const [loadingMaisUes, setLoadingMaisUes] = useState(false);

  if (!dadosTurma || !dadosTurma.itens) {
    return <>NÃO EXISTEM DADOS PARA SEREM EXIBIDOS...</>;
  }

  return (
    <>
      <Spin spinning={estaCarregando} tip="Carregando...">
        <div className="bloco-secao-tabela-comparativo">
          <div className="secao-tabela-comparativo">
            <b>
              Estudantes da Turma {turmaSelecionada} em{" "}
              {componentesCurricularSelecionado}
            </b>
          </div>
          <div>
            <div className="legendas">
              <div className="texto">
                <span className="desempenho-por-materia-negrito">Níveis:</span>
              </div>
              <div className="caixa-vermelha"></div>{" "}
              <div className="texto">1 - Abaixo do basico</div>
              <div className="caixa-amarela"></div>{" "}
              <div className="texto">2 - Básico</div>
              <div className="caixa-azul"></div>{" "}
              <div className="texto">3 - Adequado</div>
              <div className="caixa-verde"></div>{" "}
              <div className="texto">4 - Avançado</div>
            </div>
          </div>
        </div>
        <br />
        <Table
          columns={constroiColunas(disciplina, ano, dadosTurma.itens)}
          dataSource={dadosTurma.itens.map((item: any, idx: any) => ({
            ...item,
            key: idx,
          }))}
          pagination={false}
          scroll={{ x: "max-content" }}
          bordered
        />

        <>
          <br></br>
          <br></br>
          <br></br>
          {dadosTurma.itens.length >= 5 && (
            <div className="transparent-bottom-ue">
              <Button
                variant="outlined"
                className="btn-exibir-mais-ue"
                loading={loadingMaisUes}
                onClick={() => exibirMais(index)}
                style={{
                  minWidth: 160,
                  height: 40,
                  fontWeight: 600,
                  fontSize: 16,
                  zIndex: 2,
                }}
              >
                <img
                  src={iconeMais}
                  alt="Ícone dados"
                  className="disciplina-icon"
                />
                Exibir mais
              </Button>
            </div>
          )}
        </>
      </Spin>

      <div className="espacamento-tabela-comparativo"></div>
    </>
  );
};
export default ComparativoTabela;

const pegaCoresBarraProgresso = (
  valor: number,
  disciplina: string,
  ano: number
) => {
  if (disciplina === "Lingua portuguesa" && ano === 5) {
    if (valor < 150) return "#FF5959";
    if (valor < 200) return "#FEDE99";
    if (valor < 250) return "#5A94D8";
    return "#99FF99";
  }
  if (disciplina === "Lingua portuguesa" && ano === 9) {
    if (valor < 200) return "#FF5959";
    if (valor < 275) return "#FEDE99";
    if (valor < 325) return "#5A94D8";
    return "#99FF99";
  }
  if (disciplina === "Matemática" && ano === 5) {
    if (valor < 175) return "#FF5959";
    if (valor < 225) return "#FEDE99";
    if (valor < 275) return "#5A94D8";
    return "#99FF99";
  }
  if (disciplina === "Matemática" && ano === 9) {
    if (valor < 225) return "#FF5959";
    if (valor < 300) return "#FEDE99";
    if (valor < 350) return "#5A94D8";
    return "#99FF99";
  }
  return "default";
};

const getVariationTag = (valor: number) => {
  let bgColor = "#B0B0B0";
  if (valor > 0) bgColor = "#21C45D";
  else if (valor < 0) bgColor = "#EF4343";
  return (
    <div className="variacao-tag" style={{ backgroundColor: bgColor }}>
      {valor.toFixed(2)}%
    </div>
  );
};

const constroiColunas = (disciplina: string, ano: number, dados: any[]) => {
  const mesesUnicos = new Set<string>();
  dados.forEach((item) => {
    item.proficiencias.forEach((p: any) => {
      if (p.descricao === "PSA" && p.mes) mesesUnicos.add(p.mes);
    });
  });

  const colunas: any[] = [
    {
      title: "Nome do Estudante",
      dataIndex: "nome",
      key: "nome",
      className: "coluna-nome-header",
      width: 284,
    },
    {
      title: "Aplicação PSA",
      className: "aplicacao-psa-header",
      children: [
        {
          title: "PSP",
          key: "psp",
          width: 80,
          className: "psp-header",
          render: (_: any, record: any) => {
            const psp = record.proficiencias.find(
              (p: any) => p.descricao === "PSP"
            );
            if (!psp) return null;
            return (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>{psp.valor.toFixed(2)}</span>
                <Progress
                  percent={100}
                  showInfo={false}
                  strokeColor={pegaCoresBarraProgresso(
                    psp.valor,
                    disciplina,
                    ano
                  )}
                  style={{ width: 60 }}
                />
              </div>
            );
          },
        },
        // Criar colunas PSA dinamicamente
        ...Array.from(mesesUnicos).map((mes) => ({
          title: `PSA (${mes} 2025)`,
          key: `psa-${mes}`,
          width: 80,
          className: "psa-header",
          render: (_: any, record: any) => {
            const psa = record.proficiencias.find(
              (p: any) => p.descricao === "PSA" && p.mes === mes
            );
            if (!psa) return null;
            return (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>{psa.valor.toFixed(2)}</span>
                <Progress
                  percent={100}
                  showInfo={false}
                  strokeColor={pegaCoresBarraProgresso(
                    psa.valor,
                    disciplina,
                    ano
                  )}
                  style={{ width: 60 }}
                />
              </div>
            );
          },
        })),
      ],
    },
  ];

  colunas.push({
    title: "Variacão",
    key: "variacao",
    width: 80,
    aling: "center",
    render: (_: any, record: any) => getVariationTag(record.variacao),
    className: "variacao-header",
  });

  return colunas;
};
