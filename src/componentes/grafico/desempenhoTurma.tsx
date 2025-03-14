import "./desempenhoAno.css";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import "./desempenhoTurma.css";

interface ObjetoDesempenhoTurma {
  mediaProficiencia: number;
  turma: string;
}

interface TabelaProps {
  dados: ObjetoDesempenhoTurma[];
}

const DesempenhoTurma: React.FC<TabelaProps> = ({ dados }) => {
  const cores = [
    "#5A94D8",
    "#1E1EE3",
    "#595959",
    "#000000",
    "#D9D9D9",
    "#1E1E56",
  ];

  return (
    <div>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={dados}
          margin={{ top: 30, right: 0, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="turma" tick={{ fill: "#000000" }} stroke="#EDEDED" />
          <YAxis tick={{ fill: "#000000" }} stroke="#EDEDED">
            <Label
              value="Média de proficiência"
              angle={-90}
              position="insideLeft"
              offset={5}
              className="label-proficiencia"
            />
          </YAxis>
          <Bar dataKey="mediaProficiencia" barSize={70}>
            <LabelList
              dataKey="mediaProficiencia"
              position="insideTop"
              fill="white"
              fontSize={14}
            />
            {dados.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index < cores.length ? cores[index] : "#8884d8"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="legenda-container">
        {dados.map((entry, index) => (
          <div key={index} className="legenda-item">
            {index === 0 && <div className="legenda-titulo">Turma</div>}
            <div
              className="legenda-caixa"
              style={{
                backgroundColor:
                  index < cores.length ? cores[index] : "#8884d8",
              }}
            ></div>
            <span className="legenda-texto">{entry.turma}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DesempenhoTurma;
