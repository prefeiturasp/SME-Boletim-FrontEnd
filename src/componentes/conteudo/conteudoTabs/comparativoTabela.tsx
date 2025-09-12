import { Children, useState } from "react";
import { Table, Progress, Tag, Spin, Button } from "antd";
import "./comparativoTabela.css";

import iconeMais from "./../../../assets/icon-mais.svg";

interface ComparativoTabelaProps {
  turmaSelecionada: string;
  componentesCurricularSelecionado: string;
}

const ComparativoTabela: React.FC<ComparativoTabelaProps> = ({
  turmaSelecionada,
  componentesCurricularSelecionado
}) => { 
    const [estaCarregando, setEstaCarregando] = useState(false);
    const disciplina = "Lingua portuguesa";
    const ano = 5;
    const [loadingMaisUes, setLoadingMaisUes] = useState(false);

    const handleExibirMais = () => {
      // const proxPagina = currentCardPage + 1;
      // setCurrentCardPage(proxPagina);
      // fetchUesListagem(proxPagina, true);
    };


    return (
        <Spin spinning={estaCarregando} tip="Carregando...">
            <div className="bloco-secao-tabela-comparativo">
                <div className="secao-tabela-comparativo">
                    <b>Estudantes da Turma {turmaSelecionada} em {componentesCurricularSelecionado}</b>
                </div>
                <div>
                  <div className="legendas">
                    <div className="texto">
                      <span className="desempenho-por-materia-negrito">Níveis:</span>
                    </div>
                    <div className="caixa-vermelha"></div>{" "}
                    <div className="texto">1 - Abaixo do basico</div>
                    <div className="caixa-amarela"></div>{" "}
                    <div className="texto">2 - Básico</div>
                    <div className="caixa-azul"></div>{" "}
                    <div className="texto">3 - Adequado</div>
                    <div className="caixa-verde"></div>{" "}
                    <div className="texto">4 - Avançado</div>
                  </div>
                </div>
            </div>
            <br />            
            <Table
              columns={buildColumns(disciplina, ano, mockResponse.itens)}
              dataSource={mockResponse.itens.map((item, idx) => ({ ...item, key: idx }))}
              pagination={false}
              scroll={{ x: "max-content" }}
              bordered             
            />
            <>
                      <br></br><br></br><br></br>
                      <div className="transparent-bottom-ue">
                        <Button
                          variant="outlined"
                          className="btn-exibir-mais-ue"
                          loading={loadingMaisUes}
                          onClick={handleExibirMais}
                          style={{
                            minWidth: 160,
                            height: 40,
                            fontWeight: 600,
                            fontSize: 16,
                            zIndex: 2,
                          }}
                        >
                          <img
                            src={iconeMais}
                            alt="Ícone dados"
                            className="disciplina-icon"
                          />
                          Exibir mais
                        </Button>
                      </div>
                    </>
        </Spin>    
    );
}
export default ComparativoTabela;


// ---- FUNÇÃO PARA PEGAR A COR DA BARRA BASEADO NA DISCIPLINA/ANO ----
const getProgressColor = (value: number, disciplina: string, ano: number) => {
  if (disciplina === "Lingua portuguesa" && ano === 5) {
    if (value < 150) return "#FF5959";
    if (value < 200) return "#FEDE99";
    if (value < 250) return "#5A94D8";
    return "#99FF99";
  }
  if (disciplina === "Lingua portuguesa" && ano === 9) {
    if (value < 200) return "#FF5959";
    if (value < 275) return "#FEDE99";
    if (value < 325) return "#5A94D8";
    return "#99FF99";
  }
  if (disciplina === "Matemática" && ano === 5) {
    if (value < 175) return "#FF5959";
    if (value < 225) return "#FEDE99";
    if (value < 275) return "#5A94D8";
    return "#99FF99";
  }
  if (disciplina === "Matemática" && ano === 9) {
    if (value < 225) return "#FF5959";
    if (value < 300) return "#FEDE99";
    if (value < 350) return "#5A94D8";
    return "#99FF99";
  }
  return "default";
};

// ---- FUNÇÃO PARA COR DO RETÂNGULO DA VARIAÇÃO ----
const getVariationTag = (value: number) => {
  let bgColor = "#B0B0B0"; // neutro
  if (value > 0) bgColor = "#21C45D"; // verde
  else if (value < 0) bgColor = "#EF4343"; // vermelho
  return (
    <div className="variacao-tag" style={{ backgroundColor: bgColor }}>
      {value.toFixed(2)}%
    </div>
  );
};

// ---- GERA COLUNAS DINÂMICAS ----
const buildColumns = (disciplina: string, ano: number, dados: any[]) => {
  // Coletar todos os meses distintos (PSP não tem mês)
  const mesesUnicos = new Set<string>();
  dados.forEach((item) => {
    item.proficiencias.forEach((p: any) => {
      if (p.descricao === "PSA" && p.mes) mesesUnicos.add(p.mes);
    });
  });

  const columns: any[] = [
    {      
      title: "Nome do Estudante",
      dataIndex: "nome",
      key: "nome",
      className: "coluna-nome-header",
      width: 284,
    },
    {
      title: "Aplicação PSA",
      className: "aplicacao-psa-header",
      children: [
        {
          title: "PSP",
          key: "psp",
          width: 80,
          className: "psp-header",
          render: (_: any, record: any) => {
            const psp = record.proficiencias.find((p: any) => p.descricao === "PSP");
            if (!psp) return null;
            return (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>{psp.valor.toFixed(2)}</span>
                <Progress
                  percent={100}
                  showInfo={false}
                  strokeColor={getProgressColor(psp.valor, disciplina, ano)}
                  style={{ width: 60 }}
                />
              </div>
            );
          },
        },
        // Criar colunas PSA dinamicamente
        ...Array.from(mesesUnicos).map((mes) => ({
            title: `PSA (${mes} 2025)`,
            key: `psa-${mes}`,
            width: 80,
            className: "psa-header",
            render: (_: any, record: any) => {
              const psa = record.proficiencias.find(
                (p: any) => p.descricao === "PSA" && p.mes === mes
              );
              if (!psa) return null;
              return (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span>{psa.valor.toFixed(2)}</span>
                  <Progress
                    percent={100}
                    showInfo={false}
                    strokeColor={getProgressColor(psa.valor, disciplina, ano)}
                    style={{ width: 60 }}
                  />
                </div>
              );
            },
          })),       
      ]
    },

  ];
  
  // Coluna de variação
  columns.push({
    title: "Variacão",
    key: "variacao",
    width: 80,
    aling: "center",
    render: (_: any, record: any) => getVariationTag(record.variacao),
    className: "variacao-header",
  });

  return columns;
};


// ---- MOCK DE DADOS
const mockResponse = {
  total: 2,
  pagina: 1,
  itensPorPagina: 2,
  aplicacoes: ["Agosto", "Setembro"],
  itens: [
    {
      nome: "Lincoln Ferreira Campos",
      variacao: -2.9,
      proficiencias: [
        { descricao: "PSP", valor: 176.5 },
        { descricao: "PSA", mes: "Agosto", valor: 390.5 },
        { descricao: "PSA", mes: "Setembro", valor: 173.6 },
        { descricao: "PSA", mes: "Outubro", valor: 223.6 },
        { descricao: "PSA", mes: "Novembro", valor: 320.6 },
        // { descricao: "PSA", mes: "Dezembro", valor: 153.6 },
      ],
    },
    {
      nome: "Carlos Eduardo Silva",
      variacao: 5.2,
      proficiencias: [
        { descricao: "PSP", mes: "", valor: 200.0 },
        { descricao: "PSA", mes: "Agosto", valor: 210.5 },
        { descricao: "PSA", mes: "Setembro", valor: 22.4 },
        { descricao: "PSA", mes: "Outubro", valor: 223.6 },
        { descricao: "PSA", mes: "Novembro", valor: 320.6 },
        // { descricao: "PSA", mes: "Dezembro", valor: 153.6 },
      ],
    },
    {
      nome: "Pablo Silva Chavier",
      variacao: 5.2,
      proficiencias: [
        { descricao: "PSP", valor: 200.0 },
        { descricao: "PSA", mes: "Agosto", valor: 210.5 },
        { descricao: "PSA", mes: "Setembro", valor: 210.4 },
        { descricao: "PSA", mes: "Outubro", valor: 223.6 },
        { descricao: "PSA", mes: "Novembro", valor: 320.6 },
        { descricao: "PSA", mes: "Dezembro", valor: 153.6 },
      ],
    },
    {
      nome: "Aroudo Silva Jose",
      variacao: 5.2,
      proficiencias: [
        { descricao: "PSP", valor: 200.0 },
        { descricao: "PSA", mes: "Agosto", valor: 210.5 },
        { descricao: "PSA", mes: "Setembro", valor: 210.4 },
        { descricao: "PSA", mes: "Outubro", valor: 223.6 },
        { descricao: "PSA", mes: "Novembro", valor: 320.6 },
        { descricao: "PSA", mes: "Dezembro", valor: 153.6 },
      ],
    },
    {
      nome: "Ciclano",
      variacao: 0.0,
      proficiencias: [
        { descricao: "PSP", valor: 200.0 },
        { descricao: "PSA", mes: "Agosto", valor: 210.5 },
        { descricao: "PSA", mes: "Setembro", valor: 210.4 },
        { descricao: "PSA", mes: "Outubro", valor: 223.6 },
        { descricao: "PSA", mes: "Novembro", valor: 320.6 },
        { descricao: "PSA", mes: "Dezembro", valor: 153.6 },
      ],
    },
  ],
};