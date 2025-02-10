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

const columns: ColumnsType<DataType> = [
  {
    title: "Componente curricular",
    dataIndex: "componente",
    key: "componente",
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

const data: DataType[] = [
  {
    key: "1",
    componente: "Língua portuguesa (5º ano)",
    abaixoBasico: "24 (32,4%)",
    basico: "34 (45,9%)",
    adequado: "16 (21,6%)",
    avancado: "0 (0%)",
    total: 74,
    mediaProficiencia: 168.7,
  },
  {
    key: "2",
    componente: "Língua portuguesa (9º ano)",
    abaixoBasico: "60 (73,2%)",
    basico: "20 (24,4%)",
    adequado: "2 (2,4%)",
    avancado: "0 (0%)",
    total: 82,
    mediaProficiencia: 180.2,
  },
  {
    key: "3",
    componente: "Matemática (5º ano)",
    abaixoBasico: "41 (55,4%)",
    basico: "25 (33,8%)",
    adequado: "8 (10,8%)",
    avancado: "0 (0%)",
    total: 74,
    mediaProficiencia: 169.9,
  },
  {
    key: "4",
    componente: "Matemática (9º ano)",
    abaixoBasico: "68 (82,9%)",
    basico: "14 (17,1%)",
    adequado: "0 (0%)",
    avancado: "0 (0%)",
    total: 82,
    mediaProficiencia: 197.2,
  },
];

const Tabela: React.FC = () => {
  return (
    <div className="tabela-container">
      <Table columns={columns} dataSource={data} pagination={false} />
    </div>
  );
};

export default Tabela;
