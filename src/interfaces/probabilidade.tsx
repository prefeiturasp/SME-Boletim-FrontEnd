// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Probabilidade {
    codigoHabilidade: string;
    habilidadeDescricao: string;
    turmaDescricao: string;
    abaixoDoBasico: number;
    basico: number;
    adequado: number;
    avancado: number;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ProbabilidadeTEMP {
    codigoHabilidade: string;
    habilidadeDescricao: string;
    turmas: ProbabilidadeTurmas[]   
}

interface ProbabilidadeTurmas {
    turmaDescricao: string;
    abaixoDoBasico: number;
    basico: number;
    adequado: number;
    avancado: number;
}