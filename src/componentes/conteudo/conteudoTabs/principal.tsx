import React, { useEffect, useState } from "react";
import { Row, Col, Button, notification, Spin, Modal } from "antd";
import "./principal.css";
import Tabela from "../tabela/tabela";
import DesempenhoAno from "../../grafico/desempenhoAno";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { servicos } from "../../../servicos";
import {
  DownloadOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import LoadingBox from "../../loadingBox/loadingBox";

const Principal: React.FC = () => {
  const [dados, setDados] = useState<any[]>([]);
  const [estaCarregando, setEstaCarregando] = useState(false);
  const [estaCarregandoRelatorio, setEstaCarregandoRelatorio] = useState(false);

  const escolaSelecionada = useSelector(
    (state: RootState) => state.escola.escolaSelecionada
  );

  const aplicacaoSelecionada = useSelector(
    (state: RootState) => state.nomeAplicacao.id
  );

  const activeTab = useSelector((state: RootState) => state.tab.activeTab);
  const filtrosSelecionados = useSelector((state: RootState) => state.filtros);

  const buscarAbrangencias = async () => {
    try {
      setEstaCarregando(true);
      let filtros = "";
      if (
        filtrosSelecionados.anosEscolares.length > 0 ||
        filtrosSelecionados.componentesCurriculares.length > 0
      ) {
        const params = new URLSearchParams();

        filtrosSelecionados.anosEscolares.forEach((item) => {
          params.append("Ano", item.valor.toString());
        });

        filtrosSelecionados.componentesCurriculares.forEach((item) => {
          params.append("ComponentesCurriculares", item.valor.toString());
        });

        filtros = `?${params.toString()}`;
      }
      const resposta = await servicos.get(
        `/api/boletimescolar/${aplicacaoSelecionada}/${escolaSelecionada.ueId}${filtros}`
      );

      setDados(resposta);
    } catch (error) {
      console.error(
        "Erro ao buscar os dados da tabela (aba principal):",
        error
      );
      setEstaCarregando(false);
    } finally {
      setEstaCarregando(false);
    }
  };

  useEffect(() => {
    if (
      escolaSelecionada.ueId !== null &&
      activeTab == "1" &&
      aplicacaoSelecionada
    ) {
      buscarAbrangencias();
    }
  }, [escolaSelecionada, filtrosSelecionados, activeTab, aplicacaoSelecionada]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (estaCarregandoRelatorio) {
        event.preventDefault();
        event.returnValue = "";

        Modal.confirm({
          title: "Seu documento está sendo processado!",
          icon: <ExclamationCircleOutlined style={{ color: "#faad14" }} />,
          content:
            "Se você atualizar a página agora, o progresso será perdido e será necessário recomeçar. Tem certeza de que deseja atualizar?",
          okText: "Atualizar",
          cancelText: "Voltar",
          onOk: () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.location.reload();
          },
          onCancel: () => {
            notification.open({
              key: "reloadCancelado",
              message: <b>Operação cancelada</b>,
              description:
                "O recarregamento foi cancelado e o relatório continua sendo processado.",
              placement: "top",
              icon: <ExclamationCircleOutlined style={{ color: "#faad14" }} />,
              duration: 5,
            });
          },
        });
      }
    };

    if (estaCarregandoRelatorio) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    } else {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [estaCarregandoRelatorio]);

  const iniciarDownloadRelatorioPrincipal = async () => {
    setEstaCarregandoRelatorio(true);

    notification.open({
      key: "relatorioPrincipal",
      message: <b>Os dados estão em processamento</b>,
      description: `Não atualize a tela! Assim que os dados forem processados, o seu documento "Dados da ${escolaSelecionada?.descricao}" será baixado automaticamente.`,
      placement: "bottomLeft",
      icon: <InfoCircleOutlined style={{ color: "#108ee9" }} />,
      duration: 8,
      pauseOnHover: true,
      closeIcon: false,
    });

    try {
      const resposta = await servicos.get(
        `/api/boletimescolar/download/${aplicacaoSelecionada}/${escolaSelecionada.ueId}`,
        { responseType: "blob" }
      );

      const blob = new Blob([resposta], {
        type: "application/vnd.ms-excel",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `boletim-resultados-principais-${escolaSelecionada.descricao}.xls`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      notification.open({
        key: "relatorioPrincipalSuccess",
        message: <b>Tudo certo por aqui!</b>,
        description: `Seu documento "${escolaSelecionada.descricao}" foi baixado com sucesso! Verifique a pasta de downloads no seu dispositivo.`,
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
        key: "relatorioPrincipalErro",
        message: <b>Não conseguimos baixar seu documento</b>,
        description: `Ocorreu um erro no download do seu documento “${escolaSelecionada?.descricao}”. Você pode tentar novamente. `,
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
    <div>
      {estaCarregando && <LoadingBox />}
      <span>
        Esta seção apresenta uma tabela e um gráfico que ilustram a quantidade
        de estudantes por ano escolar e faixa de classificação em cada nível.
      </span>

      <div className="legenda-container-fundo">
        <Row gutter={16}>
          <Col>
            <span className="legenda-item">
              <strong>AB</strong> = Abaixo do básico
            </span>
          </Col>
          <Col>
            <span className="legenda-item">
              <strong>B</strong> = Básico
            </span>
          </Col>
          <Col>
            <span className="legenda-item">
              <strong>AD</strong> = Adequado
            </span>
          </Col>
          <Col>
            <span className="legenda-item">
              <strong>AV</strong> = Avançado
            </span>
          </Col>
        </Row>
      </div>

      <Tabela
        dados={dados}
        origem="principal"
        estaCarregando={estaCarregando}
      />

      {dados.length > 0 && (
        <DesempenhoAno
          dados={dados}
          filtrosSelecionados={filtrosSelecionados}
        />
      )}

      <div className="download-section">
        <Row gutter={16} align="middle" justify="center">
          <Col>
            <div className="download-wrapper">
              <p className="school-text">
                Você pode baixar os dados da{" "}
                <b>{escolaSelecionada?.descricao}</b>, clicando no botão ao lado
              </p>

              <Button
                type="primary"
                target="_blank"
                rel="noopener noreferrer"
                onClick={iniciarDownloadRelatorioPrincipal}
                icon={<DownloadOutlined />}
                disabled={estaCarregandoRelatorio}
              >
                Baixar os dados
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Principal;
