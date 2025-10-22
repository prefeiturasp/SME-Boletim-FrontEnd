import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Label,
  ResponsiveContainer,
} from "recharts";
import TooltipMediaProficiencia from "./conteudo/tooltipMediaProficiencia";

interface GraficoEvolucaoDreProps {
  dados: any;
  componenteSelecionado: ParametrosPadraoAntDesign | null | undefined;
  anoSelecionado: ParametrosPadraoAntDesign | null | undefined
  aplicacaoSelecionada: ParametrosPadraoAntDesign | null | undefined
}

const GraficoEvolucaoDre: React.FC<GraficoEvolucaoDreProps> = ({ dados, componenteSelecionado, anoSelecionado, aplicacaoSelecionada }) => {
  if (!dados || dados.length === 0) {
    return (
      <div className="dados-nao-encontrados">
        NÃO FORAM ENCONTRADOS RESULTADOS PARA EXIBIÇÃO DO GRÁFICO
      </div>
    );
  }

  // 🔹 Collect all unique "Mes" values in the order they appear in the JSON
  const aplicacoesOrdenadas: string[] = [];
  dados.dados.forEach((dre) => {
    dre.listaProficienciaGraficoComparativoDto.forEach((item: any) => {
      if (!aplicacoesOrdenadas.includes(item.mes)) {
        aplicacoesOrdenadas.push(item.mes);
      }
    });
  });

  // 🔹 Build chart data dynamically based on available months
  const data = dados.dados.map((dre) => {
    const obj: any = { DRE: dre.dreNome.replace('DIRETORIA REGIONAL DE EDUCACAO', '').replace('/', ' ').trim() };
    aplicacoesOrdenadas.forEach((mes) => {
      const registro = dre.listaProficienciaGraficoComparativoDto.find(
        (x: any) => x.mes === mes
      );
      if (registro) obj[mes] = registro.valorProficiencia;
    });
    return obj;
  });

  // 🔹 Automatically assign distinct colors for each "Mes"
  const coresBase = [
    "#B1D4FD",
    "#5A94D8",
    "#40648E",
    "#1C2A3A",
    "#F2A74B",
    "#9ADBC5",
    "#E86A92",
  ];
  const cores: Record<string, string> = {};
  aplicacoesOrdenadas.forEach((mes, idx) => {
    cores[mes] = coresBase[idx % coresBase.length];
  });

  // ✅ Build legend data from the same arrays
  const objLegendas = aplicacoesOrdenadas.map((legenda, index) => ({
    legenda,
    cor: cores[legenda],
  }));

  return (
    <>

    <div className="filtro-comparativo">
        <div className="filtro-comparativo-titulo">
          Evolução por Diretoria Regional de Educação (DRE)
        </div>
        <div className="filtro-comparativo-conteudo">
          <div className="filtro-comparativo-subtitulo">
            Confira a média de proficiência das DREs na aplicação da Prova São Paulo e nas três aplicações da Prova Saberes e Aprendizagens.
          </div>
          <div className="filtro-comparativo-tags">
            <div className="filtro-comparativo-tags-item filtro-comparativo-tags-componente-curricular">
              {componenteSelecionado?.label}
            </div>
            <div className="filtro-comparativo-tags-item filtro-comparativo-tags-turma">
              {anoSelecionado?.label}º ano
            </div>
            <div className="filtro-comparativo-tags-item filtro-comparativo-tags-ano">
              {aplicacaoSelecionada?.label}
            </div>
          </div>
        </div>
      </div>

      <br></br><br></br>
      <ResponsiveContainer width="100%" height={270}>



        



        <BarChart
          data={data}
          margin={{ top: 0, right: 20, left: 20, bottom: 5 }}
        >
          <XAxis
            dataKey="DRE"
            interval={0}
            height={60}
            tick={({ x, y, payload }) => {
              const lines = payload.value.split(" ");
              return (
                <text
                  x={x}
                  y={y + 10}
                  textAnchor="middle"
                  style={{ fontSize: 12, fill: "#595959", }}
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

          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.05)" }}
            formatter={(value: number) => value.toFixed(2)}
          />

          {aplicacoesOrdenadas.map((mes) => (
            <Bar key={mes} dataKey={mes} name={mes} fill={cores[mes]} />
          ))}
        </BarChart>
      </ResponsiveContainer>

      <div className="legenda-container">
        {objLegendas.map((entry, index) => (
          <div key={index} className="legenda-item">
            {index === 0 && (
              <div className="legenda-titulo">Mêses de aplicação:</div>
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

export default GraficoEvolucaoDre;
