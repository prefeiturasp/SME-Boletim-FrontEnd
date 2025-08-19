import { useState } from "react";
import "./relatorioAlunosPorUes.css";
import { Button, Modal, notification } from "antd";
import { servicos } from "../../servicos";
import {
  CheckCircleOutlined,  
  InfoCircleOutlined,
} from "@ant-design/icons";

interface DownloadRelatorioProps {
  aplicacaoSelecionada: number;
  dreSelecionada: unknown;
  dreSelecionadaNome: unknown;
}

import iconeFormado from "../../assets/icon-formado.svg";
import iconePorce from "../../assets/icon-porcentagem.svg";
import iconeDownload from "../../assets/icon-downloadSeta.svg";

type TipoRelatorio = "proficiência" | "probabilidade";

const RelatorioAlunosPorUes: React.FC<DownloadRelatorioProps> = ({
  aplicacaoSelecionada,
  dreSelecionada,
  dreSelecionadaNome
}) => {
  const [estaCarregandoRelatorio, setEstaCarregandoRelatorio] = useState(false);  
  const [modalVisivel, setModalVisivel] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] = useState<TipoRelatorio | null>(null);
  const nomeDre = dreSelecionadaNome 
  ? dreSelecionadaNome.toString().replace(/DIRETORIA REGIONAL DE EDUCACAO/i, "DRE")
  : '';
  
  const abrirModal = () => {
    setModalVisivel(true);
    setTipoSelecionado(null);
  };

  const fecharModal = () => {
    setModalVisivel(false);
    setTipoSelecionado(null);
  };

  const getUrlDownload = () => {
    if (tipoSelecionado === "proficiência") {
      return `/api/BoletimEscolar/download-dre/${aplicacaoSelecionada}/${dreSelecionada}`;
    }

    if (tipoSelecionado === "probabilidade") {
      return `/api/BoletimEscolar/download-dre-probabilidade/${aplicacaoSelecionada}/${dreSelecionada}`;
    }

    return null;
  };

  const downloadDadosUesArquivo = async () => {
    const url = getUrlDownload();
    if (!url) return;

    setEstaCarregandoRelatorio(true);

    notification.open({
      key: "relatorioPrincipal",
      message: <b>Os dados estão em processamento</b>,
      description: `Não atualize a tela! Assim que os dados forem processados, o seu documento será baixado automaticamente.`,
      placement: "bottomLeft",
      icon: <InfoCircleOutlined style={{ color: "#108ee9" }} />,
      duration: 8,
      pauseOnHover: true,
      closeIcon: false,
    });

    try {
      const resposta = await servicos.get(url, {
        responseType: "blob",
      });

      const blob = new Blob([resposta], {
        type: "application/vnd.ms-excel",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `arquivo.xls`;

      if (tipoSelecionado === "proficiência") {
        link.download = `boletim-resultados-principais-${dreSelecionadaNome}.xls`;
      }

      if (tipoSelecionado === "probabilidade") {
        link.download = `boletim-resultados-probabilidades-${dreSelecionadaNome}.xls`;
      }

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      notification.open({
        key: "relatorioPrincipalSuccess",
        message: <b>Tudo certo por aqui!</b>,
        description: `Seu documento "resultado por ${tipoSelecionado ?? ""}" foi baixado com sucesso! Verifique a pasta de downloads no seu dispositivo.`,
        placement: "bottomLeft",
        icon: <CheckCircleOutlined style={{ color: "#108ee9" }} />,
        duration: 8,
        pauseOnHover: true,
        closeIcon: false,
      });

      fecharModal();
    } catch (error) {
      console.error("Erro ao buscar os dados da tabela:", error);
      setEstaCarregandoRelatorio(false);

      notification.open({
        key: "relatorioPrincipalErro",
        message: <b>Não conseguimos baixar seu documento</b>,
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

  const CardOpcao = ({
    tipo,
    titulo,
    icone,
  }: {
    tipo: TipoRelatorio;
    titulo: string;
    icone: JSX.Element;
  }) => (
    <div
      className={`card-opcao ${tipoSelecionado === tipo ? "ativo" : ""}`}
      onClick={() => setTipoSelecionado(tipo)}
    >
      {icone}
      <span>{titulo}</span>
    </div>
  );

  return (
    <>
      <div className="elementos">
        <div className="texto-ue-download">
          <div>Você pode baixar os dados de todas as <b>Unidades</b></div>
          <div><b>Educacionais (UEs)</b>, clicando no botão ao lado</div>
        </div>
        <div className="botao-download">
          <Button
            type="primary"
            icon={
            <img
              src={iconeDownload}
              alt="ícone de download"
              style={{ width: 14, height: 17, paddingTop: 6.8, paddingRight: 3 }} />
            }
            onClick={abrirModal}
            className="btnAzulPadrao"
          >
            Baixar os dados
          </Button>
        </div>
      </div>

      <Modal
        title="Baixar os dados"
        open={modalVisivel}
        onCancel={fecharModal}
        footer={null}
        centered
        width={410}
        height={370}
        className="tituloModal-Dre"
        zIndex={2000}
      >
        <div className="modalCorpo">
          <p className="texto-modal">Você pode baixar os dados de todas as Unidades Educacionais da <span style={{fontWeight: 700}}>{nomeDre}</span>. Qual você gostaria de baixar primeiro?</p>

          <div className="opcoes-container">
            <CardOpcao
              tipo="proficiência"
              titulo="Dados de proficiência por alunos"            
              icone={
                <img
                  src={iconeFormado}
                  alt="Ícone aluno"
                  style={{ width: 19.5, height: 18.76, color: "#1890ff",
                      paddingTop: 4, paddingRight: 0, paddingBottom: 9, paddingLeft: 1
                  }}
                />}
              />
            <CardOpcao
              tipo="probabilidade"
              titulo="Probabilidade de acerto por habilidade"
              icone={
                <img
                  src={iconePorce}
                  alt="Ícone aluno"
                  style={{ width: 15.81, height: 15.81, color: "#1890ff", 
                    paddingTop: 4, paddingRight: 0, paddingBottom: 9, paddingLeft: 1
                  }}
                />} 
            />
          </div>

          <div className="modal-botoes">
            <Button
              type="primary"
              icon={
              <img
                src={iconeDownload}
                alt="ícone de download"
                style={{ width: 14, height: 17, paddingTop: 6.8, paddingRight: 3 }} />
              }
              disabled={!tipoSelecionado || estaCarregandoRelatorio}
              loading={estaCarregandoRelatorio}
              onClick={downloadDadosUesArquivo}
              block
              className="btnAzulPadrao"
            >
              <p>Baixar os dados</p>
            </Button>
            <Button 
                onClick={fecharModal} block style={{ }}
                className="btnCancelar-dre"
            >
              Cancelar
            </Button>
          </div>
        </div>

      </Modal>
    </>
  );
};

export default RelatorioAlunosPorUes;
