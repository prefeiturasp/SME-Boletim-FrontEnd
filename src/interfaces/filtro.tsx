// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Filtro {
    niveis: FiltroChaveValor[],
    anosEscolares: FiltroChaveValor[],
    componentesCurriculares: FiltroChaveValor[],
    nivelMinimo: number,
    nivelMaximo: number,
    nivelMinimoEscolhido: number,
    nivelMaximoEscolhido: number,
    turmas: FiltroChaveValor[]
    nomeEstudante: string,
    eolEstudante: string,
  }