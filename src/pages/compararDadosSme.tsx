import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Card, Col, Row, Select } from "antd";
import { Header } from "antd/es/layout/layout";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "./compararDadosSme.css";
import {
  getAnosAplicacaoVisaoSme,
  getAnosEscolaresUeVisaoSme,
  getComponentesCurricularesVisaoSme,
} from "../servicos/compararDadosSme/compararDadosSmeService";
import FiltroAplicacaoComponenteCurricularAno from "../componentes/filtro/filtroCompararDados/filtroAplicacaoComponenteCurricularAno";
import FiltroComparativoDresUes from "../componentes/filtro/filtroComparativoDresUEs/filtroComparativoDresUes";
import { CardsComparativaProps, CardsComparativaUnidadeEducacionalProps } from "../interfaces/cardsComparativaProps";
import CardsComparativa from "../componentes/cards/cardsComparativa/cardsComparativa";
import iconeMais from "../assets/icon-mais.svg";
import mock from "../mocks/cardsComparativasDres.json"
import mock2 from "../mocks/graficoEvolucaoDre.json"
import GraficoEvolucaoDre from "../componentes/grafico/GraficoEvolucaoDre";

const CompararDadosSme: React.FC = () => {
  const [aplicacoes, setAplicacoes] = useState<ParametrosPadraoAntDesign[]>([]);
  const [componentesCurriculares, setComponentesCurriculares] = useState<
    ParametrosPadraoAntDesign[]
  >([]);
  const [anos, setAnos] = useState<ParametrosPadraoAntDesign[]>([]);

  const [aplicacaoSelecionada, setAplicacaoSelecionada] =
    useState<ParametrosPadraoAntDesign | null>();

  const [componenteSelecionado, setComponenteCurricularSelecionado] =
    useState<ParametrosPadraoAntDesign | null>();

  const [anoSelecionado, setAnoSelecionado] =
    useState<ParametrosPadraoAntDesign | null>();

  const [listaDres, setListaDres] = useState<ParametrosPadraoAntDesign[]>([
    {
      value: "0",
      label: "Todas",
    },
  ]);
  const [dreSelecionada, setDreSelecionada] =
    useState<ParametrosPadraoAntDesign>({
      value: "0",
      label: "Todas",
    });

  const linkRetorno = "https://serap.sme.prefeitura.sp.gov.br/";

  const [dres, setDres] = useState<CardsComparativaProps>();
  const [mostrarExibirMais, setMostrarExibirMais] = useState(true);
    const [itensPorPagina, setItensPorPagina] = useState(10);
  

  useEffect(() => {
    buscaAplicacoes();
  }, []);

  useEffect(() => {
    if (aplicacaoSelecionada) buscaComponentesCurriculares();
  }, [aplicacaoSelecionada]);

  useEffect(() => {
    if (aplicacaoSelecionada && componenteSelecionado) buscaAnosEscolares();
  }, [aplicacaoSelecionada, componenteSelecionado]);

   useEffect(() => {
      if (
        dreSelecionada &&
        aplicacaoSelecionada &&
        componenteSelecionado &&
        anoSelecionado &&
        itensPorPagina
      )
        preencheCardsDre();
    }, [
      dreSelecionada,
      aplicacaoSelecionada,
      componenteSelecionado,
      anoSelecionado,
      itensPorPagina,
    ]);

  const buscaAplicacoes = async () => {
    try {
      const aplicacoes: number[] = await getAnosAplicacaoVisaoSme();

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
      const anosEscolares: FiltroChaveValor[] =
        await getAnosEscolaresUeVisaoSme(
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

  const selecionaAno = async (value: string, option: any) => {
    const obj: ParametrosPadraoAntDesign = {
      label: option.label,
      value: value,
    };
    setAnoSelecionado(obj);
  };

  const selecionaAplicacao = async (value: string, option: any) => {
    const obj: ParametrosPadraoAntDesign = {
      label: option.label,
      value: value,
    };
    setAplicacaoSelecionada(obj);
  };

  const selecionaComponenteCurricular = async (value: string, option: any) => {
    const obj: ParametrosPadraoAntDesign = {
      label: option.label,
      value: value,
    };
    setComponenteCurricularSelecionado(obj);
  };

  const alterarDreUe = async (value: string, option: any) => {
    const ueSelecionada: ParametrosPadraoAntDesign = {
      label: option.label,
      value: value,
    };
    setDreSelecionada(ueSelecionada);
  };

  const exibirMais = async () => {
    if (dres) {
      if (itensPorPagina >= dres.total) setMostrarExibirMais(false);
      else setItensPorPagina(itensPorPagina + 10);
    }
  };

  const preencheCardsDre = async () => {
      try {
        const dreEscolhida =
          dreSelecionada && dreSelecionada.value != 0
            ? dreSelecionada.value.toString()
            : "";


        const getDresComparativas = mock
  
        /*const getUesComparativas: CardsComparativaProps = await getComporativoUe(
          dreSelecionada,
          Number(componenteSelecionado!.value),
          Number(aplicacaoSelecionada!.value),
          Number(anoSelecionado?.value),
          itensPorPagina,
          ueEscolhida
        );*/
        setDres(getDresComparativas);
  
        if (getDresComparativas.ues.length < 10) setMostrarExibirMais(false);
        else setMostrarExibirMais(true);
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
                <span className="texto-retorno-compara-dre">
                  Retornar à tela inicial
                </span>
              </Link>
              <span className="titulo-principal-compara-dre">
                Boletim de provas
              </span>
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
          <FiltroAplicacaoComponenteCurricularAno
            dreSelecionadaNome={undefined}
            aplicacaoSelecionada={aplicacaoSelecionada}
            componenteSelecionado={componenteSelecionado}
            anoSelecionado={anoSelecionado}
            aplicacoes={aplicacoes}
            componentesCurriculares={componentesCurriculares}
            anos={anos}
            selecionaAno={selecionaAno}
            selecionaAplicacao={selecionaAplicacao}
            selecionaComponenteCurricular={selecionaComponenteCurricular}
          ></FiltroAplicacaoComponenteCurricularAno>
          <br />
          <Card className="comparar-dados-card-conteudo">

                <GraficoEvolucaoDre

                dados={mock2}   
                aplicacaoSelecionada={aplicacaoSelecionada}
              componenteSelecionado={componenteSelecionado}
              anoSelecionado={anoSelecionado}             
                ></GraficoEvolucaoDre>




            <FiltroComparativoDresUes
              dados={listaDres}
              valorSelecionado={dreSelecionada}
              alterarDreUe={alterarDreUe}
              aplicacaoSelecionada={aplicacaoSelecionada}
              componenteSelecionado={componenteSelecionado}
              anoSelecionado={anoSelecionado}
              visao="sme"
            />

            <br>
            
            
            
            </br>
          
          



          {dres != undefined &&
              dres.ues.map(
                (
                  item: CardsComparativaUnidadeEducacionalProps,
                  index: number
                ) => {
                  return (
                    <CardsComparativa
                      key={index}
                      dados={item}
                      dreId={dres.dreId}
                      ano={anoSelecionado || null}
                      visao="sme"
                    />
                  );
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

export default CompararDadosSme;
