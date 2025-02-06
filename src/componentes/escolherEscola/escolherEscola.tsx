import React from "react";
import { Layout, Breadcrumb, Typography, Flex } from "antd";

import {
  Col,
  Divider,
  Row,
  Space,
  Card,
  Drawer,
  Button,
  Checkbox,
  Select,
} from "antd";
import { FilterOutlined } from "@ant-design/icons";
import "./escolherEscola.css";
import { useDispatch, useSelector } from "react-redux";
import { selecionarEscola } from "../../redux/slices/escolaSlice";
import { RootState } from "../../redux/store";
const EscolherEscola: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);

  const dispatch = useDispatch();
  const escolaSelecionada = useSelector(
    (state: RootState) => state.escola.escolaSelecionada
  );

  const handleChange = (value: string) => {
    dispatch(selecionarEscola(value)); // Salva a escola no Redux
  };

  const abrirFiltro = () => {
    setOpen(true);
    setLoading(false);
  };

  return (
    <>
      <Row className="escolher-escola" justify="space-between" align="middle">
        <Col>
          <span className="nome-escola">
            EMEF Bartolomeu Lourenço de Gusmão
          </span>
        </Col>
        <Col>
          <FilterOutlined className="icone-filtrar" onClick={abrirFiltro} />
          <span className="texto-filtrar" onClick={abrirFiltro}>
            {" "}
            Filtrar{" "}
          </span>
        </Col>
      </Row>

      <Drawer
        className="custom-drawer"
        closable
        destroyOnClose
        title={
          <p>
            {" "}
            <FilterOutlined /> <span>Filtrar</span>
          </p>
        }
        placement="right"
        open={open}
        loading={loading}
        onClose={() => setOpen(false)}
      >
        <Divider className="separador" />
        <div className="filtro-secao">
          <h3 className="filtro-titulo">Níveis</h3>
          <Checkbox>Abaixo do básico</Checkbox>
          <Checkbox>Básico</Checkbox>
          <Checkbox>Adequado</Checkbox>
          <Checkbox>Avançado</Checkbox>
        </div>
        <Divider className="separador" />
        <div className="filtro-secao">
          <h3 className="filtro-titulo">Ano letivo</h3>
          <Checkbox>5º ano</Checkbox>
          <Checkbox>9º ano</Checkbox>
        </div>
        <Divider className="separador" />
        <div className="filtro-secao">
          <h3 className="filtro-titulo">Componente curricular</h3>
          <Checkbox>Língua Portuguesa</Checkbox>
          <Checkbox>Matemática</Checkbox>
        </div>
        <Divider className="separador" />
        <Flex gap="small" wrap>
          <Button className="botao-remover">Remover Filtros</Button>
          <Button type="primary" className="botao-filtrar">
            Filtrar
          </Button>
        </Flex>
      </Drawer>

      <div className="conteudo-principal">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card
              title="Você pode filtrar por Unidade Educacional (UE) ou por Diretoria Regional de Educação (DRE)."
              bordered={false}
            >
              <Select
                showSearch
                placeholder="Selecione ou digite a DRE ou UE..."
                style={{ width: "100%" }}
                onChange={handleChange}
                value={escolaSelecionada}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={[
                  { value: "1", label: "EMEF Bartolomeu Lourenço de Gusmão" },
                  { value: "2", label: "EMEF Batista" },
                  { value: "3", label: "EMEF Teste" },
                ]}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default EscolherEscola;
