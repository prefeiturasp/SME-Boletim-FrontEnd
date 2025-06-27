import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button, Checkbox, Divider, Drawer, Flex, Input, Radio, Select, } from "antd";
import { useDispatch, useSelector } from "react-redux";
import "./filtroLateral.css";
import { useEffect, useState } from "react";
import { setFilters } from "../../redux/slices/filtrosSlice";
const FiltroLateral = ({ open, setOpen, filtroDados, }) => {
    const activeTab = useSelector((state) => state.tab.activeTab);
    const filtrosSelecionados = useSelector((state) => state.filtros);
    const dispatch = useDispatch();
    const [selectedFilters, setSelectedFilters] = useState(filtrosSelecionados);
    useEffect(() => {
        if (open) {
            setSelectedFilters(filtrosSelecionados);
        }
    }, [open]);
    const initialValue = filtroDados.nivelMinimo;
    const limit = filtroDados.nivelMaximo;
    const generateOptions = () => {
        const options = [];
        for (let i = initialValue; i <= limit; i += 25) {
            options.push(i);
        }
        return options;
    };
    const handleResetFilters = () => {
        setSelectedFilters({
            niveis: [],
            niveisAbaPrincipal: [
                { texto: "Abaixo do Básico", valor: 1 },
                { texto: "Básico", valor: 2 },
                { texto: "Adequado", valor: 3 },
                { texto: "Avançado", valor: 4 },
            ],
            anosEscolares: [],
            componentesCurriculares: [],
            anosEscolaresRadio: [filtroDados.anosEscolares[0]],
            componentesCurricularesRadio: [filtroDados.componentesCurriculares[0]],
            nomeEstudante: "",
            eolEstudante: "",
            nivelMinimo: filtroDados.nivelMinimo,
            nivelMinimoEscolhido: filtroDados.nivelMinimo,
            nivelMaximo: filtroDados.nivelMaximo,
            nivelMaximoEscolhido: filtroDados.nivelMaximo,
            turmas: [],
        });
    };
    const handleApplyFilters = () => {
        dispatch(setFilters(selectedFilters));
        setOpen(false);
    };
    const handleFilterChange = (filterType, value, type = "checkbox") => {
        setSelectedFilters((prevFilters) => {
            const newFilters = { ...prevFilters };
            if (filterType === "niveis" ||
                filterType === "niveisAbaPrincipal" ||
                filterType === "anosEscolares" ||
                filterType === "componentesCurriculares" ||
                filterType === "turmas" ||
                filterType === "anosEscolaresRadio" ||
                filterType === "componentesCurricularesRadio") {
                const arrayFiltro = newFilters[filterType];
                let item;
                if (typeof value === "object") {
                    item = value;
                }
                else {
                    item = { valor: value, texto: String(value) };
                }
                if (type === "radio") {
                    newFilters[filterType] = [item];
                }
                else {
                    const exists = arrayFiltro.some((f) => f.valor === item.valor);
                    newFilters[filterType] = exists
                        ? arrayFiltro.filter((f) => f.valor !== item.valor)
                        : [...arrayFiltro, item];
                }
            }
            else if (filterType === "nomeEstudante" ||
                filterType === "eolEstudante") {
                newFilters[filterType] = value;
            }
            else if (filterType === "nivelMinimo" ||
                filterType === "nivelMinimoEscolhido" ||
                filterType === "nivelMaximo" ||
                filterType === "nivelMaximoEscolhido") {
                newFilters[filterType] = value;
            }
            return newFilters;
        });
    };
    return (_jsx(_Fragment, { children: _jsxs(Drawer, { className: "custom-drawer", closable: true, destroyOnClose: true, title: _jsxs("p", { children: [_jsx("img", { src: "/icon_filter_white.svg", alt: "Filtrar", className: "icone-filtrar-drawer" }), _jsx("span", { children: " Filtrar" })] }), placement: "right", open: open, onClose: () => setOpen(false), children: [activeTab == "4" && (_jsxs(_Fragment, { children: [_jsx(Divider, { className: "separador" }), _jsxs("div", { className: "filtro-secao", children: [_jsx("h3", { className: "filtro-titulo", children: "Turmas" }), filtroDados.turmas.map((turma) => (_jsx(Checkbox, { checked: selectedFilters.turmas.some((item) => item.valor === turma.valor), onChange: () => handleFilterChange("turmas", turma.valor), children: turma.texto }, turma.valor)))] })] })), (activeTab == "1" || activeTab == "2" || activeTab == "4") && (_jsxs(_Fragment, { children: [_jsx(Divider, { className: "separador" }), _jsxs("div", { className: "filtro-secao", children: [_jsx("h3", { className: "filtro-titulo", children: "N\u00EDvel" }), filtroDados.niveis.map((nivel) => (_jsx(Checkbox, { defaultChecked: true, checked: selectedFilters.niveisAbaPrincipal.some((item) => item.valor === nivel.valor), onChange: () => handleFilterChange("niveisAbaPrincipal", nivel), children: nivel.texto }, nivel.valor)))] })] })), activeTab == "3" && (_jsxs(_Fragment, { children: [_jsx(Divider, { className: "separador" }), _jsxs("div", { className: "filtro-secao", children: [_jsx("h3", { className: "filtro-titulo", children: "Nome do estudante" }), _jsx(Input, { className: "filtro-input", placeholder: "Digite o nome do estudante", value: selectedFilters.nomeEstudante, onChange: (e) => handleFilterChange("nomeEstudante", e.target.value) })] }), _jsx(Divider, { className: "separador" }), _jsxs("div", { className: "filtro-secao", children: [_jsx("h3", { className: "filtro-titulo", children: "EOL do estudante" }), _jsx(Input, { className: "filtro-input", placeholder: "Digite o EOL do estudante", value: selectedFilters.eolEstudante, onChange: (e) => handleFilterChange("eolEstudante", e.target.value) })] })] })), activeTab != "4" && (_jsxs(_Fragment, { children: [_jsx(Divider, { className: "separador" }), _jsxs("div", { className: "filtro-secao", children: [_jsx("h3", { className: "filtro-titulo", children: "Ano" }), filtroDados.anosEscolares.map((ano) => (_jsx(Checkbox, { checked: selectedFilters.anosEscolares.some((item) => item.valor === ano.valor), onChange: () => handleFilterChange("anosEscolares", ano.valor), children: ano.texto + "º ano" }, ano.valor)))] }), _jsx(Divider, { className: "separador" }), _jsxs("div", { className: "filtro-secao", children: [_jsx("h3", { className: "filtro-titulo", children: "Componente curricular" }), filtroDados.componentesCurriculares.map((comp) => (_jsx(Checkbox, { checked: selectedFilters.componentesCurriculares.some((item) => item.valor === comp.valor), onChange: () => handleFilterChange("componentesCurriculares", comp.valor), children: comp.texto }, comp.valor)))] })] })), activeTab == "9" && (_jsxs(_Fragment, { children: [_jsx(Divider, { className: "separador" }), _jsxs("div", { className: "filtro-secao", children: [_jsx("h3", { className: "filtro-titulo", children: "Ano" }), filtroDados.anosEscolares.map((ano) => (_jsx(Radio, { checked: selectedFilters.anosEscolaresRadio.some((item) => item.valor === ano.valor), onChange: () => handleFilterChange("anosEscolaresRadio", ano, "radio"), children: ano.texto + "º ano" }, ano.valor)))] }), _jsx(Divider, { className: "separador" }), _jsxs("div", { className: "filtro-secao", children: [_jsx("h3", { className: "filtro-titulo", children: "Componente curricular" }), filtroDados.componentesCurriculares.map((comp) => (_jsx(Radio, { checked: selectedFilters.componentesCurricularesRadio.some((item) => item.valor === comp.valor), onChange: () => handleFilterChange("componentesCurricularesRadio", comp, "radio"), children: comp.texto }, comp.valor)))] })] })), activeTab == "3" && (_jsxs(_Fragment, { children: [_jsx(Divider, { className: "separador" }), _jsxs("div", { className: "filtro-secao", children: [_jsx("h3", { className: "filtro-titulo", children: "N\u00EDvel" }), filtroDados.niveis.map((nivel) => (_jsx(Checkbox, { checked: selectedFilters.niveis.some((item) => item.valor === nivel.valor), onChange: () => handleFilterChange("niveis", nivel.valor), children: nivel.texto }, nivel.valor)))] })] })), activeTab == "3" && (_jsxs(_Fragment, { children: [_jsx(Divider, { className: "separador" }), _jsxs("div", { className: "filtro-secao", children: [_jsx("h3", { className: "filtro-titulo", children: "Profici\u00EAncia" }), "Selecione um intervalo de profici\u00EAncia.", _jsxs("div", { className: "select-caixa", children: [_jsx("span", { className: "label", children: "N\u00EDvel inicial:" }), _jsx(Select, { defaultValue: initialValue, className: "select", value: selectedFilters.nivelMinimoEscolhido, onChange: (value) => handleFilterChange("nivelMinimoEscolhido", value), children: generateOptions().map((value) => (_jsx("option", { value: value, children: value }, value))) })] })] }), _jsx("div", { children: _jsxs("div", { className: "select-caixa", children: [_jsx("span", { className: "label", children: "N\u00EDvel final:" }), _jsx(Select, { defaultValue: limit, className: "select", value: selectedFilters.nivelMaximoEscolhido, onChange: (value) => handleFilterChange("nivelMaximoEscolhido", value), children: generateOptions().map((value) => (_jsx("option", { value: value, children: value }, value))) })] }) })] })), _jsx(Divider, { className: "separador" }), _jsxs(Flex, { gap: "small", wrap: true, children: [_jsx(Button, { className: "botao-remover", onClick: handleResetFilters, children: "Remover Filtros" }), _jsx(Button, { type: "primary", className: "botao-filtrar", onClick: handleApplyFilters, children: "Filtrar" })] })] }) }));
};
export default FiltroLateral;
