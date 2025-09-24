// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface CardsComparativaProps {
  ueId: string;
  ueNome: string;
  variacao?: number;
  disciplinaid?: number;
  provaSp: {
    nomeAplicacao: string;
    mesAno: string;
    valorProficiencia?: number;
    nivelProficiencia: string;
    qtdeEstudante: string;
  };
  aplicacao: [
    {
      loteId: number;
      nomeAplicacao: string;
      mesAno: string;
      valorProficiencia: number;
      nivelProficiencia: string;
      qtdeEstudante: string;
    }
  ];
}
