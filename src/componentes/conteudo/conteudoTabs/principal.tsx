import React from "react";
import { Row, Col } from "antd";
import "./principal.css";
import Tabela from "../tabela/tabela";
import DesempenhoAno from "../../grafico/desempenhoAno";

const Principal: React.FC = () => {
  return (
    <>
      <span>
        Esta seção apresenta uma tabela e um gráfico que ilustram a quantidade
        de estudantes por ano escolar e faixa de classificação em cada nível.
      </span>

      <div className="legenda-container-fundo">
        <Row gutter={16}>
          <Col>
            <span className="legenda-item">
              <strong>AB</strong> = Abaixo do básico
            </span>
          </Col>
          <Col>
            <span className="legenda-item">
              <strong>B</strong> = Básico
            </span>
          </Col>
          <Col>
            <span className="legenda-item">
              <strong>AD</strong> = Adequado
            </span>
          </Col>
          <Col>
            <span className="legenda-item">
              <strong>AV</strong> = Avançado
            </span>
          </Col>
        </Row>
      </div>

      <Tabela />      
      <DesempenhoAno />
    </>
  );
};

export default Principal;
