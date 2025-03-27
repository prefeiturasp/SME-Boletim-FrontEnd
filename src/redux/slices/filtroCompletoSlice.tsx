import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Filtro = {
  niveis: [
    { valor: 1, texto: "abaixoBasico" },
    { valor: 4, texto: "avançado" },
  ],
  niveisAbaPrincipal: [
    {
      texto: "Abaixo do Básico",
      valor: 1,
    },
    {
      texto: "Básico",
      valor: 2,
    },
    {
      texto: "Adequado",
      valor: 3,
    },
    {
      texto: "Avançado",
      valor: 4,
    },
  ],  
  anosEscolares: [
    { valor: 5, texto: "5" },
    { valor: 9, texto: "9" },
  ],
  componentesCurriculares: [
    { valor: 5, texto: "Lingua Portuguesa" },
    { valor: 4, texto: "Matemática" },
  ],
  anosEscolaresRadio: [],
  componentesCurricularesRadio: [],
  nivelMinimo: 50,
  nivelMaximo: 275,
  turmas: [
    { valor: "A", texto: "A" },
    { valor: "A", texto: "A" },
    { valor: "A", texto: "A" },
    { valor: "A", texto: "A" },
  ],
  nivelMinimoEscolhido: 0,
  nivelMaximoEscolhido: 0,
  nomeEstudante: "",
  eolEstudante: "",
};

const filtroCompletoSlice = createSlice({
  name: "filtro",
  initialState,
  reducers: {
    setFiltroDados: (state, action: PayloadAction<Filtro>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setFiltroDados } = filtroCompletoSlice.actions;
export default filtroCompletoSlice.reducer;
