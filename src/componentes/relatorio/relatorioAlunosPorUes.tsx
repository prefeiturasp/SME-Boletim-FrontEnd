import { useState } from "react";
import "./relatorioAlunosPorUe.css";
import { Button, notification } from "antd";
import { servicos } from "../../servicos";
import {
  CheckCircleOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

interface DownloadRelatorioProps {
  aplicacaoSelecionada: number;
  dreSelecionada: unknown;
  dreSelecionadaNome: unknown;
}

const RelatorioAlunosPorUes: React.FC<DownloadRelatorioProps> = ({
  aplicacaoSelecionada,
  dreSelecionada,
  dreSelecionadaNome
}) => {
  const [estaCarregandoRelatorio, setEstaCarregandoRelatorio] = useState(false);
  const downloadDadosUesArquivo = async () => {
    setEstaCarregandoRelatorio(true);

    notification.open({
      key: "relatorioPrincipal",
      message: "Os dados estão em processamento",
      description: `Não atualize a tela! Assim que os dados forem processados, o seu documento será baixado automaticamente.`,
      placement: "bottomLeft",
      icon: <InfoCircleOutlined style={{ color: "#108ee9" }} />,
      duration: 8,
      pauseOnHover: true,
      closeIcon: false,
    });

    try {
      const resposta = await servicos.get(
        `/api/BoletimEscolar/download-dre/${aplicacaoSelecionada}/${dreSelecionada}`,
        { responseType: "blob" }
      );

      const blob = new Blob([resposta], {
        type: "application/vnd.ms-excel",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `boletim-resultados-principais-${dreSelecionadaNome}.xls`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      notification.open({
        key: "relatorioPrincipalSuccess",
        message: "Tudo certo por aqui!",
        description: `Seu documento  foi baixado com sucesso! Verifique a pasta de downloads no seu dispositivo.`,
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
        message: "Não conseguimos baixar seu documento",
        description: `Ocorreu um erro no download do seu documento. Você pode tentar novamente. `,
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
    <>
      <div className="elementos">
        <div className="texto">
          Você pode baixar os dados de todas as &nbsp;
          <b>Unidades Educacionais (UEs)</b>, clicando no botão ao lado
        </div>

        <div className="botao-download">
          <Button
            type="primary"
            target="_blank"
            rel="noopener noreferrer"
            onClick={downloadDadosUesArquivo}
            icon={<DownloadOutlined />}
            disabled={estaCarregandoRelatorio}
          >
            Baixar os dados
          </Button>
        </div>
      </div>
    </>
  );
};

export default RelatorioAlunosPorUes;
