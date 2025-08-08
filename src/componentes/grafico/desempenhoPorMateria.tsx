import "./desempenhoPorMateria.css";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import "./desempenhoTurma.css";
import { Card } from "antd";

interface DataPoint {
  name: string;
  abaixoDoBasico: number;
  basico: number;
  adequado: number;
  avancado: number;
}

const ConverteDados = (lsDados: any[]): DataPoint[] => {
  return lsDados.map((item) => ({
    name: item.disciplinaNome,
    abaixoDoBasico:
      item.uesPorNiveisProficiencia.find((n: any) => n.codigo === 1)
        ?.quantidadeUes || 0,
    basico:
      item.uesPorNiveisProficiencia.find((n: any) => n.codigo === 2)
        ?.quantidadeUes || 0,
    adequado:
      item.uesPorNiveisProficiencia.find((n: any) => n.codigo === 3)
        ?.quantidadeUes || 0,
    avancado:
      item.uesPorNiveisProficiencia.find((n: any) => n.codigo === 4)
        ?.quantidadeUes || 0,
  }));
};

const ConverteDadosDre = (lsDados: any[]): DataPoint[] => {
  return lsDados.map((item) => ({
    name: item.disciplinaNome,
    abaixoDoBasico:
      item.dresPorNiveisProficiencia.find((n: any) => n.codigo === 1)
        ?.quantidadeDres || 0,
    basico:
      item.dresPorNiveisProficiencia.find((n: any) => n.codigo === 2)
        ?.quantidadeDres || 0,
    adequado:
      item.dresPorNiveisProficiencia.find((n: any) => n.codigo === 3)
        ?.quantidadeDres || 0,
    avancado:
      item.dresPorNiveisProficiencia.find((n: any) => n.codigo === 4)
        ?.quantidadeDres || 0,
  }));
};


const DesempenhoPorMateria: React.FC<{ dados?: any[], tipo: any }> = ({ dados, tipo }) => {
  console.log(dados);
  if (!Array.isArray(dados) || dados.length === 0) return <></>;
  else {
    let data: DataPoint[] = [];
    if(tipo === "UEs"){
      data = ConverteDados(dados);
    } else if(tipo === "DREs"){
      data = ConverteDadosDre(dados);
    }
    
    return (
      <div className="ajuste-padding-grafico-card">
        <Card className="grafico-borda">
          Confira a quantidade de <b>Unidades Educacionais ({tipo}) </b>
          classificadas dentro de cada um dos niveis de proficiência (AB, B, AD,
          AV).
          <div className="legendas">
            <div className="texto">
              <b>Niveis:</b>
            </div>
            <div className="caixa-vermelha"></div>{" "}
            <div className="texto">AB - Abaixo do basico</div>
            <div className="caixa-amarela"></div>{" "}
            <div className="texto">B - Básico</div>
            <div className="caixa-azul"></div>{" "}
            <div className="texto">AD - Adequado</div>
            <div className="caixa-verde"></div>{" "}
            <div className="texto">AV - Avançado</div>
          </div>
          {data.map((item, index) => (
            <div key={index} className="desempenho-por-materia">
              <div>
                Componente Curricular: <strong>{item.name}</strong>
              </div>
              <ResponsiveContainer width="100%" height={70}>
                <BarChart
                  data={[item]}
                  layout="vertical"
                  margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
                  barCategoryGap="0%"
                  barSize={70}
                >
                  <Label
                    value={`Componente Curricularxxxxxxxxxxxxxxxxxx: ${item.name}`}
                    position="top"
                    offset={10}
                  />
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis
                    type="number"
                    domain={[0, "dataMax"]}
                    axisLine={false}
                    tickLine={false}
                    tick={false}
                  />
                  <YAxis
                    width={0}
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={false}
                  />
                  {item.abaixoDoBasico > 0 && (
                    <Bar dataKey="abaixoDoBasico" stackId="a" fill="#FF5959">
                      <LabelList
                        dataKey="abaixoDoBasico"
                        position="center"
                        fill="white"
                        fontSize={14}
                        fontWeight={500}
                        formatter={(value: unknown) => `AB: ${value}`}
                      />
                    </Bar>
                  )}
                  {item.basico > 0 && (
                    <Bar dataKey="basico" stackId="a" fill="#FEDE99">
                      <LabelList
                        dataKey="basico"
                        position="center"
                        fill="black"
                        fontSize={14}
                        fontWeight={500}
                        formatter={(value: unknown) => `B: ${value}`}
                      />
                    </Bar>
                  )}
                  {item.adequado > 0 && (
                    <Bar dataKey="adequado" stackId="a" fill="#9999FF">
                      <LabelList
                        dataKey="adequado"
                        position="center"
                        fill="white"
                        fontSize={14}
                        fontWeight={500}
                        formatter={(value: unknown) => `AD: ${value}`}
                      />
                    </Bar>
                  )}
                  {item.avancado > 0 && (
                    <Bar dataKey="avancado" stackId="a" fill="#99FF99">
                      <LabelList
                        dataKey="avancado"
                        position="center"
                        fill="black"
                        fontSize={14}
                        fontWeight={500}
                        formatter={(value: unknown) => `AV: ${value}`}
                      />
                    </Bar>
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          ))}
        </Card>
      </div>
    );
  }
};

export default DesempenhoPorMateria;
