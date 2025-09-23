import { Children, useState } from "react";
import { Table, Progress, Tag, Spin, Button } from "antd";
import "./comparativoTabela.css";
import iconeMais from "./../../../assets/icon-mais.svg";
//import LoadingBox from "../../loadingBox/loadingBox";

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
    return (
      <div className="comparativo-tabela-estudante-nao-encontrado">
        Não existem dados para os estudantes da turma {turmaSelecionada} em{" "}
        {componentesCurricularSelecionado}
      </div>
    );
  }

  return (
    <>
      <Spin spinning={estaCarregando} tip="Carregando...">
        <div className="bloco-secao-tabela-comparativo">
          <div className="secao-tabela-comparativo">
            <b>
              Estudantes da turma {turmaSelecionada} em{" "}
              {componentesCurricularSelecionado}
            </b>
          </div>
          <div>
            <div className="legendas-niveis-cores">
              <div className="texto-niveis-cores">
                <span className="desempenho-por-materia-negrito">Níveis:</span>
              </div>
              <div className="niveis-cores">
                <div className="niveis-cores-caixa">
                  <div className="caixa-vermelha"></div>{" "}
                  <div className="texto-legenda-nivel">1 - Abaixo do básico</div>
                </div>
                <div className="niveis-cores-caixa">
                  <div className="caixa-amarela"></div>{" "}
                  <div className="texto-legenda-nivel">2 - Básico</div>
                </div>
                <div className="niveis-cores-caixa">
                  <div className="caixa-azul"></div>{" "}
                  <div className="texto-legenda-nivel">3 - Adequado</div>
                </div>
                <div className="niveis-cores-caixa">
                  <div className="caixa-verde"></div>{" "}
                  <div className="texto-legenda-nivel">4 - Avançado</div>
                </div>
              </div>
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
          locale={{
            emptyText: (
              <div className="comparativo-tabela-vazia">
                NENHUM ESTUDANTE ENCONTRADO PARA ESTA TURMA
              </div>
            ),
          }}
        />

        <>
          <br></br>
          <br></br>
          <br></br>
          {dadosTurma.itens.length >= 5 &&
            dadosTurma.total > dadosTurma.itens.length && (
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

const pegaCoresBarraProgresso = (nivelProficiencia: string) => {
  if (nivelProficiencia === "Abaixo do Básico") return "#FF5959";
  if (nivelProficiencia === "Básico") return "#FEDE99";
  if (nivelProficiencia === "Adequado") return "#9999FF";
  if (nivelProficiencia === "Avançado") return "#99FF99";
  return "#B0B0B0";
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
      title: "Nome do estudante",
      dataIndex: "nome",
      key: "nome",
      className: "coluna-nome-header",
      width: 260,
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
                <span className="valorPspPsa">{psp.valor.toFixed(2)}</span>
                <Progress
                  percent={psp.valor}
                  strokeWidth={10}
                  showInfo={false}
                  strokeColor={pegaCoresBarraProgresso(psp.nivelProficiencia)}
                  trailColor="#B0B0B0"
                  style={{ width: 60 }}
                />
              </div>
            );
          },
        },

        ...Array.from(mesesUnicos).map((mes) => ({
          title: `PSA (${mes})`,
          key: `psa-${mes}`,
          width: 80,
          className: "psa-header",
          render: (_: any, record: any) => {
            const psa = record.proficiencias.find(
              (p: any) => p.descricao === "PSA" && p.mes === mes
            );
            if (!psa) return null;
            return (
              <div style={{ display: "flex", alignItems: "center", gap: 8}}>
                <span className="valorPspPsa">{psa.valor.toFixed(2)}</span>
                <Progress
                  percent={psa.valor}
                  strokeWidth={10}
                  showInfo={false}
                  strokeColor={pegaCoresBarraProgresso(psa.nivelProficiencia)}
                  trailColor="#B0B0B0"
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
    title: "Variação",
    key: "variacao",
    width: 80,
    aling: "center",
    render: (_: any, record: any) => getVariationTag(record.variacao),
    className: "variacao-header",
  });

  return colunas;
};
