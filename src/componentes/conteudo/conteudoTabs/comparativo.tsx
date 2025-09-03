import { Card, Col, Row, Select, Spin } from "antd";
import "./comparativo.css"
import {useEffect, useState } from "react";
import iconeDados from "../../../assets/icon-dados.svg";
import iconeAlunos from "../../../assets/icon-alunos.svg";
import { RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../../../redux/slices/filtrosSlice";
import { servicos } from "../../../servicos";

const Comparativo: React.FC = () => {
    const dispatch = useDispatch();
    const [estaCarregando, setEstaCarregando] = useState(false);

    //Confirmar como vai ficar
    const [resumoCards, setResumoCards] = useState<any | null>(null);

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


    const [componentesCurricularSelecionado, setComponentesCurricular] = useState(
        filtroCompleto.componentesCurriculares[0]?.texto
    );
    const [componentesCurricularSelecionadoId, setComponentesCurricularId] =
    useState(filtroCompleto.componentesCurriculares[0]?.valor);

    const [anosEscolarSelecionado, setAnoEscolar] = useState(
        filtroCompleto.anosEscolares[0]?.texto
    );
    const [anosEscolarSelecionadoId, setAnoEscolarId] = useState(
        filtroCompleto.anosEscolares[0]?.valor
    );

    //verificar a lógica de seleção de turmas
    const [turmas, setTurmas] = useState([]);
    const [turmaSelecionada, setTurmaSelecionada] = useState();

    //Mock
    const [proeficiencia, setProeficiencia] = useState<any | null>(192.2);

    const getNivelColor = (nivel: string) => {
        switch (nivel) {
        case "Abaixo do básico":
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


    const alteraRadio = (valor: string, tipo: TipoFiltro) => {
        if (tipo === "componentesCurriculares") {
            setComponentesCurricular(valor);
            setComponentesCurricularId(valor);
            const item = filtroCompleto.componentesCurriculares.find(
            (item) => item.texto === valor
            );
            const novosFiltros = {
            ...filtrosSelecionados,
            componentesCurricularesRadio: [item],
            };
            dispatch(setFilters(novosFiltros));
        } else if (tipo === "anosEscolares") {
            setAnoEscolar(valor);
            setAnoEscolarId(valor);
            const item = filtroCompleto.anosEscolares.find(
            (item) => item.texto === valor
            );
            const novosFiltros = {
            ...filtrosSelecionados,
            anosEscolaresRadio: [item],
            };
            dispatch(setFilters(novosFiltros));
        }
    };

    //Construção basica, verificar regras.
    const buscarTurmas = async () => {
        try {
            setEstaCarregando(true);

            // Buscar turmas
            const resposta = await servicos.get(
            `/api/boletimescolar/turma`
            );

            setTurmas(resposta || []);

            if (resposta.length > 0) {
            const primeiraTurma = resposta[0];
            // dispatch(
            //   setNomeAplicacao({
            //     id: primeiraTurma.id,
            //     nome: primeiraTurma.nome,                
            //   })
            // );
            }
        } catch (error) {
            console.error("Erro ao buscar turmas:", error);
        }finally {
            setEstaCarregando(false);
        }
    };
    
    //  Preciso verificar qual é a regra para carregar a turma e daonde que os dados vem
    //   useEffect(() => {
    //     if (escolaSelecionada.ueId != null) {
    //       buscarTurmas();
    //     }
    //   }, [escolaSelecionada]);


    // Vai ser trocado quando o BACKEND estiver pronto.
    // const buscarComparacoesCards = async () => {
    //     //Confirmar quais dados vão usar para validar
    //     // if (!aplicacaoSelecionada || !componentesCurricularSelecionado || !anosEscolarSelecionado) return;
    //     try {        
    //       const resposta = await servicos.get(
    //         `/api/BoletimEscolar-comparação/${aplicacaoSelecionada}/${componentesCurricularSelecionado}/${anosEscolarSelecionado}/resumo-cards`
    //       );
    //       setResumoCards(resposta);
    //     } catch (error) {
    //       console.error("Erro ao buscar resumo da DRE:", error);
    //       setResumoCards(null);
    //     }
    // };


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
                        <Select
                            className="select-custom-comparativo"
                            placeholder="Selecione"
                            variant="borderless"
                            onChange={(value) => {
                                setComponentesCurricular(value);
                                setComponentesCurricularId(value);
                                alteraRadio(value, "componentesCurriculares");
                            }}
                            value={
                                filtrosSelecionados &&
                                filtrosSelecionados.componentesCurricularesRadio.length > 0 &&
                                filtrosSelecionados.componentesCurricularesRadio[0] &&
                                filtrosSelecionados.componentesCurricularesRadio[0].texto
                                ? filtrosSelecionados.componentesCurricularesRadio[0].texto
                                : undefined
                            }
                            notFoundContent="Nenhum componente curricular encontrado"
                            filterOption={(input, option: any) =>
                                (option?.label ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }>
                            {filtroCompleto.componentesCurriculares.map((item) => (
                                <Select.Option key={item.valor} value={item.texto}>
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
                                setAnoEscolar(value);
                                setAnoEscolarId(value);
                                alteraRadio(value, "anosEscolares");
                            }}
                            value={
                                filtrosSelecionados &&
                                filtrosSelecionados.anosEscolaresRadio.length > 0 &&
                                filtrosSelecionados.anosEscolaresRadio[0] &&
                                filtrosSelecionados.anosEscolaresRadio[0].texto
                                ? filtrosSelecionados.anosEscolaresRadio[0].texto
                                : undefined
                            }
                            notFoundContent="Nenhum ano encontrado"
                            filterOption={(input, option: any) =>
                                (option?.label ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }                            
                        >
                        {filtroCompleto.anosEscolares.map((item) => (
                            <Select.Option key={item.valor} value={item.texto}>
                                {item.texto + "º ano"}
                            </Select.Option>
                        ))}
                        </Select>
                    </div>                
                    <div className="filtro-turma-comparativo">
                        <span>Turma:</span>
                        <Select
                            className="select-custom-comparativo"
                            placeholder="Selecione"
                            variant="borderless"
                            onChange={(value) => {
                                setTurmaSelecionada(value);
                            }}
                            value={turmaSelecionada || undefined}
                            notFoundContent="Nenhuma turma encontrada"
                            filterOption={(input, option: any) =>
                                (option?.label ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            options={turmas}
                        />
                    </div>
                </div>                
            </div>
            
            <div className="cards-comparacao">
                <Row gutter={[16, 16]} className="cards-container-comparacao">
                    <Col xs={24} sm={24} md={24} lg={6} style={{paddingRight: '2px'}}>
                        <Card className="card-conteudo-comparacao" style={{ padding: 0 }}>
                            <div className="cards-conteudo-titulo">
                                <span>Proeficiência</span>
                                <div style={{float: 'right', fontSize: '12px'}}>
                                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span
                                            style={{
                                            width: "10px",
                                            height: "10px",
                                            borderRadius: "50%",
                                            backgroundColor: getNivelColor("Abaixo do básico"),
                                            }}
                                        ></span>
                                    {"Abaixo do básico"}
                                    </span>
                                </div>
                            </div>
                            <div style={{ width: '100%', fontSize: '38px', fontWeight: '700' }}>{proeficiencia ?? "-"}</div>
                            <div className="cards-conteudo-valores">
                                <div className="cards-conmteudo-valores-label">
                                    <img
                                        src={iconeDados}
                                        alt="Ícone disciplina"
                                        className="cards-conteudo-valores-icon"
                                    />
                                    <span style={{paddingBottom: '0.2em'}}>Prova São Paulo</span>
                                </div>
                                <div className="cards-conmteudo-valores-valor-mes">
                                    <span>2025</span>
                                </div>
                            </div>
                            <div className="cards-conteudo-valores">
                                <div className="cards-conmteudo-valores-label">
                                    <img
                                        src={iconeAlunos}
                                        alt="Ícone disciplina"
                                        className="cards-conteudo-valores-icon"
                                    />
                                    <span>Estudantes que realizaram a prova:</span>
                                </div>
                                <div className="cards-conmteudo-valores-valor">862 (95,6%)</div>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={6} style={{paddingRight: '2px', paddingLeft: '2px'}}>
                        <Card className="card-conteudo-comparacao" style={{ padding: 0 }}>
                            <div className="cards-conteudo-titulo">
                                <span>Proeficiência</span>
                                <div style={{float: 'right', fontSize: '12px'}}>
                                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span
                                            style={{
                                            width: "10px",
                                            height: "10px",
                                            borderRadius: "50%",
                                            backgroundColor: getNivelColor("Abaixo do básico"),
                                            }}
                                        ></span>
                                    {"Abaixo do básico"}
                                    </span>
                                </div>
                            </div>
                            <div style={{ width: '100%', fontSize: '38px', fontWeight: '700' }}>{proeficiencia ?? "-"}</div>
                            <div className="cards-conteudo-valores">
                                <div className="cards-conmteudo-valores-label">
                                    <img
                                        src={iconeDados}
                                        alt="Ícone disciplina"
                                        className="cards-conteudo-valores-icon"
                                    />
                                    <span style={{paddingBottom: '0.2em'}}>Prova Saberes e Aprendizagens</span>
                                </div>                                
                                <div className="cards-conmteudo-valores-valor-mes">
                                    <span>2025</span>
                                </div>
                            </div>
                            <div className="cards-conteudo-valores">
                                <div className="cards-conmteudo-valores-label">
                                    <img
                                        src={iconeAlunos}
                                        alt="Ícone disciplina"
                                        className="cards-conteudo-valores-icon"
                                    />
                                    <span>Estudantes que realizaram a prova:</span>
                                </div>
                                <div className="cards-conmteudo-valores-valor">862 (95,6%)</div>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={6} style={{paddingRight: '2px', paddingLeft: '2px'}}>
                        <Card className="card-conteudo-comparacao" style={{ padding: 0 }}>
                             <div className="cards-conteudo-titulo">
                                <span>Proeficiência</span>
                                <div style={{float: 'right', fontSize: '12px'}}>
                                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span
                                            style={{
                                            width: "10px",
                                            height: "10px",
                                            borderRadius: "50%",
                                            backgroundColor: getNivelColor("Abaixo do básico"),
                                            }}
                                        ></span>
                                    {"Abaixo do básico"}
                                    </span>
                                </div>
                            </div>
                            <div style={{ width: '100%', fontSize: '38px', fontWeight: '700' }}>{proeficiencia ?? "-"}</div>
                            <div className="cards-conteudo-valores">
                                <div className="cards-conmteudo-valores-label">
                                    <img
                                        src={iconeDados}
                                        alt="Ícone disciplina"
                                        className="cards-conteudo-valores-icon"
                                    />
                                    <span style={{paddingBottom: '0.2em'}}>Prova Saberes e Aprendizagens</span>
                                </div>                                
                                <div className="cards-conmteudo-valores-valor-mes">
                                    <span>2025</span>
                                </div>
                            </div>
                            <div className="cards-conteudo-valores">
                                <div className="cards-conmteudo-valores-label">
                                    <img
                                        src={iconeAlunos}
                                        alt="Ícone disciplina"
                                        className="cards-conteudo-valores-icon"
                                    />
                                    <span>Estudantes que realizaram a prova:</span>
                                </div>
                                <div className="cards-conmteudo-valores-valor">862 (95,6%)</div>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={6} style={{paddingLeft: '2px'}}>
                        <Card className="card-conteudo-comparacao" style={{ padding: 0 }}>
                            <div className="cards-conteudo-titulo">
                                <span>Proeficiência</span>
                                <div style={{float: 'right', fontSize: '12px'}}>
                                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span
                                            style={{
                                            width: "10px",
                                            height: "10px",
                                            borderRadius: "50%",
                                            backgroundColor: getNivelColor("Abaixo do básico"),
                                            }}
                                        ></span>
                                    {"Abaixo do básico"}
                                    </span>
                                </div>
                            </div>
                            <div style={{ width: '100%', fontSize: '38px', fontWeight: '700' }}>{proeficiencia ?? "-"}</div>
                            <div className="cards-conteudo-valores">
                                <div className="cards-conmteudo-valores-label">
                                    <img
                                        src={iconeDados}
                                        alt="Ícone disciplina"
                                        className="cards-conteudo-valores-icon"
                                    />
                                    <span style={{paddingBottom: '0.2em'}}>Prova Saberes e Aprendizagens</span>
                                </div>                                
                                <div className="cards-conmteudo-valores-valor-mes">
                                    <span>2025</span>
                                </div>
                            </div>
                            <div className="cards-conteudo-valores">
                                <div className="cards-conmteudo-valores-label">
                                    <img
                                        src={iconeAlunos}
                                        alt="Ícone disciplina"
                                        className="cards-conteudo-valores-icon"
                                    />
                                    <span>Estudantes que realizaram a prova:</span>
                                </div>
                                <div className="cards-conmteudo-valores-valor">862 (95,6%)</div>
                            </div>
                        </Card>
                    </Col>                    
                </Row>
                <div className="info-blue">
                    Informações da <span style={{fontWeight: '700'}}>{escolaSelecionada.descricao?.replace("DRE SA -", "")}</span> nas provas São Paulo (PSP) e  Saberes e Aprendizagens (PSA)
                </div>

            </div>
                
        </Spin>
    )
}

export default Comparativo;