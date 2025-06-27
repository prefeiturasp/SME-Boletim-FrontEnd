import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Col, Row, Card, Select, Badge } from "antd";
import "./escolherEscola.css";
import { useDispatch, useSelector } from "react-redux";
import { selecionarEscola } from "../../redux/slices/escolaSlice";
import { servicos } from "../../servicos";
import { setFilters } from "../../redux/slices/filtrosSlice";
import FiltroLateral from "../filtro/filtroLateral";
import { setFiltroDados } from "../../redux/slices/filtroCompletoSlice";
import { filtroCarregado } from "../../redux/slices/filtroCarregado";
const EscolherEscola = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [abrangencia, setAbrangencia] = useState([]);
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
    const dispatch = useDispatch();
    const escolaSelecionada = useSelector((state) => state.escola.escolaSelecionada);
    const aplicacaoSelecionada = useSelector((state) => state.nomeAplicacao.id);
    const filtroDados = useSelector((state) => state.filtroCompleto);
    const filtrosSelecionados = useSelector((state) => state.filtros);
    const activeTab = useSelector((state) => state.tab.activeTab);
    const buscarAbrangencias = async () => {
        try {
            const resposta = await servicos.get("/api/abrangencia", {});
            const escolasValidas = resposta.filter((item) => item && item.ueId && item.descricao);
            setAbrangencia(escolasValidas);
        }
        catch (error) {
            console.error("Erro ao buscar escolas:", error);
        }
    };
    const buscarFiltros = async (escolaSelecionada) => {
        try {
            const resposta = await servicos.get(`/api/boletimescolar/${aplicacaoSelecionada}/${escolaSelecionada.ueId}/filtros`);
            const novosFiltros = {
                niveis: [],
                niveisAbaPrincipal: resposta.niveis || [],
                anosEscolares: [],
                componentesCurriculares: [],
                anosEscolaresRadio: resposta.anosEscolares?.length > 0 ? [resposta.anosEscolares[0]] : [],
                componentesCurricularesRadio: resposta.componentesCurriculares?.length > 0
                    ? [resposta.componentesCurriculares[0]]
                    : [],
                nivelMinimo: resposta.nivelMinimo || 0,
                nivelMinimoEscolhido: resposta.nivelMinimo || 0,
                nivelMaximo: resposta.nivelMaximo || 0,
                nivelMaximoEscolhido: resposta.nivelMaximo || 0,
                turmas: [],
                nomeEstudante: "",
                eolEstudante: "",
            };
            dispatch(setFilters(novosFiltros));
            dispatch(setFiltroDados(resposta));
            dispatch(filtroCarregado(true));
        }
        catch (error) {
            console.error("Erro ao buscar os filtros laterais:", error);
        }
    };
    useEffect(() => {
        if (escolaSelecionada.ueId != null && aplicacaoSelecionada) {
            buscarFiltros(escolaSelecionada);
        }
    }, [escolaSelecionada, aplicacaoSelecionada]);
    useEffect(() => {
        buscarAbrangencias();
    }, [aplicacaoSelecionada]);
    useEffect(() => {
        if (abrangencia.length > 0 && escolaSelecionada.ueId == null) {
            const primeiraEscola = abrangencia[0];
            dispatch(selecionarEscola({
                ueId: primeiraEscola.ueId,
                descricao: primeiraEscola.descricao,
            }));
        }
    }, [abrangencia, escolaSelecionada, dispatch]);
    const handleChange = (value, option) => {
        dispatch(selecionarEscola({ ueId: value, descricao: option.label }));
    };
    const abrirFiltro = () => {
        setOpen(true);
        setLoading(false);
    };
    const opcoes = abrangencia.map((item) => ({
        value: `${item.ueId}`,
        label: item.descricao,
    }));
    let totalFiltrosSelecionados = 0;
    if (activeTab === "1" || activeTab === "2") {
        totalFiltrosSelecionados =
            filtrosSelecionados.niveisAbaPrincipal.length +
                filtrosSelecionados.anosEscolares.length +
                filtrosSelecionados.componentesCurriculares.length;
    }
    if (activeTab === "3") {
        totalFiltrosSelecionados =
            filtrosSelecionados.anosEscolares.length +
                filtrosSelecionados.componentesCurriculares.length +
                filtrosSelecionados.niveis.length +
                (filtrosSelecionados.nomeEstudante.length > 0 ? 1 : 0) +
                (filtrosSelecionados.eolEstudante.length > 0 ? 1 : 0) +
                (filtrosSelecionados.nivelMinimoEscolhido !=
                    filtrosSelecionados.nivelMinimo
                    ? 1
                    : 0) +
                (filtrosSelecionados.nivelMaximoEscolhido !=
                    filtrosSelecionados.nivelMaximo
                    ? 1
                    : 0);
    }
    if (activeTab === "4") {
        totalFiltrosSelecionados =
            filtrosSelecionados.niveisAbaPrincipal.length +
                filtrosSelecionados.turmas.length;
    }
    return (_jsxs("div", { className: "conteudo-fixo", children: [_jsxs(Row, { className: "escolher-escola", justify: "space-between", align: "middle", children: [_jsx(Col, { children: _jsx("span", { className: "nome-escola", children: escolaSelecionada?.descricao }) }), _jsx(Col, { children: _jsxs(Badge, { count: totalFiltrosSelecionados, className: "badge-notificacoes", children: [_jsx("img", { src: "/icon_filter_default.svg", alt: "Filtrar", className: "icone-filtrar", onClick: abrirFiltro }), _jsxs("span", { className: "texto-filtrar", onClick: abrirFiltro, children: [" ", "Filtrar", " "] })] }) })] }), _jsx(FiltroLateral, { open: open, setOpen: setOpen, filtroDados: filtroDados }), _jsx("div", { className: "conteudo-principal", children: _jsx(Row, { gutter: [16, 16], children: _jsx(Col, { span: 24, children: _jsxs(Card, { title: "", variant: "borderless", children: [_jsx("div", { className: "card-escolher-escolas", children: "Voc\u00EA pode filtrar por Diretoria Regional de Educa\u00E7\u00E3o (DRE) ou Unidade Educacional (UE)." }), _jsx(Select, { showSearch: true, placeholder: "Selecione ou digite a DRE ou UE...", style: { width: "100%" }, onChange: handleChange, value: escolaSelecionada ? escolaSelecionada.descricao : undefined, notFoundContent: "N\u00E3o encontramos nenhuma DRE ou UE com o nome digitado...", filterOption: (input, option) => String(option?.label ?? "")
                                        .toLowerCase()
                                        .includes(input.toLowerCase()), options: opcoes })] }) }) }) })] }));
};
export default EscolherEscola;
