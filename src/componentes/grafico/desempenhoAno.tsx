import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import "./desempenhoAno.css";
import TooltipCustomizada from "./conteudo/tooltipCustomizada";
import LegendaCustomizada from "./conteudo/legendaCustomizada";

interface DataPoint {
  name: string;
  abaixoDoBasico: number;
  basico: number;
  adequado: number;
  avancado: number;
}

interface TabelaProps {
  dados: any;
  filtrosSelecionados: Filtro;
}

const DesempenhoAno: React.FC<TabelaProps> = ({
  dados,
  filtrosSelecionados,
}) => {
  
  const apiData: DataPoint[] = [];
  for (let i = 0; i < dados.length; i++) {
    const item = dados[i];
    apiData.push({
      name: item.componenteCurricular,
      abaixoDoBasico: item.abaixoBasico
        .split(" ")[1]
        .replace("(", "")
        .replace(")", "")
        .replace("%", ""),
      basico: item.basico
        .split(" ")[1]
        .replace("(", "")
        .replace(")", "")
        .replace("%", ""),
      adequado: item.adequado
        .split(" ")[1]
        .replace("(", "")
        .replace(")", "")
        .replace("%", ""),
      avancado: item.avancado
        .split(" ")[1]
        .replace("(", "")
        .replace(")", "")
        .replace("%", ""),
    });
  }

  return (
    <ResponsiveContainer width="100%" height={700}>
      <BarChart
        layout="vertical"
        data={apiData}
        margin={{ top: 30, right: 5, left: 20, bottom: 0 }}
        barCategoryGap="0%"
        barGap={0}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" stroke="#EDEDED" tick={{ fill: "#595959" }} />

        <YAxis
          dataKey="name"
          type="category"
          width={160}
          interval={0}
          tickFormatter={(value) => value}
          tick={{ fill: "#595959" }}
          stroke="#EDEDED"
        >
          <Label
            value="Componente por ano de escolaridade"
            angle={-90}
            position="insideLeft"
            offset={-15}
            style={{
              textAnchor: "middle",
              fontSize: 14,
              fontWeight: "bold",
              fill: "#595959",
            }}
          />
        </YAxis>

        <Tooltip
          content={<TooltipCustomizada />}
          wrapperStyle={{
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            borderRadius: "5px",
            color: "#fff",
          }}
        />
        <Legend
          verticalAlign="top"
          align="center"
          content={<LegendaCustomizada />}
        />
        {filtrosSelecionados.niveisAbaPrincipal.some(
          (item) => item.valor === 1
        ) && (
          <Bar
            dataKey="abaixoDoBasico"
            barSize={70}
            fill="#FF5959"
            name="1 - Abaixo do Básico"
          />
        )}
        {filtrosSelecionados.niveisAbaPrincipal.some(
          (item) => item.valor === 2
        ) && (
          <Bar dataKey="basico" barSize={70} fill="#FEDE99" name="2 - Básico" />
        )}
        {filtrosSelecionados.niveisAbaPrincipal.some(
          (item) => item.valor === 3
        ) && (
          <Bar
            dataKey="adequado"
            barSize={70}
            fill="#9999FF"
            name="3 - Adequado"
          />
        )}
        {filtrosSelecionados.niveisAbaPrincipal.some(
          (item) => item.valor === 4
        ) && (
          <Bar
            dataKey="avancado"
            barSize={70}
            fill="#99FF99"
            name="4 - Avançado"
          />
        )}
        <Bar dataKey="" barSize={5} fill="#ffffff" name="" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DesempenhoAno;
