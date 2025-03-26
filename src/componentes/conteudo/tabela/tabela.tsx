import React, { useEffect, useState } from "react";
import { Table, Dropdown, Menu, Button, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";
import "./tabela.css";
import { FilterOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

interface DataType {
  key: string;
  componenteCurricular: string;
  abaixoBasico: string;
  basico: string;
  adequado: string;
  avancado: string;
  total: number;
  mediaProficiencia: number;
}

const colunasInicial: ColumnsType<DataType> = [
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
  dados: DataType[];
  origem: "principal";
  estaCarregando: boolean;
}

const Tabela: React.FC<TabelaProps> = ({ dados, origem, estaCarregando }) => {
  const [colunas, setColunas] = useState<ColumnsType<DataType>>(colunasInicial);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);

  const activeTab = useSelector((state: RootState) => state.tab.activeTab);
  const filtrosSelecionados = useSelector((state: RootState) => state.filtros);

  const onDragStart = (e: React.DragEvent, key: string) => {
    setDraggedColumn(key);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDrop = (e: React.DragEvent, targetKey: string) => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === targetKey) return;

    const newOrder = [...colunas];
    const draggedIndex = newOrder.findIndex((col) => col.key === draggedColumn);
    const targetIndex = newOrder.findIndex((col) => col.key === targetKey);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [removed] = newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, removed);
      setColunas(newOrder);
    }

    setDraggedColumn(null);
  };

  const toggleColumnVisibility = (key: string) => {
    setColunas((prevColunas) =>
      prevColunas.map((col) =>
        col.key === key ? { ...col, hidden: !col.hidden } : col
      )
    );
  };

  const toggleColumnVisibility2 = (key: string, value: boolean) => {
    setColunas((prevColunas) =>
      prevColunas.map((col) =>
        col.key === key ? { ...col, hidden: value } : col
      )
    );
  };

  useEffect(() => {
    if (activeTab == "1") {
      colunas.map((item) => {
        if (
          item.key === "abaixoBasico" &&
          filtrosSelecionados.niveisAbaPrincipal.some((item) => item.valor == 1)
        )
          toggleColumnVisibility2("abaixoBasico", false);
        else if (
          item.key === "abaixoBasico" &&
          !filtrosSelecionados.niveisAbaPrincipal.some(
            (item) => item.valor == 1
          )
        )
          toggleColumnVisibility2("abaixoBasico", true);
        else if (
          item.key === "basico" &&
          filtrosSelecionados.niveisAbaPrincipal.some((item) => item.valor == 2)
        )
          toggleColumnVisibility2("basico", false);
        else if (
          item.key === "basico" &&
          !filtrosSelecionados.niveisAbaPrincipal.some(
            (item) => item.valor == 2
          )
        )
          toggleColumnVisibility2("basico", true);
        else if (
          item.key === "adequado" &&
          filtrosSelecionados.niveisAbaPrincipal.some((item) => item.valor == 3)
        )
          toggleColumnVisibility2("adequado", false);
        else if (
          item.key === "adequado" &&
          !filtrosSelecionados.niveisAbaPrincipal.some(
            (item) => item.valor == 3
          )
        )
          toggleColumnVisibility2("adequado", true);
        else if (
          item.key === "avancado" &&
          filtrosSelecionados.niveisAbaPrincipal.some((item) => item.valor == 4)
        )
          toggleColumnVisibility2("avancado", false);
        else if (
          item.key === "avancado" &&
          !filtrosSelecionados.niveisAbaPrincipal.some(
            (item) => item.valor == 4
          )
        )
          toggleColumnVisibility2("avancado", true);
      });
    }
  }, [filtrosSelecionados, activeTab]);

  const menu: MenuProps = {
    items: colunas.map((col) => ({
      key: col.key as string,
      label: (
        <div
          draggable
          onDragStart={(e) => onDragStart(e, col.key as string)}
          onDrop={(e) => onDrop(e, col.key as string)}
          onDragOver={(e) => e.preventDefault()}
          style={{ cursor: "pointer" }}
        >
          <input
            type="checkbox"
            checked={!col.hidden}
            onChange={() => toggleColumnVisibility(col.key as string)}
            style={{ marginRight: 8 }}
          />
          {col.title as string}
        </div>
      ),
    })),
  };

  return (
    <div className="tabela-container">
      <Table
        columns={colunas.filter((col) => !col.hidden)}
        dataSource={dados}
        pagination={false}
        loading={estaCarregando}
        locale={{ emptyText: "Não encontramos dados para a UE selecionada" }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default Tabela;
