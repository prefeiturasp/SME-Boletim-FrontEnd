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
import TooltipCustomizada from "./conteudo/TooltipCustomizada";
import LegendaCustomizada from "./conteudo/LegendaCustomizada";


interface DataPoint {
  name: string;
  abaixoDoBasico: number;
  basico: number;
  adequado: number;
  avancado: number;
}

const DesempenhoAno: React.FC = () => {

  const dispatch = useDispatch();
  const data = useSelector((state: RootState) => state.desempenho.data);
  
  useEffect(() => {
    const fetchData = async () => {
      const apiData: DataPoint[] = [
        { name: "Língua Portuguesa 5º ano", abaixoDoBasico: 60.5, basico: 40, adequado: 20, avancado: 20 },
        { name: "Língua Portuguesa 9º ano", abaixoDoBasico: 70.5, basico: 80, adequado: 55, avancado: 20 },
        { name: "Matemática 5º ano", abaixoDoBasico: 44.5, basico: 67, adequado: 25, avancado: 20 },
        { name: "Matemática 9º ano", abaixoDoBasico: 24.5, basico: 33, adequado: 50, avancado: 20 },
      ];
      dispatch(setDesempenhoData(apiData));
    };

    fetchData();
  }, [dispatch]);


  return (
    <div className="conteudo-principal">
      <Card bordered={false}>
        <ResponsiveContainer width="100%" height={600}>
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 0, right: 50, left: 40, bottom: 0 }}
            barCategoryGap="0%"
            barGap={0}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            
            <YAxis dataKey="name" type="category" width={200} interval={0} tickFormatter={(value) => value}>
              <Label
                value="Componente por ano de escolaridade"
                angle={-90}
                position="insideLeft"
                offset={-30}
                style={{ textAnchor: "middle", fontSize: 14, fontWeight: "bold" }}
              />
            </YAxis>

            <Tooltip content={<TooltipCustomizada />} />
            <Legend verticalAlign="top" align="center" content={<LegendaCustomizada />} />
            <Bar dataKey="abaixoDoBasico" fill="#FF5959" name="1 - Abaixo do Básico" />
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
