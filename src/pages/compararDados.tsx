import { Breadcrumb, Button, Card, Row } from "antd";
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

import iconeMais from "../assets/icon-mais.svg";
import {
  CardsComparativaProps,
  CardsComparativaUnidadeEducacionalProps,
} from "../interfaces/cardsComparativaProps";
import FiltroAplicacaoComponenteCurricularAno from "../componentes/filtro/filtroCompararDados/filtroAplicacaoComponenteCurricularAno";

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
  const [dreSelecionadaNome, setDreSelecionadaNome] = useState("");
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
    const optNum2: string = dreParam2;

    setDreSelecionada(optNum);
    setDreSelecionadaNome(optNum2);
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
          <FiltroAplicacaoComponenteCurricularAno
            dreSelecionadaNome={dreSelecionadaNome}
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
                  return (
                    <CardsComparativa
                      key={index}
                      dados={item}
                      dreId={ues.dreId}
                      ano={anoSelecionado || null}
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

export default CompararDados;
