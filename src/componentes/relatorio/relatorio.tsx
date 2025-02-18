import { Row, Col, Button } from "antd";
import "./relatorio.css";
import { DownloadOutlined } from "@ant-design/icons";

interface DownloadRelatorioProps {
  nomeEscola: string;
  downloadUrl: string;
}

const DownloadRelatorio: React.FC<DownloadRelatorioProps> = ({
  nomeEscola,
  downloadUrl,
}) => {
  return (
    <div className="download-section">
      <Row gutter={16} align="middle" className="download-content">
        <Col span={12} className="text-col">
          <p className="school-text">
            Você pode baixar os dados da <b> {nomeEscola} </b>, clicando no
            botão ao lado
          </p>
        </Col>
        <Col span={12} className="button-col">
          <Button
            type="primary"
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            icon={<DownloadOutlined />}
          >
            Baixar os dados
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default DownloadRelatorio;
