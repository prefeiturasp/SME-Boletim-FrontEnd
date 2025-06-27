import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Row, Col, Button, notification, Spin, Modal } from "antd";
import "./principal.css";
import Tabela from "../tabela/tabela";
import DesempenhoAno from "../../grafico/desempenhoAno";
import { useSelector } from "react-redux";
import { servicos } from "../../../servicos";
import { DownloadOutlined, InfoCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined, } from "@ant-design/icons";
const Principal = () => {
    const [dados, setDados] = useState([]);
    const [estaCarregando, setEstaCarregando] = useState(false);
    const [estaCarregandoRelatorio, setEstaCarregandoRelatorio] = useState(false);
    const escolaSelecionada = useSelector((state) => state.escola.escolaSelecionada);
    const aplicacaoSelecionada = useSelector((state) => state.nomeAplicacao.id);
    const activeTab = useSelector((state) => state.tab.activeTab);
    const filtrosSelecionados = useSelector((state) => state.filtros);
    const buscarAbrangencias = async () => {
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
            const resposta = await servicos.get(`/api/boletimescolar/${aplicacaoSelecionada}/${escolaSelecionada.ueId}${filtros}`);
            setDados(resposta);
        }
        catch (error) {
            console.error("Erro ao buscar os dados da tabela (aba principal):", error);
            setEstaCarregando(false);
        }
        finally {
            setEstaCarregando(false);
        }
    };
    useEffect(() => {
        if (escolaSelecionada.ueId !== null &&
            activeTab == "1" &&
            aplicacaoSelecionada) {
            buscarAbrangencias();
        }
    }, [escolaSelecionada, filtrosSelecionados, activeTab, aplicacaoSelecionada]);
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (estaCarregandoRelatorio) {
                event.preventDefault();
                event.returnValue = "";
                Modal.confirm({
                    title: "Seu documento está sendo processado!",
                    icon: _jsx(ExclamationCircleOutlined, { style: { color: "#faad14" } }),
                    content: "Se você atualizar a página agora, o progresso será perdido e será necessário recomeçar. Tem certeza de que deseja atualizar?",
                    okText: "Atualizar",
                    cancelText: "Voltar",
                    onOk: () => {
                        window.removeEventListener("beforeunload", handleBeforeUnload);
                        window.location.reload();
                    },
                    onCancel: () => {
                        notification.open({
                            key: "reloadCancelado",
                            message: "Operação cancelada",
                            description: "O recarregamento foi cancelado e o relatório continua sendo processado.",
                            placement: "top",
                            icon: _jsx(ExclamationCircleOutlined, { style: { color: "#faad14" } }),
                            duration: 5,
                        });
                    },
                });
            }
        };
        if (estaCarregandoRelatorio) {
            window.addEventListener("beforeunload", handleBeforeUnload);
        }
        else {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        }
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [estaCarregandoRelatorio]);
    const iniciarDownloadRelatorioPrincipal = async () => {
        setEstaCarregandoRelatorio(true);
        notification.open({
            key: "relatorioPrincipal",
            message: "Os dados estão em processamento",
            description: `Não atualize a tela! Assim que os dados forem processados, o seu documento "Dados da ${escolaSelecionada?.descricao}" será baixado automaticamente.`,
            placement: "bottomLeft",
            icon: _jsx(InfoCircleOutlined, { style: { color: "#108ee9" } }),
            duration: 8,
            pauseOnHover: true,
            closeIcon: false,
        });
        try {
            const resposta = await servicos.get(`/api/boletimescolar/download/${aplicacaoSelecionada}/${escolaSelecionada.ueId}`, { responseType: "blob" });
            const blob = new Blob([resposta], {
                type: "application/vnd.ms-excel",
            });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `boletim-resultados-principais-${escolaSelecionada.descricao}.xls`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            notification.open({
                key: "relatorioPrincipalSuccess",
                message: "Tudo certo por aqui!",
                description: `Seu documento "${escolaSelecionada.descricao}" foi baixado com sucesso! Verifique a pasta de downloads no seu dispositivo.`,
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
                key: "relatorioPrincipalErro",
                message: "Não conseguimos baixar seu documento",
                description: `Ocorreu um erro no download do seu documento “${escolaSelecionada?.descricao}”. Você pode tentar novamente. `,
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
    return (_jsxs(Spin, { spinning: estaCarregando, tip: "Carregando...", children: [_jsx("span", { children: "Esta se\u00E7\u00E3o apresenta uma tabela e um gr\u00E1fico que ilustram a quantidade de estudantes por ano escolar e faixa de classifica\u00E7\u00E3o em cada n\u00EDvel." }), _jsx("div", { className: "legenda-container-fundo", children: _jsxs(Row, { gutter: 16, children: [_jsx(Col, { children: _jsxs("span", { className: "legenda-item", children: [_jsx("strong", { children: "AB" }), " = Abaixo do b\u00E1sico"] }) }), _jsx(Col, { children: _jsxs("span", { className: "legenda-item", children: [_jsx("strong", { children: "B" }), " = B\u00E1sico"] }) }), _jsx(Col, { children: _jsxs("span", { className: "legenda-item", children: [_jsx("strong", { children: "AD" }), " = Adequado"] }) }), _jsx(Col, { children: _jsxs("span", { className: "legenda-item", children: [_jsx("strong", { children: "AV" }), " = Avan\u00E7ado"] }) })] }) }), _jsx(Tabela, { dados: dados, origem: "principal", estaCarregando: estaCarregando }), dados.length > 0 && (_jsx(DesempenhoAno, { dados: dados, filtrosSelecionados: filtrosSelecionados })), _jsx("div", { className: "download-section", children: _jsx(Row, { gutter: 16, align: "middle", justify: "center", children: _jsx(Col, { children: _jsxs("div", { className: "download-wrapper", children: [_jsxs("p", { className: "school-text", children: ["Voc\u00EA pode baixar os dados da", " ", _jsx("b", { children: escolaSelecionada?.descricao }), ", clicando no bot\u00E3o ao lado"] }), _jsx(Button, { type: "primary", target: "_blank", rel: "noopener noreferrer", onClick: iniciarDownloadRelatorioPrincipal, icon: _jsx(DownloadOutlined, {}), disabled: estaCarregandoRelatorio, children: "Baixar os dados" })] }) }) }) })] }));
};
export default Principal;
