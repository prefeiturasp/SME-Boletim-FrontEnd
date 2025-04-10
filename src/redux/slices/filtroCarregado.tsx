import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FiltroCarregado {
  carregado: boolean;
}

const initialState: FiltroCarregado = {
  carregado: false,
};

const filtroCarregadoSlice = createSlice({
  name: "filtroCarregado",
  initialState,
  reducers: {
    filtroCarregado: (state, action: PayloadAction<any>) => {
      state.carregado = action.payload;
    },
  },
});

export const { filtroCarregado } = filtroCarregadoSlice.actions;
export default filtroCarregadoSlice.reducer;
