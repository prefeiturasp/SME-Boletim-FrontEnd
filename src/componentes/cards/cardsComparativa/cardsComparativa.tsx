import React from "react";
import "./cardsComparativa.css";
import Card from "antd/es/card/Card";
import { Col, Row, Tooltip } from "antd";
import iconeAlunos from "../../../assets/icon-alunos.svg";
import iconeUe from "../../../assets/icon-ue.svg";
import {
  CardsComparativaAplicacaoProps,
  CardsComparativaUnidadeEducacionalProps,
} from "../../../interfaces/cardsComparativaProps";
import { CardsComparativaDiretoriaReginalProps } from "../../../interfaces/cardsComparativaSMEProps";
import BotaoIrParaComparativo from "../../botao/botaoIrParaComparativo/botaoIrParaComparativo";
import { VARIACAO_DESCRICAO } from "../../../constantes/constantes";

interface CardsComparativaProps {
  dados:
    | CardsComparativaUnidadeEducacionalProps
    | CardsComparativaDiretoriaReginalProps;
  dreId: number;
  ano: ParametrosPadraoAntDesign | null;
  visao: string;
}

const CardsComparativa: React.FC<CardsComparativaProps> = ({
  dados,
  dreId,
  ano,
  visao,
}) => {
  // 🔍 Safe type guards
  const isSME = "dreNome" in dados;
  const isUE = "ueNome" in dados;

  dados.aplicacoesPsa = dados.aplicacoesPsa.slice(0, 3);

  const ultimaAplicacao = [...(dados.aplicacoesPsa ?? [])].sort((a, b) => {
    const dataA = parsePeriodo(a.periodo)?.getTime() ?? 0;
    const dataB = parsePeriodo(b.periodo)?.getTime() ?? 0;
    return dataB - dataA;
  })[0];

  const getAplicacaoId = (): number => {
    if (isUE && ultimaAplicacao && "loteId" in ultimaAplicacao) {
      return (ultimaAplicacao as any).loteId ?? 0;
    }
    return 0;
  };

  function getClasseVariacao(variacao: number): string {
    if (variacao > 0) return "cards-variacao-positiva";
    if (variacao < 0) return "cards-variacao-negativa";
    return "cards-variacao-neutra";
  }

  function formatarVariacao(variacao: number): string {
    if (variacao > 0) return `+${variacao}%`;
    if (variacao < 0) return `${variacao}%`;
    return "0%";
  }

  return (
    <Card className="cards-comparativa-corpo">
      <div className="cards-comparativa-header">
        <div className="cards-comparativa-titulo">
          <b>{isSME ? dados.dreNome : isUE ? dados.ueNome : "-"}</b>
        </div>
        <Tooltip placement="top" title={VARIACAO_DESCRICAO}>
          <div className="cards-comparativa-variacao">
            <span className="cards-comparativa-variacao-label">Variação:</span>
            <div>
              <div
                className={`cards-comparativa-variacao-valor ${getClasseVariacao(
                  dados.variacao,
                )}`}
              >
                {formatarVariacao(dados.variacao)}
              </div>
            </div>
          </div>
        </Tooltip>
      </div>

      <Row gutter={[16, 16]} className="cards-comparativa-blocos">
        {(() => {
          const temPsp = !!dados?.aplicacaoPsp;
          const totalCards =
            (temPsp ? 1 : 0) + (dados?.aplicacoesPsa?.length ?? 0);
          const span = totalCards > 0 ? Math.floor(24 / totalCards) : 24;

          return (
            <>
              {/* PSP CARD */}
              {temPsp && (
                <Col xs={24} sm={24} md={24} lg={span} key="prova-sp">
                  <div className="cards-comparativa-bloco-cinza">
                    <div className="cards-comparativa-bloco-cinza-header">
                      <div className="cards-comparativa-prova-data">
                        <b>{dados.aplicacaoPsp?.nomeAplicacao}</b>
                        <span>{dados.aplicacaoPsp?.periodo}</span>
                      </div>
                      <div className="cards-comparativa-valor">
                        <span>Proficiência:</span>
                        <div>{dados.aplicacaoPsp?.mediaProficiencia}</div>
                      </div>
                    </div>

                    {/* UEs (only SME view) */}
                    {isSME && (
                      <div className="cards-comparativa-quantidade-corpo-sp2">
                        <div className="cards-comparativa-quantidade-icone">
                          <img src={iconeUe} alt="Ícone disciplina" />
                        </div>
                        <div className="cards-comparativa-quantidade-texto">
                          <p>UEs que realizaram a prova:</p>
                          <span>
                            {dados.aplicacaoPsp?.quantidadeUes ?? "-"}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Estudantes */}
                    <div
                      className={
                        isSME
                          ? "cards-comparativa-quantidade-corpo-sp"
                          : "cards-comparativa-quantidade-corpo-sp-original"
                      }
                    >
                      <div className="cards-comparativa-quantidade-icone">
                        <img src={iconeAlunos} alt="Ícone disciplina" />
                      </div>
                      <div className="cards-comparativa-quantidade-texto">
                        <p>Estudantes que realizaram a prova:</p>
                        <span>
                          {dados.aplicacaoPsp?.realizaramProva ?? "-"}
                        </span>
                      </div>
                    </div>

                    {/* Nível */}
                    <div className="cards-comparativa-nivel-corpo">
                      <div className="cards-comparativa-nivel-icone">
                        <span
                          style={{
                            backgroundColor: getNivelColor(
                              dados?.aplicacaoPsp?.nivelProficiencia ?? "",
                            ),
                          }}
                        ></span>
                      </div>
                      <div className="cards-comparativa-nivel-texto">
                        <span>
                          {dados.aplicacaoPsp?.nivelProficiencia ?? "-"}
                        </span>
                        <p>Nível de proficiência</p>
                      </div>
                    </div>
                  </div>
                </Col>
              )}

              {/* PSA CARDS */}
              {dados.aplicacoesPsa
                ?.slice()
                .sort((a, b) => {
                  const dataA = parsePeriodo(a?.periodo);
                  const dataB = parsePeriodo(b?.periodo);
                  if (!dataA || !dataB) return 0;
                  return dataA.getTime() - dataB.getTime();
                })
                .map((comparacao, idx) => (
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
                          <span>{comparacao.periodo}</span>
                        </div>
                        <div className="cards-comparativa-valor">
                          <span>Proficiência:</span>
                          <div>{comparacao.mediaProficiencia}</div>
                        </div>
                      </div>

                      {isSME && (
                        <div className="cards-comparativa-quantidade-corpo">
                          <div className="cards-comparativa-quantidade-icone">
                            <img src={iconeUe} alt="Ícone disciplina" />
                          </div>
                          <div className="cards-comparativa-quantidade-texto">
                            <p>UEs que realizaram a prova:</p>
                            <span>{comparacao.realizaramProva}</span>
                          </div>
                        </div>
                      )}

                      <div className="cards-comparativa-quantidade-corpo">
                        <div className="cards-comparativa-quantidade-icone">
                          <img src={iconeAlunos} alt="Ícone disciplina" />
                        </div>
                        <div className="cards-comparativa-quantidade-texto">
                          <p>Estudantes que realizaram a prova:</p>
                          <span>{comparacao.realizaramProva}</span>
                        </div>
                      </div>

                      <div className="cards-comparativa-nivel-corpo">
                        <div className="cards-comparativa-nivel-icone">
                          <span
                            style={{
                              backgroundColor: getNivelColor(
                                comparacao.nivelProficiencia ?? "",
                              ),
                            }}
                          ></span>
                        </div>
                        <div className="cards-comparativa-nivel-texto">
                          <span>{comparacao.nivelProficiencia ?? "-"}</span>
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

      {/* FOOTER */}
      <div className="cards-comparativa-rodape">
        <div>
          <p>
            {isSME
              ? 'Para conferir os dados de proficiência dos estudantes desta Unidade Educacional, clique no botão "Conferir dados da UE"'
              : 'Para conferir os dados de proficiência desta Diretoria Regional de Educação (DRE), clique no botão "Conferir dados da DRE"'}
          </p>
        </div>
        <div>
          {isUE && (
            <BotaoIrParaComparativo
              dreId={dreId}
              escola={{
                ueId: dados.ueId.toString(),
                descricao: dados.ueNome,
              }}
              aplicacaoId={getAplicacaoId()}
              componenteCurricularId={dados.disciplinaid ?? 0}
              ano={ano}
              visao={visao}
            />
          )}

          {isSME && (
            <BotaoIrParaComparativo
              dreId={dreId}
              escola={{
                ueId: "",
                descricao: "",
              }}
              aplicacaoId={0}
              componenteCurricularId={0}
              ano={ano}
              visao={visao}
            />
          )}
        </div>
      </div>
    </Card>
  );
};

export default CardsComparativa;

// ------------------------------------------------------------
// 🔹 Helper Functions
// ------------------------------------------------------------
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
      return "#B0B0B0";
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
