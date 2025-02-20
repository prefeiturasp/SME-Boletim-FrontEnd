import React from "react";
import { Button, Col, Row } from "antd";
import { UpOutlined } from "@ant-design/icons";
import "./rodape.css";

const Rodape: React.FC = () => {
  const voltarAoInicio = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const versao = import.meta.env.VITE_BOLETIM_VERSAO;

  return (
    <>
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
    </>
  );
};

export default Rodape;
