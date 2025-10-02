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

  const linkRetorno = "https://serap.sme.prefeitura.sp.gov.br/";

  useEffect(() => {
    buscaAplicacoes();
  }, []);

  useEffect(() => {
    if (aplicacaoSelecionada)
      buscaComponentesCurriculares();
  }, [aplicacaoSelecionada]);

  useEffect(() => {
    if (aplicacaoSelecionada && componenteSelecionado)
      buscaAnosEscolares();
  }, [aplicacaoSelecionada, componenteSelecionado]);

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
        </div>
      </div>
    </>
  );
};

export default CompararDadosSme;
