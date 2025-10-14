export interface AAAParametrosTabelaComparativaProps {
    dados: any;
    aplicacaoSelecionada: { label: string; value: string | number } | null | undefined;
    componenteSelecionado: { label: string; value: string | number } | null | undefined;
    anoSelecionado: { label: string; value: string | number } | null | undefined;    
    //quantidadeDres: number;
}

export interface AAAValueTabelaComparativaProps {
    variacao: number;
    aplicacao: AAAAplicacaoItem[];
}

export interface AAAAplicacaoItem {
    descricao: string;
    mes: string;
    valorProficiencia: number;
    nivelProficiencia: string;
    qtdeDRE: string;
    qtdeUe: string;
    qtdeEstudante: string;
}