export interface ParametrosTabelaComparativaNovaProps {
    dados: any;
    aplicacaoSelecionada: { label: string; value: string | number } | null | undefined;
    componenteSelecionado: { label: string; value: string | number } | null | undefined;
    anoSelecionado: { label: string; value: string | number } | null | undefined;    
    //quantidadeDres: number;
}

export interface ValueTabelaComparativaNovaProps {
    variacao: number;
    aplicacao: AplicacaoItemNova[];
}

export interface AplicacaoItemNova {
    descricao: string;
    mes: string;
    valorProficiencia: number;
    nivelProficiencia: string;
    qtdeDRE: string;
    qtdeUe: string;
    qtdeEstudante: string;
}