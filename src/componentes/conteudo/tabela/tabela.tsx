import React from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import "./tabela.css";

interface DataType {
  key: string;
  componente: string;
  abaixoBasico: string;
  basico: string;
  adequado: string;
  avancado: string;
  total: number;
  mediaProficiencia: number;
}

const colunasPrincipal: ColumnsType<DataType> = [
  {
    title: "Componente curricular",
    dataIndex: "componenteCurricular",
    key: "componenteCurricular",
  },
  {
    title: "Abaixo do básico",
    dataIndex: "abaixoBasico",
    key: "abaixoBasico",
  },
  {
    title: "Básico",
    dataIndex: "basico",
    key: "basico",
  },
  {
    title: "Adequado",
    dataIndex: "adequado",
    key: "adequado",
  },
  {
    title: "Avançado",
    dataIndex: "avancado",
    key: "avancado",
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    className: "col-total",
  },
  {
    title: "Média de proficiência",
    dataIndex: "mediaProficiencia",
    key: "mediaProficiencia",
    className: "col-proficiencia",
  },
];

interface TabelaProps {
  dados: any;
  origem: string;
  estaCarregando: boolean;
}

const Tabela: React.FC<TabelaProps> = ({ dados, origem, estaCarregando }) => {
  let colunas;
  if (origem == "principal") {
    colunas = colunasPrincipal;
  }

  return (
    <div className="tabela-container">
      <Table
        columns={colunas}
        dataSource={dados}
        pagination={false}
        loading={estaCarregando}
      />
    </div>
  );
};

export default Tabela;
