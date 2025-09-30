import React from 'react';
import { Breadcrumb, Button, Card, Col, Row, Select } from "antd";
import { Header } from "antd/es/layout/layout";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "./compararDadosSme.css";


const CompararDadosSme: React.FC = () => {

    const linkRetorno = "https://serap.sme.prefeitura.sp.gov.br/";
    const [searchParams] = useSearchParams();

    let dreSelecionada = "";
    let dreSelecionadaNome = "";

    try {
        dreSelecionada = searchParams?.get("dreUrlSelecionada") || "";
        dreSelecionadaNome = searchParams?.get("dreSelecionadaNome") || "";
    } catch (error) {
        console.warn("Erro ao acessar searchParams:", error);
        dreSelecionada = "";
        dreSelecionadaNome = "";
    }


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