interface CardsComparativaProps{
    objeto: { 
        dre: string; 
        variacao?: number;
        provaSp: {
            descricaoProva: string,
            mesAno: string,
            valorProficiencia?: number,
            nivelProficiencia: string,
            qtdeEstudante: string
        },
        aplicacao: [
            {
                descricao: string,
                mes: string,
                valorProficiencia?: number,
                nivelProficiencia: string,
                qtdeUE: string,
                qtdeEstudante: string
            }
        ]

    } | null;
}