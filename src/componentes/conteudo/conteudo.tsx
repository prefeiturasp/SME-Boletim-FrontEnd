import React, { useEffect, useState } from "react";
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
  const filtrosCarregados = useSelector(
    (state: RootState) => state.filtroCarregado
  );

  const abasDesabilitadas = !filtrosCarregados.carregado;

  return (
    <div className="conteudo-principal">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title={
              <h2 style={{ fontSize: "20px", color: "#595959" }}>
                {nomeAplicacao.nome}
              </h2>
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
