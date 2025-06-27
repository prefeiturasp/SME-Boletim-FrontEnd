import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Table } from "antd";
import "./tabela.css";
import { useSelector } from "react-redux";
const colunasInicial = [
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
const Tabela = ({ dados, origem, estaCarregando }) => {
    const [colunas, setColunas] = useState(colunasInicial);
    const [draggedColumn, setDraggedColumn] = useState(null);
    const activeTab = useSelector((state) => state.tab.activeTab);
    const filtrosSelecionados = useSelector((state) => state.filtros);
    const onDragStart = (e, key) => {
        setDraggedColumn(key);
        e.dataTransfer.effectAllowed = "move";
    };
    const onDrop = (e, targetKey) => {
        e.preventDefault();
        if (!draggedColumn || draggedColumn === targetKey)
            return;
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
    const toggleColumnVisibility = (key) => {
        setColunas((prevColunas) => prevColunas.map((col) => col.key === key ? { ...col, hidden: !col.hidden } : col));
    };
    const toggleColumnVisibility2 = (key, value) => {
        setColunas((prevColunas) => prevColunas.map((col) => col.key === key ? { ...col, hidden: value } : col));
    };
    useEffect(() => {
        if (activeTab == "1") {
            colunas.map((item) => {
                if (item.key === "abaixoBasico" &&
                    filtrosSelecionados.niveisAbaPrincipal.some((item) => item.valor == 1))
                    toggleColumnVisibility2("abaixoBasico", false);
                else if (item.key === "abaixoBasico" &&
                    !filtrosSelecionados.niveisAbaPrincipal.some((item) => item.valor == 1))
                    toggleColumnVisibility2("abaixoBasico", true);
                else if (item.key === "basico" &&
                    filtrosSelecionados.niveisAbaPrincipal.some((item) => item.valor == 2))
                    toggleColumnVisibility2("basico", false);
                else if (item.key === "basico" &&
                    !filtrosSelecionados.niveisAbaPrincipal.some((item) => item.valor == 2))
                    toggleColumnVisibility2("basico", true);
                else if (item.key === "adequado" &&
                    filtrosSelecionados.niveisAbaPrincipal.some((item) => item.valor == 3))
                    toggleColumnVisibility2("adequado", false);
                else if (item.key === "adequado" &&
                    !filtrosSelecionados.niveisAbaPrincipal.some((item) => item.valor == 3))
                    toggleColumnVisibility2("adequado", true);
                else if (item.key === "avancado" &&
                    filtrosSelecionados.niveisAbaPrincipal.some((item) => item.valor == 4))
                    toggleColumnVisibility2("avancado", false);
                else if (item.key === "avancado" &&
                    !filtrosSelecionados.niveisAbaPrincipal.some((item) => item.valor == 4))
                    toggleColumnVisibility2("avancado", true);
            });
        }
    }, [filtrosSelecionados, activeTab]);
    const menu = {
        items: colunas.map((col) => ({
            key: col.key,
            label: (_jsxs("div", { draggable: true, onDragStart: (e) => onDragStart(e, col.key), onDrop: (e) => onDrop(e, col.key), onDragOver: (e) => e.preventDefault(), style: { cursor: "pointer" }, children: [_jsx("input", { type: "checkbox", checked: !col.hidden, onChange: () => toggleColumnVisibility(col.key), style: { marginRight: 8 } }), col.title] })),
        })),
    };
    return (_jsx("div", { className: "tabela-container", children: _jsx(Table, { columns: colunas.filter((col) => !col.hidden), dataSource: dados, pagination: false, loading: estaCarregando, locale: { emptyText: "Não encontramos dados para a UE selecionada" }, scroll: { x: "max-content" } }) }));
};
export default Tabela;
