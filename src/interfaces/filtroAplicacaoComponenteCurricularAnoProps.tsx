export interface filtroAplicacaoComponenteCurricularAnoProps {
  dreSelecionadaNome: string | undefined;
  aplicacaoSelecionada: ParametrosPadraoAntDesign | null | undefined;
  componenteSelecionado: ParametrosPadraoAntDesign | null | undefined;
  anoSelecionado: ParametrosPadraoAntDesign | null | undefined;
  aplicacoes: ParametrosPadraoAntDesign[];
  componentesCurriculares: ParametrosPadraoAntDesign[];
  anos: ParametrosPadraoAntDesign[];
  selecionaAno: (value: any, option: any) => void;
  selecionaAplicacao: (value: any, option: any) => void;
  selecionaComponenteCurricular: (value: any, option: any) => void;
}
