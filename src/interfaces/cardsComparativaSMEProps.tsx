export interface CardsComparativaAplicacaoSMEProps {
  nomeAplicacao: string;
  periodo: string;
  mediaProficiencia: number;
  realizaramProva: number;
  quantidadeUes: number
  nivelProficiencia: string;
}

export interface CardsComparativaDiretoriaReginalProps {
  dreId:number
  dreAbreviacao:string
  dreNome:string
  variacao: number;
  aplicacaoPsp: CardsComparativaAplicacaoSMEProps | null;
  aplicacoesPsa: CardsComparativaAplicacaoSMEProps[];
}

export interface CardsComparativaSMEProps {
  total: number;
  pagina: number;
  itensPorPagina: number;
  dres: CardsComparativaDiretoriaReginalProps[];
}