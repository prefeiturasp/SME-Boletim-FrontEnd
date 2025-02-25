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

  const buscarAbrangencias = async () => {
    try {
      const resposta = await servicos.get(
        `/boletimescolar/${escolaSelecionada.ueId}`,
        {}
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
  }, [escolaSelecionada]);

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
      <DesempenhoAno />
      <DownloadRelatorio
        nomeEscola={escolaSelecionada?.descricao}
        downloadUrl="/principal"
      />
    </>
  );
};

export default Principal;
