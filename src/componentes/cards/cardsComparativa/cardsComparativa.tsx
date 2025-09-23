import React from "react";
import "./cardsComparativa.css";
import Card from "antd/es/card/Card";
import { Col, Row } from "antd";
import iconeAlunos from "../../../assets/icon-alunos.svg";
import { Button } from "antd";

const CardsComparativa: React.FC<{ dados: CardsComparativaProps }> = ({
  dados,
}) => {
  const abrirComparativo = () => {
    // const url = `https://boletim.sme.prefeitura.sp.gov.br/comparativo-dre?dre=${cardsComparativa.dre}`;
    // window.open(url, '_blank');
  };

  return (
    <>
      <Card className="cards-comparativa-corpo">
        <div className="cards-comparativa-header">
          <div className="cards-comparativa-titulo">
            <b>{dados.dre}</b>
          </div>
          <div className="cards-comparativa-variacao">
            <span className="cards-comparativa-variacao-label">Variação:</span>
            <div className="cards-comparativa-variacao-valor">
              +{dados.variacao}%
            </div>
          </div>
        </div>

        <Row gutter={[16, 16]} className="cards-comparativa-blocos">
          {(() => {
            const dinamicos = dados?.aplicacao?.length ?? 0;
            const totalCards = 1 + dinamicos; // 1 fixo + dinâmicos
            const span = 24 / totalCards; // divide o grid igualmente

            return (
              <>
                <Col xs={24} sm={24} md={24} lg={span} key="prova-sp">
                  <div className="cards-comparativa-bloco-cinza">
                    <div className="cards-comparativa-bloco-cinza-header">
                      <div className="cards-comparativa-prova-data">
                        <b>{dados.provaSp.nomeAplicacao}</b>
                        <span>{dados.provaSp.mesAno}</span>
                      </div>
                      <div className="cards-comparativa-valor">
                        <span>Proficiência:</span>
                        <div>{dados.provaSp.valorProficiencia}</div>
                      </div>
                    </div>
                    <div className="cards-comparativa-quantidade-corpo-sp">
                      <div className="cards-comparativa-quantidade-icone">
                        <img src={iconeAlunos} alt="Ícone disciplina" />
                      </div>
                      <div className="cards-comparativa-quantidade-texto">
                        <p>Estudantes que realizaram a prova:</p>
                        <span>{dados.provaSp.qtdeEstudante}</span>
                      </div>
                    </div>
                    <div className="cards-comparativa-nivel-corpo">
                      <div className="cards-comparativa-nivel-icone">
                        <span
                          style={{
                            backgroundColor: getNivelColor(
                              dados?.provaSp?.nivelProficiencia ?? ""
                            ),
                          }}
                        ></span>
                      </div>
                      <div className="cards-comparativa-nivel-texto">
                        <span>{dados.provaSp.nivelProficiencia}</span>
                        <p>Nível de proficiência</p>
                      </div>
                    </div>
                  </div>
                </Col>
                {dados?.aplicacao
                  ?.slice()
                  .sort((a: any, b: any) => {
                    const dataA = parsePeriodo(a?.periodo);
                    const dataB = parsePeriodo(b?.periodo);
                    if (!dataA || !dataB) return 0;
                    return dataA.getTime() - dataB.getTime();
                  })
                  .map((comparacao: any, idx: number) => (
                    <Col
                      key={idx}
                      xs={24}
                      sm={24}
                      md={24}
                      lg={span}
                      className="cards-comparativa-coluna"
                    >
                      <div className="cards-comparativa-bloco-cinza">
                        <div className="cards-comparativa-bloco-cinza-header">
                          <div className="cards-comparativa-prova-data">
                            <b>{comparacao.nomeAplicacao}</b>
                            <span>{comparacao.mesAno}</span>
                          </div>
                          <div className="cards-comparativa-valor">
                            <span>Proficiência:</span>
                            <div>{comparacao.valorProficiencia}</div>
                          </div>
                        </div>
                        <div className="cards-comparativa-quantidade-corpo">
                          <div className="cards-comparativa-quantidade-icone">
                            <img src={iconeAlunos} alt="Ícone disciplina" />
                          </div>
                          <div className="cards-comparativa-quantidade-texto">
                            <p>Estudantes que realizaram a prova:</p>
                            <span>{comparacao.qtdeEstudante}</span>
                          </div>
                        </div>
                        <div className="cards-comparativa-nivel-corpo">
                          <div className="cards-comparativa-nivel-icone">
                            <span
                              style={{
                                backgroundColor: getNivelColor(
                                  dados.provaSp.nivelProficiencia ?? ""
                                ),
                              }}
                            ></span>
                          </div>
                          <div className="cards-comparativa-nivel-texto">
                            <span>{dados.provaSp.nivelProficiencia}</span>
                            <p>Nível de proficiência</p>
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))}
              </>
            );
          })()}
        </Row>

        <div className="cards-comparativa-rodape">
          <div>
            <p>
              Para conferir os dados de proficiência dos estudantes desta
              Unidade Educaional, clique no botão "Conferir dados da UE"
            </p>
          </div>
          <div>
            <Button
              type="primary"
              onClick={abrirComparativo}
              className="cards-comparativa-rodape-btn"
            >
              Conferir dados da UE
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
};

export default CardsComparativa;

export const getNivelColor = (nivel: string) => {
  switch (nivel) {
    case "Abaixo do Básico":
      return "#FF5959";
    case "Básico":
      return "#FEDE99";
    case "Avançado":
      return "#99FF99";
    case "Adequado":
      return "#9999FF";
    default:
      return "black";
  }
};

const meses: Record<string, number> = {
  Janeiro: 0,
  Fevereiro: 1,
  Março: 2,
  Abril: 3,
  Maio: 4,
  Junho: 5,
  Julho: 6,
  Agosto: 7,
  Setembro: 8,
  Outubro: 9,
  Novembro: 10,
  Dezembro: 11,
};

function parsePeriodo(periodo: string): Date | null {
  if (!periodo) return null;
  const [mes, ano] = periodo.split(" ");
  const mesIndex = meses[mes];
  if (mesIndex === undefined || isNaN(Number(ano))) return null;
  return new Date(Number(ano), mesIndex, 1);
}