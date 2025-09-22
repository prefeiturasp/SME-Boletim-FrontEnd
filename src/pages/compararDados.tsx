import { Breadcrumb, Card, Col, Row, Select } from "antd";
import { Header } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import imagemFluxoDRE from "../assets/Imagem_fluxo_DRE_2.jpg";
const linkRetorno = "https://serap.sme.prefeitura.sp.gov.br/";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "./compararDados.css";
import TabelaComparativa from "../componentes/tabela/tabelaComparativa/tabelaComparativa";
import FiltroComparativoUes from "../componentes/filtro/filtroComparativoUEs/filtroComparativoUes";
import {
  getAnosAplicacaoDre,
  getAnosEscolaresUe,
  getComponentesCurricularesDre,
} from "../servicos/compararDados/compararDadosService";

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

  const [anoSelecionado, setAnoSelecionado] =
    useState<ParametrosPadraoAntDesign | null>();

  const [listaUes, setListaUes] = useState([
    {
      value: "12345",
      label: "DRE SA - EMEF ARMANDO ARRUDA PEREIRA",
    },
  ]);

  const [ueSelecionada, setUeSelecionada] = useState([
    {
      value: "12345",
      label: "DRE SA - EMEF ARMANDO ARRUDA PEREIRA",
    },
  ]);

  const [dreSelecionada, setDreSelecionada] = useState(0);
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
    if (!dreParam) return;

    const optNum = Number(dreParam);
    if (Number.isNaN(optNum)) return;

    setDreSelecionada(optNum);
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

  const alterarUe = async () => {
    //TODO: quando a api estiver pronta iremos trocar os valores do select aqui
    //setUeSelecionada(???)
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

        <Row>
          <div className="imagem-header">
            <img src={imagemFluxoDRE} alt="Fluxo DRE" />
          </div>
        </Row>

        <div className="conteudo-principal-dres">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <h2 className="titulo-ue-sme">
                Secretaria Municipal de Educação
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

                  <p className="global-texto-padrao" style={{ marginTop: "0", marginBottom: "16px" }}>
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
                            setAplicacaoSelecionada(aplicacoes.find(x => x.value === Number(value)));
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
                            setComponenteCurricularSelecionado(componentesCurriculares.find(x => x.value === Number(value)));
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
                            setAnoSelecionado(anos.find(x => x.value === Number(value)));
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
          <Card>
            <TabelaComparativa
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
          </Card>
        </div>
      </div>
    </>
  );
};

export default CompararDados;
