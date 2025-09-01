import { Select, Spin } from "antd";
import "./comparativo.css"
import { useState } from "react";

const Comparativo: React.FC = () => {
    const [estaCarregando, setEstaCarregando] = useState(false);

    const [componentCurricular, setComponentCurricular] = useState();
    const [componentCurricularSelecionado, setComponentCurricularSelecionado] = useState();

    const [anos, setAnos] = useState([]);
    const [anoSelecionado, setAnoSelecionado] = useState();

    const [turmas, setTurmas] = useState([]);
    const [turmaSelecionada, setTurmaSelecionada] = useState();

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
        </Spin>
    )
}

export default Comparativo;