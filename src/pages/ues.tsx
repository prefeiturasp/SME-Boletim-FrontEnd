// UesPage.tsx

import React, { useEffect, useState } from "react";
import { ArrowLeftOutlined, UpOutlined } from "@ant-design/icons";
import { Row, Col, Breadcrumb, Card, Select, Checkbox, Button } from "antd";
import { Header } from "antd/es/layout/layout";
import { Link } from "react-router-dom";
import imagemFluxoDRE from "../assets/Imagem_fluxo_DRE.jpg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { servicos } from "../servicos";
import { setNomeAplicacao } from "../redux/slices/nomeAplicacaoSlice";
import DesempenhoPorMateria from "../componentes/grafico/desempenhoPorMateria";
import RelatorioAlunosPorUes from "../componentes/relatorio/relatorioAlunosPorUes";
import "./UesPage.css";

const linkRetorno = "https://serap.sme.prefeitura.sp.gov.br/";
const versao = "1.0";

const UesPage: React.FC = () => {
  const dispatch = useDispatch();
  const nomeAplicacao = useSelector((state: RootState) => state.nomeAplicacao);
  const [aplicacoes, setAplicacoes] = useState<any[]>([]);
  const [anos, setAnos] = useState([]);
  const [anoSelecionado, setAnoSelecionado] = useState();
  const [niveisProficiencia, setNiveisProficiencia] = useState<any[]>([]);
  const [dres, setDres] = useState([]);
  const [dreSelecionada, setDreSelecionada] = useState();
  const [dreSelecionadaNome, setDreSeleciondaNome] = useState();
  const [resumoDre, setResumoDre] = useState<any | null>(null);
  const [ues, setUes] = useState([]);
  const [uesSelecionadas, setUesSelecionadas] = useState([]);

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

  const aplicacaoSelecionada = useSelector(
    (state: RootState) => state.nomeAplicacao.id
  );

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
  }, [aplicacaoSelecionada, anoSelecionado]);

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

  const voltarAoInicio = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
            <h2>{dreSelecionadaNome}</h2>

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
                  }}
                  value={dreSelecionada || undefined}
                  notFoundContent="Nenhuma DRE encontrada"
                  filterOption={(input, option) =>
                    String(option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={dres}
                />
              </div>
            </Card>
            <br></br>
            <Card title="" variant="borderless">
              <p>
                Você pode consultar as informações de todas as provas já
                aplicadas. Basta selecionar a aplicação que deseja visualizar.
              </p>
              <div className="filtros-card">
                <Select
                  showSearch
                  placeholder="Selecione uma aplicação..."
                  className="select-full"
                  onChange={handleChange}
                  value={nomeAplicacao.id || undefined}
                  notFoundContent="Nenhuma aplicação encontrada"
                  filterOption={(input, option) =>
                    option?.label.toLowerCase().includes(input.toLowerCase())
                  }
                  options={opcoes}
                />
                <Select
                  showSearch
                  placeholder="Ano escolar"
                  className="select-ano"
                  onChange={(value) => {
                    setAnoSelecionado(value);
                  }}
                  value={anoSelecionado || undefined}
                  notFoundContent="Nenhum ano encontrado"
                  filterOption={(input, option) =>
                    option?.label.toLowerCase().includes(input.toLowerCase())
                  }
                  options={anos}
                />
              </div>
            </Card>
            <br></br>
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
                    <Card className="card-resumo" bodyStyle={{ padding: 0 }}>
                      <div className="valor">
                        {disciplina.mediaProficiencia?.toFixed(1) ?? "-"}
                      </div>
                      <div className="descricao">
                        Média de proficiência {disciplina.disciplinaNome}
                      </div>
                    </Card>
                  </Col>
                )
              )}
            </Row>
            <br></br>
            <div className="informacao-blue">
              As informações são das Unidades Educacionais que realizam a prova{" "}
              {nomeAplicacao.nome}
            </div>
            <br></br>
            <Card title="" variant="borderless">
              <p className="ues-dre-title">
                <b>Unidades Educacionais (UEs) - {dreSelecionadaNome}</b>
              </p>
              <p>
                Confira as informações de todas as UEs da {dreSelecionadaNome}.
              </p>

              <DesempenhoPorMateria dados={niveisProficiencia} />

              <br />
              <p>Você pode filtrar por Unidade Educacional (UE)</p>

              <Select
                mode="multiple"
                allowClear
                showSearch
                placeholder="Selecione ou digite a UE..."
                className="select-full"
                value={uesSelecionadas}
                onChange={setUesSelecionadas}
                notFoundContent="Nenhuma escola encontrada"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={ues}
                optionRender={(option) => (
                  <div className="select-option-multiview">
                    <Checkbox
                      checked={uesSelecionadas.includes(option.value)}
                      className="checkbox-ue"
                    />
                    {option.label}
                  </div>
                )}
              />
              <br />
            </Card>
            <br></br>
            <Card title="" variant="borderless">
              <RelatorioAlunosPorUes
                aplicacaoSelecionada={aplicacaoSelecionada}
                dreSelecionada={dreSelecionada}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <div className="rodape">
        <Button type="primary" icon={<UpOutlined />} onClick={voltarAoInicio}>
          Voltar para o Início
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
