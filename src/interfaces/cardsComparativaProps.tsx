// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface CardsComparativaProps {
  dre: string;
  variacao?: number;
  provaSp: {
    nomeAplicacao: string;
    mesAno: string;
    valorProficiencia?: number;
    nivelProficiencia: string;
    qtdeEstudante: string;
  };
  aplicacao: [
    {
      nomeAplicacao: string;
      mesAno: string;
      valorProficiencia: number;
      nivelProficiencia: string;
      qtdeEstudante: string;
    }
  ];
}
