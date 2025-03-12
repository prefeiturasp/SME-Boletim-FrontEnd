import React, { useEffect, useState } from "react";
import { Row, Col, Button, notification } from "antd";
import "./principal.css";
import Tabela from "../tabela/tabela";
import DesempenhoAno from "../../grafico/desempenhoAno";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { servicos } from "../../../servicos";
import { DownloadOutlined, InfoCircleOutlined } from "@ant-design/icons";

const Principal: React.FC = () => {
  const [dados, setDados] = useState<any[]>([]);
  const [estaCarregando, setEstaCarregando] = useState(false);
  const [estaCarregandoRelatorio, setEstaCarregandoRelatorio] = useState(false);

  const escolaSelecionada = useSelector(
    (state: RootState) => state.escola.escolaSelecionada
  );

  const filtrosSelecionados = useSelector((state: RootState) => state.filtros);

  const buscarAbrangencias = async () => {
    try {
      let filtros = "";
      if (
        filtrosSelecionados.anoLetivo.length > 0 ||
        filtrosSelecionados.componentesCurriculares.length > 0
      ) {
        const anoLetivoMap = {
          "5º ano": 5,
          "9º ano": 9,
        };

        const componentesMap = {
          "Língua Portuguesa": "linguaPortuguesa",
          Matemática: "matematica",
        };

        const params = new URLSearchParams();

        filtrosSelecionados.anoLetivo.forEach((ano) => {
          params.append("Ano", anoLetivoMap[ano]);
        });

        filtrosSelecionados.componentesCurriculares.forEach((cc) => {
          params.append("ComponentesCurriculares", componentesMap[cc]);
        });

        filtros = `?${params.toString()}`;
      }
      const resposta = await servicos.get(
        `/api/boletimescolar/${escolaSelecionada.ueId}${filtros}`
      );

      setDados(resposta);
    } catch (error) {
      console.error(
        "Erro ao buscar os dados da tabela (aba principal):",
        error
      );
      setEstaCarregando(false);
    }
  };

  useEffect(() => {
    setEstaCarregando(true);
    buscarAbrangencias();
    setEstaCarregando(false);
  }, [escolaSelecionada, filtrosSelecionados]);

  const iniciarDownloadRelatorioPrincipal = async () => {
    setEstaCarregandoRelatorio(true);

    notification.open({
      key: "relatorioPrincipal",
      message: "Os dados estão em processamento",
      description: `Não atualize a tela! Assim que os dados forem processados, o seu documento "Dados da ${escolaSelecionada?.descricao}" será baixado automaticamente.`,
      placement: "bottomLeft",
      icon: <InfoCircleOutlined style={{ color: "#108ee9" }} />,
      duration: 8,
      pauseOnHover: true,
      closeIcon: false,
    });

    setEstaCarregandoRelatorio(false);

    // setTimeout(() => {
    //   notification.destroy("relatorioPrincipal");
    // }, 4000);
  };

  return (
    <>
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
      <DesempenhoAno dados={dados} />

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
    </>
  );
};

export default Principal;
