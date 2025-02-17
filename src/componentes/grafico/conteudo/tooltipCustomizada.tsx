import React from "react";
import "./tooltipCustomizada.css"; // Make sure to create a CSS file for styles

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const TooltipCustomizada: React.FC<TooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="tooltip-customizada">
        <p className="tooltip-label">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="tooltip-item">
            {entry.name}: {entry.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default TooltipCustomizada;
