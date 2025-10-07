import { Card, Col, Row, Select } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { filtroAplicacaoComponenteCurricularAnoProps } from "../../../interfaces/filtroAplicacaoComponenteCurricularAnoProps";
import { ArrowLeftOutlined } from "@ant-design/icons";

const FiltroAplicacaoComponenteCurricularAno: React.FC<
  filtroAplicacaoComponenteCurricularAnoProps
> = ({
  dreSelecionadaNome,
  aplicacaoSelecionada,
  componenteSelecionado,
  anoSelecionado,
  aplicacoes,
  componentesCurriculares,
  anos,
  selecionaAno,
  selecionaAplicacao,
  selecionaComponenteCurricular,
}) => {
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <h2 className="titulo-ue-sme">{dreSelecionadaNome ?? ""}</h2>

          <div className="ajustes-padding-cards">
            <Card title="" variant="borderless" className="card-body-dre">
              <div style={{ marginBottom: 32 }}>
                <Link
                  to="/ues"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "#1976d2",
                    textDecoration: "none",
                    margin: "0px",
                    fontSize: 14,
                  }}
                  className="botao-voltar-ues"
                >
                  <ArrowLeftOutlined style={{ fontSize: 18 }} />
                  Voltar a tela anterior
                </Link>
              </div>

              <p
                className="global-texto-padrao"
                style={{ marginTop: "0", marginBottom: "16px" }}
              >
                Aqui, você pode acompanhar a evolução do nível de proficiência
                da SME nas diferentes aplicações da Prova São Paulo e da Prova
                Saberes e Aprendizagens.
              </p>

              <div className="comparar-dados-caixa-cinza">
                <div className="comparar-dados-caixa-texto">
                  {" "}
                  Para começar, selecione o componente curricular, o ano escolar
                  e o ano de aplicação que deseja visualizar. Caso o ano ainda
                  esteja em andamento, só serão exibidos os resultados
                  disponíveis até agora.
                </div>

                <div className="comparar-dados-filtros-card">
                  <div className="comparar-dados-selects">
                    <label className="label-filtro-dre">Ano da aplicação</label>
                    <Select
                      data-testid="select-aplicacao"
                      showSearch
                      placeholder="Selecione uma aplicação..."
                      className="select-custom"
                      onChange={selecionaAplicacao}
                      value={aplicacaoSelecionada ?? undefined}
                      notFoundContent="Nenhuma aplicação encontrada"
                      filterOption={(input, option: any) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={aplicacoes}
                    />
                  </div>
                  <div className="comparar-dados-selects">
                    <label className="label-filtro-dre">
                      Componente curricular
                    </label>
                    <Select
                      data-testid="select-aplicacao"
                      showSearch
                      placeholder="Selecione uma aplicação..."
                      className="select-custom"
                      onChange={selecionaComponenteCurricular}
                      value={componenteSelecionado ?? undefined}
                      notFoundContent="Nenhuma aplicação encontrada"
                      filterOption={(input, option: any) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={componentesCurriculares}
                    />
                  </div>
                  <div className="comparar-dados-selects">
                    <label className="label-filtro-dre">Ano</label>
                    <Select
                      showSearch
                      placeholder="Ano escolar"
                      className="select-custom"
                      onChange={selecionaAno}
                      value={anoSelecionado ?? undefined}
                      notFoundContent="Nenhum ano encontrado"
                      filterOption={(input, option: any) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={anos}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default FiltroAplicacaoComponenteCurricularAno;
