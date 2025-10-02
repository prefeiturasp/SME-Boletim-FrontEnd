export interface BtnConferirDadosProps {
    escola: { ueId: string; descricao: string };
    aplicacaoId: number;
    componenteCurricularId: number;
    dreId?: number;
    ano?: ParametrosPadraoAntDesign | null;
}