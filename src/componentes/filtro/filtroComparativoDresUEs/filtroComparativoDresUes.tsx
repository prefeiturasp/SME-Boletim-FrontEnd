import { Select } from "antd";
import React from "react";
import "./filtroComparativoDresUes.css";

interface FiltroComparativoParametros {
  dados: any;
  valorSelecionado: any;
  alterarDreUe: (value: string, option: any) => void;
  aplicacaoSelecionada: any;
  componenteSelecionado: any;
  anoSelecionado: any;
  visao: string;
}

const FiltroComparativoDresUes: React.FC<FiltroComparativoParametros> = ({
  dados,
  valorSelecionado,
  alterarDreUe,
  aplicacaoSelecionada,
  componenteSelecionado,
  anoSelecionado,
  visao
}) => {
  return (
    <>

    {visao == "sme" ? <></> :
    

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
    
    
    }
      

      <div className="filtro-comparativo-funcionalidade">
        <div className="filtro-comparativo-funcionalidade-texto">
          {visao === "sme" ? "Você pode filtrar por Diretoria Regional de Educação (DRE)." : "Você pode filtrar por Unidade Educacional (UE)"}
        </div>

        <div className="filtro-comparativo-funcionalidade-select">
          <Select
            showSearch
            placeholder="Selecione ou digite a DRE ou UE..."
            style={{ width: "100%" }}
            onChange={alterarDreUe}
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

export default FiltroComparativoDresUes;
