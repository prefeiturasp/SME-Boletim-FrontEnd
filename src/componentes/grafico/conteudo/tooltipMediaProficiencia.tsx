import React from "react";
import "./tooltipMediaProficiencia.css"; 

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  showPercentage: boolean
}

const labelMap: Record<string, string> = {
  portugues: "Língua Portuguesa",
  matematica: "Matemática",
};

const TooltipMediaProficiencia: React.FC<TooltipProps> = ({ active, payload, label, showPercentage }) => {
  if (active && payload && payload.length) {
    return (
      <div className="tooltip-customizada-media-proficiencia">
        <div className="tooltip-label-media-proficiencia">{label}</div>
        {payload.map((entry, index) => (
          <p key={index} className="tooltip-item-media-proficiencia">
            {labelMap[entry.name] || entry.name}: {Number(entry.value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}{showPercentage ? '%' : ''}

          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default TooltipMediaProficiencia;
