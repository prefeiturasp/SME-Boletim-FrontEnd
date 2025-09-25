import React, { useEffect, useState } from "react";
import { Row, Col, Card, Tabs, Select } from "antd";
import { Link, useSearchParams } from "react-router-dom";
import Principal from "./conteudoTabs/principal";
import Turma from "./conteudoTabs/turma";
import Estudantes from "./conteudoTabs/estudantes";
import Resultado from "./conteudoTabs/probabilidade";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setActiveTab } from "../../redux/slices/tabSlice";
import { setNomeAplicacao } from "../../redux/slices/nomeAplicacaoSlice";
import { servicos } from "../../servicos";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Comparativo from "./conteudoTabs/comparativo";
import { useLocation, useNavigate } from "react-router-dom";
import { selecionarEscola } from "../../redux/slices/escolaSlice";
//import { atualizarCampos } from "../../redux/slices/filtroCompletoSlice";
import { setFiltroDados } from "../../redux/slices/filtroCompletoSlice";

const Conteudo: React.FC = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.tab.activeTab);
  const nomeAplicacao = useSelector((state: RootState) => state.nomeAplicacao);
  const [aplicacoes, setAplicacoes] = useState<any[]>([]);
  const filtrosCarregados = useSelector(
    (state: RootState) => state.filtroCarregado
  );
  const escolaSelecionada = useSelector(
    (state: RootState) => state.escola.escolaSelecionada
  );

  const abasDesabilitadas = !filtrosCarregados.carregado;

  const [showVoltarUes, setShowVoltarUes] = useState(false);
  const [dreId, setDreId] = useState<number | null>(null);


  useEffect(() => {
    const tipoPerfil = parseInt(localStorage.getItem("tipoPerfil") || "0", 10);
    if (tipoPerfil === 4 || tipoPerfil === 5) {
      setShowVoltarUes(true);
    } else {
      setShowVoltarUes(false);
    }
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  //só pega a tab
  useEffect(() => {
    try {
      if (location.state?.abrirComparativo) {
        dispatch(setActiveTab("5"));
        
        const dreUrlSelecionada = searchParams.get("dreUrlSelecionada");
        setDreId(dreUrlSelecionada ? parseInt(dreUrlSelecionada, 10) : null);

        console.log("DRE ID no Botão: ", dreUrlSelecionada);
        if (!dreUrlSelecionada) {
          console.error("DRE ID é nulo ou indefinido.");
        }
      }
    } catch (error) {
      console.error("Erro ao processar os parâmetros da URL:", error);
    }

  }, [location.state, dispatch]);

  // useEffect(() => {
  //   if (location.state?.abrirComparativo) {
  //     dispatch(setActiveTab("5"));

  //     if (location.state.ueId) {
  //       dispatch(selecionarEscola({ ueId: location.state.ueId, descricao: "-" }));
  //     }
  //     if (location.state.dreId) {
  //       setDreId(location.state.dreId);
  //       //dispatch(atualizarCampos({ dre: { valor: location.state.dreId, texto: "-" } } as any));
  //     }
  //     if (location.state.aplicacaoId) {
  //       dispatch(
  //         setNomeAplicacao({
  //           id: location.state.aplicacaoId,
  //           nome: "-",
  //           tipoTai: true,
  //           dataInicioLote: new Date().toISOString(),
  //         })
  //       );
  //     }
  //     if (location.state.componenteCurricularId) {
  //       dispatch(
  //         setFiltroDados({
  //           componentesCurriculares: [
  //             { valor: location.state.componenteCurricularId, texto: "-" },
  //           ],
  //         } as any)
  //       );
  //     }
  //   }
  // }, [location.state, dispatch]);


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
    if (escolaSelecionada.ueId != null) {
      buscarAplicacoes();
    }
  }, [escolaSelecionada]);

  const opcoes = aplicacoes.map((item: any) => ({
    value: item.id,
    label: item.nome,
    aplicacao: item,
  }));

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

  const handleClick = () => {
    if (location.state?.abrirComparativo) {
      navigate(`/comparar-dados/?dreUrlSelecionada=${dreId}`);
    } else {
      navigate("/ues");
    }
  };

  return (
    <div className="conteudo-principal">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title={
              <div>
                <div style={{ marginBottom: 12 }}>
                  <button
                    onClick={handleClick}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      color: "#1976d2",
                      textDecoration: "none",
                      margin: "15px 0px 0px",
                      fontSize: 14,
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                    }}
                    className="botao-voltar-ues"
                  >
                    <ArrowLeftOutlined style={{ fontSize: 18 }} />
                    Voltar a tela anterior
                  </button>
                </div>


                <span
                  style={{
                    display: "block",
                    marginBottom: 8,
                    marginTop: 8,
                    fontWeight: "normal",
                    fontSize: "14px",
                  }}
                >
                  Você pode consultar as informações de todas as provas já
                  aplicadas. Basta selecionar a aplicação que deseja visualizar
                </span>

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
              </div>
            }
            variant="borderless"
          >
            <Tabs
              activeKey={activeTab}
              onChange={(key) => dispatch(setActiveTab(key))}
              items={[
                {
                  key: '1',
                  label: 'Principal',
                  children: <Principal />,
                  disabled: abasDesabilitadas,
                },
                {
                  key: '2',
                  label: 'Turma',
                  children: <Turma />,
                  disabled: abasDesabilitadas,
                },
                {
                  key: '3',
                  label: 'Estudantes',
                  children: <Estudantes />,
                  disabled: abasDesabilitadas,
                },
                {
                  key: '4',
                  label: 'Resultado por Probabilidade',
                  children: <Resultado />,
                  disabled: abasDesabilitadas,
                },
                {
                  key: '5',
                  label: 'Comparativo',
                  children: <Comparativo />,
                  disabled: abasDesabilitadas,
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Conteudo;
