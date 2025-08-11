import "./desempenhoPorMediaProficiencia.css";

import {
  Bar,
  BarChart,
  Label,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./desempenhoPorMediaProficiencia.css";
import React from "react";
import TooltipMediaProficiencia from "./conteudo/tooltipMediaProficiencia";

interface legendas {
  legenda: string;
  cor: string;
}

interface objGrafico {
  dreNome: string;
  portugues: number;
  matematica: number;
}

const DesempenhoPorMediaProficiencia: React.FC<{ dados?: any[] }> = ({
  dados,
}) => {
  const lsobjGrafico: objGrafico[] = [];
  const objLegendas: legendas[] = [];
  objLegendas.push({ legenda: "Língua Portuguesa", cor: "#5A94D8" });
  objLegendas.push({ legenda: "Matemática", cor: "#EDEDED" });

  if (dados != undefined && dados?.length > 0) {
    dados?.map((item) => {
      const portuguesDisc = item.diciplinas.find(
        (x: any) => x.disciplinaId === 5
      );
      const matematicaDisc = item.diciplinas.find(
        (x: any) => x.disciplinaId === 4
      );

      const hi: objGrafico = {
        dreNome: item.dreNome.trim(),
        portugues: portuguesDisc?.mediaProficiencia ?? 0,
        matematica: matematicaDisc?.mediaProficiencia ?? 0,
      };

      lsobjGrafico.push(hi);
    });

    console.log("acabei");
  } else {
    return (
      <div className="dados-nao-encontrados">
        {" "}
        NÃO FORAM ENCONTRADOS RESULTADOS PARA EXIBIÇÃO DO GRÁFICO
      </div>
    );
  }

  return (
    <>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={lsobjGrafico}
          margin={{ top: 0, right: 0, left: 20, bottom: 5 }}
        >
          {/*<CartesianGrid strokeDasharray="3 3" />*/}
          <XAxis
            dataKey="dreNome"
            interval={0}
            height={60}
            
            tick={({ x, y, payload }) => {
              const lines = payload.value.split(" ");
              return (
                <text
                  x={x}
                  y={y + 10}
                  textAnchor="middle"
                  style={{ fontSize: 12 }}
                >
                  {lines.map((line: string, index: number) => (
                    <tspan key={index} x={x} dy={index === 0 ? 0 : 14}>
                      {line}
                    </tspan>
                  ))}
                </text>
              );
            }}
          >
            <Label
              value="Diretorias Regionais (DRE)"
              position="insideBottom"
              offset={0}
              style={{
                textAnchor: "middle",
                fontSize: 14,
                fontWeight: "bold",
                fill: "#595959",
              }}
            />
          </XAxis>

          <YAxis>
            <Label
              value="Média de proficiência"
              angle={-90}
              position="insideLeft"
              offset={0}
              
              style={{
                textAnchor: "middle",
                fontSize: 14,
                fontWeight: "bold",
                fill: "#595959",
              }}
            />
          </YAxis>
          <Tooltip
          content={<TooltipMediaProficiencia showPercentage={false}/>}
            wrapperStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              borderRadius: "5px",
              color: "#fff",
            }}
          />

          <Bar dataKey="portugues" fill="#5A94D8" />
          <Bar dataKey="matematica" fill="#EDEDED" />
        </BarChart>
      </ResponsiveContainer>
      <div className="legenda-container">
        {objLegendas.map((entry, index) => (
          <div key={index} className="legenda-item">
            {index === 0 && (
              <div className="legenda-titulo">Componentes curriculares:</div>
            )}
            <div
              className="legenda-caixa-media-proficiencia"
              style={{
                backgroundColor: entry.cor,
              }}
            ></div>
            <span className="legenda-texto-media-proficiencia">{entry.legenda}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default DesempenhoPorMediaProficiencia;
