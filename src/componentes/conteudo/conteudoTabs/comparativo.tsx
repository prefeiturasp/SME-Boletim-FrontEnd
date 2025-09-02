import { Card, Col, Row, Select, Spin } from "antd";
import "./comparativo.css"
import { useState } from "react";
import iconeDados from "../../../assets/icon-dados.svg";
import iconeAlunos from "../../../assets/icon-alunos.svg";

const Comparativo: React.FC = () => {
    const [estaCarregando, setEstaCarregando] = useState(false);

    const [componentCurricular, setComponentCurricular] = useState();
    const [componentCurricularSelecionado, setComponentCurricularSelecionado] = useState();

    const [anos, setAnos] = useState([]);
    const [anoSelecionado, setAnoSelecionado] = useState();

    const [turmas, setTurmas] = useState([]);
    const [turmaSelecionada, setTurmaSelecionada] = useState();

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
                                setComponentCurricularSelecionado(value);
                            }}
                            value={componentCurricularSelecionado || undefined}
                            notFoundContent="Nenhum componente curricular encontrado"
                            filterOption={(input, option: any) =>
                                (option?.label ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            options={componentCurricular}
                        />
                    </div>
                    <div className="filtro-ano-comparativo">
                        <span>Ano:</span>
                        <Select
                            className="select-custom-comparativo"
                            placeholder="Selecione"
                            variant="borderless"
                            onChange={(value) => {
                                setAnoSelecionado(value);
                            }}
                            value={anoSelecionado || undefined}
                            notFoundContent="Nenhum ano encontrado"
                            filterOption={(input, option: any) =>
                                (option?.label ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            options={anos}
                        />
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
                            <div style={{}}>Proeficiência
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
                                <img
                                    src={iconeDados}
                                    alt="Ícone disciplina"
                                    className="cards-conteudo-valores-icon"
                                />
                                <div>
                                    <div style={{width: '100%'}}>Prova São Paulo</div>
                                    <div style={{fontWeight: '500', fontSize: '12px'}}>Janeiro 2025</div>
                                </div>
                            </div>
                            <div className="cards-conteudo-valores">
                                <img
                                    src={iconeAlunos}
                                    alt="Ícone disciplina"
                                    className="cards-conteudo-valores-icon"
                                />
                                <div>
                                    <div style={{width: '100%'}}>Estudantes que realizaram a prova:</div>
                                    <div style={{fontWeight: '500', fontSize: '12px'}}>862 (95,6%)</div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={6} style={{paddingRight: '2px', paddingLeft: '2px'}}>
                        <Card className="card-conteudo-comparacao" style={{ padding: 0 }}>
                            <div style={{}}>Proeficiência
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
                                <img
                                    src={iconeDados}
                                    alt="Ícone disciplina"
                                    className="cards-conteudo-valores-icon"
                                />
                                <div>
                                    <div style={{width: '100%'}}>Prova São Paulo</div>
                                    <div style={{fontWeight: '500', fontSize: '12px'}}>Janeiro 2025</div>
                                </div>
                            </div>
                            <div className="cards-conteudo-valores">
                                <img
                                    src={iconeAlunos}
                                    alt="Ícone disciplina"
                                    className="cards-conteudo-valores-icon"
                                />
                                <div>
                                    <div style={{width: '100%'}}>Estudantes que realizaram a prova:</div>
                                    <div style={{fontWeight: '500', fontSize: '12px'}}>862 (95,6%)</div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={6} style={{paddingRight: '2px', paddingLeft: '2px'}}>
                        <Card className="card-conteudo-comparacao" style={{ padding: 0 }}>
                            <div style={{}}>Proeficiência
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
                                <img
                                    src={iconeDados}
                                    alt="Ícone disciplina"
                                    className="cards-conteudo-valores-icon"
                                />
                                <div>
                                    <div style={{width: '100%'}}>Prova São Paulo</div>
                                    <div style={{fontWeight: '500', fontSize: '12px'}}>Janeiro 2025</div>
                                </div>
                            </div>
                            <div className="cards-conteudo-valores">
                                <img
                                    src={iconeAlunos}
                                    alt="Ícone disciplina"
                                    className="cards-conteudo-valores-icon"
                                />
                                <div>
                                    <div style={{width: '100%'}}>Estudantes que realizaram a prova:</div>
                                    <div style={{fontWeight: '500', fontSize: '12px'}}>862 (95,6%)</div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={6} style={{paddingLeft: '2px'}}>
                        <Card className="card-conteudo-comparacao" style={{ padding: 0 }}>
                            <div style={{}}>Proeficiência
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
                                <img
                                    src={iconeDados}
                                    alt="Ícone disciplina"
                                    className="cards-conteudo-valores-icon"
                                />
                                <div>
                                    <div style={{width: '100%'}}>Prova São Paulo</div>
                                    <div style={{fontWeight: '500', fontSize: '12px'}}>Janeiro 2025</div>
                                </div>
                            </div>
                            <div className="cards-conteudo-valores">
                                <img
                                    src={iconeAlunos}
                                    alt="Ícone disciplina"
                                    className="cards-conteudo-valores-icon"
                                />
                                <div>
                                    <div style={{width: '100%'}}>Estudantes que realizaram a prova:</div>
                                    <div style={{fontWeight: '500', fontSize: '12px'}}>862 (95,6%)</div>
                                </div>
                            </div>
                        </Card>
                    </Col>                    
                </Row>
                <div className="info-blue">
                    Informações da <span style={{fontWeight: '700'}}>EMEF Bartolomeu ourenço de Gusmão</span> nas provas São Paulo (PSP) e  Saberes e Aprendizagens (PSA)
                </div>

            </div>
                
        </Spin>
    )
}

export default Comparativo;