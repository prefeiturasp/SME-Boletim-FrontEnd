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

interface TabelaProps {
  dados: unknown;
}

interface DataPoint {
  name: string;
  abaixoDoBasico: number;
  basico: number;
  adequado: number;
  avancado: number;
}

const data: DataPoint[] = [
  {
    name: "Lingua Portuguesa",
    abaixoDoBasico: 3000,
    basico: 398,
    adequado: 1398,
    avancado: 2210,
  },
  {
    name: "Matematica",
    abaixoDoBasico: 100,
    basico: 200,
    adequado: 50,
    avancado: 60,
  },
];

const DesempenhoPorMateria: React.FC<TabelaProps> = ({ dados }) => {
  if (!dados) return <></>;
  else {
    return (
      <>
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
                <Bar dataKey="abaixoDoBasico" stackId="a" fill="#FF5959">
                  <LabelList
                    dataKey="abaixoDoBasico"
                    position="center"
                    fill="white"
                    fontSize={14}
                    formatter={(value: unknown) => `AB: ${value}`}
                  />
                </Bar>
                <Bar dataKey="basico" stackId="a" fill="#FEDE99">
                  <LabelList
                    dataKey="basico"
                    position="center"
                    fill="black"
                    fontSize={14}
                    formatter={(value: unknown) => `B: ${value}`}
                  />
                </Bar>
                <Bar dataKey="adequado" stackId="a" fill="#9999FF">
                  <LabelList
                    dataKey="adequado"
                    position="center"
                    fill="white"
                    fontSize={14}
                    formatter={(value: unknown) => `AD: ${value}`}
                  />
                </Bar>
                <Bar dataKey="avancado" stackId="a" fill="#99FF99">
                  <LabelList
                    dataKey="avancado"
                    position="center"
                    fill="black"
                    fontSize={14}
                    formatter={(value: unknown) => `AV: ${value}`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </>
    );
  }
};

export default DesempenhoPorMateria;
