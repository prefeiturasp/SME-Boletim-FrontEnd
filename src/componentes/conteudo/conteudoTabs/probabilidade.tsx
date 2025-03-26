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
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { servicos } from "../../../servicos";
import "./probabilidade.css";
import {
  CheckCircleOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const Probabilidade: React.FC = () => {
  const [dados, setDados] = useState<any[]>([]);
  const [disciplinas, setDadosDisciplinas] = useState<any[]>([]);

  const [carregando, setCarregando] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [estaCarregandoRelatorio, setEstaCarregandoRelatorio] = useState(false);
  const [disciplinaIdSelecionada, setDisciplinaId] = useState();

  const escolaSelecionada = useSelector(
    (state: RootState) => state.escola.escolaSelecionada
  );

  const filtroCompleto = useSelector(
    (state: RootState) => state.filtroCompleto
  );
  const [componentesCurricularSelecionado, setComponentesCurricular] = useState(
    filtroCompleto.componentesCurriculares[0]?.texto
  );
  const [anosEscolarSelecionado, setAnoEscolar] = useState(
    filtroCompleto.anosEscolares[0]?.texto
  );

  const activeTab = useSelector((state: RootState) => state.tab.activeTab);

  const buscarDadosEstudantes = async (paginaAtual = 1, tamanhoPagina = 10) => {
    try {
      setCarregando(true);

      const idComponentesCurriculares =
        filtroCompleto.componentesCurriculares.find(
          (item) => item.texto === componentesCurricularSelecionado
        )?.valor;

      const idAnosEscolares = filtroCompleto.anosEscolares.find(
        (item) => item.texto === anosEscolarSelecionado
      )?.valor;

      const resposta = await servicos.get(
        `/api/boletimescolar/${escolaSelecionada.ueId}/${idComponentesCurriculares}/${idAnosEscolares}/resultado-probabilidade?pageNumber=${paginaAtual}&pageSize=${tamanhoPagina}`
      );
      
      setDados(resposta || []);
      setDadosDisciplinas(resposta.disciplinas || []);
      setTotalRegistros(resposta.length || 0);
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
  }, [pagina, pageSize, activeTab, anosEscolarSelecionado, componentesCurricularSelecionado]);

  const iniciarDownloadRelatorioProbabilidade = async () => {
    setEstaCarregandoRelatorio(true);

    notification.open({
      key: "relatorioProbabilidade",
      message: "Os dados estão em processamento",
      description: `Não atualize a tela! Assim que processamento for finalizado, o seu documento “resultado por probabilidades” será baixado automaticamente.`,
      placement: "bottomLeft",
      icon: <InfoCircleOutlined style={{ color: "#108ee9" }} />,
      duration: 8,
      pauseOnHover: true,
      closeIcon: false,
    });

    try {
      const resposta = await servicos.get(
        `/api/boletimescolar/download/${escolaSelecionada.ueId}`,
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
        description: `Ocorreu um erro no download do seu documento “resultados por probabilidades”. Você pode tentar novamente. `,
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

  const colunas = [
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
              value={componentesCurricularSelecionado}
              onChange={(value) => setComponentesCurricular(value)}
            >
              {filtroCompleto.componentesCurriculares.map((item) => (
                <option key={item.valor} value={item.texto}>
                  {item.texto}
                </option>
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
              value={anosEscolarSelecionado}
              onChange={(value) => setAnoEscolar(value)}
            >
              {filtroCompleto.anosEscolares.map((item) => (
                <option key={item.valor} value={item.texto}>
                  {item.texto + "º ano"}
                </option>
              ))}
            </Select>
          </Space>
        </div>
        <br />
        <p className="secao-sobre-probabilidade">
          Tabela dos alunos do {anosEscolarSelecionado}º ano em{" "}
          {componentesCurricularSelecionado} com os percentuais por habilidade
          em cada um dos cortes: Abaixo do
          Básico (AB), Básico (B), Adequado (AD) e Avançado (AV). Utilize os
          campos de busca para encontrar o que você precisa mais rápido.
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
          dataSource={dados}
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
