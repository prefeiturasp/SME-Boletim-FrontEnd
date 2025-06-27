import React, { useEffect, useState } from "react";
import { Row, Col, Card, Tabs, Select } from "antd";
import Principal from "./conteudoTabs/principal";
import Turma from "./conteudoTabs/turma";
import Estudantes from "./conteudoTabs/estudantes";
import Resultado from "./conteudoTabs/probabilidade";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setActiveTab } from "../../redux/slices/tabSlice";
import { setNomeAplicacao } from "../../redux/slices/nomeAplicacaoSlice";
import { servicos } from "../../servicos";

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

  return (
    <div className="conteudo-principal">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title={
              <div>
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
            >
              <Tabs.TabPane
                tab="Principal"
                key="1"
                disabled={abasDesabilitadas}
              >
                <Principal />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Turma" key="2" disabled={abasDesabilitadas}>
                <Turma />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab="Estudantes"
                key="3"
                disabled={abasDesabilitadas}
              >
                <Estudantes />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab="Resultado por Probabilidade"
                key="4"
                disabled={abasDesabilitadas}
              >
                <Resultado />
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Conteudo;
