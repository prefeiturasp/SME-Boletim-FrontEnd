import React, { useEffect, useState } from "react";
import { Col, Row, Card, Select, Badge, Checkbox, Radio } from "antd";
import "./escolherEscola.css";
import { useDispatch, useSelector } from "react-redux";
import { selecionarEscola } from "../../redux/slices/escolaSlice";
import { RootState } from "../../redux/store";
import { servicos } from "../../servicos";
import { setFilters } from "../../redux/slices/filtrosSlice";
import FiltroLateral from "../filtro/filtroLateral";
import { setFiltroDados } from "../../redux/slices/filtroCompletoSlice";
import { setNomeAplicacao } from "../../redux/slices/nomeAplicacaoSlice";

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
    nomeEstudante: "",
    eolEstudante: "",
  });

  const dispatch = useDispatch();
  const escolaSelecionada = useSelector(
    (state: RootState) => state.escola.escolaSelecionada
  );
  const filtroDados = useSelector((state: RootState) => state.filtroCompleto);

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
      const resposta: Filtro = await servicos.get(
        `/api/boletimescolar/${escolaSelecionada.ueId}/filtros`
      );

      resposta.nivelMaximoEscolhido = resposta.nivelMaximo;
      resposta.nivelMinimoEscolhido = resposta.nivelMinimo;
      resposta.niveisAbaPrincipal = resposta.niveis;
      resposta.niveisAbaPrincipal.map((item) => {
        selectedFilters.niveisAbaPrincipal.push(item);
      });

      selectedFilters.anosEscolaresRadio = [resposta.anosEscolares[0]];
      selectedFilters.componentesCurricularesRadio = [
        resposta.componentesCurriculares[0],
      ];
      setSelectedFilters(selectedFilters);
      dispatch(setFilters(selectedFilters));

      dispatch(setFiltroDados(resposta));
    } catch (error) {
      console.error("Erro ao buscar os filtros laterais:", error);
    }
  };

  const buscarNomeAplicacao = async () => {
    try {
      const resposta: NomeAplicacao = await servicos.get(
        `/api/boletimescolar/nome-aplicacao`
      );
      dispatch(setNomeAplicacao(resposta));
    } catch (error) {
      console.error("Erro ao buscar o nome da:", error);
    }
  };

  useEffect(() => {
    buscarFiltros(escolaSelecionada);
    buscarNomeAplicacao();
  }, [escolaSelecionada]);

  useEffect(() => {
    buscarAbrangencias();
  }, []);

  useEffect(() => {
    if (abrangencia.length > 0 && escolaSelecionada.ueId == null) {
      const primeiraEscola = abrangencia[0];

      dispatch(
        selecionarEscola({
          ueId: primeiraEscola.ueId,
          descricao: primeiraEscola.descricao,
        })
      );
    }
  }, [abrangencia, escolaSelecionada, dispatch]);

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

  const totalFiltrosSelecionados =
    selectedFilters.niveis.length +
    selectedFilters.anosEscolares.length +
    selectedFilters.componentesCurriculares.length;

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

      <FiltroLateral
        open={open}
        setOpen={setOpen}
        filtroDados={filtroDados}
      />

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
                  escolaSelecionada ? escolaSelecionada.descricao : undefined
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
