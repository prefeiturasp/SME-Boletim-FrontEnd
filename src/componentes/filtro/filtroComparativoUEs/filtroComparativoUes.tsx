import { Select } from "antd";
import React from "react";
import "./filtroComparativoUes.css";

interface FiltroComparativoParametros {
  dados: any;
  valorSelecionado: any;
  alterarUe: (value: string, option: any) => void;
  aplicacaoSelecionada: any;
  componenteSelecionado: any;
  anoSelecionado: any;
}

const FiltroComparativoUes: React.FC<FiltroComparativoParametros> = ({
  dados,
  valorSelecionado,
  alterarUe,
  aplicacaoSelecionada,
  componenteSelecionado,
  anoSelecionado,
}) => {
  return (
    <>
      <div className="filtro-comparativo">
        <div className="filtro-comparativo-titulo">
          Evolução por Unidade Educacional (UE)
        </div>
        <div className="filtro-comparativo-conteudo">
          <div className="filtro-comparativo-subtitulo">
            Confira a média de proficiência das UEs na aplicação da Prova São
            Paulo e nas três aplicações da Prova Saberes e Aprendizagens.
          </div>
          <div className="filtro-comparativo-tags">
            <div className="filtro-comparativo-tags-item filtro-comparativo-tags-componente-curricular">
              {componenteSelecionado?.label}
            </div>
            <div className="filtro-comparativo-tags-item filtro-comparativo-tags-turma">
              {anoSelecionado?.label}º ano
            </div>
            <div className="filtro-comparativo-tags-item filtro-comparativo-tags-ano">
              {aplicacaoSelecionada?.label}
            </div>
          </div>
        </div>
      </div>

      <div className="filtro-comparativo-funcionalidade">
        <div className="filtro-comparativo-funcionalidade-texto">
          Você pode filtrar por Unidade Educacional (UE)
        </div>

        <div className="filtro-comparativo-funcionalidade-select">
          <Select
            showSearch
            placeholder="Selecione ou digite a DRE ou UE..."
            style={{ width: "100%" }}
            onChange={alterarUe}
            value={valorSelecionado}
            notFoundContent="Não encontramos nenhuma DRE ou UE com o nome digitado..."
            filterOption={(input, option) =>
              String(option?.label ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            options={dados}
          />
        </div>
      </div>
    </>
  );
};

export default FiltroComparativoUes;
