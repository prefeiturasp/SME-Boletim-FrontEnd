import React, { useEffect, useState } from "react";
import { Table, Spin } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { servicos } from "../../../servicos";
import "./estudantes.css";
import EstudantesPorMateria from "../../grafico/estudantePorMateria";

const Estudantes: React.FC = () => {
  const [dados, setDados] = useState<any[]>([]);
  const [disciplinas, setDadosDisciplinas] = useState<any[]>([]);
  const [dadosGrafico, setDadosGrafico] = useState<Turma[]>([]);

  const [carregando, setCarregando] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRegistros, setTotalRegistros] = useState(0);

  const escolaSelecionada = useSelector(
    (state: RootState) => state.escola.escolaSelecionada
  );

  const aplicacaoSelecionada = useSelector(
    (state: RootState) => state.nomeAplicacao.id
  );

  const filtrosSelecionados = useSelector((state: RootState) => state.filtros);
  const activeTab = useSelector((state: RootState) => state.tab.activeTab);

  const buscarDadosEstudantes = async (paginaAtual = 1, tamanhoPagina = 10) => {
    try {
      setCarregando(true);

      let filtros = "";
      if (
        filtrosSelecionados.nomeEstudante ||
        filtrosSelecionados.eolEstudante ||
        filtrosSelecionados.anosEscolares.length > 0 ||
        filtrosSelecionados.componentesCurriculares.length > 0 ||
        filtrosSelecionados.niveis.length > 0 ||
        filtrosSelecionados.nivelMinimoEscolhido > 0 ||
        filtrosSelecionados.nivelMaximoEscolhido > 0
      ) {
        const params = new URLSearchParams();

        if (filtrosSelecionados.nomeEstudante)
          params.append("NomeEstudante", filtrosSelecionados.nomeEstudante);

        if (filtrosSelecionados.eolEstudante)
          params.append("EolEstudante", filtrosSelecionados.eolEstudante);

        filtrosSelecionados.anosEscolares.forEach((item) => {
          params.append("Ano", item.valor.toString());
        });

        filtrosSelecionados.componentesCurriculares.forEach((item) => {
          params.append("ComponentesCurriculares", item.valor.toString());
        });

        filtrosSelecionados.niveis.forEach((item) => {
          params.append("NivelProficiencia", item.valor.toString());
        });

        if (filtrosSelecionados.nivelMinimoEscolhido)
          params.append(
            "NivelMinimo",
            filtrosSelecionados.nivelMinimoEscolhido.toString()
          );

        if (filtrosSelecionados.nivelMaximoEscolhido)
          params.append(
            "NivelMaximo",
            filtrosSelecionados.nivelMaximoEscolhido.toString()
          );

        filtros = `&${params.toString()}`;
      }

      const resposta = await servicos.get(
        `/api/boletimescolar/${aplicacaoSelecionada}/${escolaSelecionada.ueId}/estudantes?pageNumber=${paginaAtual}&pageSize=${tamanhoPagina}${filtros}`
      );

      setDados(resposta.estudantes.itens || []);
      setDadosDisciplinas(resposta.disciplinas || []);
      setTotalRegistros(resposta.estudantes.totalRegistros || 0);
    } catch (error) {
      console.error("Erro ao buscar os dados da tabela:", error);
    } finally {
      setCarregando(false);
    }
  };

  const buscarDadosGraficos = async () => {
    try {
      setCarregando(true);

      let filtros = "";
      if (
        filtrosSelecionados.nomeEstudante ||
        filtrosSelecionados.eolEstudante ||
        filtrosSelecionados.anosEscolares.length > 0 ||
        filtrosSelecionados.componentesCurriculares.length > 0 ||
        filtrosSelecionados.niveis.length > 0 ||
        filtrosSelecionados.nivelMinimoEscolhido > 0 ||
        filtrosSelecionados.nivelMaximoEscolhido > 0
      ) {
        const params = new URLSearchParams();

        if (filtrosSelecionados.nomeEstudante)
          params.append("NomeEstudante", filtrosSelecionados.nomeEstudante);

        if (filtrosSelecionados.eolEstudante)
          params.append("EolEstudante", filtrosSelecionados.eolEstudante);

        filtrosSelecionados.anosEscolares.forEach((item) => {
          params.append("Ano", item.valor.toString());
        });

        filtrosSelecionados.componentesCurriculares.forEach((item) => {
          params.append("ComponentesCurriculares", item.valor.toString());
        });

        filtrosSelecionados.niveis.forEach((item) => {
          params.append("NivelProficiencia", item.valor.toString());
        });

        if (filtrosSelecionados.nivelMinimoEscolhido)
          params.append(
            "NivelMinimo",
            filtrosSelecionados.nivelMinimoEscolhido.toString()
          );

        if (filtrosSelecionados.nivelMaximoEscolhido)
          params.append(
            "NivelMaximo",
            filtrosSelecionados.nivelMaximoEscolhido.toString()
          );

        filtros = `?${params.toString()}`;
      }

      const resposta: Turma[] = await servicos.get(
        `/api/boletimescolar/${aplicacaoSelecionada}/${escolaSelecionada.ueId}/estudantes-grafico${filtros}`
      );
      setDadosGrafico(resposta || []);
    } catch (error) {
      console.error("Erro ao buscar os dados da tabela:", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (escolaSelecionada && activeTab == "3") {
      buscarDadosEstudantes(pagina, pageSize);
    }
  }, [pagina, pageSize, activeTab, aplicacaoSelecionada]);

  useEffect(() => {
    if (escolaSelecionada && activeTab == "3") {
      setPagina(1);
      buscarDadosEstudantes();
      buscarDadosGraficos();
    }
  }, [escolaSelecionada, filtrosSelecionados, activeTab, aplicacaoSelecionada]);

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

  const colunas = [
    {
      title: "Componente curricular",
      dataIndex: "disciplina",
      key: "disciplina",
    },
    { title: "Ano", dataIndex: "anoEscolar", key: "anoEscolar" },
    { title: "Turma", dataIndex: "turma", key: "turma" },
    { title: "EOL do estudante", dataIndex: "alunoRa", key: "alunoRa" },
    { title: "Nome do estudante", dataIndex: "alunoNome", key: "alunoNome" },
    { title: "Proficiência", dataIndex: "proficiencia", key: "proficiencia" },
    {
      title: "Nível",
      dataIndex: "nivelDescricao",
      key: "nivelDescricao",
      render: (text: string) => (
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: getNivelColor(text),
            }}
          ></span>
          {text}
        </span>
      ),
    },
  ];

  return (
    <Spin spinning={carregando} tip="Carregando...">
      <div>
        <p className="secao-sobre-estudantes">
          Esta seção apresenta uma tabela e gráficos que ilustram a proficiência
          de cada aluno, separado por turmas.
        </p>

        <p className="secao-titulo-estudantes">
          Distribuição de estudantes em cada nível por turma.
        </p>

        <p className="secao-titulo-disciplinas">
          {disciplinas.length > 1
            ? `${disciplinas.slice(0, -1).join(", ")} e ${
                disciplinas[disciplinas.length - 1]
              }`
            : disciplinas[0]}
        </p>

        <Table
          columns={colunas}
          dataSource={dados}
          //rowKey="alunoRa"
          locale={{ emptyText: "Não encontramos dados" }}
          pagination={{
            current: pagina,
            total: totalRegistros,
            pageSize,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} de ${total} alunos`,
            pageSizeOptions: ["10", "20", "30", "40", "50", "100"],
            onShowSizeChange: (_, newSize) => setPageSize(newSize),
            onChange: (page, newSize) => {
              setPagina(page);
              setPageSize(newSize);
            },
            position: ["bottomCenter"],
            locale: {
              items_per_page: "/ página",
            },
          }}
        />
      </div>
      {dadosGrafico.map((item) => (
        <EstudantesPorMateria dados={item} />
      ))}
    </Spin>
  );
};

export default Estudantes;
