import React from "react";
import { Row, Col, Card, Tabs } from "antd";
import Principal from "./conteudoTabs/principal";
import Turma from "./conteudoTabs/turma";
import Estudantes from "./conteudoTabs/estudantes";
import Resultado from "./conteudoTabs/probabilidade";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setActiveTab } from "../../redux/slices/tabSlice";

const Conteudo: React.FC = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.tab.activeTab);
  const nomeAplicacao = useSelector((state: RootState) => state.nomeAplicacao);

  return (
    <div className="conteudo-principal">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title={nomeAplicacao.nome} variant="borderless">
            <Tabs
              activeKey={activeTab}
              onChange={(key) => dispatch(setActiveTab(key))}
            >
              <Tabs.TabPane tab="Principal" key="1">
                <Principal />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Turma" key="2">
                <Turma />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Estudantes" key="3">
                <Estudantes />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Resultado por Probabilidade" key="4">
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
