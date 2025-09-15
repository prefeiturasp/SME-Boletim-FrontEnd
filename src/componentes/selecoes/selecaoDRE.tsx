import { Card, Col, Row, Select } from "antd";
import React from "react";

const SelecaoDRE: React.FC = () => {
  
    const handleChange = (valor: string) => {
    console.log(valor)
  };
  

  return (
    <>
      <div className="conteudo-principal">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title="" variant="borderless">
              <div className="card-escolher-escolas">
                Você pode filtrar por Diretoria Regional de Educação (DRE) ou
                Unidade Educacional (UE).
              </div>
              <Select
                showSearch
                placeholder="Selecione ou digite a DRE ou UE..."
                style={{ width: "100%" }}
                onChange={handleChange}
                //value={
                  //escolaSelecionada ? String(escolaSelecionada.ueId) : undefined
                //}
                notFoundContent="Não encontramos nenhuma DRE ou UE com o nome digitado..."
                filterOption={(input, option) =>
                  String(option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                //options={opcoes}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default SelecaoDRE;
