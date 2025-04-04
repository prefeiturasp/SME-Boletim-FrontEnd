import React from "react";
import { Layout, Breadcrumb } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "./cabecalho.css";
import { Row } from "antd";
const { Header } = Layout;
import { Link } from "react-router-dom";

const linkRetorno = "https://serap.sme.prefeitura.sp.gov.br/";

const Cabecalho: React.FC = () => {
  return (
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
      </Header>
    </Row>
  );
};

export default Cabecalho;
