import { Card, Col, Row, Select, Spin } from "antd";
import "./comparativo.css"
import {useEffect, useState } from "react";
import iconeDados from "../../../assets/icon-dados.svg";
import iconeAlunos from "../../../assets/icon-alunos.svg";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import { servicos } from "../../../servicos";
import ComparativoTabela from "./comparativoTabela";

const Comparativo: React.FC = () => {    
    const [estaCarregando, setEstaCarregando] = useState(false);

    //Confirmar como vai ficar
    const [resumoCardsComparacao, setResumoCardsComparacao] = useState<any | null>(null);

    const filtroCompleto = useSelector(
        (state: RootState) => state.filtroCompleto
    );

    const filtrosSelecionados = useSelector((state: RootState) => state.filtros);
    const activeTab = useSelector((state: RootState) => state.tab.activeTab);

    const escolaSelecionada = useSelector(
        (state: RootState) => state.escola.escolaSelecionada
    );

    const aplicacaoSelecionada = useSelector(
        (state: RootState) => state.nomeAplicacao.id
    );


    //Codigo para o valor ficar ordenado.
    const componentesOrdenados = filtroCompleto.componentesCurriculares
    ?.slice()
    .sort((a, b) => a.texto.localeCompare(b.texto)) || [];
    
    const primeiroValor = componentesOrdenados[0]?.valor ?
    Number(componentesOrdenados[0]?.valor): null;

    const [componentesCurricularSelecionado, setComponentesCurricular] = useState<string>(
        componentesOrdenados[0]?.texto ?? ""
    );

    const [componentesCurricularSelecionadoId, setComponentesCurricularId] = useState<number | null>(
        primeiroValor
    );

    const [anosEscolarSelecionado, setAnoEscolar] = useState(
        filtroCompleto.anosEscolares[0]?.texto ?? ""
    );
    const [anosEscolarSelecionadoId, setAnoEscolarId] = useState(
        filtroCompleto.anosEscolares[0]?.valor ?? null
    );
 
    const [turmaSelecionada, setTurma] = useState("Todas");
    const [turmaSelecionadaId, setTurmaId] = useState("");

    useEffect(() => {
        setTurma("Todas");
        setTurmaId("");
    }, [aplicacaoSelecionada]);

    useEffect(() => {
        if (activeTab !== '5') return;

        if (aplicacaoSelecionada && escolaSelecionada?.ueId && componentesCurricularSelecionadoId && anosEscolarSelecionadoId) {
            buscarCardsComparacao();
        }
        }, [
        activeTab,
        aplicacaoSelecionada,
        escolaSelecionada?.ueId,
        componentesCurricularSelecionadoId,
        anosEscolarSelecionadoId,
    ]);
   
        
    const buscarCardsComparacao = async () => {
        try {
            setEstaCarregando(true);
            setResumoCardsComparacao(null);

            const componenteId = componentesCurricularSelecionadoId;
            const anoId = anosEscolarSelecionadoId;

            if (!aplicacaoSelecionada || !escolaSelecionada?.ueId || !componenteId || !anoId) return;

            const resposta = await servicos.get(
            `/api/BoletimEscolar/proficienciaComparativoProvaSp/${aplicacaoSelecionada}/${escolaSelecionada.ueId}/${componenteId}/${anoId}`
            );

            setResumoCardsComparacao(resposta || null);
        } catch (error) {
            console.error("Erro ao buscar cards de comparação:", error);
            setResumoCardsComparacao(null);
        } finally {
            setEstaCarregando(false);
        }
    };

    

    return (
        <Spin spinning={estaCarregando} tip="Carregando...">
            <div>
                <p className="secao-sobre-comparativo">
                Esta seção apresenta a evolução do nível de proficiência das turmas e estudantes nas diferentes aplicações 
                da Prova São Paulo e da Prova Saberes e Aprendizagens.
                </p>
            </div>
            <div className="filtros-card-comparacao-borda">
                <span>
                    Selecione um componente curricular e o ano que deseja visualizar:
                </span>
                <div className="filtros-card-comparacao-select">
                    <div className="filtro-component-curricular-comparativo">
                        <span>Componente curricular:</span>
                        <Select<number>
                            className="select-custom-comparativo"
                            placeholder="Selecione"
                            variant="borderless"
                            onChange={(value: number) => {
                                setComponentesCurricularId(value);
                                const item = filtroCompleto.componentesCurriculares.find(i => i.valor === value);
                                setComponentesCurricular(item?.texto ?? "");                                
                            }}
                            value={componentesCurricularSelecionadoId}
                            notFoundContent="Nenhum componente curricular encontrado"
                            filterOption={(input, option: any) =>
                                (option?.label ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }>
                            {filtroCompleto.componentesCurriculares
                            .slice()
                            .sort((a, b) => a.texto.localeCompare(b.texto))
                            .map((item) => (
                                <Select.Option key={item.valor} value={item.valor}>
                                    {item.texto}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>
                    <div className="filtro-ano-comparativo">
                        <span>Ano:</span>
                        <Select
                            className="select-custom-comparativo"
                            placeholder="Selecione"
                            variant="borderless"
                            onChange={(value) => {
                                setAnoEscolarId(value);
                                const item = filtroCompleto.anosEscolares.find(i => i.valor === value);
                                setAnoEscolar(item?.texto ?? "");
                            }}
                            value={anosEscolarSelecionadoId}
                            notFoundContent="Nenhum ano encontrado"
                            filterOption={(input, option: any) =>
                                (option?.label ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }                            
                        >
                        {filtroCompleto.anosEscolares.map((item) => (
                            <Select.Option key={item.valor} value={item.valor}>
                                {item.texto + "º ano"}
                            </Select.Option>
                        ))}
                        </Select>
                    </div>                
                    <div className="filtro-turma-comparativo">
                        <span>Turma:</span>
                        <Select
                            className="select-custom-comparativo"
                            placeholder="Todas"
                            variant="borderless"
                            onChange={(value) => {
                                setTurma(value);
                                setTurmaId(value);
                            }}
                            value={turmaSelecionada}
                            notFoundContent="Nenhuma turma encontrada"
                            filterOption={(input, option: any) =>
                                (option?.label ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())}
                        >
                            {filtroCompleto.turmas
                            .slice()
                            .sort((a, b) => a.texto.localeCompare(b.texto))
                            .map((item) => (
                                <Select.Option key={item.valor} value={item.texto}>
                                    {item.texto}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>
                </div>                
            </div>
            
            <div className="cards-comparacao">
                <Row gutter={[16, 16]} className="cards-container-comparacao">
                    <Col xs={24} sm={24} md={24} lg={6} key="prova-sp">
                        <Card className="card-conteudo-comparacao" style={{ padding: '0' }}>
                            <div className="cards-conteudo-titulo">
                                <span>Proficiência</span>
                                <div style={{float: 'right', fontSize: '12px'}}>
                                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span
                                            style={{
                                            width: "10px",
                                            height: "10px",
                                            borderRadius: "50%",
                                            backgroundColor: getNivelColor(resumoCardsComparacao?.provaSP?.nivelProficiencia ?? ""),
                                            }}
                                        ></span>
                                    {resumoCardsComparacao?.provaSP?.nivelProficiencia ?? "-"}
                                    </span>
                                </div>
                            </div>
                            <div style={{ width: '100%', fontSize: '38px', fontWeight: '700' }}>{resumoCardsComparacao?.provaSP?.mediaProficiencia ?? "-"}</div>
                            <div className="cards-conteudo-valores">
                                <div className="cards-conteudo-valores-label">
                                    <img
                                        src={iconeDados}
                                        alt="Ícone disciplina"
                                        className="cards-conteudo-valores-icon"
                                    />
                                    <span style={{paddingBottom: '0.2em'}}>{resumoCardsComparacao?.provaSP?.nomeAplicacao ?? "-"}</span>
                                </div>
                                <div className="cards-conteudo-valores-valor-mes">
                                    <span>{resumoCardsComparacao?.provaSP?.periodo ?? "-"}</span>
                                </div>
                            </div>
                            <div className="cards-conteudo-valores">
                                <div className="cards-conteudo-valores-label">
                                    <img
                                        src={iconeAlunos}
                                        alt="Ícone disciplina"
                                        className="cards-conteudo-valores-icon"
                                    />
                                    <span>Estudantes que realizaram a prova:</span>
                                </div>
                                <div className="cards-conteudo-valores-valor">{resumoCardsComparacao?.provaSP?.totalRealizaramProva ?? "-"}</div>
                            </div>
                        </Card>
                    </Col>
                    {resumoCardsComparacao?.lotes?.map(
                     (comparacao: any, idx: number) =>(                        
                        <Col key={idx} xs={24} sm={24} md={24} lg={6} style={{ paddingLeft: '0px'}}>
                            <Card className="card-conteudo-comparacao" style={{ padding: 0 }}>
                                <div className="cards-conteudo-titulo">
                                    <span>Proficiência</span>
                                    <div style={{float: 'right', fontSize: '12px'}}>
                                        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <span
                                                style={{
                                                width: "10px",
                                                height: "10px",
                                                borderRadius: "50%",
                                                backgroundColor: getNivelColor(comparacao?.nivelProficiencia ?? ""),
                                                }}
                                            ></span>
                                        {comparacao?.nivelProficiencia ?? "-"}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ width: '100%', fontSize: '38px', fontWeight: '700' }}>{comparacao?.mediaProficiencia ?? "-"}</div>
                                <div className="cards-conteudo-valores">
                                    <div className="cards-conteudo-valores-label">
                                        <img
                                            src={iconeDados}
                                            alt="Ícone disciplina"
                                            className="cards-conteudo-valores-icon"
                                        />
                                        <span style={{paddingBottom: '0.2em'}}
                                            title={`Prova ${comparacao?.nomeAplicacao ?? '-'}`}
                                        >
                                            Prova {comparacao?.nomeAplicacao ?? "-"}
                                        </span>
                                    </div>                                
                                    <div className="cards-conteudo-valores-valor-mes">
                                        <span>{comparacao?.periodo ?? "-"}</span>
                                    </div>
                                </div>
                                <div className="cards-conteudo-valores">
                                    <div className="cards-conteudo-valores-label">
                                        <img
                                            src={iconeAlunos}
                                            alt="Ícone disciplina"
                                            className="cards-conteudo-valores-icon"
                                        />
                                        <span>Estudantes que realizaram a prova:</span>
                                    </div>
                                    <div className="cards-conteudo-valores-valor">{comparacao?.totalRealizaramProva ?? "-"}</div>
                                </div>
                            </Card>
                        </Col>
                     ))
                    }
                </Row>
                <div className="info-blue">
                    Informações da <span style={{fontWeight: '700'}}>{escolaSelecionada.descricao?.replace("DRE SA -", "")}</span> nas provas São Paulo (PSP) e  Saberes e Aprendizagens (PSA)
                </div>
            </div>
            <br />
            <ComparativoTabela></ComparativoTabela>                
        </Spin>
    )
}

export default Comparativo;

export const getNivelColor = (nivel: string) => {
    switch (nivel) {
    case "Abaixo do Básico":
        return "#FF5959";
    case "Básico":
        return "#FEDE99";
    case "Avançado":
        return "#99FF99";
    case "Adequado":
        return "#9999FF";
    default:
        return "black";
    }
};