import { Card, Col, Row, Select, Spin } from "antd";
import "./comparativo.css";
import { useEffect, useState } from "react";
import iconeDados from "../../../assets/icon-dados.svg";
import iconeAlunos from "../../../assets/icon-alunos.svg";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import { servicos } from "../../../servicos";
import ComparativoTabela from "./comparativoTabela";
import turmaMock from "../../../mocks/turmaMock.json";

interface Turma {
  ano: number;
  turma: string;
  descricao: string;
  disciplina: string;
}

const Comparativo: React.FC = () => {
  const [estaCarregando, setEstaCarregando] = useState(false);

  //Confirmar como vai ficar
  const [resumoCardsComparacao, setResumoCardsComparacao] = useState<
    any | null
  >(null);

  const [dadosTurma, setDadosTurma] = useState<any | null>([]);
  const [tabelasCount, setTabelasCount] = useState<number[]>([]);
  const [todasTurmas, setTodasTurmas] = useState<any | null>([]);
  const [indexTabelaTurma, setIndexTabelaTurma] = useState(-1);
  const limite = 20;

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
  const componentesOrdenados =
    filtroCompleto.componentesCurriculares
      ?.slice()
      .sort((a, b) => a.texto.localeCompare(b.texto)) || [];

  const primeiroValor = componentesOrdenados[0]?.valor
    ? Number(componentesOrdenados[0]?.valor)
    : null;

  const [componentesCurricularSelecionado, setComponentesCurricular] =
    useState<string>(componentesOrdenados[0]?.texto ?? "");

  const [componentesCurricularSelecionadoId, setComponentesCurricularId] =
    useState<number | null>(primeiroValor);

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
    if (activeTab !== "5") return;

    if (
      aplicacaoSelecionada &&
      escolaSelecionada?.ueId &&
      componentesCurricularSelecionadoId &&
      anosEscolarSelecionadoId
    ) {
      buscarCardsComparacao();
      buscaTodasTurmas();
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

      if (
        !aplicacaoSelecionada ||
        !escolaSelecionada?.ueId ||
        !componenteId ||
        !anoId
      )
        return;

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

  const buscaTodasTurmas = async () => {
    try {
      setEstaCarregando(true);
      const resultado: Turma[] = await servicos.get(
        `/api/BoletimEscolar/${aplicacaoSelecionada}/turmas-ue-ano/${escolaSelecionada.ueId}/${componentesCurricularSelecionadoId}/${anosEscolarSelecionadoId}`
      );
      const registrosPorTabela: number[] = [];
      resultado.map(() => {
        registrosPorTabela.push(limite);
      });
      setTodasTurmas(resultado);
      setTabelasCount(registrosPorTabela);
    } catch (error) {
      console.log(error);
      setEstaCarregando(false);
    } finally {
      setEstaCarregando(false);
    }
  };

  useEffect(() => {
    if (activeTab !== "5") return;
    else buscaDadosTurma(indexTabelaTurma);
  }, [
    filtrosSelecionados,
    indexTabelaTurma,
    activeTab,
    todasTurmas,
    tabelasCount,
  ]);

  const buscaUnicaTurma = async (
    ano: string,
    turma: string,
    limite: number
  ) => {
    try {
      setEstaCarregando(true);
      //const resposta = await servicos.get(`/api/pegaturmaunica`);
      console.log(ano, turma, limite);

      let resultado = { ...turmaMock };

      const variacoesSelecionadas = filtrosSelecionados?.variacoes || [];
      const nomeSelecionado = filtrosSelecionados?.nomeEstudante || [];

      if (variacoesSelecionadas.length > 0 || nomeSelecionado) {
        resultado = {
          ...resultado,
          itens: resultado.itens.filter((aluno: any) => {
            let passouVariacao = true;
            let passouNome = true;

            if (variacoesSelecionadas.length > 0) {
              passouVariacao = variacoesSelecionadas.some((f: any) => {
                if (f.valor === "positiva") return aluno.variacao > 0;
                if (f.valor === "negativa") return aluno.variacao < 0;
                if (f.valor === "neutra") return aluno.variacao === 0;
                return false;
              });
            }

            if (nomeSelecionado) {
              passouNome = aluno.nome.toLowerCase().includes(nomeSelecionado);
            }

            return passouVariacao && passouNome;
          }),
        };
      }

      resultado.itens = resultado.itens.slice(0, limite);

      return resultado;
    } catch (error) {
      console.log(error);
      setEstaCarregando(false);
    } finally {
      setEstaCarregando(false);
    }
  };

  const buscaDadosTurma = async (index: number = -1) => {
    try {
      setEstaCarregando(true);

      if (index === -1) {
        //"TODO: CHAMA A API E PROCURA TODOS OS DADOS"

        const resultados = await Promise.all(
          todasTurmas.map((item: any) =>
            buscaUnicaTurma(item.ano, item.turma, 20)
          )
        );

        setDadosTurma(resultados || []);
      } else {
        //"TODO: CHAMA A API E PROCURA OS DADOS DO INDICE"

        const x = await buscaUnicaTurma(
          todasTurmas[index].ano,
          todasTurmas[index].turma,
          20
        );

        if (!x || !x.itens) {
          setEstaCarregando(false);
          return;
        }

        const mais5 = x.itens.slice(0, 5);

        const clone = [...dadosTurma];
        clone[index] = {
          ...clone[index],
          itens: [...clone[index].itens, ...mais5],
        };
        setDadosTurma(clone);
      }
    } catch (error) {
      console.error("Erro ao buscar dados da turma:", error);
    } finally {
      setEstaCarregando(false);
    }
  };

  const exibirMais = async (index: number) => {
    try {
      setEstaCarregando(true);
      setTabelasCount((prev) => {
        const clone = [...prev];
        clone[index] = clone[index] + 20;
        return clone;
      });
      setIndexTabelaTurma(index);
    } catch (error) {
      console.error("Erro ao buscar cards de comparação:", error);
    } finally {
      setEstaCarregando(false);
    }
  };

  return (
    <Spin spinning={estaCarregando} tip="Carregando...">
      <div>
        <p className="secao-sobre-comparativo">
          Esta seção apresenta a evolução do nível de proficiência das turmas e
          estudantes nas diferentes aplicações da Prova São Paulo e da Prova
          Saberes e Aprendizagens.
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
                const item = filtroCompleto.componentesCurriculares.find(
                  (i) => i.valor === value
                );
                setComponentesCurricular(item?.texto ?? "");
              }}
              value={componentesCurricularSelecionadoId}
              notFoundContent="Nenhum componente curricular encontrado"
              filterOption={(input, option: any) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
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
                const item = filtroCompleto.anosEscolares.find(
                  (i) => i.valor === value
                );
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
                  .includes(input.toLowerCase())
              }
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
            <Card className="card-conteudo-comparacao" style={{ padding: "0" }}>
              <div className="cards-conteudo-titulo">
                <span>Proficiência</span>
                <div style={{ float: "right", fontSize: "12px" }}>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: getNivelColor(
                          resumoCardsComparacao?.provaSP?.nivelProficiencia ??
                            ""
                        ),
                      }}
                    ></span>
                    {resumoCardsComparacao?.provaSP?.nivelProficiencia ?? "-"}
                  </span>
                </div>
              </div>
              <div
                style={{ width: "100%", fontSize: "38px", fontWeight: "700" }}
              >
                {resumoCardsComparacao?.provaSP?.mediaProficiencia ?? "-"}
              </div>
              <div className="cards-conteudo-valores">
                <div className="cards-conteudo-valores-label">
                  <img
                    src={iconeDados}
                    alt="Ícone disciplina"
                    className="cards-conteudo-valores-icon"
                  />
                  <span style={{ paddingBottom: "0.2em" }}>
                    {resumoCardsComparacao?.provaSP?.nomeAplicacao ?? "-"}
                  </span>
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
                <div className="cards-conteudo-valores-valor">
                  {resumoCardsComparacao?.provaSP?.totalRealizaramProva ?? "-"}
                </div>
              </div>
            </Card>
          </Col>
          {resumoCardsComparacao?.lotes
          ?.slice()
          .sort((a: any, b: any) => {
            const dataA = parsePeriodo(a?.periodo);
            const dataB = parsePeriodo(b?.periodo);
            if (!dataA || !dataB) return 0;
            return dataA.getTime() - dataB.getTime();
          })
          .map((comparacao: any, idx: number) => (
            <Col
              key={idx}
              xs={24}
              sm={24}
              md={24}
              lg={6}
              style={{ paddingLeft: "0px" }}
            >
              <Card className="card-conteudo-comparacao" style={{ padding: 0 }}>
                <div className="cards-conteudo-titulo">
                  <span>Proficiência</span>
                  <div style={{ float: "right", fontSize: "12px" }}>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor: getNivelColor(
                            comparacao?.nivelProficiencia ?? ""
                          ),
                        }}
                      ></span>
                      {comparacao?.nivelProficiencia ?? "-"}
                    </span>
                  </div>
                </div>
                <div
                  style={{ width: "100%", fontSize: "38px", fontWeight: "700" }}
                >
                  {comparacao?.mediaProficiencia ?? "-"}
                </div>
                <div className="cards-conteudo-valores">
                  <div className="cards-conteudo-valores-label">
                    <img
                      src={iconeDados}
                      alt="Ícone disciplina"
                      className="cards-conteudo-valores-icon"
                    />
                    <span
                      style={{ paddingBottom: "0.2em" }}
                      title={`Prova ${comparacao?.nomeAplicacao ?? "-"}`}
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
                  <div className="cards-conteudo-valores-valor">
                    {comparacao?.totalRealizaramProva ?? "-"}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="info-blue">
          Informações da{" "}
          <span style={{ fontWeight: "700" }}>
            {escolaSelecionada.descricao?.replace("DRE SA -", "")}
          </span>{" "}
          nas provas São Paulo (PSP) e Saberes e Aprendizagens (PSA)
        </div>
      </div>

      <br />
      <br />

      {dadosTurma.map((item: any, index: number) => (
        <ComparativoTabela
          index={index}
          exibirMais={exibirMais}
          dadosTurma={dadosTurma[index]}
          turmaSelecionada={todasTurmas[index].turma}
          componentesCurricularSelecionado={componentesCurricularSelecionado}
        />
      ))}
    </Spin>
  );
};

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

const meses: Record<string, number> = {
  Janeiro: 0,
  Fevereiro: 1,
  Março: 2,
  Abril: 3,
  Maio: 4,
  Junho: 5,
  Julho: 6,
  Agosto: 7,
  Setembro: 8,
  Outubro: 9,
  Novembro: 10,
  Dezembro: 11,
};

function parsePeriodo(periodo: string): Date | null {
  if (!periodo) return null;
  const [mes, ano] = periodo.split(" ");
  const mesIndex = meses[mes];
  if (mesIndex === undefined || isNaN(Number(ano))) return null;
  return new Date(Number(ano), mesIndex, 1);
}
