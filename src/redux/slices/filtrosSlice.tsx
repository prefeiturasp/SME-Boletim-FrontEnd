import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  niveis: [],
  anoLetivo: [],
  componentesCurriculares: [],
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
