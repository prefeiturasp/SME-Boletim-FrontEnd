import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeftOutlined, UpOutlined } from "@ant-design/icons";
import {
  Row,
  Col,
  Breadcrumb,
  Card,
  Select,
  Checkbox,
  Button,
  Tooltip,
} from "antd";
import { Link } from "react-router-dom";
import imagemFluxoDRE from "../assets/Imagem_fluxo_DRE_2.jpg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { servicos } from "../servicos";
import { setNomeAplicacao } from "../redux/slices/nomeAplicacaoSlice";
import DesempenhoPorMateria from "../componentes/grafico/desempenhoPorMateria";
import "./DresPage.css";
import "./ues_dres.css";
import iconePort from "../assets/icon-port.svg";
import iconeMat from "../assets/icon-mat.svg";
import iconeAlunos from "../assets/icon-alunos.svg";
import iconeDados from "../assets/icon-dados.svg";
import iconeUe from "../assets/icon-ue.svg";
import { useNavigate } from "react-router-dom";
import { Layout } from "antd";
import RelatorioAlunosPorDres from "../componentes/relatorio/relatorioAlunosPorDres";
import DesempenhoPorMediaProficiencia from "../componentes/grafico/desempenhoPorMediaProficiencia";
const { Header } = Layout;

const linkRetorno = "https://serap.sme.prefeitura.sp.gov.br/";
const versao = "1.0";

export function estiloNivel(nivel: string) {
  if (!nivel) return { background: "#f0f0f0", color: "#8c8c8c" };
  const n = nivel
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  if (n === "adequado")
    return { background: "rgba(153, 153, 255, 0.5)", color: "#3f673f" };
  if (n === "basico")
    return { background: "rgba(254,222,153, 0.5)", color: "#3f673f" };
  if (n === "abaixo do basico")
    return { background: "rgba(255,89,89, 0.5)", color: "#3f673f" };
  if (n === "avancado")
    return { background: "rgba(153, 255, 153, 0.5)", color: "#3f673f" };
  return { background: "#f0f0f0", color: "#8c8c8c" };
}

const DresPage: React.FC = () => {
  const dispatch = useDispatch();
  const nomeAplicacao = useSelector((state: RootState) => state.nomeAplicacao);

  const [aplicacoes, setAplicacoes] = useState<any[]>([]);
  const [anos, setAnos] = useState([]);
  const [anoSelecionado, setAnoSelecionado] = useState();
  const [niveisProficiencia, setNiveisProficiencia] = useState<any[]>([]);
  const [mediaProficiencia, setMediaProficiencia] = useState<any[]>([]);

  const [dreSelecionada, setDreSelecionada] = useState();
  const [dreSelecionadaNome, setDreSeleciondaNome] = useState<
    string | undefined
  >();
  const [resumoDre, setResumoDre] = useState<any | null>(null);
  const [ues, setUes] = useState([]);
  const [uesSelecionadas, setUesSelecionadas] = useState<
    { value: number; label: string }[]
  >([]);

  const [dresDados, setDresDados] = useState<any[]>([]);
  const stickyRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  const aplicacaoSelecionada = useSelector(
    (state: RootState) => state.nomeAplicacao.id
  );

  const navigate = useNavigate();

  useEffect(() => {
    const el = stickyRef.current;
    const container = containerRef.current;
    const sentinel = sentinelRef.current;
    const spacer = spacerRef.current;
    if (!el || !container || !sentinel || !spacer) return;

    const scrollEl = getScrollParent(el);
    const root = scrollEl instanceof Window ? null : (scrollEl as Element);

    const setVars = () => {
      const rect = container.getBoundingClientRect();
      el.style.setProperty("--container-left", `${rect.left}px`);
      el.style.setProperty("--container-width", `${rect.width}px`);

      const title = document.querySelector(
        ".titulo-ue-sme"
      ) as HTMLElement | null;
      const offset = title ? title.getBoundingClientRect().height : 0;
      el.style.setProperty("--sticky-offset", `${offset}px`);
    };

    const onChange: IntersectionObserverCallback = ([entry]) => {
      const shouldFix =
        entry.boundingClientRect.top < 0 && !entry.isIntersecting;
      el.classList.toggle("fixed", shouldFix);
      spacer.style.height = shouldFix ? `${el.offsetHeight}px` : "0px";
      setVars();
    };

    const io = new IntersectionObserver(onChange, {
      root,
      threshold: [0, 1],
    });

    io.observe(sentinel);
    window.addEventListener("resize", setVars, { passive: true });
    setVars();

    return () => {
      io.disconnect();
      window.removeEventListener("resize", setVars);
    };
  }, []);

  function getScrollParent(node: HTMLElement): HTMLElement | Window {
    let p: HTMLElement | null = node.parentElement;
    while (p) {
      const { overflowY } = getComputedStyle(p);
      if (/(auto|scroll|overlay)/.test(overflowY)) return p;
      p = p.parentElement;
    }
    return window;
  }

  const buscarAplicacoes = async () => {
    try {
      const resposta = await servicos.get(
        `/api/boletimescolar/aplicacoes-prova`
      );
      setAplicacoes(resposta || []);
      if (resposta.length > 0) {
        const primeiraAplicacao = resposta[0];
        dispatch(
          setNomeAplicacao({
            id: primeiraAplicacao.id,
            nome: primeiraAplicacao.nome,
            tipoTai: primeiraAplicacao.tipoTai ?? true,
            dataInicioLote:
              primeiraAplicacao.dataInicioLote ?? new Date().toISOString(),
          })
        );
      }
    } catch (error) {
      console.error("Erro ao buscar aplicações:", error);
    }
  };

  useEffect(() => {
    buscarAplicacoes();
  }, []);

  const buscarAnos = async () => {
    try {
      const resposta = await servicos.get(
        `/api/boletimescolar/${aplicacaoSelecionada}/anos-escolares`
      );
      const opcoes = (resposta ?? []).map(
        (item: { ano: any; descricao: any }) => ({
          value: item.ano,
          label: item.descricao,
        })
      );
      setAnos(opcoes);
      setAnoSelecionado(opcoes[0]?.value || undefined);
    } catch (error) {
      console.error("Erro ao buscar anos:", error);
    }
  };

  useEffect(() => {
    buscarAnos();
  }, [aplicacaoSelecionada]);

  useEffect(() => {
    if (aplicacoes.length > 0) {
      buscaDesempenhoPorMateria();
    }
  }, [aplicacaoSelecionada, anoSelecionado, dreSelecionada]);

  useEffect(() => {
    if (aplicacoes.length > 0 && anoSelecionado != undefined) {
      buscaDesempenhoPorMediaProficiencia();
    }
  }, [aplicacaoSelecionada, anoSelecionado, uesSelecionadas]);

  const buscaDesempenhoPorMateria = async () => {
    try {
      const respostas = await servicos.get(
        `/api/boletimescolar/${anoSelecionado}/${aplicacaoSelecionada}/grafico/niveis-proficiencia-disciplina`
      );
      setNiveisProficiencia(respostas?.disciplinas || []);
    } catch (error) {
      console.error(error);
    }
  };

  const buscaDesempenhoPorMediaProficiencia = async () => {
    try {
      let url: string = "";
      let parametros = "";
      uesSelecionadas.forEach((dre) => {
        parametros += "dresIds=" + dre.value + "&";
      });

      url = `/api/BoletimEscolar/${aplicacaoSelecionada}/ano-escolar/${anoSelecionado}/grafico/media-proficiencia?${parametros}`;

      const respostas = await servicos.get(url);
      setMediaProficiencia(respostas || []);
    } catch (error) {
      console.error(error);
    }
  };

  const opcoes = aplicacoes.map((item: any) => ({
    value: item.id,
    label: item.nome,
    aplicacao: item,
  }));

  const handleChange = (value: number) => {
    const aplicacaoSelecionada = aplicacoes.find((app) => app.id === value);
    if (aplicacaoSelecionada) {
      dispatch(
        setNomeAplicacao({
          id: aplicacaoSelecionada.id,
          nome: aplicacaoSelecionada.nome,
          tipoTai: aplicacaoSelecionada.tipoTai ?? true,
          dataInicioLote:
            aplicacaoSelecionada.dataInicioLote ?? new Date().toISOString(),
        })
      );
    }
  };

  const buscarDres = async () => {
    try {
      const resposta = await servicos.get(`/api/Abrangencia/dres`);
      const opcoesDre = (resposta ?? []).map(
        (item: { id: any; nome: any }) => ({
          value: item.id,
          label: item.nome,
        })
      );
      if (opcoesDre.length > 0) {
        setDreSelecionada(opcoesDre[0].value);
        setDreSeleciondaNome(opcoesDre[0].label);
      }
    } catch (error) {
      console.error("Erro ao buscar DREs:", error);
    }
  };

  useEffect(() => {
    buscarDres();
  }, []);

  const buscarResumoDre = async () => {
    if (!aplicacaoSelecionada || !anoSelecionado) return;
    try {
      const resposta = await servicos.get(
        `/api/BoletimEscolar/${aplicacaoSelecionada}/${anoSelecionado}/resumo-sme`
      );

      if (resposta?.proficienciaDisciplina?.length) {
        resposta.proficienciaDisciplina.sort((a: any, b: any) =>
          a.disciplinaNome.localeCompare(b.disciplinaNome, "pt-BR", {
            sensitivity: "base",
          })
        );
      }

      setResumoDre(resposta);
    } catch (error) {
      console.error("Erro ao buscar resumo da DRE:", error);
      setResumoDre(null);
    }
  };

  useEffect(() => {
    if (aplicacaoSelecionada && dreSelecionada && anoSelecionado) {
      buscarResumoDre();
    }
  }, [aplicacaoSelecionada, dreSelecionada, anoSelecionado]);

  const buscarUes = async () => {
    if (!aplicacaoSelecionada || !dreSelecionada || !anoSelecionado) {
      setUes([]);
      return;
    }
    try {
      const resposta = await servicos.get(
        `/api/BoletimEscolar/${anoSelecionado}/${aplicacaoSelecionada}/dres`
      );
      const opcoesDre = (resposta ?? []).map(
        (item: { dreId: any; dreNome: any }) => ({
          value: item.dreId,
          label: item.dreNome,
        })
      );
      setUes(opcoesDre);
    } catch (error) {
      setUes([]);
      console.error("Erro ao buscar UEs:", error);
    }
  };

  useEffect(() => {
    buscarUes();
    setUesSelecionadas(prev => (prev.length === 0 ? prev : []));
  }, [aplicacaoSelecionada, dreSelecionada, anoSelecionado]);

  const fetchDresListagem = async () => {
    setDresDados([]);

    if (!aplicacaoSelecionada || !dreSelecionada || !anoSelecionado) return;

    try {
      const params = new URLSearchParams();
      uesSelecionadas.forEach((dre) => params.append("dreIds", String(dre.value)));

      const qs = params.toString();
      const url =
        `/api/BoletimEscolar/${anoSelecionado}/${aplicacaoSelecionada}` +
        `/dres/proficiencia${qs ? `?${qs}` : ""}`;

      const resposta = await servicos.get(url);
      setDresDados(resposta?.itens || []);
    } catch (error) {
      setDresDados([]);
      console.error("Erro ao buscar DREs listagem:", error);
    }
  };


  useEffect(() => {
    fetchDresListagem();
  }, [aplicacaoSelecionada, dreSelecionada, anoSelecionado, uesSelecionadas]);


  const uesOptions = useMemo(() => {
    return ues.map((dre: any) => ({
      value: dre.value,
      label: dre.label,
    }));
  }, [ues]);

  const voltarAoInicio = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const tipoPerfil = parseInt(localStorage.getItem("tipoPerfil") || "0", 10);
    if (tipoPerfil !== 5) {
      navigate("/ues");
    }
  }, []);

  const compararDados = () => {
    navigate(`/comparar-dados-dre/?dreUrlSelecionada=${dreSelecionada}&dreSelecionadaNome=${dreSelecionadaNome}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="app-container">
      <Row>
        <Header className="cabecalho">
          <div className="linha-superior">
            <Link to={linkRetorno} className="retornar">
              <ArrowLeftOutlined className="icone-retorno" />
              <span className="texto-retorno">Retornar à tela inicial</span>
            </Link>
            <span className="titulo-principal">Boletim de Provas</span>
          </div>
          <div className="barra-azul">
            <Breadcrumb
              className="breadcrumb"
              items={[
                { title: 'Home' },
                { title: 'Provas' },
                { title: 'Boletim de provas' },
              ]}
            />
            <span className="titulo-secundario">Boletim de provas</span>
          </div>
          <div className="imagem-header">
            <img src={imagemFluxoDRE} alt="Fluxo DRE" />
          </div>
        </Header>
      </Row>
      <Row>
        <div className="comparativo-corpo-drePage">
          <div className="comparativo-texto-drePage">
            <div className="comparativo-titulo-drePage">
              <p>Comparativo de resultados</p>
            </div>
            <div className="comparativo-descricao-drePage">
              <p>Acompanhe a proficiência de todas as Diretorias Regionais de Educação (DREs) nas diferentes aplicações da Prova São Paulo e Prova Saberes e Aprendizagens.</p>
            </div>
          </div>
          <div className="comparativo-botao-drePage">
            <Button type="primary" onClick={compararDados} className="btnAzulPadrao">
              Comparar dados
            </Button>
          </div>
        </div>
      </Row>


      <div className="conteudo-principal-ues" ref={containerRef}>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <h2 className="titulo-ue-sme">Secretaria Municipal de Educação</h2>

            <div className="ajustes-padding-cards">
              <Card title="" variant="borderless" className="card-body-dre">
                <p style={{ marginTop: "0", marginBottom: "32px" }}>
                  Você pode consultar as informações de todas as provas já
                  aplicadas. Basta selecionar a aplicação que deseja visualizar.
                </p>

                <div className="filtros-card-dre">
                  <div className="filtro-aplicacao">
                    <label className="label-filtro-dre">Aplicação</label>
                    <Select
                      data-testid="select-aplicacao"
                      showSearch
                      placeholder="Selecione uma aplicação..."
                      className="select-custom"
                      onChange={handleChange}
                      value={nomeAplicacao.id || undefined}
                      notFoundContent="Nenhuma aplicação encontrada"
                      filterOption={(input, option) =>
                        option?.label
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={opcoes}
                    />
                  </div>
                  <div className="filtro-ano">
                    <label className="label-filtro-dre">Ano</label>
                    <Select
                      showSearch
                      placeholder="Ano escolar"
                      className="select-custom"
                      onChange={(value) => {
                        setAnoSelecionado(value);
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
              </Card>
            </div>
            <br />
            <Row gutter={[16, 16]} className="cards-container-dre">
              <Col xs={24} sm={12} md={4} className="colum-dre">
                <Card className="card-resumo-dre" style={{ padding: 0 }}>
                  <div className="valor">{resumoDre?.totalDres ?? "-"}</div>
                  <div className="descricao">DREs</div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={5} className="colum-dre">
                <Card className="card-resumo-dre" style={{ padding: 0 }}>
                  <div className="valor">{resumoDre?.totalUes ?? "-"}</div>
                  <div className="descricao">Unidades Educacionais</div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={5} className="colum-dre">
                <Card className="card-resumo-dre" style={{ padding: 0 }}>
                  <div className="valor">{resumoDre?.totalAlunos ?? "-"}</div>
                  <div className="descricao">Estudantes</div>
                </Card>
              </Col>
              {resumoDre?.proficienciaDisciplina?.map(
                (disciplina: any, idx: number) => (
                  <Col xs={24} sm={12} md={5} key={idx} className="colum-dre">
                    <Card
                      className="card-resumo-dre"
                      style={{ padding: 0, paddingTop: "0.3em" }}
                    >
                      <div className="valor">
                        {disciplina.mediaProficiencia?.toFixed(1) ?? "-"}
                      </div>
                      <div className="descricao" style={{ lineHeight: 1 }}>
                        <p style={{ margin: 0 }}>Média de proficiência</p>
                        <p style={{ margin: 0 }}>{disciplina.disciplinaNome}</p>
                      </div>
                    </Card>
                  </Col>
                )
              )}
            </Row>

            <div className="informacao-blue">
              As informações são das Unidades Educacionais que realizaram a
              prova {nomeAplicacao.nome}
            </div>
            <br />
            <div className="ajustes-padding-cards">
              <Card title="" variant="borderless" className="body-pai-dre">
                <div className="ues-dre-title">
                  <b>Diretorias Regionais de Educação (DREs)</b>
                </div>
                <div className="ues-dre-subtitulo">
                  Confira as informações de todas as DREs do Município de São
                  Paulo.
                </div>
                <DesempenhoPorMateria
                  dados={niveisProficiencia}
                  tipo={"DREs"}
                />
                <div ref={sentinelRef} style={{ height: 1 }} />
                <div ref={spacerRef} style={{ height: 0 }} aria-hidden />
                <div ref={stickyRef} className="conteudo-fixo-dropdown">
                  <p>
                    Você pode filtrar por Diretoria Regional de Educação (DRE).
                  </p>

                  <Select
                    mode="multiple"
                    allowClear
                    showSearch
                    labelInValue
                    value={uesSelecionadas}
                    onChange={(values) => setUesSelecionadas(values)}
                    className="select-full"
                    placeholder="Selecione ou digite a DRE..."
                    notFoundContent="Nenhuma escola encontrada"
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toString()
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={uesOptions}
                    optionRender={(option) => {
                      const selected = uesSelecionadas.some(
                        (dre) => dre.value === option.value
                      );
                      return (
                        <div className="select-option-multiview">
                          <Checkbox
                            checked={selected}
                            className="checkbox-ue"
                          />
                          {option.label}
                        </div>
                      );
                    }}
                    dropdownStyle={{ zIndex: 1001 }}
                  />
                </div>

                <div className="list-cards">
                  <Row gutter={[16, 16]}>
                    {dresDados.map((dre) => {
                      const semDisciplinas =
                        !dre.disciplinas || dre.disciplinas.length === 0;
                      return (
                        <Col xs={24} sm={24} md={8} key={dre.dreId}>
                          <Card className="list-card">
                            <Tooltip
                              title={dre.dreNome}
                              className="custom-tooltip"
                            >
                              <div className="list-card-nome nome-truncado">
                                {dre.dreNome}
                              </div>
                            </Tooltip>

                            <div className="list-card-ano">
                              <b>Ano:</b> <span>{dre.anoEscolar}º ano</span>
                            </div>

                            {semDisciplinas ? (
                              <div className="mensagem-sem-dados">
                                <p>
                                  Não há dados cadastrados <br />
                                  nesta Unidade Educacional.
                                </p>
                              </div>
                            ) : (
                              <>
                                <div className="list-card-proficiencias">
                                  {dre.disciplinas.map(
                                    (p: any, idx: number) => (
                                      <div
                                        className="list-card-prof-item"
                                        key={idx}
                                      >
                                        <div className="disciplina-label">
                                          <img
                                            src={
                                              p.disciplina ===
                                                "Língua portuguesa"
                                                ? iconePort
                                                : iconeMat
                                            }
                                            alt="Ícone disciplina"
                                            className="disciplina-icon"
                                          />
                                          <span
                                            style={{
                                              fontWeight: "700",
                                              color: "#595959",
                                            }}
                                          >
                                            {p.disciplina}
                                          </span>
                                        </div>
                                        <span
                                          className="nivel"
                                          style={estiloNivel(
                                            p.nivelProficiencia
                                          )}
                                        >
                                          {p.nivelProficiencia}
                                        </span>
                                        <div className="prof-value">
                                          {typeof p.mediaProficiencia ===
                                            "number"
                                            ? p.mediaProficiencia.toLocaleString(
                                              "pt-BR",
                                              {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              }
                                            )
                                            : "-"}
                                        </div>
                                        <div className="prof-label">
                                          Média de proficiência
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                                <hr className="separador-ues-dres" />
                                <div className="list-card-meta-row">
                                  <div className="list-meta-conteudo-dres">
                                    <img
                                      src={iconeUe}
                                      alt="Ícone alunos"
                                      className="disciplina-icon"
                                    />{" "}
                                    <div className="list-meta-titulo">
                                      Unidades Educacionais:
                                    </div>
                                    <div className="list-meta-valor">
                                      {dre.totalUes?.toLocaleString("pt-BR") ??
                                        "-"}
                                    </div>
                                  </div>

                                  <div className="list-meta-conteudo-dres">
                                    <img
                                      src={iconeAlunos}
                                      alt="Ícone alunos"
                                      className="disciplina-icon"
                                    />{" "}
                                    <div className="list-meta-titulo">
                                      Total de estudantes:
                                    </div>
                                    <div className="list-meta-valor">
                                      {dre.totalAlunos?.toLocaleString(
                                        "pt-BR"
                                      ) ?? "-"}
                                    </div>
                                  </div>
                                  <div className="list-meta-conteudo-dres">
                                    <img
                                      src={iconeDados}
                                      alt="Ícone dados"
                                      className="disciplina-icon"
                                    />
                                    <div className="list-meta-titulo">
                                      Realizaram a prova:
                                    </div>
                                    <div className="list-meta-valor">
                                      {dre.totalRealizaramProva?.toLocaleString(
                                        "pt-BR"
                                      ) ?? "-"}{" "}
                                      ({dre.percentualParticipacao ?? 0}
                                      %)
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                            <Button
                              data-testid={dre.dreId ? `btn-acessar-${dre.dreId}` : undefined}
                              className="btn-acessar-ue"
                              block
                              disabled={semDisciplinas}
                              onClick={() => {
                                navigate(`/ues?dreUrlSelecionada=${dre.dreId}`);
                                window.scrollTo(0, 0);
                              }}
                            >Acessar DRE</Button>
                          </Card>
                        </Col>
                      );
                    })}
                  </Row>
                </div>
              </Card>
            </div>
            <br />
            <Card title="" variant="borderless">
              <span className="ues-dre-title">
                <b>Média de proficiência</b>
              </span>

              <div className="conteudo-grafico-media-proficiencia">
                <div className="conteudo-grafico-media-proficiencia-texto">
                  <p>
                    Confira a média de proficiência por componente curricular
                    das Diretorias Regionais (DRE)
                  </p>
                </div>
                <div className="conteudo-grafico-media-proficiencia-dropdown">
                  <div className="filtro-aplicacao2">
                    <Select
                      data-testid="select-aplicacao"
                      showSearch
                      placeholder="Selecione uma aplicação..."
                      className="select-custom"
                      onChange={handleChange}
                      value={nomeAplicacao.id || undefined}
                      notFoundContent="Nenhuma aplicação encontrada"
                      filterOption={(input, option) =>
                        option?.label
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={opcoes}
                    />
                  </div>
                  <div className="filtro-ano2">
                    <Select
                      showSearch
                      placeholder="Ano escolar"
                      className="select-custom"
                      onChange={(value) => {
                        setAnoSelecionado(value);
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
              <br></br>
              <DesempenhoPorMediaProficiencia dados={mediaProficiencia} />
            </Card>
            <br />
            <Card title="" variant="borderless">
              <RelatorioAlunosPorDres
                dreSelecionadaNome={dreSelecionadaNome}
                aplicacaoSelecionada={aplicacaoSelecionada}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <div className="rodape">
        <Button type="primary" icon={<UpOutlined />} onClick={voltarAoInicio} className="btnAzulPadrao">
          Voltar para o início
        </Button>
      </div>
      <div className="rodape-versao">
        <Row className="versao-secao">
          <Col span={12} className="text-left">
            <p>Boletim: Versão {versao}</p>
          </Col>
          <Col span={12} className="text-right">
            <p>Todos os direitos reservados</p>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DresPage;
