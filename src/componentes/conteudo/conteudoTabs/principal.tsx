import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import "./principal.css";
import Tabela from "../tabela/tabela";
import DesempenhoAno from "../../grafico/desempenhoAno";
import DownloadRelatorio from "../../relatorio/relatorio";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { servicos } from "../../../servicos";

const Principal: React.FC = () => {
  const [dados, setDados] = useState<any[]>([]);
  const [estaCarregando, setEstaCarregando] = useState(false);

  const escolaSelecionada = useSelector(
    (state: RootState) => state.escola.escolaSelecionada
  );

  const filtrosSelecionados = useSelector((state: RootState) => state.filtros);

  const buscarAbrangencias = async () => {
    try {
      let filtros;
      if (
        filtrosSelecionados.anoLetivo.length > 0 ||
        filtrosSelecionados.componentesCurriculares.length > 0 ||
        filtrosSelecionados.niveis.length > 0
      ) {
        const anoLetivoMap = {
          "5º ano": 5,
          "9º ano": 9,
        };

        const componentesMap = {
          "Língua Portuguesa": "linguaPortuguesa",
          Matemática: "matematica",
        };

        const niveisMap = {
          "Abaixo do básico": "abaixoDoBasico",
          Básico: "basico",
          Adequado: "adequado",
          Avançado: "avancado",
        };

        filtros = {
          anoLetivo: filtrosSelecionados.anoLetivo.map(
            (ano) => anoLetivoMap[ano]
          ),
          componentesCurriculares:
            filtrosSelecionados.componentesCurriculares.map(
              (cc) => componentesMap[cc]
            ),
          niveis: filtrosSelecionados.niveis.map((nivel) => niveisMap[nivel]),
        };
      }
      const resposta = await servicos.get(
        `/boletimescolar/${escolaSelecionada.ueId}`,
        { filtros }
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
      <DesempenhoAno dados={dados}/>
      <DownloadRelatorio
        nomeEscola={escolaSelecionada?.descricao}
        downloadUrl="/principal"
      />
    </>
  );
};

export default Principal;
