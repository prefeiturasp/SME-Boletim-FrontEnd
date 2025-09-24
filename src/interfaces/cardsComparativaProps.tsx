export interface CardsComparativaAplicacaoProps {
  loteId: number;
  nomeAplicacao: string;
  periodo: string;
  mediaProficiencia: number;
  realizaramProva: number;
  nivelProficiencia: string;
}

export interface CardsComparativaUnidadeEducacionalProps {
  ueId: number;
  ueNome: string;
  disciplinaid: number;
  variacao: number;
  aplicacaoPsp: CardsComparativaAplicacaoProps | null;
  aplicacoesPsa: CardsComparativaAplicacaoProps[];
}

export interface CardsComparativaProps {
  total: number;
  pagina: number;
  itensPorPagina: number;
  dreId: number;
  dreAbreviacao: string;
  ues: CardsComparativaUnidadeEducacionalProps[];
}
