import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Card, Col, Row, Select } from "antd";
import { Header } from "antd/es/layout/layout";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "./compararDadosSme.css";
import {
    getAnosAplicacaoVisaoSme,
    getAnosEscolaresUeVisaoSme,
    getComponentesCurricularesVisaoSme
} from '../servicos/compararDadosSme/compararDadosSme';


const CompararDadosSme: React.FC = () => {

    const [aplicacoes, setAplicacoes] = useState<ParametrosPadraoAntDesign[]>([]);
    const [componentesCurriculares, setComponentesCurriculares] = useState<
        ParametrosPadraoAntDesign[]
    >([]);
    const [anos, setAnos] = useState<ParametrosPadraoAntDesign[]>([]);


    const [dreSelecionada, setDreSelecionada] = useState(0);

    const [dreSelecionadaNome, setDreSelecionadaNome] = useState(0);

    const [aplicacaoSelecionada, setAplicacaoSelecionada] =
        useState<ParametrosPadraoAntDesign | null>();

    const [componenteSelecionado, setComponenteCurricularSelecionado] =
        useState<ParametrosPadraoAntDesign | null>();

    const [anoSelecionado, setAnoSelecionado] =
        useState<ParametrosPadraoAntDesign | null>();

    const linkRetorno = "https://serap.sme.prefeitura.sp.gov.br/";
    const [searchParams] = useSearchParams();

    useEffect(() => {
        try {
            const dreParam = searchParams.get("dreUrlSelecionada");
            const dreParam2 = searchParams.get("dreSelecionadaNome");

            if (!dreParam || !dreParam2) return;

            const optNum = Number(dreParam);
            if (Number.isNaN(optNum)) return;


            if (!dreParam2) return;
            const optNum2 = dreParam2;

            setDreSelecionada(optNum);
            setDreSelecionadaNome(Number(optNum2));

        }
        catch (error) {
            console.warn("Erro ao acessar searchParams:", error);
        }
    }, []);

    useEffect(() => {
        if (dreSelecionada != 0) buscaAplicacoes();
    }, [dreSelecionada]);

    useEffect(() => {
        if (dreSelecionada != 0 && aplicacaoSelecionada)
            buscaComponentesCurriculares();
    }, [dreSelecionada, aplicacaoSelecionada]);

    useEffect(() => {
        if (dreSelecionada != 0 && aplicacaoSelecionada && componenteSelecionado)
            buscaAnosEscolares();
    }, [dreSelecionada, aplicacaoSelecionada, componenteSelecionado]);

    const buscaAplicacoes = async () => {
        try {
            const aplicacoes: number[] = await getAnosAplicacaoVisaoSme(dreSelecionada);

            const listaAplicacoes: ParametrosPadraoAntDesign[] = [];
            aplicacoes.map((item) => {
                listaAplicacoes.push({
                    value: item,
                    label: item.toString(),
                });
            });
            setAplicacoes(listaAplicacoes);
            if (listaAplicacoes.length > 0)
                setAplicacaoSelecionada(listaAplicacoes[0]);
        } catch (error) {
            console.log(error);
        }
    };

    const buscaComponentesCurriculares = async () => {
        try {
            let listaAnt: ParametrosPadraoAntDesign[] = [];
            const materiasEscolares: FiltroChaveValor[] =
                await getComponentesCurricularesVisaoSme(
                    dreSelecionada,
                    Number(aplicacaoSelecionada!.value)
                );

            listaAnt = materiasEscolares.map((item) => ({
                value: item.valor,
                label: item.texto,
            }));

            setComponentesCurriculares(listaAnt);
            if (listaAnt.length > 0) setComponenteCurricularSelecionado(listaAnt[0]);
        } catch (error) {
            console.log(error);
        }
    };

    const buscaAnosEscolares = async () => {
        try {
            let listaAnt: ParametrosPadraoAntDesign[] = [];
            const anosEscolares: FiltroChaveValor[] = await getAnosEscolaresUeVisaoSme(
                dreSelecionada,
                Number(aplicacaoSelecionada!.value),
                Number(componenteSelecionado!.value)
            );

            listaAnt = anosEscolares.map((item) => ({
                value: item.valor,
                label: item.texto,
            }));

            setAnos(listaAnt);
            if (anosEscolares.length > 0) setAnoSelecionado(listaAnt[0]);
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <>
            <div className="app-container">
                <Row>
                    <Header className="cabecalho-compara-dre">
                        <div className="linha-superior-compara-dre">
                            <Link to={linkRetorno} className="retornar-compara-dre">
                                <ArrowLeftOutlined className="icone-retorno-compara-dre" />
                                <span className="texto-retorno-compara-dre">Retornar à tela inicial</span>
                            </Link>
                            <span className="titulo-principal-compara-dre">Boletim de provas</span>
                        </div>
                        <div className="barra-azul-compara-dre">
                            <Breadcrumb
                                className="breadcrumb-compara-dre"
                                items={[
                                    { title: "Home" },
                                    { title: "Provas" },
                                    { title: "Boletim de provas" },
                                    { title: "Comparativo de Resultados" },
                                ]}
                            />
                            <span className="titulo-secundario-compara-dre">
                                Comparativo de resultados
                            </span>
                        </div>
                    </Header>
                </Row>

                <div className="conteudo-principal-dres">
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <h2 className="titulo-ue-sme" style={{ fontSize: 24 }}>
                                Secretaria Municipal de Educação
                            </h2>
                            <div className="ajustes-padding-cards">
                                <Card title="" variant="borderless" className="card-body-dre">
                                    <div style={{ marginBottom: 32 }}>
                                        <Link
                                            to="/dres"
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 6,
                                                color: "#1976d2",
                                                textDecoration: "none",
                                                margin: "0px",
                                                fontSize: 14,
                                            }}
                                            className="botao-voltar-ues"
                                        >
                                            <ArrowLeftOutlined style={{ fontSize: 18 }} />
                                            Voltar a tela anterior
                                        </Link>
                                    </div>

                                    <p
                                        className="global-texto-padrao"
                                        style={{ marginTop: "0", marginBottom: "16px" }}
                                    >
                                        Aqui, você pode acompanhar a evolução do nível de
                                        proficiência da SME nas diferentes aplicações da Prova São
                                        Paulo e da Prova Saberes e Aprendizagens.
                                    </p>
                                </Card>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
};

export default CompararDadosSme;