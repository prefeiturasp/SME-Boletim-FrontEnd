import React from "react";
import "./cardsComparativa.css";
import Card from "antd/es/card/Card";
import cardsComparativa from "../../../mocks/cardsComparativas.json"
import { Col, Row } from "antd";


const CardsComparativa: React.FC<CardsComparativaProps> = ({
    objeto
}) => {

    return (
        <>
            <Card className="cards-comparativa-corpo">
                <div className="cards-comparativa-header">
                    <div className="cards-comparativa-titulo">
                        <b>{cardsComparativa.dre}</b>
                    </div>
                    <div className="cards-comparativa-variacao">
                        <span className="cards-comparativa-variacao-label">Variação:</span>
                        <div className="cards-comparativa-variacao-valor">+{cardsComparativa.variacao}%</div>
                    </div>
                </div>

                <Row gutter={[16, 16]} className="cards-comparativa-blocos">
                    {(() => {
                        const dinamicos = cardsComparativa?.aplicacao?.length ?? 0;
                        const totalCards = 1 + dinamicos; // 1 fixo + dinâmicos
                        const span = 24 / totalCards; // divide o grid igualmente

                        return (
                            <>
                                <Col xs={24} sm={24} md={24} lg={span} key="prova-sp">
                                    <div className="cards-comparativa-bloco-cinza">
                                        <div className="cards-comparativa-bloco-cinza-header">
                                            <div className="cards-comparativa-prova-data">
                                                <b>{cardsComparativa.provaSp.descricaoProva}</b>
                                                <span>{cardsComparativa.provaSp.mesAno}</span>
                                            </div>
                                            <div className="cards-comparativa-valor">
                                                <span>Proficiência:</span>
                                                <div>{cardsComparativa.provaSp.valorProficiencia}</div>
                                            </div>

                                        </div>
                                    </div>
                                </Col>
                                {cardsComparativa?.aplicacao
                                    ?.slice()
                                    .sort((a: any, b: any) => {
                                        const dataA = parsePeriodo(a?.periodo);
                                        const dataB = parsePeriodo(b?.periodo);
                                        if (!dataA || !dataB) return 0;
                                        return dataA.getTime() - dataB.getTime();
                                    }).map((comparacao: any, idx: number) => (
                                        <Col
                                            key={idx}
                                            xs={24}
                                            sm={24}
                                            md={24}
                                            lg={span}
                                            style={{ paddingLeft: "0px" }}
                                        >
                                            <div className="cards-comparativa-bloco-cinza">
                                                <div className="cards-comparativa-bloco-cinza-header">
                                                    <div className="cards-comparativa-prova-data">
                                                        <b>{comparacao.descricaoProva}</b>
                                                        <span>{comparacao.mesAno}</span>
                                                    </div>
                                                    <div className="cards-comparativa-valor">
                                                        <span>Proficiência:</span>
                                                        <div>{comparacao.valorProficiencia}</div>
                                                    </div>

                                                </div>
                                            </div>


                                        </Col>

                                    ))}


                            </>
                        );

                    })()}
                </Row>
            </Card>
        </>

    );
};

export default CardsComparativa;

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