import React, { useEffect, useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Row, Col, Breadcrumb, Card, Select } from "antd";
import { Header } from "antd/es/layout/layout";
import { Link } from "react-router-dom";
import imagemFluxoDRE from "../assets/Imagem_fluxo_DRE.jpg";
const linkRetorno = "https://serap.sme.prefeitura.sp.gov.br/";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { servicos } from "../servicos";
import { setNomeAplicacao } from "../redux/slices/nomeAplicacaoSlice";
import DesempenhoPorMateria from "../componentes/grafico/desempenhoPorMateria";

const UesPage: React.FC = () => {
  const dispatch = useDispatch();
  const nomeAplicacao = useSelector((state: RootState) => state.nomeAplicacao);
  const [aplicacoes, setAplicacoes] = useState<any[]>([]);
  const [anos, setAnos] = useState([]);
  const [anoSelecionado, setAnoSelecionado] = useState();
  const [niveisProficiencia, setNiveisProficiencia] = useState<any[]>([]);

  const buscaDesempenhoPorMateria = async () => {
    try {
      const respostas = await servicos.get(
        `/api/boletimescolar/${aplicacaoSelecionada}/dre/11/ano-escolar/${anoSelecionado}/grafico/niveis-proficiencia-disciplina`
      );
      setNiveisProficiencia([]);

      if (respostas) {
        setNiveisProficiencia(respostas.disciplinas);
      }

      console.log(respostas);
    } catch (error) {
      console.log(error);
    }
  };

  const buscarAplicacoes = async () => {
    try {
      const resposta = await servicos.get(
        `/api/boletimescolar/aplicacoes-prova`
      );
      console.log(resposta);
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
  console.log(aplicacaoSelecionada);

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

      if (opcoes.length > 0) {
        setAnoSelecionado(opcoes[0].value);
      } else {
        setAnoSelecionado(undefined);
      }
    } catch (error) {
      console.error("Erro ao buscar aplicações:", error);
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

  const cards = [
    { valor: "58", descricao: "Unidades Educacionais" },
    { valor: "62.458", descricao: "Estudantes" },
    { valor: "180,5", descricao: "Média de proficiência Língua Portuguesa" },
    { valor: "150,4", descricao: "Média de proficiência Matemática" },
  ];

  const handleChange = (value: number, option: any) => {
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

          <div style={{ width: "100%", height: "200px", overflow: "hidden" }}>
            <img
              src={imagemFluxoDRE}
              alt="Fluxo DRE"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </Header>
      </Row>

      <div className="conteudo-principal-ues">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <h2>DRE Capela do Socorro</h2>
            <Card title="" variant="borderless">
              {/* <button
              style={{
                background: "none",
                border: "none",
                color: "#1976d2",
                cursor: "pointer",
                marginBottom: 10,
              }}
              onClick={() => window.history.back()}
            >
              <ArrowLeftOutlined /> Voltar à tela anterior 
            </button> */}

              <p>
                Você pode consultar as informações de todas as provas já
                aplicadas. Basta selecionar a aplicação que deseja visualizar.
              </p>
              <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
                <Select
                  showSearch
                  placeholder="Selecione uma aplicação..."
                  style={{ width: "100%" }}
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
                  style={{ width: "20%" }}
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
            <Row gutter={[16, 16]}>
              {cards.map((card, idx) => (
                <Col xs={24} sm={12} md={6} key={idx}>
                  <Card
                    style={{
                      textAlign: "center",
                      padding: 0,
                      borderRadius: 8,
                      height: 90,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      color: " #595959",
                    }}
                    bodyStyle={{ padding: 0 }}
                  >
                    <div style={{ fontSize: 32, fontWeight: "bold" }}>
                      {card.valor}
                    </div>
                    <div style={{ fontSize: 14 }}>{card.descricao}</div>
                  </Card>
                </Col>
              ))}
            </Row>
            <div
              style={{
                background: "#428bca",
                color: "white",
                padding: "8px 16px",
                borderRadius: 4,
                fontSize: 14,
                textAlign: "left",
              }}
            >
              As informações são das Unidades Educacionais que realizaram a
              prova Saberes e Aprendizagens (4ª aplicação)
            </div>

            <br></br>

            <Card title="" variant="borderless">
              <p>Unidades Educacionais (UEs) - DRE Capela do Socorro</p>
              <p>
                {" "}
                Confira as informações de todas as UEs da DRE Capela do Socorro.
              </p>
              <div>
                <DesempenhoPorMateria dados={niveisProficiencia} />
              </div>
              <br></br>
              Você pode filtrar por Unidade Educacional (UE)
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default UesPage;
