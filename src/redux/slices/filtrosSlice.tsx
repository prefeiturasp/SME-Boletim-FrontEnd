import { createSlice } from "@reduxjs/toolkit";

const initialState: Filtro = {
  niveis: [],
  anosEscolares: [],
  componentesCurriculares: [],
  nivelMinimo: 0,
  nivelMinimoEscolhido: 0,
  nivelMaximo: 0,
  nivelMaximoEscolhido: 0,
  turmas: [],
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
