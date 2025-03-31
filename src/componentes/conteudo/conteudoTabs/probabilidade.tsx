import React, { useEffect, useState } from "react";
import {
  Table,
  Spin,
  Select,
  Space,
  Input,
  Col,
  Button,
  Row,
  notification,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { servicos } from "../../../servicos";
import "./probabilidade.css";
import {
  CheckCircleOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { setFilters } from "../../../redux/slices/filtrosSlice";

const colunasInicial = [
  {
    title: "Código",
    dataIndex: "codigoHabilidade",
    key: "codigoHabilidade",
  },
  {
    title: "Habilidades",
    dataIndex: "habilidadeDescricao",
    key: "habilidadeDescricao",
  },
  { title: "Turma", dataIndex: "turmaDescricao", key: "turmaDescricao" },
  {
    title: "Abaixo do básico",
    dataIndex: "abaixoDoBasico",
    key: "abaixoDoBasico",
  },
  { title: "Básico", dataIndex: "basico", key: "basico" },
  { title: "Adequado", dataIndex: "adequado", key: "adequado" },
  {
    title: "Avançado",
    dataIndex: "avancado",
    key: "avancado",
  },
];

const Probabilidade: React.FC = () => {
  const [dados, setDados] = useState<any[]>([]);
  const [dadosFormatados, setDadosFormatados] = useState<any[]>([]);
  const [disciplinas, setDadosDisciplinas] = useState<any[]>([]);

  const [carregando, setCarregando] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [estaCarregandoRelatorio, setEstaCarregandoRelatorio] = useState(false);
  const [disciplinaIdSelecionada, setDisciplinaId] = useState();
  const dispatch = useDispatch();
  const [selectedFilters, setSelectedFilters] = useState<Filtro>({
    niveis: [],
    niveisAbaPrincipal: [],
    anosEscolares: [],
    componentesCurriculares: [],
    anosEscolaresRadio: [],
    componentesCurricularesRadio: [],
    nivelMinimo: 0,
    nivelMinimoEscolhido: 0,
    nivelMaximo: 0,
    nivelMaximoEscolhido: 0,
    turmas: [],
    nomeEstudante: "",
    eolEstudante: "",
  });

  const [colunas, setColunas] = useState<any[]>(colunasInicial);

  const escolaSelecionada = useSelector(
    (state: RootState) => state.escola.escolaSelecionada
  );

  const filtroCompleto = useSelector(
    (state: RootState) => state.filtroCompleto
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

  const filtrosSelecionados = useSelector((state: RootState) => state.filtros);
  const activeTab = useSelector((state: RootState) => state.tab.activeTab);

  const buscarDadosEstudantes = async (paginaAtual = 1, tamanhoPagina = 10) => {
    try {
      setCarregando(true);

      let filtros = "";
      const params = new URLSearchParams();
      if (filtroTexto.trim().length > 0) {
        params.append("Habilidade", filtroTexto);
      }
      if (filtrosSelecionados.turmas.length > 0) {
        filtrosSelecionados.turmas.forEach((item) => {
          params.append("Turma", item.valor.toString());
        });
      }
      filtros = params.toString();

      const idComponentesCurriculares =
        filtroCompleto.componentesCurriculares.find(
          (item) => item.texto === componentesCurricularSelecionado
        )?.valor ?? 0;

      const idAnosEscolares =
        filtroCompleto.anosEscolares.find(
          (item) => item.texto === anosEscolarSelecionado
        )?.valor ?? 0;

      const resposta = await servicos.get(
        `/api/boletimescolar/${escolaSelecionada.ueId}/${idComponentesCurriculares}/${idAnosEscolares}/resultado-probabilidade/lista?Pagina=${paginaAtual}&TamanhoPagina=${tamanhoPagina}&${filtros}`
      );

      setDadosFormatados(resposta.resultados);
      setTotalRegistros(resposta.totalRegistros);
    } catch (error) {
      console.error("Erro ao buscar os dados da tabela:", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (escolaSelecionada && activeTab == "4") {
      buscarDadosEstudantes(pagina, pageSize);
    }
  }, [pagina, pageSize, activeTab]);

  useEffect(() => {
    if (activeTab == "4") {
      setComponentesCurricular(
        filtrosSelecionados.componentesCurricularesRadio[0].texto
      );

      setAnoEscolar(filtrosSelecionados.anosEscolaresRadio[0].texto);
    }
  }, [filtrosSelecionados, activeTab]);

  const toggleColumnVisibility = (
    columnsSetter: React.Dispatch<React.SetStateAction<any[]>>,
    key: string,
    value: boolean
  ) => {
    columnsSetter((prevColumns) =>
      prevColumns.map((col) =>
        col.key === key ? { ...col, hidden: value } : col
      )
    );
  };

  useEffect(() => {
    if (activeTab !== "2" && activeTab !== "4") return;

    const keys = [
      { key: "abaixoBasico", valor: 1 },
      { key: "basico", valor: 2 },
      { key: "adequado", valor: 3 },
      { key: "avancado", valor: 4 },
    ];

    keys.forEach(({ key, valor }) => {
      const isVisible = filtrosSelecionados.niveisAbaPrincipal.some(
        (item) => item.valor === valor
      );

      toggleColumnVisibility(setColunas, key, !isVisible);
    });
  }, [filtrosSelecionados, activeTab]);

  const alteraRadio = (valor: string, tipo: TipoFiltro) => {
    if (tipo === "componentesCurriculares") {
      setComponentesCurricular(valor); // <- atualiza estado local para refletir na tela
      const item = filtroCompleto.componentesCurriculares.find(
        (item) => item.texto === valor
      );
      const novosFiltros = {
        ...filtrosSelecionados,
        componentesCurricularesRadio: [item],
      };
      dispatch(setFilters(novosFiltros));
    } else if (tipo === "anosEscolares") {
      setComponentesCurricular(valor); // <- atualiza estado local para refletir na tela
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

  useEffect(() => {
    if (escolaSelecionada && activeTab == "4") {
      setPagina(1);
      buscarDadosEstudantes(1, 10);
    }
  }, [
    filtroTexto,
    anosEscolarSelecionado,
    componentesCurricularSelecionado,
    filtrosSelecionados,
    activeTab,
  ]);

  const iniciarDownloadRelatorioProbabilidade = async () => {
    setEstaCarregandoRelatorio(true);

    notification.open({
      key: "relatorioProbabilidade",
      message: "Os dados estão em processamento",
      description: `Não atualize a tela! Assim que processamento for finalizado, o seu documento "resultado por probabilidades" será baixado automaticamente.`,
      placement: "bottomLeft",
      icon: <InfoCircleOutlined style={{ color: "#108ee9" }} />,
      duration: 8,
      pauseOnHover: true,
      closeIcon: false,
    });

    try {
      const resposta = await servicos.get(
        `/api/BoletimEscolar/download-probabilidade/${escolaSelecionada.ueId}/${componentesCurricularSelecionadoId}/${anosEscolarSelecionadoId}`,
        { responseType: "blob" }
      );

      const blob = new Blob([resposta], {
        type: "application/vnd.ms-excel",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `boletim-resultados-probabilidades-${escolaSelecionada.descricao}.xls`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      notification.open({
        key: "relatorioProbabilidadeSuccess",
        message: "Tudo certo por aqui!",
        description: `Seu documento "resultados por probabilidades" foi baixado com sucesso! Verifique a pasta de downloads no seu dispositivo.`,
        placement: "bottomLeft",
        icon: <CheckCircleOutlined style={{ color: "#108ee9" }} />,
        duration: 8,
        pauseOnHover: true,
        closeIcon: false,
      });
    } catch (error) {
      console.error("Erro ao buscar os dados da tabela:", error);
      setEstaCarregandoRelatorio(false);

      notification.open({
        key: "relatorioProbabilidadeErro",
        message: "Não conseguimos baixar seu documento",
        description: `Ocorreu um erro no download do seu documento "resultados por probabilidades". Você pode tentar novamente. `,
        placement: "bottomLeft",
        icon: <InfoCircleOutlined style={{ color: "#108ee9" }} />,
        duration: 8,
        pauseOnHover: true,
        closeIcon: false,
      });
    } finally {
      setEstaCarregandoRelatorio(false);
    }
  };

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
              className="custom-select-color"
              style={{
                border: "none",
                borderBottom: "1px solid white",
                width: 170,
                backgroundColor: "transparent",
                color: "white",
              }}
              dropdownStyle={{ borderRadius: 8 }}
              bordered={false}
              placeholder="Selecione"
              onChange={(value) => {
                setComponentesCurricular(value);
                setComponentesCurricularId(value);
                alteraRadio(value, "componentesCurriculares");
              }}
              value={filtrosSelecionados.componentesCurricularesRadio[0].texto}
            >
              {filtroCompleto.componentesCurriculares.map((item) => (
                <Select.Option key={item.valor} value={item.texto}>
                  {item.texto}
                </Select.Option>
              ))}
            </Select>

            <span>Ano:</span>
            <Select
              className="custom-select-color"
              style={{
                border: "none",
                borderBottom: "1px solid white",
                width: 110,
                backgroundColor: "transparent",
                color: "white",
              }}
              dropdownStyle={{ borderRadius: 8 }}
              bordered={false}
              placeholder="Selecione"
              onChange={(value) => {
                setAnoEscolar(value);
                setAnoEscolarId(value);
                alteraRadio(value, "anosEscolares");
              }}
              value={filtrosSelecionados.anosEscolaresRadio[0].texto}
            >
              {filtroCompleto.anosEscolares.map((item) => (
                <Select.Option key={item.valor} value={item.texto}>
                  {item.texto + "º ano"}
                </Select.Option>
              ))}
            </Select>
          </Space>
        </div>
        <br />
        <p className="secao-sobre-probabilidade">
          Tabela dos alunos do {anosEscolarSelecionado}º ano em{" "}
          {componentesCurricularSelecionado} com os percentuais por habilidade
          em cada um dos cortes: Abaixo do Básico (AB), Básico (B), Adequado
          (AD) e Avançado (AV). Utilize os campos de busca para encontrar o que
          você precisa mais rápido.
        </p>

        <div style={{ marginBottom: 16 }}>
          <p className="secao-sobre-probabilidade">
            Utilize o campo de busca para encontrar códigos ou habilidades
            específicas:
          </p>{" "}
          <Input
            placeholder="Digite o código ou habilidade"
            onChange={(e) => setFiltroTexto(e.target.value)}
            style={{
              width: 400,
              border: "none",
              borderBottom: "1px solid #d9d9d9",
              backgroundColor: "transparent",
              paddingRight: 30,
            }}
            suffix={<SearchOutlined style={{ color: "#999" }} />}
          />
        </div>

        <Table
          columns={colunas}
          dataSource={dadosFormatados.filter(
            (item) =>
              item.habilidadeDescricao
                .toLowerCase()
                .includes(filtroTexto.toLowerCase()) ||
              item.codigoHabilidade
                .toLowerCase()
                .includes(filtroTexto.toLowerCase())
          )}
          locale={{ emptyText: "Não encontramos dados" }}
          pagination={{
            current: pagina,
            total: totalRegistros,
            pageSize,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} de ${total} temas`,
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

      <br />
      <div className="download-section">
        <Row gutter={16} align="middle" justify="center">
          <Col>
            <div className="download-wrapper">
              <p className="school-text">
                Você pode baixar os dados das habilidades do{" "}
                <b>{anosEscolarSelecionado}º ano</b> em{" "}
                <b>{componentesCurricularSelecionado}</b>, clicando no botão ao
                lado
              </p>

              <Button
                type="primary"
                target="_blank"
                rel="noopener noreferrer"
                onClick={iniciarDownloadRelatorioProbabilidade}
                icon={<DownloadOutlined />}
                disabled={estaCarregandoRelatorio}
              >
                Baixar os dados
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </Spin>
  );
};

export default Probabilidade;
