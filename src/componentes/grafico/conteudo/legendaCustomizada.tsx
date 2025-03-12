import React from "react";
import "./legendaCustomizada.css";

const LegendaCustomizada: React.FC<{ payload?: any[] }> = ({ payload }) => {
  if (!payload) return null;
  return (
    <div className="legenda-container">
      <span className="legenda-titulo">
        Distribuição dos estudantes em cada nível.
      </span>
      <div className="legenda-itens">
        <span className="legenda-titulo">Níveis: </span>
        {payload.map((entry, index) => (
          <span key={index} className="legenda-item">
            <div
              className="legenda-cor-caixa"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="legenda-texto">{entry.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default LegendaCustomizada;
