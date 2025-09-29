import { Breadcrumb, Button, Card, Col, Row, Select } from "antd";
import { Layout } from "antd";
const { Header } = Layout;
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
const linkRetorno = "https://serap.sme.prefeitura.sp.gov.br/";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "./compararDados.css";
import TabelaComparativa from "../componentes/tabela/tabelaComparativa/tabelaComparativa";
import FiltroComparativoUes from "../componentes/filtro/filtroComparativoUEs/filtroComparativoUes";
import {
  getAnosAplicacaoDre,
  getAnosEscolaresUe,
  getComponentesCurricularesDre,
  getComporativoUe,
  getListaUes,
} from "../servicos/compararDados/compararDadosService";
import CardsComparativa from "../componentes/cards/cardsComparativa/cardsComparativa";

import mock from "../mocks/cardsComparativas.json";
import iconeMais from "../assets/icon-mais.svg";
import {
  CardsComparativaProps,
  CardsComparativaUnidadeEducacionalProps,
} from "../interfaces/cardsComparativaProps";

const CompararDados: React.FC = () => {
  const [aplicacoes, setAplicacoes] = useState<ParametrosPadraoAntDesign[]>([]);
  const [aplicacaoSelecionada, setAplicacaoSelecionada] =
    useState<ParametrosPadraoAntDesign | null>();

  const [componentesCurriculares, setComponentesCurriculares] = useState<
    ParametrosPadraoAntDesign[]
  >([]);
  const [componenteSelecionado, setComponenteCurricularSelecionado] =
    useState<ParametrosPadraoAntDesign | null>();
  const [anos, setAnos] = useState<ParametrosPadraoAntDesign[]>([]);
  const [ues, setUes] = useState<CardsComparativaProps>();

  const [anoSelecionado, setAnoSelecionado] =
    useState<ParametrosPadraoAntDesign | null>();

  const [listaUes, setListaUes] = useState<ParametrosPadraoAntDesign[]>([
    {
      value: "0",
      label: "Todas",
    },
  ]);
  const [ueSelecionada, setUeSelecionada] = useState<ParametrosPadraoAntDesign>(
    {
      value: "0",
      label: "Todas",
    }
  );

  const [dreSelecionada, setDreSelecionada] = useState(0);
  const [dreSelecionadaNome, setDreSelecionadaNome] = useState('');
  const [itensPorPagina, setItensPorPagina] = useState(10);
  const [mostrarExibirMais, setMostrarExibirMais] = useState(true);
  const [searchParams] = useSearchParams();

  const buscaAplicacoes = async () => {
    try {
      const aplicacoes: number[] = await getAnosAplicacaoDre(dreSelecionada);

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
        await getComponentesCurricularesDre(
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
      const anosEscolares: FiltroChaveValor[] = await getAnosEscolaresUe(
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

  useEffect(() => {
    const dreParam = searchParams.get("dreUrlSelecionada");
    const dreParam2 = searchParams.get("dreSelecionadaNome");

    if (!dreParam || !dreParam2) return;

    const optNum = Number(dreParam);
    if (Number.isNaN(optNum)) return;

    
    if (!dreParam2) return;
    const optNum2:string = dreParam2;

    setDreSelecionada(optNum);
    setDreSelecionadaNome(optNum2)
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

  useEffect(() => {
    if (
      dreSelecionada != 0 &&
      aplicacaoSelecionada &&
      componenteSelecionado &&
      anoSelecionado
    )
      getUes();
  }, [
    dreSelecionada,
    aplicacaoSelecionada,
    componenteSelecionado,
    anoSelecionado,
  ]);

  useEffect(() => {
    if (
      dreSelecionada != 0 &&
      aplicacaoSelecionada &&
      componenteSelecionado &&
      anoSelecionado &&
      itensPorPagina &&
      ueSelecionada
    )
      preencheCardsUe();
  }, [
    dreSelecionada,
    aplicacaoSelecionada,
    componenteSelecionado,
    anoSelecionado,
    itensPorPagina,
    ueSelecionada,
  ]);

  const getUes = async () => {
    try {
      const resposta: any[] = await getListaUes(
        dreSelecionada,
        Number(aplicacaoSelecionada?.value),
        Number(componenteSelecionado?.value),
        Number(anoSelecionado?.value)
      );

      const opcoesUe = (resposta ?? []).map((item: any) => ({
        value: item.ueId,
        label: item.ueNome,
      }));

      setListaUes([{ value: 0, label: "Todas" }, ...opcoesUe]);
    } catch (error) {
      console.log(error);
    }
  };

  const alterarUe = async (value: string, option: any) => {
    const ueSelecionada: ParametrosPadraoAntDesign = {
      label: option.label,
      value: value,
    };
    setUeSelecionada(ueSelecionada);
  };

  const preencheCardsUe = async () => {
    try {
      const ueEscolhida =
        ueSelecionada && ueSelecionada.value != 0
          ? ueSelecionada.value.toString()
          : "";

      const getUesComparativas: CardsComparativaProps = await getComporativoUe(
        dreSelecionada,
        Number(componenteSelecionado!.value),
        Number(aplicacaoSelecionada!.value),
        Number(anoSelecionado?.value),
        itensPorPagina,
        ueEscolhida
      );
      setUes(getUesComparativas);

      if (getUesComparativas.ues.length < 10) setMostrarExibirMais(false);
      else setMostrarExibirMais(true);
    } catch (error) {
      console.log(error);
    }
  };

  const exibirMais = async () => {
    if (ues) {
      if (itensPorPagina >= ues.total) setMostrarExibirMais(false);
      else setItensPorPagina(itensPorPagina + 10);
    }
  };

  return (
    <>
      <div className="app-container">
        <Row>
          <Header className="cabecalho">
            <div className="linha-superior">
              <Link to={linkRetorno} className="retornar">
                <ArrowLeftOutlined className="icone-retorno" />
                <span className="texto-retorno">Retornar à tela inicial</span>
              </Link>
              <span className="titulo-principal">Boletim de provas</span>
            </div>
            <div className="barra-azul">
              <Breadcrumb
                className="breadcrumb"
                items={[
                  { title: "Home" },
                  { title: "Provas" },
                  { title: "Boletim de provas" },
                  { title: "Comparativo de Resultados" },
                ]}
              />
              <span className="titulo-secundario">
                Comparativo de resultados
              </span>
            </div>
          </Header>
        </Row>

        

        <div className="conteudo-principal-dres">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <h2 className="titulo-ue-sme">
                {dreSelecionadaNome}
              </h2>

              <div className="ajustes-padding-cards">
                <Card title="" variant="borderless" className="card-body-dre">
                  <div style={{ marginBottom: 32 }}>
                    <Link
                      to="/ues"
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

                  <div className="comparar-dados-caixa-cinza">
                    <div className="comparar-dados-caixa-texto">
                      {" "}
                      Para começar, selecione o componente curricular, o ano
                      escolar e o ano de aplicação que deseja visualizar. Caso o
                      ano ainda esteja em andamento, só serão exibidos os
                      resultados disponíveis até agora.
                    </div>

                    <div className="comparar-dados-filtros-card">
                      <div className="comparar-dados-selects">
                        <label className="label-filtro-dre">
                          Ano da aplicação
                        </label>
                        <Select
                          data-testid="select-aplicacao"
                          showSearch
                          placeholder="Selecione uma aplicação..."
                          className="select-custom"
                          onChange={(value) => {
                            setAplicacaoSelecionada(
                              aplicacoes.find((x) => x.value === Number(value))
                            );
                          }}
                          value={aplicacaoSelecionada || undefined}
                          notFoundContent="Nenhuma aplicação encontrada"
                          filterOption={(input, option: any) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={aplicacoes}
                        />
                      </div>
                      <div className="comparar-dados-selects">
                        <label className="label-filtro-dre">
                          Componente curricular
                        </label>
                        <Select
                          data-testid="select-aplicacao"
                          showSearch
                          placeholder="Selecione uma aplicação..."
                          className="select-custom"
                          onChange={(value) => {
                            setComponenteCurricularSelecionado(
                              componentesCurriculares.find(
                                (x) => x.value === Number(value)
                              )
                            );
                          }}
                          value={componenteSelecionado || undefined}
                          notFoundContent="Nenhuma aplicação encontrada"
                          filterOption={(input, option: any) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={componentesCurriculares}
                        />
                      </div>
                      <div className="comparar-dados-selects">
                        <label className="label-filtro-dre">Ano</label>
                        <Select
                          showSearch
                          placeholder="Ano escolar"
                          className="select-custom"
                          onChange={(value) => {
                            setAnoSelecionado(
                              anos.find((x) => x.value === Number(value))
                            );
                          }}
                          value={anoSelecionado || undefined}
                          notFoundContent="Nenhum ano encontrado"
                          filterOption={(input, option: any) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={anos}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </Col>
          </Row>
          <br />
          <Card className="comparar-dados-card-conteudo">
            <TabelaComparativa
              dreSelecionada={dreSelecionada}
              aplicacaoSelecionada={aplicacaoSelecionada}
              componenteSelecionado={componenteSelecionado}
              anoSelecionado={anoSelecionado}              
            />
            <br />
            <FiltroComparativoUes
              dados={listaUes}
              valorSelecionado={ueSelecionada}
              alterarUe={alterarUe}
              aplicacaoSelecionada={aplicacaoSelecionada}
              componenteSelecionado={componenteSelecionado}
              anoSelecionado={anoSelecionado}
            />
            <br />

            {ues != undefined &&
              ues.ues.map(
                (
                  item: CardsComparativaUnidadeEducacionalProps,
                  index: number
                ) => {
                  return <CardsComparativa 
                    key={index} 
                    dados={item} 
                    dreId={ues.dreId}
                    ano={anoSelecionado || null}
                  />;
                }
              )}

            {mostrarExibirMais == true ? (
              <div className="comparar-dados-transparente">
                <Button
                  variant="outlined"
                  className="comparar-dados-transparente-exibir-mais"
                  onClick={exibirMais}
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
            ) : (
              <></>
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default CompararDados;
