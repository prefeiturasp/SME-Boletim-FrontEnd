export interface ParametrosTabelaComparativaProps {
    dreSelecionada: number | null | undefined;
    aplicacaoSelecionada: { label: string; value: string | number } | null | undefined;
    componenteSelecionado: { label: string; value: string | number } | null | undefined;
    anoSelecionado: { label: string; value: string | number } | null | undefined;
    //dados: any[];
    //quantidadeDres: number;
}

export interface ValueTabelaComparativaProps {
    variacao: number;
    aplicacao: AplicacaoItem[];
}

export interface AplicacaoItem {
    descricao: string;
    mes: string;
    valorProficiencia: number;
    nivelProficiencia: string;
    qtdeUe: string;
    qtdeEstudante: string;
}