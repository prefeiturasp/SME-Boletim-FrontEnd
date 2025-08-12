import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeftOutlined, UpOutlined } from "@ant-design/icons";
import {
  Row,
  Col,
  Breadcrumb,
  Card,
  Select,
  Checkbox,
  Button,
  Pagination,
  Tooltip,
} from "antd";

import { Link } from "react-router-dom";
import imagemFluxoDRE from "../assets/Imagem_fluxo_DRE.jpg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { servicos } from "../servicos";
import { setNomeAplicacao } from "../redux/slices/nomeAplicacaoSlice";
import DesempenhoPorMateria from "../componentes/grafico/desempenhoPorMateria";
import RelatorioAlunosPorUes from "../componentes/relatorio/relatorioAlunosPorUes";
import "./ues_dres.css";
import "./UesPage.css";
import iconePort from "../assets/icon-port.svg";
import iconeMat from "../assets/icon-mat.svg";
import iconeAlunos from "../assets/icon-alunos.svg";
import iconeDados from "../assets/icon-dados.svg";
import iconeMais from "../assets/icon-mais.svg";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Layout } from "antd";
const { Header } = Layout;

const linkRetorno = "https://serap.sme.prefeitura.sp.gov.br/";
const versao = "1.0";
const PAGE_SIZE = 12;

export function estiloNivel(nivel: string) {
  if (!nivel) return { background: "#f0f0f0", color: "#8c8c8c" };
  const n = nivel
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  if (n === "adequado")
    return { background: "rgba(153,153,255,0.5)", color: "#232323" };
  if (n === "basico")
    return { background: "rgba(254,222,153,0.5)", color: "#232323" };
  if (n === "abaixo do basico")
    return { background: "rgba(255,89,89,0.5)", color: "#232323" };
  if (n === "avancado")
    return { background: "rgba(153,255,153,0.5)", color: "#232323" };
  return { background: "#f0f0f0", color: "#8c8c8c" };
}

const UesPage: React.FC = () => {
  const dispatch = useDispatch();
  const nomeAplicacao = useSelector((state: RootState) => state.nomeAplicacao);

  const [aplicacoes, setAplicacoes] = useState<any[]>([]);
  const [anos, setAnos] = useState([]);
  const [anoSelecionado, setAnoSelecionado] = useState();
  const [niveisProficiencia, setNiveisProficiencia] = useState<any[]>([]);
  const [dres, setDres] = useState<{ value: number; label: string }[]>([]);

  const [dreSelecionada, setDreSelecionada] = useState(0);
  const [dreSelecionadaNome, setDreSeleciondaNome] = useState<
    string | undefined
  >();
  const [resumoDre, setResumoDre] = useState<any | null>(null);
  const [ues, setUes] = useState([]);
  const [uesSelecionadas, setUesSelecionadas] = useState<
    { value: number; label: string }[]
  >([]);

  const [uesDados, setUesDados] = useState<any[]>([]);
  const [currentCardPage, setCurrentCardPage] = useState(1);
  const [loadingMaisUes, setLoadingMaisUes] = useState(false);

  const [uesTotal, setUesTotal] = useState(0);

  const aplicacaoSelecionada = useSelector(
    (state: RootState) => state.nomeAplicacao.id
  );

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const dreParam = searchParams.get("dreUrlSelecionada");
    if (!dreParam) return;

    const optNum = Number(dreParam);
    if (Number.isNaN(optNum)) return;

    if (dres.length === 0) return;

    setDreSelecionada(optNum);
    const dreObj = dres.find((d) => d.value === optNum);
    setDreSeleciondaNome(dreObj?.label);

    setUesSelecionadas([]);
    setCurrentCardPage(1);
    setUesDados([]);
  }, [searchParams, dres]);

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

  const buscaDesempenhoPorMateria = async () => {
    try {
      const respostas = await servicos.get(
        `/api/boletimescolar/${aplicacaoSelecionada}/dre/${dreSelecionada}/ano-escolar/${anoSelecionado}/grafico/niveis-proficiencia-disciplina`
      );
      setNiveisProficiencia(respostas?.disciplinas || []);
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
      setDres(opcoesDre);
      if (opcoesDre.length > 0) {
        const param = searchParams.get("dreUrlSelecionada");
        const preferida = param ? Number(param) : opcoesDre[0].value;
        const dreObj =
          opcoesDre.find(
            (d: { value: number; label: string }) => d.value === preferida
          ) ?? opcoesDre[0];

        setDreSelecionada(dreObj.value);
        setDreSeleciondaNome(dreObj.label);
      }
    } catch (error) {
      console.error("Erro ao buscar DREs:", error);
    }
  };

  useEffect(() => {
    buscarDres();
  }, []);

  const buscarResumoDre = async () => {
    if (!aplicacaoSelecionada || !dreSelecionada || !anoSelecionado) return;
    try {
      const resposta = await servicos.get(
        `/api/BoletimEscolar/${aplicacaoSelecionada}/${dreSelecionada}/${anoSelecionado}/resumo-dre`
      );
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
        `/api/BoletimEscolar/${aplicacaoSelecionada}/${dreSelecionada}/${anoSelecionado}/ues-por-dre`
      );
      const opcoesUe = (resposta ?? []).map(
        (item: { ueId: any; descricao: any }) => ({
          value: item.ueId,
          label: item.descricao,
        })
      );
      setUes(opcoesUe);
    } catch (error) {
      setUes([]);
      console.error("Erro ao buscar UEs:", error);
    }
  };

  useEffect(() => {
    buscarUes();
    setUesSelecionadas([]);
  }, [aplicacaoSelecionada, dreSelecionada, anoSelecionado]);

  const fetchUesListagem = async (pagina = 1, append = false) => {
    if (!aplicacaoSelecionada || !dreSelecionada || !anoSelecionado) {
      setUesDados([]);
      setUesTotal(0);
      return;
    }
    try {
      setLoadingMaisUes(true);
      const params = new URLSearchParams();
      uesSelecionadas.forEach((ue) =>
        params.append("UesIds", String(ue.value))
      );
      params.append("TamanhoPagina", String(PAGE_SIZE));
      params.append("Pagina", String(pagina));
      const url = `/api/BoletimEscolar/${aplicacaoSelecionada}/${dreSelecionada}/${anoSelecionado}/ue-por-dre-dados?${params.toString()}`;
      const resposta = await servicos.get(url);
      if (append) {
        setUesDados((prev) => [...prev, ...(resposta?.itens || [])]);
      } else {
        setUesDados(resposta?.itens || []);
      }
      setUesTotal(resposta?.totalRegistros || 0);
    } catch (error) {
      setUesDados([]);
      setUesTotal(0);
      console.error("Erro ao buscar UEs listagem:", error);
    } finally {
      setLoadingMaisUes(false);
    }
  };

  useEffect(() => {
    fetchUesListagem(1, false);
  }, [aplicacaoSelecionada, dreSelecionada, anoSelecionado, uesSelecionadas]);

  useEffect(() => {
    setCurrentCardPage(1);
    setUesDados([]);
  }, [aplicacaoSelecionada, dreSelecionada, anoSelecionado, uesSelecionadas]);

  const uesOptions = useMemo(() => {
    return ues.map((ue: any) => ({
      value: ue.value,
      label: ue.label,
    }));
  }, [ues]);

  const voltarAoInicio = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleExibirMais = () => {
    const proxPagina = currentCardPage + 1;
    setCurrentCardPage(proxPagina);
    fetchUesListagem(proxPagina, true);
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
            <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>Provas</Breadcrumb.Item>
              <Breadcrumb.Item>Boletim de provas</Breadcrumb.Item>
            </Breadcrumb>
            <span className="titulo-secundario">Boletim de provas</span>
          </div>
          <div className="imagem-header">
            <img src={imagemFluxoDRE} alt="Fluxo DRE" />
          </div>
        </Header>
      </Row>

      <div className="conteudo-principal-ues">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <h2 className="titulo-ue">{dreSelecionadaNome}</h2>

            <div className="ajustes-padding-cards">
              <Card title="" variant="borderless">
                <p>
                  Você pode filtrar outra Diretoria Regional de Educação (DRE).
                </p>
                <div className="filtros-card">
                  <Select
                    showSearch
                    placeholder="Selecione uma DRE..."
                    className="select-full"
                    onChange={(value) => {
                      setDreSelecionada(value);
                      const dreObj = dres.find((d) => d.value === value);
                      setDreSeleciondaNome(dreObj?.label);
                    }}
                    value={dreSelecionada || undefined}
                    notFoundContent="Nenhuma DRE encontrada"
                    filterOption={(input, option: any) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={dres}
                  />
                </div>
              </Card>
            </div>
            <br />
            <div className="ajustes-padding-cards">
              <Card title="" variant="borderless">
                <p style={{ marginTop: "0", marginBottom: "3em" }}>
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
                      className="select-full"
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
            <Row gutter={[16, 16]} className="cards-container">
              <Col xs={24} sm={12} md={6}>
                <Card className="card-resumo" bodyStyle={{ padding: 0 }}>
                  <div className="valor">{resumoDre?.totalUes ?? "-"}</div>
                  <div className="descricao">Unidades Educacionais</div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card className="card-resumo" bodyStyle={{ padding: 0 }}>
                  <div className="valor">{resumoDre?.totalAlunos ?? "-"}</div>
                  <div className="descricao">Estudantes</div>
                </Card>
              </Col>
              {resumoDre?.proficienciaDisciplina?.map(
                (disciplina: any, idx: number) => (
                  <Col xs={24} sm={12} md={6} key={idx}>
                    <Card className="card-resumo" bodyStyle={{ padding: 0, paddingTop: "0.3em"}}>
                      <div className="valor">
                        {disciplina.mediaProficiencia?.toFixed(1) ?? "-"}
                      </div>
                      <div className="descricao" style={{lineHeight:1}}>
                        <p style={{margin:0}}>Média de proficiência</p>
                        <p style={{margin:0}}>{disciplina.disciplinaNome}</p>                         
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
              <Card title="" variant="borderless">
                <div className="ues-dre-title">
                  <b>Unidades Educacionais (UEs) - {dreSelecionadaNome}</b>
                </div>
                <div className="ues-dre-subtitulo">
                  Confira as informações de todas as UEs da {dreSelecionadaNome}
                  .
                </div>

                <DesempenhoPorMateria dados={niveisProficiencia} tipo={"UEs"} />

                <br />
                <div className="conteudo-fixo-dropdown">
                  <p>Você pode filtrar por Unidade Educacional (UE)</p>

                  <Select
                    mode="multiple"
                    allowClear
                    showSearch
                    labelInValue
                    value={uesSelecionadas}
                    onChange={(values) => setUesSelecionadas(values)}
                    className="select-full"
                    placeholder="Selecione ou digite a UE..."
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
                        (ue) => ue.value === option.value
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
                  />
                </div>

                <div className="list-cards" style={{zIndex: "auto"}}>
                  <Row gutter={[16, 16]}>
                    {uesDados.map((ue) => {
                      const semDisciplinas =
                        !ue.disciplinas || ue.disciplinas.length === 0;
                      return (
                        <Col xs={24} sm={24} md={8} key={ue.id}>
                          <Card className="list-card">
                            <Tooltip title={ue.nome}>
                              <div className="list-card-nome nome-truncado">
                                {ue.nome}
                              </div>
                            </Tooltip>

                            <div className="list-card-ano">
                              <b>Ano:</b> <span>{ue.anoEscolar}º ano</span>
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
                                  {ue.disciplinas.map((p: any, idx: number) => (
                                    <div
                                      className="list-card-prof-item"
                                      key={idx}
                                    >
                                      <div className="disciplina-label">
                                        <img
                                          src={
                                            p.disciplina === "Língua portuguesa"
                                              ? iconePort
                                              : iconeMat
                                          }
                                          alt="Ícone disciplina"
                                          className="disciplina-icon"
                                        />
                                        <span>{p.disciplina}</span>
                                      </div>
                                      <span
                                        className="nivel"
                                        style={estiloNivel(p.nivelDescricao)}
                                      >
                                        {p.nivelDescricao}
                                      </span>
                                      <div className="prof-value">
                                        {typeof p.mediaProficiencia === "number"
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
                                  ))}
                                </div>
                                <hr className="separador" />
                                <div className="list-card-meta-row">
                                  <div className="list-meta-conteudo">
                                    <img
                                      src={iconeAlunos}
                                      alt="Ícone alunos"
                                      className="disciplina-icon"
                                    />{" "}
                                    <div className="list-meta-titulo">
                                      Total de estudantes:
                                    </div>
                                    <div className="list-meta-valor">
                                      {ue.totalEstudantes?.toLocaleString(
                                        "pt-BR"
                                      ) ?? "-"}
                                    </div>
                                  </div>
                                  <div className="list-meta-conteudo">
                                    <img
                                      src={iconeDados}
                                      alt="Ícone dados"
                                      className="disciplina-icon"
                                    />
                                    <div className="list-meta-titulo">
                                      Realizaram a prova:
                                    </div>
                                    <div className="list-meta-valor">
                                      {ue.totalEstudadesRealizaramProva?.toLocaleString(
                                        "pt-BR"
                                      ) ?? "-"}{" "}
                                      (
                                      {ue.percentualEstudadesRealizaramProva ??
                                        0}
                                      %)
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                            <Button
                              className="btn-acessar-ue"
                              block
                              disabled={semDisciplinas}
                              onClick={() => {
                                navigate(`/?ueSelecionada=${ue.id}`);
                                window.scrollTo(0, 0);
                              }}
                            >
                              Acessar UE
                            </Button>
                          </Card>
                        </Col>
                      );
                    })}
                  </Row>
                  {uesDados.length < uesTotal && (
                    <>
                      <br></br>
                      <div className="transparent-bottom-ue">
                        <Button
                          variant="outlined"
                          className="btn-exibir-mais-ue"
                          loading={loadingMaisUes}
                          onClick={handleExibirMais}
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
                    </>
                  )}
                </div>
              </Card>
            </div>
            <br />
            <Card title="" variant="borderless">
              <RelatorioAlunosPorUes
                dreSelecionadaNome={dreSelecionadaNome}
                aplicacaoSelecionada={aplicacaoSelecionada}
                dreSelecionada={dreSelecionada}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <div className="rodape">
        <Button type="primary" icon={<UpOutlined />} onClick={voltarAoInicio}>
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

export default UesPage;
