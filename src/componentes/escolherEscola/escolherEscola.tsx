import React, { useEffect, useRef, useState } from "react";
import { Col, Row, Card, Select, Badge, Checkbox, Radio } from "antd";
import "./escolherEscola.css";
import { useDispatch, useSelector } from "react-redux";
import { selecionarEscola } from "../../redux/slices/escolaSlice";
import { RootState } from "../../redux/store";
import { servicos } from "../../servicos";
import { setFilters } from "../../redux/slices/filtrosSlice";
import FiltroLateral from "../filtro/filtroLateral";
import { setFiltroDados } from "../../redux/slices/filtroCompletoSlice";
import { filtroCarregado } from "../../redux/slices/filtroCarregado";
import { useLocation } from "react-router-dom";

const EscolherEscola = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [abrangencia, setAbrangencia] = useState<any[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Filtro>({
    niveis: [],
    niveisAbaPrincipal: [],
    anosEscolares: [],
    componentesCurriculares: [],
    anosEscolaresRadio: [],
    componentesCurricularesRadio: [],
    nivelMinimo: 0,
    nivelMinimoEscolhido: 0,
    nivelMaximo: 0,
    nivelMaximoEscolhido: 0,
    turmas: [],
    variacoes: [],
    nomeEstudante: "",
    eolEstudante: "",
  });

  const location = useLocation();

  const dispatch = useDispatch();
  const escolaSelecionada = useSelector(
    (state: RootState) => state.escola.escolaSelecionada
  );

  const aplicacaoSelecionada = useSelector(
    (state: RootState) => state.nomeAplicacao.id
  );

  const filtroDados = useSelector((state: RootState) => state.filtroCompleto);
  const filtrosSelecionados = useSelector((state: RootState) => state.filtros);
  const activeTab = useSelector((state: RootState) => state.tab.activeTab);
  const filtroUrlJaAplicado = useRef(false);

  const buscarAbrangencias = async () => {
    try {
      const resposta = await servicos.get("/api/abrangencia", {});

      const escolasValidas = resposta.filter(
        (item: any) => item && item.ueId && item.descricao
      );

      setAbrangencia(escolasValidas);
    } catch (error) {
      console.error("Erro ao buscar escolas:", error);
    }
  };

  const buscarFiltros = async (escolaSelecionada: {
    ueId: string | null;
    descricao: string | null;
  }) => {
    try {
      const resposta: any = await servicos.get(
        `/api/boletimescolar/${aplicacaoSelecionada}/${escolaSelecionada.ueId}/filtros`
      );

      const novosFiltros = {
        niveis: [],
        niveisAbaPrincipal: resposta.niveis || [],
        anosEscolares: [],
        componentesCurriculares: [],
        anosEscolaresRadio:
          resposta.anosEscolares?.length > 0 ? [resposta.anosEscolares[0]] : [],
        componentesCurricularesRadio:
          resposta.componentesCurriculares?.length > 0
            ? [resposta.componentesCurriculares[0]]
            : [],
        nivelMinimo: resposta.nivelMinimo || 0,
        nivelMinimoEscolhido: resposta.nivelMinimo || 0,
        nivelMaximo: resposta.nivelMaximo || 0,
        nivelMaximoEscolhido: resposta.nivelMaximo || 0,
        turmas: [],
        nomeEstudante: "",
        eolEstudante: "",
      };

      dispatch(setFilters(novosFiltros));
      dispatch(setFiltroDados(resposta));
      dispatch(filtroCarregado(true));
    } catch (error) {
      console.error("Erro ao buscar os filtros laterais:", error);
    }
  };

  useEffect(() => {
    if (escolaSelecionada.ueId != null && aplicacaoSelecionada) {
      buscarFiltros(escolaSelecionada);
    }
  }, [escolaSelecionada, aplicacaoSelecionada]);

  useEffect(() => {
    buscarAbrangencias();
  }, [aplicacaoSelecionada]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ueIdDaUrl = params.get("ueSelecionada");

    if (abrangencia.length > 0) {
      if (
        ueIdDaUrl &&
        abrangencia.some((a) => String(a.ueId) === ueIdDaUrl) &&
        !filtroUrlJaAplicado.current
      ) {
        const escolaDaUrl = abrangencia.find(
          (a) => String(a.ueId) === ueIdDaUrl
        );
        if (escolaSelecionada?.ueId !== escolaDaUrl.ueId) {
          dispatch(
            selecionarEscola({
              ueId: escolaDaUrl.ueId,
              descricao: escolaDaUrl.descricao,
            })
          );
        }
        filtroUrlJaAplicado.current = true;
      } else if (
        (!ueIdDaUrl ||
          !abrangencia.some((a) => String(a.ueId) === ueIdDaUrl)) &&
        (!escolaSelecionada || escolaSelecionada.ueId == null)
      ) {
        const primeiraEscola = abrangencia[0];
        dispatch(
          selecionarEscola({
            ueId: primeiraEscola.ueId,
            descricao: primeiraEscola.descricao,
          })
        );
      }
    }
  }, [abrangencia, location.search, dispatch, escolaSelecionada]);

  const handleChange = (value: string, option: any) => {
    dispatch(selecionarEscola({ ueId: value, descricao: option.label }));
  };

  const abrirFiltro = () => {
    setOpen(true);
    setLoading(false);
  };

  const opcoes = abrangencia.map((item) => ({
    value: `${item.ueId}`,
    label: item.descricao,
  }));

  let totalFiltrosSelecionados = 0;

  if (activeTab === "1" || activeTab === "2") {
    totalFiltrosSelecionados =
      filtrosSelecionados.niveisAbaPrincipal.length +
      filtrosSelecionados.anosEscolares.length +
      filtrosSelecionados.componentesCurriculares.length;
  }

  if (activeTab === "3") {
    totalFiltrosSelecionados =
      filtrosSelecionados.anosEscolares.length +
      filtrosSelecionados.componentesCurriculares.length +
      filtrosSelecionados.niveis.length +
      (filtrosSelecionados.nomeEstudante.length > 0 ? 1 : 0) +
      (filtrosSelecionados.eolEstudante.length > 0 ? 1 : 0) +
      (filtrosSelecionados.nivelMinimoEscolhido !=
      filtrosSelecionados.nivelMinimo
        ? 1
        : 0) +
      (filtrosSelecionados.nivelMaximoEscolhido !=
      filtrosSelecionados.nivelMaximo
        ? 1
        : 0);
  }

  if (activeTab === "4") {
    totalFiltrosSelecionados =
      filtrosSelecionados.niveisAbaPrincipal.length +
      filtrosSelecionados.turmas.length;
  }

  return (
    <div className="conteudo-fixo">
      <Row className="escolher-escola" justify="space-between" align="middle">
        <Col>
          <span className="nome-escola">{escolaSelecionada?.descricao}</span>
        </Col>
        <Col>
          <Badge
            count={totalFiltrosSelecionados}
            className="badge-notificacoes"
          >
            <img
              src="/icon_filter_default.svg"
              alt="Filtrar"
              className="icone-filtrar"
              onClick={abrirFiltro}
            />

            <span className="texto-filtrar" onClick={abrirFiltro}>
              {" "}
              Filtrar{" "}
            </span>
          </Badge>
        </Col>
      </Row>

      <FiltroLateral open={open} setOpen={setOpen} filtroDados={filtroDados} />

      <div className="conteudo-principal">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title="" variant="borderless">
              <div className="card-escolher-escolas">
                Você pode filtrar por Diretoria Regional de Educação (DRE) ou
                Unidade Educacional (UE).
              </div>
              <Select
                showSearch
                placeholder="Selecione ou digite a DRE ou UE..."
                style={{ width: "100%" }}
                onChange={handleChange}
                value={
                  escolaSelecionada ? String(escolaSelecionada.ueId) : undefined
                }
                notFoundContent="Não encontramos nenhuma DRE ou UE com o nome digitado..."
                filterOption={(input, option) =>
                  String(option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={opcoes}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default EscolherEscola;
