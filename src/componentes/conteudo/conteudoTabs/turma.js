import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Table, Spin } from "antd";
import { useSelector } from "react-redux";
import { servicos } from "../../../servicos";
import "./turma.css";
import DesempenhoTurma from "../../grafico/desempenhoTurma";
const colunasTurmaInicial = [
    { title: "Turma", dataIndex: "turma", key: "turma" },
    {
        title: "Abaixo do Básico",
        dataIndex: "abaixoBasico",
        key: "abaixoBasico",
    },
    { title: "Básico", dataIndex: "basico", key: "basico" },
    { title: "Adequado", dataIndex: "adequado", key: "adequado" },
    { title: "Avançado", dataIndex: "avancado", key: "avancado" },
    {
        title: "Total de Alunos",
        dataIndex: "total",
        key: "total",
        className: "col-total",
    },
    {
        title: "Média de Proficiência",
        dataIndex: "mediaProficiencia",
        key: "mediaProficiencia",
        className: "col-proficiencia",
    },
];
const colunasNiveisInicial = [
    { title: "Ano Escolar", dataIndex: "anoEscolar", key: "anoEscolar" },
    {
        title: "Abaixo do Básico",
        dataIndex: "abaixoBasico",
        key: "abaixoBasico",
    },
    { title: "Básico", dataIndex: "basico", key: "basico" },
    { title: "Adequado", dataIndex: "adequado", key: "adequado" },
    { title: "Avançado", dataIndex: "avancado", key: "avancado" },
];
const Turma = () => {
    const [colunasTurmas, setColunasTurmas] = useState(colunasTurmaInicial);
    const [colunasNiveis, setColunasNiveis] = useState(colunasNiveisInicial);
    const [dados, setDados] = useState([]);
    const [estaCarregando, setEstaCarregando] = useState(false);
    const escolaSelecionada = useSelector((state) => state.escola.escolaSelecionada);
    const aplicacaoSelecionada = useSelector((state) => state.nomeAplicacao.id);
    const activeTab = useSelector((state) => state.tab.activeTab);
    const filtrosSelecionados = useSelector((state) => state.filtros);
    const buscarDadosTurmas = async () => {
        try {
            setEstaCarregando(true);
            let filtros = "";
            if (filtrosSelecionados.anosEscolares.length > 0 ||
                filtrosSelecionados.componentesCurriculares.length > 0) {
                const params = new URLSearchParams();
                filtrosSelecionados.anosEscolares.forEach((item) => {
                    params.append("Ano", item.valor.toString());
                });
                filtrosSelecionados.componentesCurriculares.forEach((item) => {
                    params.append("ComponentesCurriculares", item.valor.toString());
                });
                filtros = `?${params.toString()}`;
            }
            const resposta = await servicos.get(`/api/boletimescolar/${aplicacaoSelecionada}/${escolaSelecionada.ueId}/turmas${filtros}`);
            setDados(resposta.provas || []);
        }
        catch (error) {
            console.error("Erro ao buscar os dados da tabela:", error);
        }
        finally {
            setEstaCarregando(false);
        }
    };
    useEffect(() => {
        if (escolaSelecionada && activeTab == "2") {
            buscarDadosTurmas();
        }
    }, [escolaSelecionada, filtrosSelecionados, activeTab, aplicacaoSelecionada]);
    const toggleColumnVisibility = (columnsSetter, key, value) => {
        columnsSetter((prevColumns) => prevColumns.map((col) => col.key === key ? { ...col, hidden: value } : col));
    };
    useEffect(() => {
        if (activeTab !== "2")
            return;
        const keys = [
            { key: "abaixoBasico", valor: 1 },
            { key: "basico", valor: 2 },
            { key: "adequado", valor: 3 },
            { key: "avancado", valor: 4 },
        ];
        keys.forEach(({ key, valor }) => {
            const isVisible = filtrosSelecionados.niveisAbaPrincipal.some((item) => item.valor === valor);
            toggleColumnVisibility(setColunasTurmas, key, !isVisible);
            toggleColumnVisibility(setColunasNiveis, key, !isVisible);
        });
    }, [filtrosSelecionados, activeTab]);
    return (_jsx(Spin, { spinning: estaCarregando, tip: "Carregando...", children: _jsxs("div", { children: [_jsx("p", { className: "secao-sobre-turmas", children: "Esta se\u00E7\u00E3o apresenta uma tabelas e gr\u00E1ficos que ilustram a quantidade de estudantes e faixa de classifica\u00E7\u00E3o em cada n\u00EDvel por turma." }), dados.map((prova) => (_jsxs("div", { children: [_jsx("p", { className: "titulo-prova-turmas", children: prova.descricao }), _jsxs("p", { className: "subtitulo-prova-turmas", children: ["Para facilitar o entendimento, esses s\u00E3o os valores de refer\u00EAncia para os cortes", " ", _jsx("b", { children: " Abaixo do B\u00E1sico (AB), B\u00E1sico (B), Adequado (AD) " }), " e", _jsx("b", { children: " Avan\u00E7ado (AV) " }), " em ", prova.descricao, "."] }), _jsx(Table, { columns: colunasNiveis, dataSource: prova.niveis, rowKey: "anoEscolar", pagination: false, size: "small", className: "tabela-niveis-turmas" }), _jsx("p", { className: "dados-turmas", children: "Distribui\u00E7\u00E3o do n\u00FAmero de estudantes em cada n\u00EDvel por turma." }), _jsx(Table, { columns: colunasTurmas, dataSource: prova.turmas, rowKey: "turma", pagination: false, size: "small" }), _jsxs("p", { className: "dados-turmas", children: ["M\u00E9dia de profici\u00EAncia em ", prova.descricao, " por turma"] }), _jsx(DesempenhoTurma, { dados: prova.turmas })] }, prova.id)))] }) }));
};
export default Turma;
