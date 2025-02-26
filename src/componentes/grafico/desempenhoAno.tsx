import React, { useEffect } from "react";
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
import { Card } from "antd";
import "./desempenhoAno.css";
import { RootState } from "../../redux/store";
import { setDesempenhoData } from "../../redux/slices/desempenhoSlice";
import { useDispatch, useSelector } from "react-redux";
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
}

const DesempenhoAno: React.FC<TabelaProps> = ({ dados }) => {
  const dispatch = useDispatch();
  const data = useSelector((state: RootState) => state.desempenho.data);

  useEffect(() => {
    const fetchData = async () => {
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

      dispatch(setDesempenhoData(apiData));
    };

    fetchData();
  }, [dispatch, dados]);

  return (
    <div className="conteudo-principal">
      <Card variant="borderless">
        <ResponsiveContainer width="100%" height={800}>
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 30, right: 5, left: 20, bottom: 0 }}
            barCategoryGap="0%"
            barGap={0}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />

            <YAxis
              dataKey="name"
              type="category"
              width={160}
              interval={0}
              tickFormatter={(value) => value}
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
                }}
              />
            </YAxis>

            <Tooltip content={<TooltipCustomizada />} />
            <Legend
              verticalAlign="top"
              align="center"
              content={<LegendaCustomizada />}
            />
            <Bar
              dataKey="abaixoDoBasico"
              fill="#FF5959"
              name="1 - Abaixo do Básico"
            />
            <Bar dataKey="basico" fill="#FEDE99" name="2 - Básico" />
            <Bar dataKey="adequado" fill="#9999FF" name="3 - Adequado" />
            <Bar dataKey="avancado" fill="#99FF99" name="4 - Avançado" />
            <Bar dataKey="" fill="#ffffff" name="" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default DesempenhoAno;
