import React from "react";
import { Row, Col, Card, Tabs } from "antd";
import Principal from "./conteudoTabs/principal";
import Turma from "./conteudoTabs/turma";
import Estudantes from "./conteudoTabs/estudantes";
import Resultado from "./conteudoTabs/probabilidade";

const Conteudo: React.FC = () => {
  return (
    <div className="conteudo-principal">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Saberes e aprendizagens (agosto 2024)" bordered={false}>
            <Tabs defaultActiveKey="1">
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
