import React from "react";
import { json2csv } from "json-2-csv";

const Estudantes: React.FC = () => {
  const data = [
    {
      turma: "5A",
      abaixoBasico: "2 (40%)",
      basico: "2 (40%)",
      adequado: "1 (20%)",
      avancado: "0 (0%)",
      total: 5,
      mediaProficiencia: 191.19,
    },
    {
      turma: "5B",
      abaixoBasico: "2 (66.67%)",
      basico: "1 (33.33%)",
      adequado: "0 (0%)",
      avancado: "0 (0%)",
      total: 3,
      mediaProficiencia: 155.85,
    },
    {
      turma: "6A",
      abaixoBasico: "0 (0%)",
      basico: "0 (0%)",
      adequado: "0 (0%)",
      avancado: "25 (100%)",
      total: 25,
      mediaProficiencia: 163.04,
    },
    {
      turma: "6B",
      abaixoBasico: "0 (0%)",
      basico: "0 (0%)",
      adequado: "0 (0%)",
      avancado: "25 (100%)",
      total: 25,
      mediaProficiencia: 157.57,
    },
  ];

  const exportToCSV = async () => {
    try {
      const csv = await json2csv(data);

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "dados.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erro ao exportar CSV:", error);
    }
  };

  return <button onClick={exportToCSV}>Exportar CSV</button>;
};

export default Estudantes;
