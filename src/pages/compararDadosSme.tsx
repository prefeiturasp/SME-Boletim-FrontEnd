import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Card, Col, Row, Select } from "antd";
import { Header } from "antd/es/layout/layout";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "./compararDadosSme.css";
import {
  getAnosAplicacaoVisaoSme,
  getAnosEscolaresUeVisaoSme,
  getCardsDre,
  getComponentesCurricularesVisaoSme,
  getDadosTabelaSME,
  getGraficoSME,
  getListaDres,
} from "../servicos/compararDadosSme/compararDadosSmeService";
import FiltroAplicacaoComponenteCurricularAno from "../componentes/filtro/filtroCompararDados/filtroAplicacaoComponenteCurricularAno";
import FiltroComparativoDresUes from "../componentes/filtro/filtroComparativoDresUEs/filtroComparativoDresUes";
import CardsComparativa from "../componentes/cards/cardsComparativa/cardsComparativa";
import iconeMais from "../assets/icon-mais.svg";

import {
  CardsComparativaDiretoriaReginalProps,
  CardsComparativaSMEProps,
} from "../interfaces/cardsComparativaSMEProps";
import LoadingBox from "../componentes/loadingBox/loadingBox";
import { ValueTabelaComparativaProps } from "../interfaces/tabelaComparativaProps";
import TabelaComparativaSME from "../componentes/tabela/tabelaComparativaSme/tabelaComparativaSme";
import GraficoEvolucaoDre from "../componentes/grafico/graficoEvolucaoDre";

const CompararDadosSme: React.FC = () => {
  const [estaCarregando, setEstaCarregando] = useState(false);
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

  const [dadosGrafico, setDadosGrafico] = useState<any>();

  const linkRetorno = "https://serap.sme.prefeitura.sp.gov.br/";

  const [cardsDres, setCardsDres] = useState<CardsComparativaSMEProps>();
  const [mostrarExibirMais, setMostrarExibirMais] = useState(true);
  const [itensPorPagina, setItensPorPagina] = useState(10);
  const [dadosTabela, setDadosTabela] =
    React.useState<ValueTabelaComparativaProps>();

  useEffect(() => {
    buscaAplicacoes();
  }, []);

  useEffect(() => {
    if (aplicacaoSelecionada) buscaComponentesCurriculares();
  }, [aplicacaoSelecionada]);

  useEffect(() => {
    if (aplicacaoSelecionada && componenteSelecionado) buscaAnosEscolares();
  }, [aplicacaoSelecionada, componenteSelecionado]);

  /*useEffect(() => {
    if (!aplicacaoSelecionada || !componenteSelecionado || !anoSelecionado)
      return;
    (async () => {
      setEstaCarregando(true);
      await Promise.all([
        getDres(),
        preencheGraficoSME(),
        preencheTabela(),
        preencheCardsDre(),
      ]);
      setEstaCarregando(false);
    })();
  }, [aplicacaoSelecionada, componenteSelecionado, anoSelecionado]);*/

  useEffect(() => {
    if (aplicacaoSelecionada && componenteSelecionado && anoSelecionado) {
      preencheGraficoSME();
      preencheTabela();
      preencheCardsDre();
    }
  }, [aplicacaoSelecionada, componenteSelecionado, anoSelecionado]);

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

  const getDres = async () => {
    try {
      const resposta: any[] = await getListaDres(
        Number(aplicacaoSelecionada?.value),
        Number(componenteSelecionado?.value),
        Number(anoSelecionado?.value)
      );

      const opcoesDre = (resposta ?? []).map((item: any) => ({
        value: item.dreId,
        label: item.dreNome,
      }));

      setListaDres([{ value: 0, label: "Todas" }, ...opcoesDre]);
    } catch (error) {
      console.log(error);
    }
  };

  const alterarDreUe = async (value: string, option: any) => {
    const ueSelecionada: ParametrosPadraoAntDesign = {
      label: option.label,
      value: value,
    };
    setDreSelecionada(ueSelecionada);
  };

  const exibirMais = async () => {
    if (cardsDres) {
      if (itensPorPagina >= cardsDres.total) setMostrarExibirMais(false);
      else setItensPorPagina(itensPorPagina + 10);
    }
  };

  const preencheGraficoSME = async () => {
    try {
      setEstaCarregando(true);

      const retorno = await getGraficoSME(
        Number(aplicacaoSelecionada!.value),
        Number(componenteSelecionado!.value),
        Number(anoSelecionado?.value)
      );

      setDadosGrafico(retorno);
    } catch (error) {
      console.log(error);
      setEstaCarregando(false);
    }
  };

  const preencheCardsDre = async () => {
    try {
      setEstaCarregando(true);
      const dreEscolhida =
        dreSelecionada.label === "Todas" ? 0 : Number(dreSelecionada.value);

      const getDresComparativas: CardsComparativaSMEProps = await getCardsDre(
        dreEscolhida,

        Number(aplicacaoSelecionada!.value),
        Number(componenteSelecionado!.value),
        Number(anoSelecionado?.value),
        itensPorPagina
      );

      setCardsDres(getDresComparativas);

      if (getDresComparativas.dres.length < 10) setMostrarExibirMais(false);
      else setMostrarExibirMais(true);
      setEstaCarregando(false);
    } catch (error) {
      console.log(error);
      setEstaCarregando(false);
    }
  };

  const preencheTabela = async () => {
    try {
      const ValueTabela: ValueTabelaComparativaProps = await getDadosTabelaSME(
        Number(aplicacaoSelecionada!.value ?? 0),
        Number(componenteSelecionado!.value ?? 0),
        Number(anoSelecionado?.value ?? 0)
      );

      const dadosTratados = ValueTabela;
      tratamentoDescricao(dadosTratados);

      setDadosTabela(dadosTratados);
    } catch (error) {
      console.log(error);
    }
  };

  const tratamentoItemRepetido = (
    dados: ValueTabelaComparativaProps
  ): ValueTabelaComparativaProps => {
    const vistos = new Set<string>();
    const aplicacaoUnica = dados.aplicacao.filter((item) => {
      if (vistos.has(item.mes)) return false;
      vistos.add(item.mes);
      return true;
    });

    return { ...dados, aplicacao: aplicacaoUnica };
  };

  const tratamentoDescricao = (dados: ValueTabelaComparativaProps) => {
    dados.aplicacao.forEach((item) => {
      if (item.descricao) {
        item.descricao = item.descricao
          .replace("Prova São Paulo", "PSP")
          .replace("Prova Saberes e Aprendizagens", "PSA");
      }
    });
  };

  return (
    <>
      {estaCarregando && <LoadingBox />}
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
            <TabelaComparativaSME
              dados={dadosTabela}
              aplicacaoSelecionada={aplicacaoSelecionada}
              componenteSelecionado={componenteSelecionado}
              anoSelecionado={anoSelecionado}
            />

            <br />
            <GraficoEvolucaoDre
              dados={dadosGrafico}
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

            <br></br>

            {cardsDres != undefined &&
              cardsDres.dres.map(
                (
                  item: CardsComparativaDiretoriaReginalProps,
                  index: number
                ) => {
                  return (
                    <CardsComparativa
                      key={index}
                      dados={item}
                      dreId={item.dreId}
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
