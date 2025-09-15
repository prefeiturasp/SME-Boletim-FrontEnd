// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Filtro {
  niveis: FiltroChaveValor[],
  niveisAbaPrincipal: FiltroChaveValor[],
  anosEscolares: FiltroChaveValor[],  
  anosEscolaresRadio: FiltroChaveValor[],
  componentesCurriculares: FiltroChaveValor[],  
  componentesCurricularesRadio: FiltroChaveValor[],
  nivelMinimo: number,
  nivelMaximo: number,
  nivelMinimoEscolhido: number,
  nivelMaximoEscolhido: number,
  turmas: FiltroChaveValor[]
  nomeEstudante: string,
  eolEstudante: string,
  variacoes: FiltroChaveValor[]
}