import { createSlice } from "@reduxjs/toolkit";

const initialState: Filtro = {
  niveis: [],
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
  anosEscolares: [],
  componentesCurriculares: [],
  anosEscolaresRadio: [],
  componentesCurricularesRadio: [],
  nivelMinimo: 0,
  nivelMinimoEscolhido: 0,
  nivelMaximo: 0,
  nivelMaximoEscolhido: 0,
  turmas: [],
  variacoes: [
    { valor: "positiva", texto: "Variação positiva" },
    { valor: "negativa", texto: "Variação negativa" },
    { valor: "neutra", texto: "Sem variação" },
  ],
  nomeEstudante: "",
  eolEstudante: "",
};

const filtrosSlice = createSlice({
  name: "filtros",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetFilters: () => initialState,
  },
});

export const { setFilters, resetFilters } = filtrosSlice.actions;
export default filtrosSlice.reducer;
