import "./estudantePorMateria.css";
import {
  Bar,
  BarChart,
  Label,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface TabelaProps {
  dados: Turma;
}

const EstudantesPorMateria: React.FC<TabelaProps> = ({ dados }) => {
  console.log(dados);

  let altura = dados.alunos.length * 50;
  const cor = dados.disciplina == "Matemática" ? "#EDEDED" : "#5A94D8";
  const barraClass =
    dados.disciplina == "Matemática" ? "bar-texto-preto" : "bar-texto-branco";
  if (altura <= 150) altura = 150;

  return (
    <div>
      <span className="titulo-grafico">{`Estudantes da turma ${dados.turma} em ${dados.disciplina}`}</span>
      <ResponsiveContainer width="100%" height={altura}>
        <BarChart
          layout="vertical"
          data={dados.alunos}
          margin={{ top: 30, right: 30, left: 20, bottom: 0 }}
        >
          <XAxis tick={{ fill: "#595959" }} stroke="#EDEDED" type="number" />
          <YAxis
            tick={{ fill: "#595959" }}
            stroke="#EDEDED"
            dataKey="nome"
            type="category"
            width={300}
            fontSize={13}
          >
            <Label
              value="Estudantes"
              angle={-90}
              position="insideLeft"
              offset={0}
              className="titulo-grafico"
            />
          </YAxis>
          <Bar dataKey="proficiencia" fill={cor}>
            <LabelList
              position="insideLeft"
              fill="white"
              fontSize={14}
              className={barraClass}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EstudantesPorMateria;
