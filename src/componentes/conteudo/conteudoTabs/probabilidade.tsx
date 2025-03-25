import React, { useEffect, useState } from "react";
import { Table, Spin, Select, Space } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { servicos } from "../../../servicos";
import "./probabilidade.css";

const Probabilidade: React.FC = () => {
  const [dados, setDados] = useState<any[]>([]);
  const [disciplinas, setDadosDisciplinas] = useState<any[]>([]);

  const [carregando, setCarregando] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRegistros, setTotalRegistros] = useState(0);

  const escolaSelecionada = useSelector(
    (state: RootState) => state.escola.escolaSelecionada
  );

  const filtrosSelecionados = useSelector((state: RootState) => state.filtros);
  const activeTab = useSelector((state: RootState) => state.tab.activeTab);

  const buscarDadosEstudantes = async (paginaAtual = 1, tamanhoPagina = 10) => {
    try {
      setCarregando(true);

      const resposta = await servicos.get(
        `/api/boletimescolar/${escolaSelecionada.ueId}/estudantes?pageNumber=${paginaAtual}&pageSize=${tamanhoPagina}`
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

  useEffect(() => {
    if (escolaSelecionada && activeTab == "3") {
      buscarDadosEstudantes(pagina, pageSize);
    }
  }, [pagina, pageSize, activeTab]);

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
    },
  ];

  return (
    <Spin spinning={carregando} tip="Carregando...">
      <div>
        <p className="secao-sobre-probabilidade">
          Os percentuais por habilidade ajudam os professores no planejamento de
          atividades para melhorar o aprendizado dos alunos. Para calcular esses
          percentuais, foi criada uma técnica que leva em conta as
          probabilidades dos alunos que foram classificados nas categorias:
          Abaixo do Básico (AB), Básico (B), Adequado (AD) e Avançado (AV).{" "}
          <br /> <br />
          Nesta seção, serão apresentados os percentuais por habilidade para
          cada ano escolar e turma. Esses percentuais mostram a probabilidade de
          os estudantes, classificados nas categorias Abaixo do{" "}
          <b> Básico (AB), Básico (B), Adequado (AD) </b> e{" "}
          <b> Avançado (AV) </b>, acertarem qualquer tarefa relacionada à
          habilidade analisada. Ao visualizar uma linha da tabela, você
          encontrará a descrição da habilidade, além dos percentuais por
          categoria.
        </p>

        <div className="secao-escolher-disciplina">
          <span>
            Selecione um componente curricular e o ano que deseja visualizar na
            tabela:
          </span>

          <Space style={{ display: "flex", alignItems: "center" }}>
            <span>Componente curricular:</span>
            <Select
              style={{
                border: "none",
                borderBottom: "1px solid white",
                width: 150,
                backgroundColor: "transparent",
                color: "white",
              }}
              dropdownStyle={{ borderRadius: 8 }}
              bordered={false}
              placeholder="Selecione"
              options={[
                { value: "matematica", label: "Matemática" },
                { value: "portugues", label: "Português" },
                { value: "ciencias", label: "Ciências" },
              ]}
            ></Select>

            <span>Ano:</span>
            <Select
              style={{
                border: "none",
                borderBottom: "1px solid black",
                width: 100,
                backgroundColor: "transparent",
              }}
              dropdownStyle={{ borderRadius: 8 }}
              bordered={false}
              placeholder="Selecione"
              options={[
                { value: "2023", label: "2023" },
                { value: "2024", label: "2024" },
                { value: "2025", label: "2025" },
              ]}
            ></Select>
          </Space>
        </div>

        <Table
          columns={colunas}
          dataSource={dados}
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
    </Spin>
  );
};

export default Probabilidade;
