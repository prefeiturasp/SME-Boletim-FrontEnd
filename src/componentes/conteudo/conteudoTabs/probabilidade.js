import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Table, Spin, Select, Space, Input, Col, Button, Row, notification, } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { servicos } from "../../../servicos";
import "./probabilidade.css";
import { CheckCircleOutlined, DownloadOutlined, InfoCircleOutlined, SearchOutlined, } from "@ant-design/icons";
import { setFilters } from "../../../redux/slices/filtrosSlice";
const colunasInicial = [
    {
        title: "Código",
        dataIndex: "codigoHabilidade",
        key: "codigoHabilidade",
    },
    {
        title: "Habilidades",
        dataIndex: "habilidadeDescricao",
        key: "habilidadeDescricao",
    },
    { title: "Turma", dataIndex: "turmaDescricao", key: "turmaDescricao" },
    {
        title: "Abaixo do básico",
        dataIndex: "abaixoDoBasico",
        key: "abaixoDoBasico",
    },
    { title: "Básico", dataIndex: "basico", key: "basico" },
    { title: "Adequado", dataIndex: "adequado", key: "adequado" },
    {
        title: "Avançado",
        dataIndex: "avancado",
        key: "avancado",
    },
];
const Probabilidade = () => {
    const [dados, setDados] = useState([]);
    const [dadosFormatados, setDadosFormatados] = useState([]);
    const [disciplinas, setDadosDisciplinas] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [pagina, setPagina] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRegistros, setTotalRegistros] = useState(0);
    const [filtroTexto, setFiltroTexto] = useState("");
    const [estaCarregandoRelatorio, setEstaCarregandoRelatorio] = useState(false);
    const [disciplinaIdSelecionada, setDisciplinaId] = useState();
    const dispatch = useDispatch();
    const [selectedFilters, setSelectedFilters] = useState({
        niveis: [],
        niveisAbaPrincipal: [],
        anosEscolares: [],
        componentesCurriculares: [],
        anosEscolaresRadio: [],
        componentesCurricularesRadio: [],
        nivelMinimo: 0,
        nivelMinimoEscolhido: 0,
        nivelMaximo: 0,
        nivelMaximoEscolhido: 0,
        turmas: [],
        nomeEstudante: "",
        eolEstudante: "",
    });
    const [colunas, setColunas] = useState(colunasInicial);
    const escolaSelecionada = useSelector((state) => state.escola.escolaSelecionada);
    const filtroCompleto = useSelector((state) => state.filtroCompleto);
    const [componentesCurricularSelecionado, setComponentesCurricular] = useState(filtroCompleto.componentesCurriculares[0]?.texto);
    const [componentesCurricularSelecionadoId, setComponentesCurricularId] = useState(filtroCompleto.componentesCurriculares[0]?.valor);
    const [anosEscolarSelecionado, setAnoEscolar] = useState(filtroCompleto.anosEscolares[0]?.texto);
    const [anosEscolarSelecionadoId, setAnoEscolarId] = useState(filtroCompleto.anosEscolares[0]?.valor);
    const aplicacaoSelecionada = useSelector((state) => state.nomeAplicacao.id);
    const filtrosSelecionados = useSelector((state) => state.filtros);
    const activeTab = useSelector((state) => state.tab.activeTab);
    const buscarDadosEstudantes = async (paginaAtual = 1, tamanhoPagina = 10) => {
        try {
            setCarregando(true);
            let filtros = "";
            const params = new URLSearchParams();
            if (filtroTexto.trim().length > 0) {
                params.append("Habilidade", filtroTexto);
            }
            if (filtrosSelecionados.turmas.length > 0) {
                filtrosSelecionados.turmas.forEach((item) => {
                    params.append("Turma", item.valor.toString());
                });
            }
            filtros = params.toString();
            const idComponentesCurriculares = filtroCompleto.componentesCurriculares.find((item) => item.texto === componentesCurricularSelecionado)?.valor ?? 0;
            const idAnosEscolares = filtroCompleto.anosEscolares.find((item) => item.texto === anosEscolarSelecionado)?.valor ?? 0;
            const resposta = await servicos.get(`/api/boletimescolar/${aplicacaoSelecionada}/${escolaSelecionada.ueId}/${idComponentesCurriculares}/${idAnosEscolares}/resultado-probabilidade/lista?Pagina=${paginaAtual}&TamanhoPagina=${tamanhoPagina}&${filtros}`);
            setDadosFormatados(resposta.resultados);
            setTotalRegistros(resposta.totalRegistros);
        }
        catch (error) {
            console.error("Erro ao buscar os dados da tabela:", error);
        }
        finally {
            setCarregando(false);
        }
    };
    useEffect(() => {
        if (escolaSelecionada && activeTab == "4") {
            buscarDadosEstudantes(pagina, pageSize);
        }
    }, [pagina, pageSize, activeTab, aplicacaoSelecionada]);
    useEffect(() => {
        if (activeTab === "4" &&
            filtrosSelecionados.componentesCurricularesRadio.length > 0 &&
            filtrosSelecionados.anosEscolaresRadio.length > 0) {
            const componente = filtrosSelecionados.componentesCurricularesRadio[0];
            const ano = filtrosSelecionados.anosEscolaresRadio[0];
            if (componente && componente.texto) {
                setComponentesCurricular(componente.texto);
            }
            if (ano && ano.texto) {
                setAnoEscolar(ano.texto);
            }
        }
    }, [filtrosSelecionados, activeTab, aplicacaoSelecionada]);
    const toggleColumnVisibility = (columnsSetter, key, value) => {
        columnsSetter((prevColumns) => prevColumns.map((col) => col.key === key ? { ...col, hidden: value } : col));
    };
    useEffect(() => {
        if (activeTab !== "2" && activeTab !== "4")
            return;
        const keys = [
            { key: "abaixoBasico", valor: 1 },
            { key: "basico", valor: 2 },
            { key: "adequado", valor: 3 },
            { key: "avancado", valor: 4 },
        ];
        keys.forEach(({ key, valor }) => {
            const isVisible = filtrosSelecionados.niveisAbaPrincipal.some((item) => item.valor === valor);
            toggleColumnVisibility(setColunas, key, !isVisible);
        });
    }, [filtrosSelecionados, activeTab, aplicacaoSelecionada]);
    const alteraRadio = (valor, tipo) => {
        if (tipo === "componentesCurriculares") {
            setComponentesCurricular(valor);
            setComponentesCurricularId(valor);
            const item = filtroCompleto.componentesCurriculares.find((item) => item.texto === valor);
            const novosFiltros = {
                ...filtrosSelecionados,
                componentesCurricularesRadio: [item],
            };
            dispatch(setFilters(novosFiltros));
        }
        else if (tipo === "anosEscolares") {
            setAnoEscolar(valor);
            setAnoEscolarId(valor);
            const item = filtroCompleto.anosEscolares.find((item) => item.texto === valor);
            const novosFiltros = {
                ...filtrosSelecionados,
                anosEscolaresRadio: [item],
            };
            dispatch(setFilters(novosFiltros));
        }
    };
    useEffect(() => {
        if (escolaSelecionada && activeTab == "4" && filtrosSelecionados) {
            setPagina(1);
            buscarDadosEstudantes(1, 10);
        }
    }, [
        filtroTexto,
        anosEscolarSelecionado,
        componentesCurricularSelecionado,
        filtrosSelecionados,
        activeTab,
        aplicacaoSelecionada,
    ]);
    const iniciarDownloadRelatorioProbabilidade = async () => {
        setEstaCarregandoRelatorio(true);
        notification.open({
            key: "relatorioProbabilidade",
            message: "Os dados estão em processamento",
            description: `Não atualize a tela! Assim que processamento for finalizado, o seu documento "resultado por probabilidades" será baixado automaticamente.`,
            placement: "bottomLeft",
            icon: _jsx(InfoCircleOutlined, { style: { color: "#108ee9" } }),
            duration: 8,
            pauseOnHover: true,
            closeIcon: false,
        });
        const idComponentesCurriculares = filtroCompleto.componentesCurriculares.find((item) => item.texto === componentesCurricularSelecionado)?.valor ?? 0;
        try {
            const resposta = await servicos.get(`/api/BoletimEscolar/download-probabilidade/${aplicacaoSelecionada}/${escolaSelecionada.ueId}/${componentesCurricularSelecionadoId}/${anosEscolarSelecionadoId}`, { responseType: "blob" });
            const blob = new Blob([resposta], {
                type: "application/vnd.ms-excel",
            });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `boletim-resultados-probabilidades-${escolaSelecionada.descricao}.xls`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            notification.open({
                key: "relatorioProbabilidadeSuccess",
                message: "Tudo certo por aqui!",
                description: `Seu documento "resultados por probabilidades" foi baixado com sucesso! Verifique a pasta de downloads no seu dispositivo.`,
                placement: "bottomLeft",
                icon: _jsx(CheckCircleOutlined, { style: { color: "#108ee9" } }),
                duration: 8,
                pauseOnHover: true,
                closeIcon: false,
            });
        }
        catch (error) {
            console.error("Erro ao buscar os dados da tabela:", error);
            setEstaCarregandoRelatorio(false);
            notification.open({
                key: "relatorioProbabilidadeErro",
                message: "Não conseguimos baixar seu documento",
                description: `Ocorreu um erro no download do seu documento "resultados por probabilidades". Você pode tentar novamente. `,
                placement: "bottomLeft",
                icon: _jsx(InfoCircleOutlined, { style: { color: "#108ee9" } }),
                duration: 8,
                pauseOnHover: true,
                closeIcon: false,
            });
        }
        finally {
            setEstaCarregandoRelatorio(false);
        }
    };
    return (_jsxs(Spin, { spinning: carregando, tip: "Carregando...", children: [_jsxs("div", { children: [_jsxs("p", { className: "secao-sobre-probabilidade", children: ["Os percentuais por habilidade ajudam os professores no planejamento de atividades para melhorar o aprendizado dos alunos. Para calcular esses percentuais, foi criada uma t\u00E9cnica que leva em conta as probabilidades dos alunos que foram classificados nas categorias: Abaixo do B\u00E1sico (AB), B\u00E1sico (B), Adequado (AD) e Avan\u00E7ado (AV).", " ", _jsx("br", {}), " ", _jsx("br", {}), "Nesta se\u00E7\u00E3o, ser\u00E3o apresentados os percentuais por habilidade para cada ano escolar e turma. Esses percentuais mostram a probabilidade de os estudantes, classificados nas categorias Abaixo do", " ", _jsx("b", { children: " B\u00E1sico (AB), B\u00E1sico (B), Adequado (AD) " }), " e", " ", _jsx("b", { children: " Avan\u00E7ado (AV) " }), ", acertarem qualquer tarefa relacionada \u00E0 habilidade analisada. Ao visualizar uma linha da tabela, voc\u00EA encontrar\u00E1 a descri\u00E7\u00E3o da habilidade, al\u00E9m dos percentuais por categoria."] }), _jsxs("div", { className: "secao-escolher-disciplina", children: [_jsx("span", { children: "Selecione um componente curricular e o ano que deseja visualizar na tabela:" }), _jsxs(Space, { style: { display: "flex", alignItems: "center" }, children: [_jsx("span", { children: "Componente curricular:" }), _jsx(Select, { className: "custom-select-color", style: {
                                            border: "none",
                                            borderBottom: "1px solid white",
                                            width: 170,
                                            backgroundColor: "transparent",
                                            color: "white",
                                        }, dropdownStyle: { borderRadius: 8 }, variant: "borderless", placeholder: "Selecione", onChange: (value) => {
                                            setComponentesCurricular(value);
                                            setComponentesCurricularId(value);
                                            alteraRadio(value, "componentesCurriculares");
                                        }, value: filtrosSelecionados &&
                                            filtrosSelecionados.componentesCurricularesRadio.length > 0 &&
                                            filtrosSelecionados.componentesCurricularesRadio[0] &&
                                            filtrosSelecionados.componentesCurricularesRadio[0].texto
                                            ? filtrosSelecionados.componentesCurricularesRadio[0].texto
                                            : undefined, children: filtroCompleto.componentesCurriculares.map((item) => (_jsx(Select.Option, { value: item.texto, children: item.texto }, item.valor))) }), _jsx("span", { children: "Ano:" }), _jsx(Select, { className: "custom-select-color", style: {
                                            border: "none",
                                            borderBottom: "1px solid white",
                                            width: 110,
                                            backgroundColor: "transparent",
                                            color: "white",
                                        }, dropdownStyle: { borderRadius: 8 }, variant: "borderless", placeholder: "Selecione", onChange: (value) => {
                                            setAnoEscolar(value);
                                            setAnoEscolarId(value);
                                            alteraRadio(value, "anosEscolares");
                                        }, value: filtrosSelecionados &&
                                            filtrosSelecionados.anosEscolaresRadio.length > 0 &&
                                            filtrosSelecionados.anosEscolaresRadio[0] &&
                                            filtrosSelecionados.anosEscolaresRadio[0].texto
                                            ? filtrosSelecionados.anosEscolaresRadio[0].texto
                                            : undefined, children: filtroCompleto.anosEscolares.map((item) => (_jsx(Select.Option, { value: item.texto, children: item.texto + "º ano" }, item.valor))) })] })] }), _jsx("br", {}), _jsxs("p", { className: "secao-sobre-probabilidade", children: ["Tabela dos alunos do ", anosEscolarSelecionado, "\u00BA ano em", " ", componentesCurricularSelecionado, " com os percentuais por habilidade em cada um dos cortes: Abaixo do B\u00E1sico (AB), B\u00E1sico (B), Adequado (AD) e Avan\u00E7ado (AV). Utilize os campos de busca para encontrar o que voc\u00EA precisa mais r\u00E1pido."] }), _jsxs("div", { style: { marginBottom: 16 }, children: [_jsx("p", { className: "secao-sobre-probabilidade", children: "Utilize o campo de busca para encontrar c\u00F3digos ou habilidades espec\u00EDficas:" }), " ", _jsx(Input, { placeholder: "Digite o c\u00F3digo ou habilidade", onChange: (e) => setFiltroTexto(e.target.value), style: {
                                    width: 400,
                                    border: "none",
                                    borderBottom: "1px solid #d9d9d9",
                                    backgroundColor: "transparent",
                                    paddingRight: 30,
                                }, suffix: _jsx(SearchOutlined, { style: { color: "#999" } }) })] }), _jsx(Table, { columns: colunas, dataSource: dadosFormatados.filter((item) => item.habilidadeDescricao
                            .toLowerCase()
                            .includes(filtroTexto.toLowerCase()) ||
                            item.codigoHabilidade
                                .toLowerCase()
                                .includes(filtroTexto.toLowerCase())), locale: { emptyText: "Não encontramos dados" }, pagination: {
                            current: pagina,
                            total: totalRegistros,
                            pageSize,
                            showSizeChanger: true,
                            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} temas`,
                            pageSizeOptions: ["10", "20", "30", "40", "50", "100"],
                            onShowSizeChange: (_, newSize) => setPageSize(newSize),
                            onChange: (page, newSize) => {
                                setPagina(page);
                                setPageSize(newSize);
                            },
                            position: ["bottomCenter"],
                            locale: {
                                items_per_page: "/ página",
                            },
                        } })] }), _jsx("br", {}), _jsx("div", { className: "download-section", children: _jsx(Row, { gutter: 16, align: "middle", justify: "center", children: _jsx(Col, { children: _jsxs("div", { className: "download-wrapper", children: [_jsxs("p", { className: "school-text", children: ["Voc\u00EA pode baixar os dados das habilidades do", " ", _jsxs("b", { children: [anosEscolarSelecionado, "\u00BA ano"] }), " em", " ", _jsx("b", { children: componentesCurricularSelecionado }), ", clicando no bot\u00E3o ao lado"] }), _jsx(Button, { type: "primary", target: "_blank", rel: "noopener noreferrer", onClick: iniciarDownloadRelatorioProbabilidade, icon: _jsx(DownloadOutlined, {}), disabled: estaCarregandoRelatorio, children: "Baixar os dados" })] }) }) }) })] }));
};
export default Probabilidade;
