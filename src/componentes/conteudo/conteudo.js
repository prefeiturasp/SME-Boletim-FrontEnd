import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Row, Col, Card, Tabs, Select } from "antd";
import Principal from "./conteudoTabs/principal";
import Turma from "./conteudoTabs/turma";
import Estudantes from "./conteudoTabs/estudantes";
import Resultado from "./conteudoTabs/probabilidade";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "../../redux/slices/tabSlice";
import { setNomeAplicacao } from "../../redux/slices/nomeAplicacaoSlice";
import { servicos } from "../../servicos";
const Conteudo = () => {
    const dispatch = useDispatch();
    const activeTab = useSelector((state) => state.tab.activeTab);
    const nomeAplicacao = useSelector((state) => state.nomeAplicacao);
    const [aplicacoes, setAplicacoes] = useState([]);
    const filtrosCarregados = useSelector((state) => state.filtroCarregado);
    const escolaSelecionada = useSelector((state) => state.escola.escolaSelecionada);
    const abasDesabilitadas = !filtrosCarregados.carregado;
    const buscarAplicacoes = async () => {
        try {
            const resposta = await servicos.get(`/api/boletimescolar/aplicacoes-prova`);
            console.log(resposta);
            setAplicacoes(resposta || []);
            if (resposta.length > 0) {
                const primeiraAplicacao = resposta[0];
                dispatch(setNomeAplicacao({
                    id: primeiraAplicacao.id,
                    nome: primeiraAplicacao.nome,
                    tipoTai: primeiraAplicacao.tipoTai ?? true,
                    dataInicioLote: primeiraAplicacao.dataInicioLote ?? new Date().toISOString(),
                }));
            }
        }
        catch (error) {
            console.error("Erro ao buscar aplicações:", error);
        }
    };
    useEffect(() => {
        if (escolaSelecionada.ueId != null) {
            buscarAplicacoes();
        }
    }, [escolaSelecionada]);
    const opcoes = aplicacoes.map((item) => ({
        value: item.id,
        label: item.nome,
        aplicacao: item,
    }));
    const handleChange = (value, option) => {
        const aplicacaoSelecionada = aplicacoes.find((app) => app.id === value);
        if (aplicacaoSelecionada) {
            dispatch(setNomeAplicacao({
                id: aplicacaoSelecionada.id,
                nome: aplicacaoSelecionada.nome,
                tipoTai: aplicacaoSelecionada.tipoTai ?? true,
                dataInicioLote: aplicacaoSelecionada.dataInicioLote ?? new Date().toISOString(),
            }));
        }
    };
    return (_jsx("div", { className: "conteudo-principal", children: _jsx(Row, { gutter: [16, 16], children: _jsx(Col, { span: 24, children: _jsx(Card, { title: _jsxs("div", { children: [_jsx("span", { style: {
                                    display: "block",
                                    marginBottom: 8,
                                    marginTop: 8,
                                    fontWeight: "normal",
                                    fontSize: "14px",
                                }, children: "Voc\u00EA pode consultar as informa\u00E7\u00F5es de todas as provas j\u00E1 aplicadas. Basta selecionar a aplica\u00E7\u00E3o que deseja visualizar" }), _jsx(Select, { showSearch: true, placeholder: "Selecione uma aplica\u00E7\u00E3o...", style: { width: "100%" }, onChange: handleChange, value: nomeAplicacao.id || undefined, notFoundContent: "Nenhuma aplica\u00E7\u00E3o encontrada", filterOption: (input, option) => option?.label.toLowerCase().includes(input.toLowerCase()), options: opcoes })] }), variant: "borderless", children: _jsxs(Tabs, { activeKey: activeTab, onChange: (key) => dispatch(setActiveTab(key)), children: [_jsx(Tabs.TabPane, { tab: "Principal", disabled: abasDesabilitadas, children: _jsx(Principal, {}) }, "1"), _jsx(Tabs.TabPane, { tab: "Turma", disabled: abasDesabilitadas, children: _jsx(Turma, {}) }, "2"), _jsx(Tabs.TabPane, { tab: "Estudantes", disabled: abasDesabilitadas, children: _jsx(Estudantes, {}) }, "3"), _jsx(Tabs.TabPane, { tab: "Resultado por Probabilidade", disabled: abasDesabilitadas, children: _jsx(Resultado, {}) }, "4")] }) }) }) }) }));
};
export default Conteudo;
